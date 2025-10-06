# Informe del Proyecto: Funcionalidades de la API

## Introducción
Este informe describe las funcionalidades implementadas en la API del proyecto, destacando los módulos principales, sus propósitos y cómo interactúan entre sí. Además, se explica cómo se implementaron las características de autenticación, autorización y persistencia en la base de datos, así como la ejecución de las pruebas realizadas para garantizar la calidad del sistema.

---

## Estructura del Proyecto
El proyecto está organizado en módulos que representan las diferentes áreas funcionales de la API. Cada módulo contiene controladores, servicios, entidades y DTOs (Data Transfer Objects) que trabajan juntos para implementar las funcionalidades requeridas.

### Módulo `User`

El módulo `User` gestiona las operaciones relacionadas con los usuarios en la API. Este módulo incluye funcionalidades para listar, crear, actualizar y eliminar usuarios, así como para obtener información específica de un usuario.

---

### **Descripción de los Endpoints**

#### **1. Obtener todos los usuarios**
- **Ruta**: `GET /user`
- **Descripción**: Devuelve una lista de todos los usuarios registrados.
- **Parámetros**:
  - **Query**:
    - `offset` (opcional): Número de registros a omitir.
    - `limit` (opcional): Número máximo de registros a devolver.
- **Respuesta**:
  ```json
  [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    }
  ]
  ```
- **Notas**: Este endpoint es público y no requiere autenticación.

---

#### **2. Obtener un usuario por ID**
- **Ruta**: `GET /user/:id`
- **Descripción**: Devuelve los detalles de un usuario específico.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID del usuario (UUID).
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
  ```
- **Notas**: Este endpoint es público y no requiere autenticación.

---

#### **3. Crear un usuario**
- **Ruta**: `POST /user`
- **Descripción**: Crea un nuevo usuario.
- **Parámetros**:
  - **Body**:
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123"
    }
    ```
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
  ```
- **Notas**:
  - Este endpoint requiere el rol de `admin`.
  - La contraseña se almacena de forma segura utilizando un hash.

---

#### **4. Actualizar un usuario**
- **Ruta**: `PATCH /user/:id`
- **Descripción**: Actualiza los datos de un usuario existente.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID del usuario (UUID).
  - **Body** (solo los campos que se desean actualizar):
    ```json
    {
      "name": "John Updated",
      "email": "updated@example.com",
      "password": "newpassword123",
      "role": "admin"
    }
    ```
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "name": "John Updated",
    "email": "updated@example.com",
    "role": "admin"
  }
  ```
- **Notas**:
  - Este endpoint requiere el rol de `admin`.
  - Si se actualiza la contraseña, se almacena de forma segura utilizando un hash.

---

#### **5. Eliminar un usuario**
- **Ruta**: `DELETE /user/:id`
- **Descripción**: Elimina un usuario existente.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID del usuario (UUID).
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
  ```
- **Notas**:
  - Este endpoint requiere el rol de `admin`.

---

### **Detalles Técnicos**

#### **DTOs (Data Transfer Objects)**
- **`CreateUserDto`**:
  - Valida los datos necesarios para crear un usuario.
  - Campos:
    - `name` (string, requerido).
    - `email` (string, requerido).
    - `password` (string, requerido, entre 5 y 20 caracteres).

- **`UpdateUserDto`**:
  - Valida los datos para actualizar un usuario.
  - Campos opcionales:
    - `name` (string).
    - `email` (string).
    - `password` (string).
    - `role` (string).

- **`searchUserDto`**:
  - Valida los parámetros de consulta para la paginación.
  - Campos opcionales:
    - `offset` (número).
    - `limit` (número).

#### **Roles y Seguridad**
- Los endpoints `POST`, `PATCH`, y `DELETE` están protegidos por el guard `RolesGuard` y requieren el rol de `admin`.
- Los endpoints `GET` son públicos y no requieren autenticación.

#### **Servicios**
- **`UserService`**:
  - Implementa la lógica de negocio para gestionar usuarios.
  - Métodos principales:
    - `create`: Crea un nuevo usuario con la contraseña hasheada.
    - `getAll`: Devuelve todos los usuarios.
    - `findById`: Busca un usuario por su ID.
    - `findByEmail`: Busca un usuario por su correo electrónico.
    - `update`: Actualiza los datos de un usuario.
    - `delete`: Elimina un usuario.

#### **Entidades**
- **`User`**:
  - Representa la tabla de usuarios en la base de datos.
  - Campos:
    - `id` (UUID, clave primaria).
    - `name` (string).
    - `email` (string).
    - `password` (string, almacenado como hash).
    - `role` (string).

### **Modulo `Auth`**

El módulo `Auth` gestiona la autenticación de usuarios en la API. Este módulo incluye funcionalidades para iniciar sesión y proteger rutas mediante autenticación basada en JWT (JSON Web Tokens).

---

### **Descripción de los Endpoints**

#### **1. Iniciar sesión**
- **Ruta**: `POST /auth/login`
- **Descripción**: Permite a un usuario autenticarse en la API y obtener un token JWT.
- **Parámetros**:
  - **Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
- **Respuesta**:
  ```json
  {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "user@example.com",
      "roles": "customer"
    },
    "token": "jwt-token"
  }
  ```
- **Notas**:
  - Este endpoint es público y no requiere autenticación previa.
  - El token JWT devuelto debe incluirse en el encabezado `Authorization` como `Bearer <token>` para acceder a rutas protegidas.

---

### **Detalles Técnicos**

#### **DTOs (Data Transfer Objects)**
- **`LoginDto`**:
  - Valida los datos necesarios para iniciar sesión.
  - Campos:
    - `email` (string, requerido): Debe ser un correo electrónico válido.
    - `password` (string, requerido): Contraseña del usuario.

#### **Servicios**
- **`AuthService`**:
  - Implementa la lógica de autenticación.
  - Métodos principales:
    - `validateUser`: Valida las credenciales del usuario (correo y contraseña).
    - `login`: Genera un token JWT para un usuario autenticado.

#### **Estrategias**
- **`JwtStrategy`**:
  - Valida los tokens JWT en las solicitudes protegidas.
  - Extrae el token del encabezado `Authorization` y verifica su validez utilizando la clave secreta configurada.
  - Devuelve el payload del token (ID, correo y rol del usuario) si es válido.

#### **Guards**
- **`JwtAuthGuard`**:
  - Protege las rutas que requieren autenticación.
  - Verifica si la ruta es pública (decorador `@Public`) o si requiere un token JWT válido.
  - Llama a `JwtStrategy.validate` para validar el token y adjuntar el usuario autenticado al objeto `request`.

#### **Módulo**
- **`AuthModule`**:
  - Configura la autenticación JWT.
  - Importa el módulo `JwtModule` con una clave secreta (`JWT_SECRET`) y un tiempo de expiración de 1 hora.
  - Proporciona los servicios y estrategias necesarios para la autenticación.

---

### **Notas Adicionales**

1. **Seguridad**:
   - El token JWT incluye información sensible como el ID y el rol del usuario. Asegúrate de proteger la clave secreta (`JWT_SECRET`) en el entorno de producción.

2. **Decoradores**:
   - El decorador `@Public` permite marcar rutas como públicas, excluyéndolas de la autenticación.

3. **Logs**:
   - El módulo incluye logs detallados en `JwtAuthGuard` y `JwtStrategy` para depurar problemas de autenticación.

### **Módulo `ComplementaryProduct`**

El módulo `ComplementaryProduct` gestiona los productos complementarios relacionados con las velas personalizadas. Este módulo incluye funcionalidades para listar, crear, actualizar y eliminar productos complementarios, así como para obtener información específica de un producto.

---

### **Descripción de los Endpoints**

#### **1. Obtener todos los productos complementarios**
- **Ruta**: `GET /complementary-product`
- **Descripción**: Devuelve una lista de todos los productos complementarios registrados.
- **Parámetros**: Ninguno.
- **Respuesta**:
  ```json
  [
    {
      "id": 1,
      "name": "Producto 1",
      "description": "Descripción del producto 1",
      "image_url": "https://example.com/image1.jpg",
      "price": 10.99,
      "quantity": 5
    }
  ]
  ```
- **Notas**: Este endpoint es público y no requiere autenticación.

---

#### **2. Obtener un producto complementario por ID**
- **Ruta**: `GET /complementary-product/:id`
- **Descripción**: Devuelve los detalles de un producto complementario específico.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID del producto complementario (número).
- **Respuesta**:
  ```json
  {
    "id": 1,
    "name": "Producto 1",
    "description": "Descripción del producto 1",
    "image_url": "https://example.com/image1.jpg",
    "price": 10.99,
    "quantity": 5
  }
  ```
- **Notas**: Este endpoint es público y no requiere autenticación.

---

#### **3. Crear un producto complementario**
- **Ruta**: `POST /complementary-product`
- **Descripción**: Crea un nuevo producto complementario.
- **Parámetros**:
  - **Body**:
    ```json
    {
      "name": "Producto 1",
      "description": "Descripción del producto 1",
      "image_url": "https://example.com/image1.jpg",
      "price": 10.99,
      "quantity": 5
    }
    ```
- **Respuesta**:
  ```json
  {
    "id": 1,
    "name": "Producto 1",
    "description": "Descripción del producto 1",
    "image_url": "https://example.com/image1.jpg",
    "price": 10.99,
    "quantity": 5
  }
  ```
- **Notas**:
  - Este endpoint requiere autenticación y permisos de administrador.

---

#### **4. Actualizar un producto complementario**
- **Ruta**: `PATCH /complementary-product/:id`
- **Descripción**: Actualiza los datos de un producto complementario existente.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID del producto complementario (número).
  - **Body** (solo los campos que se desean actualizar):
    ```json
    {
      "name": "Producto Actualizado",
      "price": 12.99
    }
    ```
- **Respuesta**:
  ```json
  {
    "id": 1,
    "name": "Producto Actualizado",
    "description": "Descripción del producto 1",
    "image_url": "https://example.com/image1.jpg",
    "price": 12.99,
    "quantity": 5
  }
  ```
- **Notas**:
  - Este endpoint requiere autenticación y permisos de administrador.

---

#### **5. Eliminar un producto complementario**
- **Ruta**: `DELETE /complementary-product/:id`
- **Descripción**: Elimina un producto complementario existente.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID del producto complementario (número).
- **Respuesta**:
  ```json
  {
    "id": 1,
    "name": "Producto 1",
    "description": "Descripción del producto 1",
    "image_url": "https://example.com/image1.jpg",
    "price": 10.99,
    "quantity": 5
  }
  ```
- **Notas**:
  - Este endpoint requiere autenticación y permisos de administrador.

---

### **Detalles Técnicos**

#### **DTOs (Data Transfer Objects)**
- **`CreateComplementaryProductDto`**:
  - Valida los datos necesarios para crear un producto complementario.
  - Campos:
    - `name` (string, requerido): Nombre del producto.
    - `description` (string, opcional): Descripción del producto.
    - `image_url` (string, opcional): URL de la imagen del producto.
    - `price` (número, opcional): Precio del producto.
    - `quantity` (número, requerido): Cantidad disponible del producto (mínimo 1).

- **`UpdateComplementaryProductDto`**:
  - Valida los datos para actualizar un producto complementario.
  - Campos opcionales:
    - `name` (string).
    - `description` (string).
    - `image_url` (string).
    - `price` (número).
    - `quantity` (número).

#### **Servicios**
- **`ComplementaryProductService`**:
  - Implementa la lógica de negocio para gestionar productos complementarios.
  - Métodos principales:
    - `create`: Crea un nuevo producto complementario.
    - `findAll`: Devuelve todos los productos complementarios.
    - `findOne`: Busca un producto complementario por su ID.
    - `update`: Actualiza los datos de un producto complementario.
    - `remove`: Elimina un producto complementario.

#### **Entidades**
- **`ComplementaryProduct`**:
  - Representa la tabla de productos complementarios en la base de datos.
  - Campos:
    - `id` (número, clave primaria).
    - `name` (string, requerido).
    - `description` (string, opcional).
    - `image_url` (string, opcional).
    - `price` (número, opcional).
    - `quantity` (número, requerido).

#### **Módulo**
- **`ComplementaryProductModule`**:
  - Configura el módulo para gestionar productos complementarios.
  - Importa el módulo `TypeOrmModule` para interactuar con la base de datos.
  - Proporciona el controlador y servicio necesarios para las operaciones CRUD.

### **Módulo `Container`**

El módulo `Container` gestiona los contenedores relacionados con las velas personalizadas. Este módulo incluye funcionalidades para listar, crear, actualizar y eliminar contenedores, así como para obtener información específica de un contenedor.

---

### **Descripción de los Endpoints**

#### **1. Obtener todos los contenedores**
- **Ruta**: `GET /container`
- **Descripción**: Devuelve una lista de todos los contenedores registrados.
- **Parámetros**:
  - **Query** (opcional):
    - `offset`: Número de registros a omitir.
    - `limit`: Número máximo de registros a devolver.
- **Respuesta**:
  ```json
  [
    {
      "id": "uuid",
      "name": "Contenedor 1",
      "image_url": "https://example.com/image1.jpg"
    }
  ]
  ```
- **Notas**: Este endpoint es público y no requiere autenticación.

---

#### **2. Obtener un contenedor por ID**
- **Ruta**: `GET /container/:id`
- **Descripción**: Devuelve los detalles de un contenedor específico.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID del contenedor (UUID).
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "name": "Contenedor 1",
    "image_url": "https://example.com/image1.jpg"
  }
  ```
