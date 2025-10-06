locals {
  name = lower(replace(var.project_name, " ", "-"))
}

resource "random_password" "pg" {
  length  = 20
  special = true
}

resource "azurerm_resource_group" "rg" {
  name     = "${local.name}-sonarqube-rg"
  location = var.location
  tags     = var.tags
}

resource "azurerm_virtual_network" "vnet" {
  name                = "${local.name}-vnet"
  address_space       = ["10.10.0.0/16"]
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
}

resource "azurerm_subnet" "subnet" {
  name                 = "${local.name}-subnet"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.10.1.0/24"]
}

resource "azurerm_public_ip" "pip" {
  name                = "${local.name}-pip"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  allocation_method   = "Static"
  sku                 = "Standard"
}

resource "azurerm_network_security_group" "nsg" {
  name                = "${local.name}-nsg"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  security_rule {
    name                       = "SSH"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefixes    = var.allow_ips
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "HTTP-SONAR"
    priority                   = 110
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "9000"
    source_address_prefixes    = var.allow_ips
    destination_address_prefix = "*"
  }
}

resource "azurerm_network_interface" "nic" {
  name                = "${local.name}-nic"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  ip_configuration {
    name                          = "ipconfig1"
    subnet_id                     = azurerm_subnet.subnet.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.pip.id
  }
}

resource "azurerm_network_interface_security_group_association" "nsg_assoc" {
  network_interface_id      = azurerm_network_interface.nic.id
  network_security_group_id = azurerm_network_security_group.nsg.id
}

resource "azurerm_linux_virtual_machine" "vm" {
  name                = "${local.name}-sonarqube-vm"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  size                = var.vm_size
  admin_username      = var.admin_username
  # When enable_password_auth is true, we must NOT disable password auth
  disable_password_authentication = !var.enable_password_auth
  network_interface_ids = [
    azurerm_network_interface.nic.id
  ]

  dynamic "admin_ssh_key" {
    for_each = var.vm_ssh_public_key != null && length(trimspace(var.vm_ssh_public_key)) > 0 ? [1] : []
    content {
      username   = var.admin_username
      public_key = var.vm_ssh_public_key
    }
  }

  # Set password when enabled
  provision_vm_agent = true
  computer_name      = "sonarqube"
  admin_password     = var.enable_password_auth ? var.admin_password : null

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts-gen2"
    version   = "latest"
  }

  custom_data = base64encode(templatefile("${path.module}/cloud-init.yaml", {
    pg_password   = random_password.pg.result,
    admin_username = var.admin_username
  }))

  lifecycle {
    precondition {
      condition     = var.enable_password_auth || (var.vm_ssh_public_key != null && length(trimspace(var.vm_ssh_public_key)) > 0)
      error_message = "Provide VM_SSH_PUBLIC_KEY (SSH public key) or set enable_password_auth=true with admin_password to allow SSH access."
    }
    precondition {
      condition     = var.enable_password_auth ? (var.admin_password != null && length(trimspace(var.admin_password)) > 0) : true
      error_message = "When enable_password_auth=true you must set a non-empty admin_password."
    }
  }

  tags = var.tags
}

output "sonarqube_url" {
  value       = "http://${azurerm_public_ip.pip.ip_address}:9000"
  description = "SonarQube base URL"
}

output "ssh_command" {
  value       = "ssh ${var.admin_username}@${azurerm_public_ip.pip.ip_address}"
  description = "SSH command to access the VM"
}
