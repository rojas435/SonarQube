variable "project_name" {
  type        = string
  default     = "aroma-life"
  description = "Project name prefix for resources"
}

variable "location" {
  type        = string
  default     = "chilecentral"
  description = "Azure region"
}

variable "admin_username" {
  type        = string
  default     = "azureuser"
  description = "Admin username for VM"
}

variable "vm_size" {
  type        = string
  default     = "Standard_B2s"
  description = "Azure VM size"
}

variable "allow_ips" {
  type        = list(string)
  default     = ["0.0.0.0/0"]
  description = "Allowed source IP CIDRs for inbound access (SSH, HTTP)"
}

variable "vm_ssh_public_key" {
  type        = string
  description = "SSH public key for admin user"
}

variable "tags" {
  type        = map(string)
  default     = {}
  description = "Tags to apply to resources"
}

variable "enable_password_auth" {
  type        = bool
  default     = false
  description = "Enable SSH password authentication (not recommended for production)."
}

variable "admin_password" {
  type        = string
  sensitive   = true
  description = "Admin user's password when enable_password_auth=true. Keep it secret via TF_VAR_admin_password or GitHub Secret VM_ADMIN_PASSWORD."
}