- **Notas**: Este endpoint es público y no requiere autenticación.

---

#### **3. Crear un contenedor**
- **Ruta**: `POST /container`
- **Descripción**: Crea un nuevo contenedor.
- **Parámetros**:
  - **Body**:
    ```json
    {
      "name": "Contenedor 1",
      "image_url": "https://example.com/image1.jpg"
    }
    ```
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "name": "Contenedor 1",
    "image_url": "https://example.com/image1.jpg"
  }
  ```
- **Notas**:
  - Este endpoint requiere autenticación y permisos de administrador.

---

#### **4. Actualizar un contenedor**
- **Ruta**: `PATCH /container/:id`
- **Descripción**: Actualiza los datos de un contenedor existente.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID del contenedor (UUID).
  - **Body** (solo los campos que se desean actualizar):
    ```json
    {
      "name": "Contenedor Actualizado",
      "image_url": "https://example.com/image2.jpg"
    }
    ```
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "name": "Contenedor Actualizado",
    "image_url": "https://example.com/image2.jpg"
  }
  ```
- **Notas**:
  - Este endpoint requiere autenticación y permisos de administrador.

---

#### **5. Eliminar un contenedor**
- **Ruta**: `DELETE /container/:id`
- **Descripción**: Elimina un contenedor existente.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID del contenedor (UUID).
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "name": "Contenedor 1",
    "image_url": "https://example.com/image1.jpg"
  }
  ```
- **Notas**:
  - Este endpoint requiere autenticación y permisos de administrador.

---

### **Detalles Técnicos**

#### **DTOs (Data Transfer Objects)**
- **`CreateContainerDto`**:
  - Valida los datos necesarios para crear un contenedor.
  - Campos:
    - `name` (string, requerido): Nombre del contenedor.
    - `image_url` (string, requerido): URL de la imagen del contenedor.

- **`UpdateContainerDto`**:
  - Valida los datos para actualizar un contenedor.
  - Campos opcionales:
    - `name` (string).
    - `image_url` (string).

- **`searchDto`**:
  - Valida los parámetros de consulta para la paginación.
  - Campos opcionales:
    - `offset` (número).
    - `limit` (número).

#### **Servicios**
- **`ContainerService`**:
  - Implementa la lógica de negocio para gestionar contenedores.
  - Métodos principales:
    - `create`: Crea un nuevo contenedor.
    - `getAll`: Devuelve todos los contenedores.
    - `findById`: Busca un contenedor por su ID.
    - `update`: Actualiza los datos de un contenedor.
    - `delete`: Elimina un contenedor.

#### **Entidades**
- **`Container`**:
  - Representa la tabla de contenedores en la base de datos.
  - Campos:
    - `id` (UUID, clave primaria).
    - `name` (string, requerido).
    - `image_url` (string, requerido).

#### **Módulo**
- **`ContainerModule`**:
  - Configura el módulo para gestionar contenedores.
  - Importa el módulo `TypeOrmModule` para interactuar con la base de datos.
  - Proporciona el controlador y servicio necesarios para las operaciones CRUD.

### **Módulo `CustomCandle`**

El módulo `CustomCandle` gestiona las velas personalizadas creadas por los usuarios. Este módulo incluye funcionalidades para listar, crear, actualizar y eliminar velas personalizadas, así como para obtener información específica de una vela.

---

### **Descripción de los Endpoints**

#### **1. Obtener todas las velas personalizadas**
- **Ruta**: `GET /custom-candle`
- **Descripción**: Devuelve una lista de todas las velas personalizadas registradas.
- **Parámetros**: Ninguno.
- **Respuesta**:
  ```json
  [
    {
      "id": "uuid",
      "user": {
        "id": "uuid",
        "name": "John Doe"
      },
      "container": {
        "id": "uuid",
        "name": "Contenedor 1"
      },
      "fragrance": {
        "id": "uuid",
        "name": "Lavanda"
      },
      "emotionalState": {
        "id": "uuid",
        "name": "Relajación"
      },
      "price": 25.99,
      "quantity": 2,
      "status": "pending",
      "createdAt": "2025-05-08T12:00:00Z"
    }
  ]
  ```
- **Notas**: Este endpoint es público y no requiere autenticación.

---

#### **2. Obtener una vela personalizada por ID**
- **Ruta**: `GET /custom-candle/:id`
- **Descripción**: Devuelve los detalles de una vela personalizada específica.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID de la vela personalizada (UUID).
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "user": {
      "id": "uuid",
      "name": "John Doe"
    },
    "container": {
      "id": "uuid",
      "name": "Contenedor 1"
    },
    "fragrance": {
      "id": "uuid",
      "name": "Lavanda"
    },
    "emotionalState": {
      "id": "uuid",
      "name": "Relajación"
    },
    "price": 25.99,
    "quantity": 2,
    "status": "pending",
    "createdAt": "2025-05-08T12:00:00Z"
  }
  ```
- **Notas**: Este endpoint es público y no requiere autenticación.

---

#### **3. Crear una vela personalizada**
- **Ruta**: `POST /custom-candle`
- **Descripción**: Crea una nueva vela personalizada.
- **Parámetros**:
  - **Body**:
    ```json
    {
      "userId": "uuid",
      "containerId": "uuid",
      "fragranceId": "uuid",
      "emotionalStateId": "uuid",
      "price": 25.99,
      "quantity": 2,
      "name": "Vela Relajante",
      "status": "pending"
    }
    ```
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "user": {
      "id": "uuid",
      "name": "John Doe"
    },
    "container": {
      "id": "uuid",
      "name": "Contenedor 1"
    },
    "fragrance": {
      "id": "uuid",
      "name": "Lavanda"
    },
    "emotionalState": {
      "id": "uuid",
      "name": "Relajación"
    },
    "price": 25.99,
    "quantity": 2,
    "status": "pending",
    "createdAt": "2025-05-08T12:00:00Z"
  }
  ```
- **Notas**:
  - Este endpoint requiere que los IDs de `containerId`, `fragranceId` y `emotionalStateId` sean válidos.
  - El campo `userId` es opcional.

---

#### **4. Actualizar una vela personalizada**
- **Ruta**: `PATCH /custom-candle/:id`
- **Descripción**: Actualiza los datos de una vela personalizada existente.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID de la vela personalizada (UUID).
  - **Body** (solo los campos que se desean actualizar):
    ```json
    {
      "price": 30.99,
      "status": "completed"
    }
    ```
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "user": {
      "id": "uuid",
      "name": "John Doe"
    },
    "container": {
      "id": "uuid",
      "name": "Contenedor 1"
    },
    "fragrance": {
      "id": "uuid",
      "name": "Lavanda"
    },
    "emotionalState": {
      "id": "uuid",
      "name": "Relajación"
    },
    "price": 30.99,
    "quantity": 2,
    "status": "completed",
    "createdAt": "2025-05-08T12:00:00Z"
  }
  ```
- **Notas**:
  - Este endpoint requiere que los IDs de `containerId`, `fragranceId` y `emotionalStateId` sean válidos si se actualizan.

---

#### **5. Eliminar una vela personalizada**
- **Ruta**: `DELETE /custom-candle/:id`
- **Descripción**: Elimina una vela personalizada existente.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID de la vela personalizada (UUID).
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "name": "Vela Relajante",
    "status": "pending"
  }
  ```
- **Notas**: Este endpoint elimina la vela personalizada y devuelve sus datos.

---

### **Detalles Técnicos**

#### **DTOs (Data Transfer Objects)**
- **`CreateCustomCandleDto`**:
  - Valida los datos necesarios para crear una vela personalizada.
  - Campos:
    - `userId` (UUID, opcional): ID del usuario.
    - `containerId` (UUID, requerido): ID del contenedor.
    - `fragranceId` (UUID, requerido): ID de la fragancia.
    - `emotionalStateId` (UUID, requerido): ID del estado emocional.
    - `price` (número, requerido): Precio de la vela.
    - `quantity` (entero, requerido): Cantidad de velas.
    - `name` (string, opcional): Nombre de la vela.
    - `status` (string, opcional): Estado de la vela (`pending`, `completed`, `cancelled`).

- **`UpdateCustomCandleDto`**:
  - Extiende `CreateCustomCandleDto` y permite actualizar solo los campos necesarios.

#### **Servicios**
- **`CustomCandleService`**:
  - Implementa la lógica de negocio para gestionar velas personalizadas.
  - Métodos principales:
    - `create`: Crea una nueva vela personalizada.
    - `findAll`: Devuelve todas las velas personalizadas.
    - `findOne`: Busca una vela personalizada por su ID.
    - `update`: Actualiza los datos de una vela personalizada.
    - `remove`: Elimina una vela personalizada.

#### **Entidades**
- **`CustomCandle`**:
  - Representa la tabla de velas personalizadas en la base de datos.
  - Campos:
    - `id` (UUID, clave primaria).
    - `user` (relación con `User`).
    - `container` (relación con `Container`).
    - `fragrance` (relación con `Fragrance`).
    - `emotionalState` (relación con `EmotionalState`).
    - `price` (número).
    - `quantity` (entero).
    - `name` (string).
    - `status` (string).
    - `createdAt` (fecha de creación).

#### **Módulo**
- **`CustomCandleModule`**:
  - Configura el módulo para gestionar velas personalizadas.
  - Importa el módulo `TypeOrmModule` para interactuar con la base de datos.
  - Proporciona el controlador y servicio necesarios para las operaciones CRUD.

### **Módulo `CustomCandleComplementaryProduct`**

El módulo `CustomCandleComplementaryProduct` gestiona la relación entre velas personalizadas (`CustomCandle`) y productos complementarios (`ComplementaryProduct`). Este módulo permite asociar productos complementarios a velas personalizadas, listar las relaciones existentes, y realizar operaciones CRUD sobre estas asociaciones.

---

### **Descripción de los Endpoints**

#### **1. Crear una relación entre vela personalizada y producto complementario**
- **Ruta**: `POST /custom-candle-complementary-product`
- **Descripción**: Crea una nueva relación entre una vela personalizada y un producto complementario.
- **Parámetros**:
  - **Body**:
    ```json
    {
      "customCandleId": "uuid",
      "complementaryProductId": 1
    }
    ```
- **Respuesta**:
  ```json
  {
    "id": 1,
    "customCandle": {
      "id": "uuid",
      "name": "Vela Relajante"
    },
    "complementaryProduct": {
      "id": 1,
      "name": "Producto Complementario 1"
    }
  }
  ```
- **Notas**:
  - El `customCandleId` debe ser un UUID válido que corresponda a una vela personalizada existente.
  - El `complementaryProductId` debe ser un número entero que corresponda a un producto complementario existente.

---

#### **2. Obtener todas las relaciones**
- **Ruta**: `GET /custom-candle-complementary-product`
- **Descripción**: Devuelve una lista de todas las relaciones entre velas personalizadas y productos complementarios.
- **Parámetros**: Ninguno.
- **Respuesta**:
  ```json
  [
    {
      "id": 1,
      "customCandle": {
        "id": "uuid",
        "name": "Vela Relajante"
      },
      "complementaryProduct": {
        "id": 1,
        "name": "Producto Complementario 1"
      }
    }
  ]
  ```
- **Notas**: Este endpoint es público y no requiere autenticación.

---

#### **3. Obtener una relación por ID**
- **Ruta**: `GET /custom-candle-complementary-product/:id`
- **Descripción**: Devuelve los detalles de una relación específica entre una vela personalizada y un producto complementario.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID de la relación (número).
- **Respuesta**:
  ```json
  {
    "id": 1,
    "customCandle": {
      "id": "uuid",
      "name": "Vela Relajante"
    },
    "complementaryProduct": {
      "id": 1,
      "name": "Producto Complementario 1"
    }
  }
  ```
- **Notas**: Este endpoint es público y no requiere autenticación.

---

#### **4. Actualizar una relación**
- **Ruta**: `PATCH /custom-candle-complementary-product/:id`
- **Descripción**: Actualiza los datos de una relación existente entre una vela personalizada y un producto complementario.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID de la relación (número).
  - **Body** (solo los campos que se desean actualizar):
    ```json
    {
      "customCandleId": "uuid",
      "complementaryProductId": 2
    }
    ```
- **Respuesta**:
  ```json
  {
    "id": 1,
    "customCandle": {
      "id": "uuid",
      "name": "Vela Relajante"
    },
    "complementaryProduct": {
      "id": 2,
      "name": "Producto Complementario 2"
    }
  }
  ```
- **Notas**:
  - El `customCandleId` y el `complementaryProductId` deben ser válidos si se actualizan.

---

#### **5. Eliminar una relación**
- **Ruta**: `DELETE /custom-candle-complementary-product/:id`
- **Descripción**: Elimina una relación existente entre una vela personalizada y un producto complementario.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID de la relación (número).
- **Respuesta**:
  ```json
  {
    "id": 1,
    "customCandle": {
      "id": "uuid",
      "name": "Vela Relajante"
    },
    "complementaryProduct": {
      "id": 1,
      "name": "Producto Complementario 1"
    }
  }
  ```
- **Notas**: Este endpoint elimina la relación y devuelve los datos eliminados.

---

### **Detalles Técnicos**

#### **DTOs (Data Transfer Objects)**
- **`CreateCustomCandleComplementaryProductDto`**:
  - Valida los datos necesarios para crear una relación.
  - Campos:
    - `customCandleId` (UUID, requerido): ID de la vela personalizada.
    - `complementaryProductId` (número, requerido): ID del producto complementario.

- **`UpdateCustomCandleComplementaryProductDto`**:
  - Extiende `CreateCustomCandleComplementaryProductDto` y permite actualizar solo los campos necesarios.

#### **Servicios**
- **`CustomCandleComplementaryProductService`**:
  - Implementa la lógica de negocio para gestionar las relaciones.
  - Métodos principales:
    - `create`: Crea una nueva relación.
    - `findAll`: Devuelve todas las relaciones.
    - `findOne`: Busca una relación por su ID.
    - `update`: Actualiza los datos de una relación.
    - `remove`: Elimina una relación.

#### **Entidades**
- **`CustomCandleComplementaryProduct`**:
  - Representa la tabla de relaciones en la base de datos.
  - Campos:
    - `id` (número, clave primaria).
    - `customCandle` (relación con `CustomCandle`).
    - `complementaryProduct` (relación con `ComplementaryProduct`).

#### **Módulo**
- **`CustomCandleComplementaryProductModule`**:
  - Configura el módulo para gestionar las relaciones.
  - Importa el módulo `TypeOrmModule` para interactuar con la base de datos.
  - Proporciona el controlador y servicio necesarios para las operaciones CRUD.

### **Módulo `Public Decorator`**

El módulo `Public Decorator` proporciona una funcionalidad clave para gestionar la seguridad y autenticación en la API. Este módulo permite marcar rutas específicas como públicas, excluyéndolas de los procesos de autenticación y autorización.

---

### **Descripción de la Funcionalidad**

#### **Decorador `@Public`**
- **Descripción**: 
  - Este decorador se utiliza para marcar rutas o controladores como públicos, permitiendo el acceso sin necesidad de autenticación.
  - Internamente, utiliza el método `SetMetadata` de NestJS para establecer una clave (`IS_PUBLIC_KEY`) con el valor `true` en el contexto de la ruta o controlador.

- **Uso**:
  - Se aplica directamente sobre métodos o clases en los controladores.
  - Ejemplo:
    ```typescript
    import { Controller, Get } from '@nestjs/common';
    import { Public } from 'src/decorators/public.decorator';

    @Controller('example')
    export class ExampleController {
      @Public()
      @Get()
      getPublicData() {
        return { message: 'This route is public' };
      }
    }
    ```

- **Implementación**:
  - Código del decorador:
    ```typescript
    import { SetMetadata } from '@nestjs/common';

    export const IS_PUBLIC_KEY = 'isPublic';
    export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
    ```

---

### **Detalles Técnicos**

#### **Claves y Metadatos**
- **`IS_PUBLIC_KEY`**:
  - Es una constante que define la clave utilizada para identificar rutas públicas.
  - Valor: `'isPublic'`.

- **`SetMetadata`**:
  - Método proporcionado por NestJS para asociar metadatos a rutas o controladores.
  - En este caso, se utiliza para establecer el valor `true` en la clave `IS_PUBLIC_KEY`.

#### **Integración con Guards**
- Este decorador se utiliza en combinación con un guard global (como `JwtAuthGuard`) para determinar si una ruta debe ser excluida de la autenticación.
- Ejemplo de uso en un guard:
  ```typescript
  import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';

  @Injectable()
  export class JwtAuthGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (isPublic) {
        return true;
      }
      // Lógica de autenticación aquí
      return true; // o false dependiendo de la validación
    }
  }
  ```

### **Módulo `EmotionalStateFragrance`**

El módulo `EmotionalStateFragrance` gestiona la relación entre estados emocionales (`EmotionalState`) y fragancias (`Fragrance`). Este módulo permite asociar fragancias a estados emocionales, listar las relaciones existentes, y realizar operaciones CRUD sobre estas asociaciones.

---

### **Descripción de los Endpoints**

#### **1. Crear una relación entre estado emocional y fragancia**
- **Ruta**: `POST /emotional-state-fragrance`
- **Descripción**: Crea una nueva relación entre un estado emocional y una fragancia.
- **Parámetros**:
  - **Body**:
    ```json
    {
      "fragranceId": "uuid",
      "emotionalStateId": "uuid"
    }
    ```
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "fragrance": {
      "id": "uuid",
      "name": "Lavanda"
    },
    "emotionalState": {
      "id": "uuid",
      "name": "Relajación"
    }
  }
  ```
- **Notas**:
  - El `fragranceId` y el `emotionalStateId` deben ser UUID válidos que correspondan a entidades existentes.
  - Este endpoint requiere autenticación y permisos de administrador.

---

#### **2. Obtener todas las relaciones**
- **Ruta**: `GET /emotional-state-fragrance`
- **Descripción**: Devuelve una lista de todas las relaciones entre estados emocionales y fragancias.
- **Parámetros**: Ninguno.
- **Respuesta**:
  ```json
  [
    {
      "id": "uuid",
      "fragrance": {
        "id": "uuid",
        "name": "Lavanda"
      },
      "emotionalState": {
        "id": "uuid",
        "name": "Relajación"
      }
    }
  ]
  ```
- **Notas**: Este endpoint es público y no requiere autenticación.

---

#### **3. Obtener una relación por estado emocional y fragancia**
- **Ruta**: `GET /emotional-state-fragrance/:emotionalStateId/:fragranceId`
- **Descripción**: Devuelve los detalles de una relación específica entre un estado emocional y una fragancia.
- **Parámetros**:
  - **Path**:
    - `emotionalStateId` (requerido): ID del estado emocional (UUID).
    - `fragranceId` (requerido): ID de la fragancia (UUID).
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "fragrance": {
      "id": "uuid",
      "name": "Lavanda"
    },
    "emotionalState": {
      "id": "uuid",
      "name": "Relajación"
    }
  }
  ```
- **Notas**: Este endpoint es público y no requiere autenticación.

---

#### **4. Actualizar una relación**
- **Ruta**: `PATCH /emotional-state-fragrance/:emotionalStateId/:fragranceId`
- **Descripción**: Actualiza los datos de una relación existente entre un estado emocional y una fragancia.
- **Parámetros**:
  - **Path**:
    - `emotionalStateId` (requerido): ID del estado emocional (UUID).
    - `fragranceId` (requerido): ID de la fragancia (UUID).
  - **Body** (solo los campos que se desean actualizar):
    ```json
    {
      "fragranceId": "uuid",
      "emotionalStateId": "uuid"
    }
    ```
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "fragrance": {
      "id": "uuid",
      "name": "Lavanda"
    },
    "emotionalState": {
      "id": "uuid",
      "name": "Relajación"
    }
  }
  ```
- **Notas**:
  - Este endpoint requiere autenticación y permisos de administrador.

---

#### **5. Eliminar una relación**
- **Ruta**: `DELETE /emotional-state-fragrance/:emotionalStateId/:fragranceId`
- **Descripción**: Elimina una relación existente entre un estado emocional y una fragancia.
- **Parámetros**:
  - **Path**:
    - `emotionalStateId` (requerido): ID del estado emocional (UUID).
    - `fragranceId` (requerido): ID de la fragancia (UUID).
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "fragrance": {
      "id": "uuid",
      "name": "Lavanda"
    },
    "emotionalState": {
      "id": "uuid",
      "name": "Relajación"
    }
  }
  ```
- **Notas**:
  - Este endpoint requiere autenticación y permisos de administrador.

---

### **Detalles Técnicos**

#### **DTOs (Data Transfer Objects)**
- **`CreateEmotionalStateFragranceDto`**:
  - Valida los datos necesarios para crear una relación.
  - Campos:
    - `fragranceId` (UUID, requerido): ID de la fragancia.
    - `emotionalStateId` (UUID, requerido): ID del estado emocional.

- **`UpdateEmotionalStateFragranceDto`**:
  - Extiende `CreateEmotionalStateFragranceDto` y permite actualizar solo los campos necesarios.

#### **Servicios**
- **`EmotionalStateFragranceService`**:
  - Implementa la lógica de negocio para gestionar las relaciones.
  - Métodos principales:
    - `create`: Crea una nueva relación.
    - `findAll`: Devuelve todas las relaciones.
    - `findByEmotionalStateId`: Busca relaciones por estado emocional.
    - `findByFragranceId`: Busca relaciones por fragancia.
    - `findByEmotionalStateAndFragranceId`: Busca una relación específica.
    - `update`: Actualiza los datos de una relación.
    - `delete`: Elimina una relación.

#### **Entidades**
- **`EmotionalStateFragrance`**:
  - Representa la tabla de relaciones en la base de datos.
  - Campos:
    - `id` (UUID, clave primaria).
    - `emotionalState` (relación con `EmotionalState`).
    - `fragrance` (relación con `Fragrance`).

#### **Módulo**
- **`EmotionalStateFragranceModule`**:
  - Configura el módulo para gestionar las relaciones.
  - Importa el módulo `TypeOrmModule` para interactuar con la base de datos.
  - Proporciona el controlador y servicio necesarios para las operaciones CRUD.

### **Módulo `Fragrance`**

El módulo `Fragrance` gestiona las fragancias disponibles en la API. Este módulo incluye funcionalidades para listar, crear, actualizar y eliminar fragancias, así como para obtener información específica de una fragancia.

---

### **Descripción de los Endpoints**

#### **1. Obtener todas las fragancias**
- **Ruta**: `GET /fragrance`
- **Descripción**: Devuelve una lista de todas las fragancias registradas.
- **Parámetros**:
  - **Query** (opcional):
    - `offset`: Número de registros a omitir.
    - `limit`: Número máximo de registros a devolver.
- **Respuesta**:
  ```json
  [
    {
      "id": "uuid",
      "name": "Lavanda"
    }
  ]
  ```
- **Notas**: Este endpoint es público y no requiere autenticación.

---

#### **2. Obtener una fragancia por ID**
- **Ruta**: `GET /fragrance/:id`
- **Descripción**: Devuelve los detalles de una fragancia específica.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID de la fragancia (UUID).
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "name": "Lavanda"
  }
  ```
- **Notas**: Este endpoint es público y no requiere autenticación.

---

#### **3. Crear una fragancia**
- **Ruta**: `POST /fragrance`
- **Descripción**: Crea una nueva fragancia.
- **Parámetros**:
  - **Body**:
    ```json
    {
      "name": "Lavanda"
    }
    ```
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "name": "Lavanda"
  }
  ```
- **Notas**:
  - Este endpoint requiere autenticación y permisos de administrador.
  - El nombre de la fragancia debe ser único.

---

#### **4. Actualizar una fragancia**
- **Ruta**: `PATCH /fragrance/:id`
- **Descripción**: Actualiza los datos de una fragancia existente.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID de la fragancia (UUID).
  - **Body** (solo los campos que se desean actualizar):
    ```json
    {
      "name": "Rosa"
    }
    ```
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "name": "Rosa"
  }
  ```
- **Notas**:
  - Este endpoint requiere autenticación y permisos de administrador.

---

#### **5. Eliminar una fragancia**
- **Ruta**: `DELETE /fragrance/:id`
- **Descripción**: Elimina una fragancia existente.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID de la fragancia (UUID).
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "name": "Lavanda"
  }
  ```
- **Notas**:
  - Este endpoint requiere autenticación y permisos de administrador.
  - Si la fragancia está asociada a otras entidades, se eliminan en cascada.

---

### **Detalles Técnicos**

#### **DTOs (Data Transfer Objects)**
- **`CreateFragranceDto`**:
  - Valida los datos necesarios para crear una fragancia.
  - Campos:
    - `name` (string, requerido): Nombre de la fragancia.

- **`UpdateFragranceDto`**:
  - Extiende `CreateFragranceDto` y permite actualizar solo los campos necesarios.
  - Campos opcionales:
    - `name` (string).

#### **Servicios**
- **`FragranceService`**:
  - Implementa la lógica de negocio para gestionar fragancias.
  - Métodos principales:
    - `create`: Crea una nueva fragancia.
    - `getAll`: Devuelve todas las fragancias.
    - `findById`: Busca una fragancia por su ID.
    - `update`: Actualiza los datos de una fragancia.
    - `delete`: Elimina una fragancia.

#### **Entidades**
- **`Fragrance`**:
  - Representa la tabla de fragancias en la base de datos.
  - Campos:
    - `id` (UUID, clave primaria).
    - `name` (string, requerido, único).
    - `emotionalStateFragrance` (relación con `EmotionalStateFragrance`).
    - `fragrancePyramid` (relación con `FragrancePyramid`).

#### **Módulo**
- **`FragranceModule`**:
  - Configura el módulo para gestionar fragancias.
  - Importa el módulo `TypeOrmModule` para interactuar con la base de datos.
  - Proporciona el controlador y servicio necesarios para las operaciones CRUD.

### **Módulo `FragrancePyramid`**

El módulo `FragrancePyramid` gestiona las pirámides olfativas asociadas a las fragancias. Este módulo incluye funcionalidades para listar, crear, actualizar y eliminar pirámides olfativas, así como para obtener información específica de una pirámide.

---

### **Descripción de los Endpoints**

#### **1. Crear una pirámide olfativa**
- **Ruta**: `POST /fragrance-pyramid`
- **Descripción**: Crea una nueva pirámide olfativa asociada a una fragancia.
- **Parámetros**:
  - **Body**:
    ```json
    {
      "fragranceId": "uuid",
      "top": "Nota de salida",
      "heart": "Nota de corazón",
      "base": "Nota de fondo"
    }
    ```
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "fragrance": {
      "id": "uuid",
      "name": "Lavanda"
    },
    "top": "Nota de salida",
    "heart": "Nota de corazón",
    "base": "Nota de fondo"
  }
  ```
- **Notas**:
  - El `fragranceId` debe ser un UUID válido que corresponda a una fragancia existente.
  - Este endpoint requiere autenticación y permisos de administrador.

---

#### **2. Obtener todas las pirámides olfativas**
- **Ruta**: `GET /fragrance-pyramid`
- **Descripción**: Devuelve una lista de todas las pirámides olfativas registradas.
- **Parámetros**: Ninguno.
- **Respuesta**:
  ```json
  [
    {
      "id": "uuid",
      "fragrance": {
        "id": "uuid",
        "name": "Lavanda"
      },
      "top": "Nota de salida",
      "heart": "Nota de corazón",
      "base": "Nota de fondo"
    }
  ]
  ```
- **Notas**: Este endpoint es público y no requiere autenticación.

---

#### **3. Obtener una pirámide olfativa por ID**
- **Ruta**: `GET /fragrance-pyramid/:id`
- **Descripción**: Devuelve los detalles de una pirámide olfativa específica.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID de la pirámide olfativa (UUID).
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "fragrance": {
      "id": "uuid",
      "name": "Lavanda"
    },
    "top": "Nota de salida",
    "heart": "Nota de corazón",
    "base": "Nota de fondo"
  }
  ```
- **Notas**: Este endpoint es público y no requiere autenticación.

---

#### **4. Actualizar una pirámide olfativa**
- **Ruta**: `PATCH /fragrance-pyramid/:id`
- **Descripción**: Actualiza los datos de una pirámide olfativa existente.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID de la pirámide olfativa (UUID).
  - **Body** (solo los campos que se desean actualizar):
    ```json
    {
      "top": "Nueva nota de salida",
      "heart": "Nueva nota de corazón"
    }
    ```
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "fragrance": {
      "id": "uuid",
      "name": "Lavanda"
    },
    "top": "Nueva nota de salida",
    "heart": "Nueva nota de corazón",
    "base": "Nota de fondo"
  }
  ```
- **Notas**:
  - Este endpoint requiere autenticación y permisos de administrador.

---

#### **5. Eliminar una pirámide olfativa**
- **Ruta**: `DELETE /fragrance-pyramid/:id`
- **Descripción**: Elimina una pirámide olfativa existente.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID de la pirámide olfativa (UUID).
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "fragrance": {
      "id": "uuid",
      "name": "Lavanda"
    },
    "top": "Nota de salida",
    "heart": "Nota de corazón",
    "base": "Nota de fondo"
  }
  ```
- **Notas**:
  - Este endpoint requiere autenticación y permisos de administrador.

---

### **Detalles Técnicos**

#### **DTOs (Data Transfer Objects)**
- **`CreateFragrancePyramidDto`**:
  - Valida los datos necesarios para crear una pirámide olfativa.
  - Campos:
    - `fragranceId` (UUID, requerido): ID de la fragancia asociada.
    - `top` (string, requerido): Nota de salida.
    - `heart` (string, requerido): Nota de corazón.
    - `base` (string, requerido): Nota de fondo.

- **`UpdateFragrancePyramidDto`**:
  - Extiende `CreateFragrancePyramidDto` y permite actualizar solo los campos necesarios.
  - Campos opcionales:
    - `top` (string).
    - `heart` (string).
    - `base` (string).

#### **Servicios**
- **`FragrancePyramidService`**:
  - Implementa la lógica de negocio para gestionar pirámides olfativas.
  - Métodos principales:
    - `create`: Crea una nueva pirámide olfativa.
    - `getAll`: Devuelve todas las pirámides olfativas.
    - `findById`: Busca una pirámide olfativa por su ID.
    - `update`: Actualiza los datos de una pirámide olfativa.
    - `delete`: Elimina una pirámide olfativa.

#### **Entidades**
- **`FragrancePyramid`**:
  - Representa la tabla de pirámides olfativas en la base de datos.
  - Campos:
    - `id` (UUID, clave primaria).
    - `fragrance` (relación con `Fragrance`).
    - `top` (string, requerido): Nota de salida.
    - `heart` (string, requerido): Nota de corazón.
    - `base` (string, requerido): Nota de fondo.

#### **Módulo**
- **`FragrancePyramidModule`**:
  - Configura el módulo para gestionar pirámides olfativas.
  - Importa el módulo `TypeOrmModule` para interactuar con la base de datos.
  - Proporciona el controlador y servicio necesarios para las operaciones CRUD.

### **Módulo `RolesGuard`**

El módulo `RolesGuard` gestiona la autorización basada en roles en la API. Este módulo permite restringir el acceso a rutas específicas según los roles asignados a los usuarios.

---

### **Descripción de la Funcionalidad**

#### **Decorador `@Roles`**
- **Descripción**:
  - Este decorador se utiliza para definir los roles requeridos para acceder a una ruta o controlador.
  - Internamente, utiliza el método `SetMetadata` de NestJS para asociar una clave (`ROLES_KEY`) con los roles requeridos.

- **Uso**:
  - Se aplica directamente sobre métodos o clases en los controladores.
  - Ejemplo:
    ```typescript
    import { Controller, Get } from '@nestjs/common';
    import { Roles } from 'src/guards/roles.decorator';

    @Controller('example')
    export class ExampleController {
      @Roles('admin')
      @Get()
      getAdminData() {
        return { message: 'This route is restricted to admins' };
      }
    }
    ```

- **Implementación**:
  - Código del decorador:
    ```typescript
    import { SetMetadata } from '@nestjs/common';

    export const ROLES_KEY = 'roles';
    export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
    ```

---

#### **Guard `RolesGuard`**
- **Descripción**:
  - Este guard verifica si el usuario tiene los roles necesarios para acceder a una ruta protegida.
  - Utiliza el decorador `@Roles` para obtener los roles requeridos y compara estos roles con el rol del usuario autenticado.

- **Implementación**:
  - Código del guard:
    ```typescript
    import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
    import { Reflector } from '@nestjs/core';
    import { ROLES_KEY } from './roles.decorator';

    @Injectable()
    export class RolesGuard implements CanActivate {
      constructor(private reflector: Reflector) {
        console.log('[RolesGuard] Constructor inicializado.');
      }

      canActivate(context: ExecutionContext): boolean {
        console.log('[RolesGuard] canActivate: Verificando roles...');

        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);
        console.log(`[RolesGuard] canActivate: Roles requeridos: ${requiredRoles}`);

        if (!requiredRoles || requiredRoles.length === 0) {
          console.log('[RolesGuard] canActivate: No se requieren roles específicos. Acceso permitido.');
          return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        console.log('[RolesGuard] canActivate: Usuario en request:', user);

        if (!user || !user.role) {
          console.error('[RolesGuard] canActivate: Usuario o rol no encontrado en la request. Lanzando ForbiddenException.');
          throw new ForbiddenException('No tienes permiso para acceder a este recurso (rol no encontrado en el token).');
        }

        const hasRole = requiredRoles.some((role) => user.role === role);
        console.log(`[RolesGuard] canActivate: ¿Usuario tiene el rol requerido (${user.role} vs ${requiredRoles})? ${hasRole}`);

        if (!hasRole) {
          console.warn(`[RolesGuard] canActivate: Rol de usuario '${user.role}' no coincide con roles requeridos '${requiredRoles.join(', ')}'. Lanzando ForbiddenException.`);
          throw new ForbiddenException(`No tienes permiso. Rol requerido: ${requiredRoles.join(', ')}`);
        }

        console.log('[RolesGuard] canActivate: Usuario tiene el rol requerido. Acceso concedido.');
        return true;
      }
    }
    ```

---

### **Detalles Técnicos**

#### **Claves y Metadatos**
- **`ROLES_KEY`**:
  - Es una constante que define la clave utilizada para identificar los roles requeridos en las rutas.
  - Valor: `'roles'`.

- **`SetMetadata`**:
  - Método proporcionado por NestJS para asociar metadatos a rutas o controladores.
  - En este caso, se utiliza para establecer los roles requeridos en la clave `ROLES_KEY`.

#### **Integración con Guards**
- Este guard se utiliza en combinación con el decorador `@Roles` para determinar si un usuario tiene los permisos necesarios para acceder a una ruta.

### **Módulo `OrderItem`**

El módulo `OrderItem` gestiona los elementos individuales de un pedido en la API. Este módulo incluye funcionalidades para listar, crear, actualizar y eliminar elementos de pedido, así como para obtener información específica de un elemento.

---

### **Descripción de los Endpoints**

#### **1. Crear un elemento de pedido**
- **Ruta**: `POST /order-item`
- **Descripción**: Crea un nuevo elemento de pedido asociado a un pedido y, opcionalmente, a una vela personalizada.
- **Parámetros**:
  - **Body**:
    ```json
    {
      "orderId": "uuid",
      "customCandleId": "uuid",
      "quantity": 2,
      "subtotal": 49.99
    }
    ```
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "order": {
      "id": "uuid"
    },
    "customCandle": {
      "id": "uuid"
    },
    "quantity": 2,
    "subtotal": 49.99
  }
  ```
- **Notas**:
  - El `orderId` debe ser un UUID válido que corresponda a un pedido existente.
  - El `customCandleId` es opcional y debe ser un UUID válido si se proporciona.
  - Este endpoint requiere autenticación y permisos de administrador.

---

#### **2. Obtener todos los elementos de pedido**
- **Ruta**: `GET /order-item`
- **Descripción**: Devuelve una lista de todos los elementos de pedido registrados.
- **Parámetros**: Ninguno.
- **Respuesta**:
  ```json
  [
    {
      "id": "uuid",
      "order": {
        "id": "uuid"
      },
      "customCandle": {
        "id": "uuid"
      },
      "quantity": 2,
      "subtotal": 49.99
    }
  ]
  ```
- **Notas**: Este endpoint es público y no requiere autenticación.

---

#### **3. Obtener un elemento de pedido por ID**
- **Ruta**: `GET /order-item/:id`
- **Descripción**: Devuelve los detalles de un elemento de pedido específico.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID del elemento de pedido (UUID).
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "order": {
      "id": "uuid"
    },
    "customCandle": {
      "id": "uuid"
    },
    "quantity": 2,
    "subtotal": 49.99
  }
  ```
- **Notas**: Este endpoint es público y no requiere autenticación.

---

#### **4. Actualizar un elemento de pedido**
- **Ruta**: `PATCH /order-item/:id`
- **Descripción**: Actualiza los datos de un elemento de pedido existente.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID del elemento de pedido (UUID).
  - **Body** (solo los campos que se desean actualizar):
    ```json
    {
      "quantity": 3,
      "subtotal": 74.99
    }
    ```
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "order": {
      "id": "uuid"
    },
    "customCandle": {
      "id": "uuid"
    },
    "quantity": 3,
    "subtotal": 74.99
  }
  ```
- **Notas**:
  - Este endpoint requiere autenticación y permisos de administrador.

---

#### **5. Eliminar un elemento de pedido**
- **Ruta**: `DELETE /order-item/:id`
- **Descripción**: Elimina un elemento de pedido existente.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID del elemento de pedido (UUID).
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "order": {
      "id": "uuid"
    },
    "customCandle": {
      "id": "uuid"
    },
    "quantity": 2,
    "subtotal": 49.99
  }
  ```
- **Notas**:
  - Este endpoint requiere autenticación y permisos de administrador.

---

### **Detalles Técnicos**

#### **DTOs (Data Transfer Objects)**
- **`CreateOrderItemDto`**:
  - Valida los datos necesarios para crear un elemento de pedido.
  - Campos:
    - `orderId` (UUID, requerido): ID del pedido asociado.
    - `customCandleId` (UUID, opcional): ID de la vela personalizada asociada.
    - `quantity` (entero, requerido): Cantidad del producto (mínimo 1).
    - `subtotal` (número, requerido): Subtotal del elemento (hasta 2 decimales).

- **`UpdateOrderItemDto`**:
  - Extiende `CreateOrderItemDto` y permite actualizar solo los campos necesarios.

#### **Servicios**
- **`OrderItemService`**:
  - Implementa la lógica de negocio para gestionar elementos de pedido.
  - Métodos principales:
    - `create`: Crea un nuevo elemento de pedido.
    - `getAll`: Devuelve todos los elementos de pedido.
    - `findById`: Busca un elemento de pedido por su ID.
    - `update`: Actualiza los datos de un elemento de pedido.
    - `delete`: Elimina un elemento de pedido.

#### **Entidades**
- **`OrderItem`**:
  - Representa la tabla de elementos de pedido en la base de datos.
  - Campos:
    - `id` (UUID, clave primaria).
    - `order` (relación con `Order`).
    - `customCandle` (relación con `CustomCandle`, opcional).
    - `quantity` (entero, requerido): Cantidad del producto.
    - `subtotal` (número, requerido): Subtotal del elemento.

#### **Módulo**
- **`OrderItemModule`**:
  - Configura el módulo para gestionar elementos de pedido.
  - Importa el módulo `TypeOrmModule` para interactuar con la base de datos.
  - Proporciona el controlador y servicio necesarios para las operaciones CRUD.

### **Módulo `Orders`**

El módulo `Orders` gestiona los pedidos realizados en la API. Este módulo incluye funcionalidades para listar, crear, actualizar y eliminar pedidos, así como para obtener información específica de un pedido.

---

### **Descripción de los Endpoints**

#### **1. Crear un pedido**
- **Ruta**: `POST /orders`
- **Descripción**: Crea un nuevo pedido asociado a un usuario y con detalles opcionales.
- **Parámetros**:
  - **Body**:
    ```json
    {
      "userId": "uuid",
      "totalAmount": 100.50,
      "status": "pending",
      "shippingAddress": "123 Main St",
      "paymentMethod": "credit_card",
      "notes": "Por favor, entregar en la tarde"
    }
    ```
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "user": {
      "id": "uuid",
      "name": "John Doe"
    },
    "totalAmount": 100.50,
    "status": "pending",
    "shippingAddress": "123 Main St",
    "paymentMethod": "credit_card",
    "notes": "Por favor, entregar en la tarde",
    "createdAt": "2025-05-08T12:00:00Z",
    "updatedAt": "2025-05-08T12:00:00Z"
  }
  ```
- **Notas**:
  - El `userId` es opcional y debe ser un UUID válido si se proporciona.
  - Este endpoint requiere autenticación y permisos de administrador.

---

#### **2. Obtener todos los pedidos**
- **Ruta**: `GET /orders`
- **Descripción**: Devuelve una lista de todos los pedidos registrados.
- **Parámetros**: Ninguno.
- **Respuesta**:
  ```json
  [
    {
      "id": "uuid",
      "user": {
        "id": "uuid",
        "name": "John Doe"
      },
      "totalAmount": 100.50,
      "status": "pending",
      "shippingAddress": "123 Main St",
      "paymentMethod": "credit_card",
      "notes": "Por favor, entregar en la tarde",
      "createdAt": "2025-05-08T12:00:00Z",
      "updatedAt": "2025-05-08T12:00:00Z"
    }
  ]
  ```
- **Notas**: Este endpoint es público y no requiere autenticación.

---

#### **3. Obtener un pedido por ID**
- **Ruta**: `GET /orders/:id`
- **Descripción**: Devuelve los detalles de un pedido específico.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID del pedido (UUID).
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "user": {
      "id": "uuid",
      "name": "John Doe"
    },
    "totalAmount": 100.50,
    "status": "pending",
    "shippingAddress": "123 Main St",
    "paymentMethod": "credit_card",
    "notes": "Por favor, entregar en la tarde",
    "createdAt": "2025-05-08T12:00:00Z",
    "updatedAt": "2025-05-08T12:00:00Z"
  }
  ```
- **Notas**: Este endpoint es público y no requiere autenticación.

---

#### **4. Actualizar un pedido**
- **Ruta**: `PATCH /orders/:id`
- **Descripción**: Actualiza los datos de un pedido existente.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID del pedido (UUID).
  - **Body** (solo los campos que se desean actualizar):
    ```json
    {
      "status": "completed",
      "paymentMethod": "paypal"
    }
    ```
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "user": {
      "id": "uuid",
      "name": "John Doe"
    },
    "totalAmount": 100.50,
    "status": "completed",
    "shippingAddress": "123 Main St",
    "paymentMethod": "paypal",
    "notes": "Por favor, entregar en la tarde",
    "createdAt": "2025-05-08T12:00:00Z",
    "updatedAt": "2025-05-08T12:30:00Z"
  }
  ```
- **Notas**:
  - Este endpoint requiere autenticación y permisos de administrador.

---

#### **5. Eliminar un pedido**
- **Ruta**: `DELETE /orders/:id`
- **Descripción**: Elimina un pedido existente.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID del pedido (UUID).
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "user": {
      "id": "uuid",
      "name": "John Doe"
    },
    "totalAmount": 100.50,
    "status": "pending",
    "shippingAddress": "123 Main St",
    "paymentMethod": "credit_card",
    "notes": "Por favor, entregar en la tarde",
    "createdAt": "2025-05-08T12:00:00Z",
    "updatedAt": "2025-05-08T12:00:00Z"
  }
  ```
- **Notas**:
  - Este endpoint requiere autenticación y permisos de administrador.

---

### **Detalles Técnicos**

#### **DTOs (Data Transfer Objects)**
- **`CreateOrderDto`**:
  - Valida los datos necesarios para crear un pedido.
  - Campos:
    - `userId` (UUID, opcional): ID del usuario asociado.
    - `totalAmount` (número, requerido): Total del pedido (hasta 2 decimales).
    - `status` (string, opcional): Estado del pedido (`pending`, `completed`, etc.).
    - `shippingAddress` (string, opcional): Dirección de envío.
    - `paymentMethod` (string, opcional): Método de pago.
    - `notes` (string, opcional): Notas adicionales.

- **`UpdateOrderDto`**:
  - Extiende `CreateOrderDto` y permite actualizar solo los campos necesarios.

#### **Servicios**
- **`OrdersService`**:
  - Implementa la lógica de negocio para gestionar pedidos.
  - Métodos principales:
    - `create`: Crea un nuevo pedido.
    - `getAll`: Devuelve todos los pedidos.
    - `findById`: Busca un pedido por su ID.
    - `update`: Actualiza los datos de un pedido.
    - `delete`: Elimina un pedido.

#### **Entidades**
- **`Order`**:
  - Representa la tabla de pedidos en la base de datos.
  - Campos:
    - `id` (UUID, clave primaria).
    - `user` (relación con `User`).
    - `items` (relación con `OrderItem`).
    - `totalAmount` (número, requerido): Total del pedido.
    - `status` (string, requerido): Estado del pedido.
    - `shippingAddress` (string, opcional): Dirección de envío.
    - `paymentMethod` (string, opcional): Método de pago.
    - `notes` (string, opcional): Notas adicionales.
    - `createdAt` (fecha): Fecha de creación.
    - `updatedAt` (fecha): Fecha de última actualización.

#### **Módulo**
- **`OrdersModule`**:
  - Configura el módulo para gestionar pedidos.
  - Importa el módulo `TypeOrmModule` para interactuar con la base de datos.
  - Proporciona el controlador y servicio necesarios para las operaciones CRUD.

### **Módulo `Subscription`**

El módulo `Subscription` gestiona las suscripciones de los usuarios en la API. Este módulo incluye funcionalidades para listar, crear, actualizar y eliminar suscripciones, así como para obtener información específica de una suscripción.

---

### **Descripción de los Endpoints**

#### **1. Crear una suscripción**
- **Ruta**: `POST /subscription`
- **Descripción**: Crea una nueva suscripción asociada a un usuario.
- **Parámetros**:
  - **Body**:
    ```json
    {
      "userId": "uuid",
      "startDate": "2025-05-01",
      "endDate": "2025-06-01",
      "status": "active",
      "renewalDate": "2025-06-01",
      "plan": "premium",
      "price": 19.99,
      "notes": "Suscripción mensual"
    }
    ```
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "user": {
      "id": "uuid",
      "name": "John Doe"
    },
    "startDate": "2025-05-01",
    "endDate": "2025-06-01",
    "status": "active",
    "renewalDate": "2025-06-01",
    "plan": "premium",
    "price": 19.99,
    "notes": "Suscripción mensual",
    "createdAt": "2025-05-08T12:00:00Z",
    "updatedAt": "2025-05-08T12:00:00Z"
  }
  ```
- **Notas**:
  - El `userId` debe ser un UUID válido que corresponda a un usuario existente.
  - Este endpoint requiere autenticación y permisos de administrador.

---

#### **2. Obtener todas las suscripciones**
- **Ruta**: `GET /subscription`
- **Descripción**: Devuelve una lista de todas las suscripciones registradas.
- **Parámetros**: Ninguno.
- **Respuesta**:
  ```json
  [
    {
      "id": "uuid",
      "user": {
        "id": "uuid",
        "name": "John Doe"
      },
      "startDate": "2025-05-01",
      "endDate": "2025-06-01",
      "status": "active",
      "renewalDate": "2025-06-01",
      "plan": "premium",
      "price": 19.99,
      "notes": "Suscripción mensual",
      "createdAt": "2025-05-08T12:00:00Z",
      "updatedAt": "2025-05-08T12:00:00Z"
    }
  ]
  ```
- **Notas**: Este endpoint es público y no requiere autenticación.

---

#### **3. Obtener una suscripción por ID**
- **Ruta**: `GET /subscription/:id`
- **Descripción**: Devuelve los detalles de una suscripción específica.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID de la suscripción (UUID).
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "user": {
      "id": "uuid",
      "name": "John Doe"
    },
    "startDate": "2025-05-01",
    "endDate": "2025-06-01",
    "status": "active",
    "renewalDate": "2025-06-01",
    "plan": "premium",
    "price": 19.99,
    "notes": "Suscripción mensual",
    "createdAt": "2025-05-08T12:00:00Z",
    "updatedAt": "2025-05-08T12:00:00Z"
  }
  ```
- **Notas**: Este endpoint es público y no requiere autenticación.

---

#### **4. Actualizar una suscripción**
- **Ruta**: `PATCH /subscription/:id`
- **Descripción**: Actualiza los datos de una suscripción existente.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID de la suscripción (UUID).
  - **Body** (solo los campos que se desean actualizar):
    ```json
    {
      "status": "cancelled",
      "notes": "Cancelada por el usuario"
    }
    ```
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "user": {
      "id": "uuid",
      "name": "John Doe"
    },
    "startDate": "2025-05-01",
    "endDate": "2025-06-01",
    "status": "cancelled",
    "renewalDate": "2025-06-01",
    "plan": "premium",
    "price": 19.99,
    "notes": "Cancelada por el usuario",
    "createdAt": "2025-05-08T12:00:00Z",
    "updatedAt": "2025-05-08T12:30:00Z"
  }
  ```
- **Notas**:
  - Este endpoint requiere autenticación y permisos de administrador.

---

#### **5. Eliminar una suscripción**
- **Ruta**: `DELETE /subscription/:id`
- **Descripción**: Elimina una suscripción existente.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID de la suscripción (UUID).
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "user": {
      "id": "uuid",
      "name": "John Doe"
    },
    "startDate": "2025-05-01",
    "endDate": "2025-06-01",
    "status": "active",
    "renewalDate": "2025-06-01",
    "plan": "premium",
    "price": 19.99,
    "notes": "Suscripción mensual",
    "createdAt": "2025-05-08T12:00:00Z",
    "updatedAt": "2025-05-08T12:00:00Z"
  }
  ```
- **Notas**:
  - Este endpoint requiere autenticación y permisos de administrador.

---

### **Detalles Técnicos**

#### **DTOs (Data Transfer Objects)**
- **`CreateSubscriptionDto`**:
  - Valida los datos necesarios para crear una suscripción.
  - Campos:
    - `userId` (UUID, requerido): ID del usuario asociado.
    - `startDate` (fecha, requerido): Fecha de inicio de la suscripción.
    - `endDate` (fecha, opcional): Fecha de finalización de la suscripción.
    - `status` (string, requerido): Estado de la suscripción (`active`, `cancelled`, etc.).
    - `renewalDate` (fecha, opcional): Fecha de renovación.
    - `plan` (string, opcional): Plan de la suscripción.
    - `price` (número, opcional): Precio de la suscripción.
    - `notes` (string, opcional): Notas adicionales.

- **`UpdateSubscriptionDto`**:
  - Extiende `CreateSubscriptionDto` y permite actualizar solo los campos necesarios.

#### **Servicios**
- **`SubscriptionService`**:
  - Implementa la lógica de negocio para gestionar suscripciones.
  - Métodos principales:
    - `create`: Crea una nueva suscripción.
    - `getAll`: Devuelve todas las suscripciones.
    - `findById`: Busca una suscripción por su ID.
    - `update`: Actualiza los datos de una suscripción.
    - `delete`: Elimina una suscripción.

#### **Entidades**
- **`Subscription`**:
  - Representa la tabla de suscripciones en la base de datos.
  - Campos:
    - `id` (UUID, clave primaria).
    - `user` (relación con `User`).
    - `startDate` (fecha, requerido): Fecha de inicio.
    - `endDate` (fecha, opcional): Fecha de finalización.
    - `status` (string, requerido): Estado de la suscripción.
    - `renewalDate` (fecha, opcional): Fecha de renovación.
    - `plan` (string, opcional): Plan de la suscripción.
    - `price` (número, opcional): Precio de la suscripción.
    - `notes` (string, opcional): Notas adicionales.
    - `createdAt` (fecha): Fecha de creación.
    - `updatedAt` (fecha): Fecha de última actualización.

#### **Módulo**
- **`SubscriptionModule`**:
  - Configura el módulo para gestionar suscripciones.
  - Importa el módulo `TypeOrmModule` para interactuar con la base de datos.
  - Proporciona el controlador y servicio necesarios para las operaciones CRUD.

### **Módulo `ConceptualCategory`**

El módulo `ConceptualCategory` gestiona las categorías conceptuales asociadas a las fragancias o perfiles de aroma. Este módulo incluye funcionalidades para listar, crear, actualizar y eliminar categorías conceptuales, así como para obtener información específica de una categoría.

---

### **Descripción de los Endpoints**

#### **1. Crear una categoría conceptual**
- **Ruta**: `POST /conceptual-category`
- **Descripción**: Crea una nueva categoría conceptual.
- **Parámetros**:
  - **Body**:
    ```json
    {
      "name": "Floral"
    }
    ```
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "name": "Floral"
  }
  ```
- **Notas**:
  - El campo `name` es obligatorio y debe tener entre 1 y 255 caracteres.
  - Este endpoint requiere autenticación y permisos de administrador.

---

#### **2. Obtener todas las categorías conceptuales**
- **Ruta**: `GET /conceptual-category`
- **Descripción**: Devuelve una lista de todas las categorías conceptuales registradas.
- **Parámetros**: Ninguno.
- **Respuesta**:
  ```json
  [
    {
      "id": "uuid",
      "name": "Floral"
    }
  ]
  ```
- **Notas**: Este endpoint es público y no requiere autenticación.

---

#### **3. Obtener una categoría conceptual por ID**
- **Ruta**: `GET /conceptual-category/:id`
- **Descripción**: Devuelve los detalles de una categoría conceptual específica.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID de la categoría conceptual (UUID).
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "name": "Floral"
  }
  ```
- **Notas**: Este endpoint es público y no requiere autenticación.

---

#### **4. Actualizar una categoría conceptual**
- **Ruta**: `PATCH /conceptual-category/:id`
- **Descripción**: Actualiza los datos de una categoría conceptual existente.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID de la categoría conceptual (UUID).
  - **Body** (solo los campos que se desean actualizar):
    ```json
    {
      "name": "Frutal"
    }
    ```
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "name": "Frutal"
  }
  ```
- **Notas**:
  - Este endpoint requiere autenticación y permisos de administrador.

---

#### **5. Eliminar una categoría conceptual**
- **Ruta**: `DELETE /conceptual-category/:id`
- **Descripción**: Elimina una categoría conceptual existente.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID de la categoría conceptual (UUID).
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "name": "Floral"
  }
  ```
- **Notas**:
  - Este endpoint requiere autenticación y permisos de administrador.
  - Las relaciones con otras entidades (como `Option`) se eliminan en cascada.

---

### **Detalles Técnicos**

#### **DTOs (Data Transfer Objects)**
- **`CreateConceptualCategoryDto`**:
  - Valida los datos necesarios para crear una categoría conceptual.
  - Campos:
    - `name` (string, requerido): Nombre de la categoría (entre 1 y 255 caracteres).

- **`UpdateConceptualCategoryDto`**:
  - Extiende `CreateConceptualCategoryDto` y permite actualizar solo los campos necesarios.

#### **Servicios**
- **`ConceptualCategoryService`**:
  - Implementa la lógica de negocio para gestionar categorías conceptuales.
  - Métodos principales:
    - `create`: Crea una nueva categoría conceptual.
    - `findAll`: Devuelve todas las categorías conceptuales.
    - `findById`: Busca una categoría conceptual por su ID.
    - `update`: Actualiza los datos de una categoría conceptual.
    - `delete`: Elimina una categoría conceptual.

#### **Entidades**
- **`ConceptualCategory`**:
  - Representa la tabla de categorías conceptuales en la base de datos.
  - Campos:
    - `id` (UUID, clave primaria).
    - `name` (string, requerido): Nombre de la categoría.
    - `options` (relación con `Option`): Opciones asociadas a la categoría.

#### **Módulo**
- **`ConceptualCategoryModule`**:
  - Configura el módulo para gestionar categorías conceptuales.
  - Importa el módulo `TypeOrmModule` para interactuar con la base de datos.
  - Proporciona el controlador y servicio necesarios para las operaciones CRUD.

### **Módulo `EmotionalState`**

El módulo `EmotionalState` gestiona los estados emocionales asociados a las opciones de perfil de aroma. Este módulo incluye funcionalidades para listar, crear, actualizar y eliminar estados emocionales, así como para obtener información específica de un estado emocional.

---

### **Descripción de los Endpoints**

#### **1. Crear un estado emocional**
- **Ruta**: `POST /emotional-state`
- **Descripción**: Crea un nuevo estado emocional asociado a una opción.
- **Parámetros**:
  - **Body**:
    ```json
    {
      "name": "Relajación",
      "description": "Estado emocional asociado a la relajación",
      "optionId": "uuid"
    }
    ```
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "name": "Relajación",
    "description": "Estado emocional asociado a la relajación",
    "option": {
      "id": "uuid",
      "name": "Opción asociada"
    }
  }
  ```
- **Notas**:
  - El `optionId` debe ser un UUID válido que corresponda a una opción existente.
  - Este endpoint requiere autenticación y permisos de administrador.

---

#### **2. Obtener todos los estados emocionales**
- **Ruta**: `GET /emotional-state`
- **Descripción**: Devuelve una lista de todos los estados emocionales registrados.
- **Parámetros**: Ninguno.
- **Respuesta**:
  ```json
  [
    {
      "id": "uuid",
      "name": "Relajación",
      "description": "Estado emocional asociado a la relajación",
      "option": {
        "id": "uuid",
        "name": "Opción asociada"
      }
    }
  ]
  ```
- **Notas**: Este endpoint es público y no requiere autenticación.

---

#### **3. Obtener un estado emocional por ID**
- **Ruta**: `GET /emotional-state/:id`
- **Descripción**: Devuelve los detalles de un estado emocional específico.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID del estado emocional (UUID).
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "name": "Relajación",
    "description": "Estado emocional asociado a la relajación",
    "option": {
      "id": "uuid",
      "name": "Opción asociada"
    }
  }
  ```
- **Notas**: Este endpoint es público y no requiere autenticación.

---

#### **4. Actualizar un estado emocional**
- **Ruta**: `PATCH /emotional-state/:id`
- **Descripción**: Actualiza los datos de un estado emocional existente.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID del estado emocional (UUID).
  - **Body** (solo los campos que se desean actualizar):
    ```json
    {
      "name": "Calma",
      "description": "Estado emocional asociado a la calma"
    }
    ```
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "name": "Calma",
    "description": "Estado emocional asociado a la calma",
    "option": {
      "id": "uuid",
      "name": "Opción asociada"
    }
  }
  ```
- **Notas**:
  - Este endpoint requiere autenticación y permisos de administrador.

---

#### **5. Eliminar un estado emocional**
- **Ruta**: `DELETE /emotional-state/:id`
- **Descripción**: Elimina un estado emocional existente.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID del estado emocional (UUID).
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "name": "Relajación",
    "description": "Estado emocional asociado a la relajación",
    "option": {
      "id": "uuid",
      "name": "Opción asociada"
    }
  }
  ```
- **Notas**:
  - Este endpoint requiere autenticación y permisos de administrador.

---

### **Detalles Técnicos**

#### **DTOs (Data Transfer Objects)**
- **`CreateEmotionalStateDto`**:
  - Valida los datos necesarios para crear un estado emocional.
  - Campos:
    - `name` (string, requerido): Nombre del estado emocional (entre 1 y 255 caracteres).
    - `description` (string, requerido): Descripción del estado emocional (entre 1 y 255 caracteres).
    - `optionId` (UUID, requerido): ID de la opción asociada.

- **`UpdateEmotionalStateDto`**:
  - Extiende `CreateEmotionalStateDto` y permite actualizar solo los campos necesarios.

#### **Servicios**
- **`EmotionalStateService`**:
  - Implementa la lógica de negocio para gestionar estados emocionales.
  - Métodos principales:
    - `create`: Crea un nuevo estado emocional.
    - `findAll`: Devuelve todos los estados emocionales.
    - `findById`: Busca un estado emocional por su ID.
    - `update`: Actualiza los datos de un estado emocional.
    - `delete`: Elimina un estado emocional.

#### **Entidades**
- **`EmotionalState`**:
  - Representa la tabla de estados emocionales en la base de datos.
  - Campos:
    - `id` (UUID, clave primaria).
    - `name` (string, requerido): Nombre del estado emocional.
    - `description` (string, opcional): Descripción del estado emocional.
    - `option` (relación con `Option`): Opción asociada al estado emocional.
    - `emotionalStateFragrance` (relación con `EmotionalStateFragrance`): Relación con fragancias.

#### **Módulo**
- **`EmotionalStateModule`**:
  - Configura el módulo para gestionar estados emocionales.
  - Importa el módulo `TypeOrmModule` para interactuar con la base de datos.
  - Proporciona el controlador y servicio necesarios para las operaciones CRUD.

### **Módulo `Options`**

El módulo `Options` gestiona las opciones asociadas a las categorías conceptuales en los perfiles de aroma. Este módulo incluye funcionalidades para listar, crear, actualizar y eliminar opciones, así como para obtener información específica de una opción.

---

### **Descripción de los Endpoints**

#### **1. Crear una opción**
- **Ruta**: `POST /options`
- **Descripción**: Crea una nueva opción asociada a una categoría conceptual.
- **Parámetros**:
  - **Body**:
    ```json
    {
      "name": "Opción Floral",
      "conceptualCategoryId": "uuid"
    }
    ```
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "name": "Opción Floral",
    "conceptualCategory": {
      "id": "uuid",
      "name": "Floral"
    }
  }
  ```
- **Notas**:
  - El `conceptualCategoryId` debe ser un UUID válido que corresponda a una categoría conceptual existente.
  - Este endpoint requiere autenticación y permisos de administrador.

---

#### **2. Obtener todas las opciones**
- **Ruta**: `GET /options`
- **Descripción**: Devuelve una lista de todas las opciones registradas.
- **Parámetros**: Ninguno.
- **Respuesta**:
  ```json
  [
    {
      "id": "uuid",
      "name": "Opción Floral",
      "conceptualCategory": {
        "id": "uuid",
        "name": "Floral"
      }
    }
  ]
  ```
- **Notas**: Este endpoint es público y no requiere autenticación.

---

#### **3. Obtener una opción por ID**
- **Ruta**: `GET /options/:id`
- **Descripción**: Devuelve los detalles de una opción específica.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID de la opción (UUID).
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "name": "Opción Floral",
    "conceptualCategory": {
      "id": "uuid",
      "name": "Floral"
    }
  }
  ```
- **Notas**: Este endpoint es público y no requiere autenticación.

---

#### **4. Actualizar una opción**
- **Ruta**: `PATCH /options/:id`
- **Descripción**: Actualiza los datos de una opción existente.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID de la opción (UUID).
  - **Body** (solo los campos que se desean actualizar):
    ```json
    {
      "name": "Opción Frutal"
    }
    ```
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "name": "Opción Frutal",
    "conceptualCategory": {
      "id": "uuid",
      "name": "Floral"
    }
  }
  ```
- **Notas**:
  - Este endpoint requiere autenticación y permisos de administrador.

---

#### **5. Eliminar una opción**
- **Ruta**: `DELETE /options/:id`
- **Descripción**: Elimina una opción existente.
- **Parámetros**:
  - **Path**:
    - `id` (requerido): ID de la opción (UUID).
- **Respuesta**:
  ```json
  {
    "id": "uuid",
    "name": "Opción Floral",
    "conceptualCategory": {
      "id": "uuid",
      "name": "Floral"
    }
  }
  ```
- **Notas**:
  - Este endpoint requiere autenticación y permisos de administrador.
  - Las relaciones con otras entidades (como `EmotionalState`) se eliminan en cascada.

---

### **Detalles Técnicos**

#### **DTOs (Data Transfer Objects)**
- **`CreateOptionDto`**:
  - Valida los datos necesarios para crear una opción.
  - Campos:
    - `name` (string, requerido): Nombre de la opción (entre 1 y 255 caracteres).
    - `conceptualCategoryId` (UUID, requerido): ID de la categoría conceptual asociada.

- **`UpdateOptionDto`**:
  - Extiende `CreateOptionDto` y permite actualizar solo los campos necesarios.

#### **Servicios**
- **`OptionsService`**:
  - Implementa la lógica de negocio para gestionar opciones.
  - Métodos principales:
    - `create`: Crea una nueva opción.
    - `findAll`: Devuelve todas las opciones.
    - `findById`: Busca una opción por su ID.
    - `update`: Actualiza los datos de una opción.
    - `delete`: Elimina una opción.

#### **Entidades**
- **`Option`**:
  - Representa la tabla de opciones en la base de datos.
  - Campos:
    - `id` (UUID, clave primaria).
    - `name` (string, requerido): Nombre de la opción.
    - `conceptualCategory` (relación con `ConceptualCategory`): Categoría conceptual asociada.
    - `emotionalStates` (relación con `EmotionalState`): Estados emocionales asociados.

#### **Módulo**
- **`OptionsModule`**:
  - Configura el módulo para gestionar opciones.
  - Importa el módulo `TypeOrmModule` para interactuar con la base de datos.
  - Proporciona el controlador y servicio necesarios para las operaciones CRUD.

### **Módulo `Utils`**

El módulo `Utils` proporciona utilidades generales para la aplicación, como el manejo de contraseñas mediante el servicio `PasswordService`. Este módulo incluye funcionalidades para hashear contraseñas y compararlas con valores almacenados, asegurando la seguridad en la autenticación de usuarios.

---

### **Descripción de las Funcionalidades**

#### **1. Hashear Contraseñas**
- **Método**: `hashPassword`
- **Descripción**: Genera un hash seguro a partir de una contraseña en texto plano.
- **Parámetros**:
  - `password` (string, requerido): La contraseña en texto plano.
- **Retorno**:
  - Un string que representa la contraseña hasheada.
- **Ejemplo de Uso**:
  ```typescript
  const hashedPassword = await passwordService.hashPassword('myPassword123');
  console.log(hashedPassword); // Devuelve un hash seguro.
  ```

---

#### **2. Comparar Contraseñas**
- **Método**: `comparePasswords`
- **Descripción**: Compara una contraseña en texto plano con un hash almacenado para verificar si coinciden.
- **Parámetros**:
  - `plainPassword` (string, requerido): La contraseña en texto plano.
  - `hashedPassword` (string, requerido): El hash almacenado de la contraseña.
- **Retorno**:
  - Un booleano (`true` si coinciden, `false` en caso contrario).
- **Ejemplo de Uso**:
  ```typescript
  const isMatch = await passwordService.comparePasswords('myPassword123', hashedPassword);
  console.log(isMatch); // true o false dependiendo de si coinciden.
  ```

---

### **Detalles Técnicos**

#### **Clase `PasswordService`**
- **Ubicación**: `password.utils.ts`
- **Propiedades**:
  - `saltRounds` (número): Define el número de rondas de sal para el algoritmo de hash (por defecto, 10).
- **Métodos**:
  - `hashPassword`: Utiliza `bcrypt.hash` para generar un hash seguro.
  - `comparePasswords`: Utiliza `bcrypt.compare` para verificar si una contraseña coincide con un hash.

#### **Módulo `UtilsModule`**
- **Ubicación**: `utils.module.ts`
- **Descripción**:
  - Proporciona el servicio `PasswordService` como un proveedor.
  - Exporta el servicio para que pueda ser utilizado en otros módulos de la aplicación.
- **Código**:
  ```typescript
  @Module({
    providers: [PasswordService],
    exports: [PasswordService],
  })
  export class UtilsModule {}
  ```

---

### **Pruebas del Servicio**

#### **Archivo de Pruebas**: `password.utils.spec.ts`
- **Descripción**: Contiene pruebas unitarias para verificar el correcto funcionamiento del `PasswordService`.
- **Casos de Prueba**:
  1. **Hashear Contraseñas**:
     - Verifica que el método `hashPassword` genera un hash definido y diferente de la contraseña original.
  2. **Comparar Contraseñas (Coinciden)**:
     - Verifica que `comparePasswords` devuelve `true` cuando la contraseña en texto plano coincide con el hash.
  3. **Comparar Contraseñas (No Coinciden)**:
     - Verifica que `comparePasswords` devuelve `false` cuando la contraseña en texto plano no coincide con el hash.

- **Ejemplo de Prueba**:
  ```typescript
  describe('hashPassword', () => {
    it('should hash a plain text password', async () => {
      const password = 'plainPassword';
      const hashedPassword = await service.hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toEqual(password);
    });
  });
  ```

### **Explicación del Sistema de Autenticación y Autorización**

El sistema de autenticación y autorización implementado en este proyecto está diseñado para garantizar la seguridad y el control de acceso a los recursos de la API. Este sistema utiliza **JWT (JSON Web Tokens)** para la autenticación y un enfoque basado en roles para la autorización. A continuación, se describe cómo funciona cada componente y cómo interactúan entre sí.

---

### **1. Autenticación**

La autenticación es el proceso mediante el cual un usuario verifica su identidad para acceder al sistema. En este caso, se utiliza un flujo de inicio de sesión que valida las credenciales del usuario y genera un token JWT.

#### **Flujo de Autenticación**
1. **Inicio de Sesión**:
   - El usuario envía sus credenciales (correo electrónico y contraseña) al endpoint de inicio de sesión (`POST /auth/login`).
   - El sistema valida las credenciales contra los datos almacenados en la base de datos PostgreSQL.
   - Si las credenciales son válidas, se genera un token JWT que contiene información del usuario (como su ID, correo electrónico y rol).

2. **Token JWT**:
   - El token JWT es un objeto firmado digitalmente que se utiliza para autenticar al usuario en solicitudes posteriores.
   - Contiene un **payload** con información del usuario y una fecha de expiración.
   - El token se firma utilizando una clave secreta almacenada en las variables de entorno (`JWT_SECRET`).

3. **Persistencia**:
   - La información del usuario (como su correo electrónico y contraseña hasheada) se almacena en una base de datos PostgreSQL, que puede estar alojada localmente o en Render.
   - La contraseña se almacena de forma segura utilizando un algoritmo de hashing (como bcrypt).

---

### **2. Autorización**

La autorización es el proceso mediante el cual se determina si un usuario autenticado tiene permiso para acceder a un recurso o realizar una acción específica. Este sistema utiliza un enfoque basado en roles.

#### **Flujo de Autorización**
1. **Roles**:
   - Cada usuario tiene un rol asignado (por ejemplo, `admin`, `user`, etc.).
   - Los roles determinan qué recursos y acciones están permitidos para el usuario.

2. **Decoradores y Guards**:
   - Se utilizan decoradores como `@Roles` para especificar los roles requeridos para acceder a un recurso.
   - Un guard (`RolesGuard`) verifica si el usuario tiene el rol necesario antes de permitir el acceso.

3. **Rutas Públicas y Protegidas**:
   - Algunas rutas están marcadas como públicas utilizando el decorador `@Public`, lo que permite el acceso sin autenticación.
   - Las rutas protegidas requieren un token JWT válido y, en algunos casos, un rol específico.

---

### **3. Componentes Clave**

#### **Base de Datos**
- La persistencia de los datos se realiza en una base de datos PostgreSQL, que puede estar alojada localmente o en Render.
- La base de datos almacena información de los usuarios, como su correo electrónico, contraseña hasheada y rol.

#### **JWT Strategy**
- La estrategia JWT se utiliza para validar los tokens enviados por los usuarios.
- Si el token es válido, se extrae la información del usuario y se adjunta al objeto de la solicitud (`request.user`).

#### **Guards**
- Los guards son responsables de controlar el acceso a las rutas.
- El `JwtAuthGuard` verifica si el token JWT es válido.
- El `RolesGuard` verifica si el usuario tiene el rol necesario para acceder a un recurso.

#### **Servicios**
- El servicio de autenticación (`AuthService`) maneja la lógica de inicio de sesión y generación de tokens.
- El servicio de contraseñas (`PasswordService`) se encarga de hashear y comparar contraseñas de forma segura.

---

### **4. Seguridad**

El sistema implementa varias medidas de seguridad para proteger los datos y garantizar el acceso controlado:
- **Hashing de Contraseñas**:
  - Las contraseñas se almacenan en la base de datos de forma segura utilizando un algoritmo de hashing (bcrypt).
- **Expiración de Tokens**:
  - Los tokens JWT tienen una fecha de expiración para limitar su tiempo de uso.
- **Claves Secretas**:
  - Las claves utilizadas para firmar y verificar los tokens se almacenan en variables de entorno para evitar su exposición.

---

### **5. Integración con PostgreSQL**

La base de datos PostgreSQL almacena toda la información relacionada con los usuarios y sus roles. Esto incluye:
- **Usuarios**:
  - ID, correo electrónico, contraseña hasheada y rol.
- **Tokens**:
  - Aunque los tokens no se almacenan directamente, se pueden validar utilizando la clave secreta configurada en el servidor.

La conexión con la base de datos se configura mediante las variables de entorno definidas en el archivo .env, lo que permite cambiar entre entornos locales y de producción (Render) sin modificar el código.

### **Pruebas y Cobertura del Proyecto**

El proyecto cuenta con un enfoque sólido en la calidad del software, respaldado por un conjunto extenso de pruebas automatizadas que garantizan el correcto funcionamiento de cada módulo y componente. A continuación, se detalla cómo se gestionan las pruebas y su cobertura:

---

### **1. Tipos de Pruebas Implementadas**

El sistema incluye diferentes tipos de pruebas para cubrir todos los aspectos críticos del proyecto:

- **Pruebas Unitarias**:
  - Validan el comportamiento de funciones, servicios y componentes individuales de forma aislada.
  - Aseguran que cada unidad de código funcione según lo esperado.

- **Pruebas de Integración**:
  - Verifican la interacción entre diferentes módulos y servicios.
  - Garantizan que los componentes trabajen correctamente en conjunto, como la interacción con la base de datos PostgreSQL.

- **Pruebas Funcionales**:
  - Evalúan el comportamiento de la API desde la perspectiva del usuario.
  - Incluyen pruebas de endpoints para garantizar que las rutas respondan correctamente a las solicitudes.

---

### **2. Cobertura de Pruebas**

El proyecto cuenta con un total de **297 pruebas automatizadas**, lo que refleja un esfuerzo significativo en la validación del sistema. Estas pruebas abarcan todos los módulos principales, incluyendo autenticación, autorización, gestión de usuarios, pedidos, suscripciones y más.

- **Cobertura Global**:
  - La cobertura de pruebas supera el **80%** en todas las métricas clave:
    - **Líneas de Código**: Más del 80% de las líneas están cubiertas por pruebas.
    - **Ramas de Código**: Más del 80% de las posibles rutas de ejecución están validadas.
    - **Funciones**: Más del 80% de las funciones han sido probadas.
    - **Clases**: Más del 80% de las clases están cubiertas.

Este nivel de cobertura asegura que el sistema sea robusto y confiable, minimizando el riesgo de errores en producción.

---

### **3. Ejecución de las Pruebas**

Las pruebas se ejecutan de manera automatizada utilizando herramientas de testing integradas en el proyecto. El flujo de ejecución incluye:

1. **Preparación del Entorno**:
   - Las pruebas se ejecutan en un entorno controlado que simula la base de datos PostgreSQL, tanto local como en Render.
   - Se utilizan datos de prueba para garantizar que las pruebas no afecten los datos reales.

2. **Ejecución Automatizada**:
   - Todas las pruebas se ejecutan mediante un comando único, lo que permite validar rápidamente el estado del sistema.
   - Las pruebas incluyen validaciones de rutas, lógica de negocio y persistencia de datos.

3. **Reporte de Resultados**:
   - Al finalizar, se genera un reporte detallado que muestra:
     - El número total de pruebas ejecutadas.
     - Las pruebas exitosas y fallidas.
     - La cobertura de código alcanzada.

---

### **4. Beneficios de las Pruebas**

- **Detección Temprana de Errores**:
  - Las pruebas permiten identificar y corregir errores antes de que lleguen a producción.

- **Confianza en el Sistema**:
  - La alta cobertura asegura que los módulos principales funcionen correctamente bajo diferentes escenarios.

- **Facilidad para Refactorizar**:
  - Las pruebas actúan como una red de seguridad, permitiendo realizar cambios en el código sin temor a introducir errores.

- **Cumplimiento de Estándares de Calidad**:
  - El enfoque en pruebas y cobertura refleja un compromiso con las mejores prácticas de desarrollo de software.

## Conclusión
La API implementa funcionalidades completas para gestionar usuarios, velas personalizadas, estados emocionales, pedidos y más. Las características de autenticación y autorización garantizan la seguridad del sistema, mientras que la persistencia en la base de datos asegura la integridad de los datos. Las pruebas realizadas validan el correcto funcionamiento de los módulos y la calidad del sistema.
