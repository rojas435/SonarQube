---

## ℹ️ Notas sobre el desarrollo

### Funcionalidad implementada

- API REST y GraphQL para gestión de usuarios, velas personalizadas, contenedores, fragancias y productos complementarios.
- Autenticación y autorización basada en JWT y roles (`admin`, `customer`, `supervisor`).
- Integración con PostgreSQL mediante TypeORM.
- Validaciones robustas con class-validator y pipes globales.
- Documentación automática con Swagger.
- Pruebas unitarias y e2e básicas.

### Elementos no desarrollados o pendientes

- Integración completa de estados emocionales en la personalización de velas.
- Pruebas unitarias y de integración para todos los módulos.
- Manejo avanzado de errores y mensajes personalizados en GraphQL.

### Dificultades encontradas

- Integrar guards de NestJS (`JwtAuthGuard`, `RolesGuard`) con resolvers de GraphQL usando `type-graphql` requirió configuración especial, ya que los guards de NestJS no funcionan automáticamente con resolvers si no se usa la integración de `@nestjs/graphql`.
- Configuración de CORS y headers de autenticación en entornos de desarrollo con Playground y Swagger.
- Coordinación de los DTOs y entidades para que sean compatibles tanto con REST como con GraphQL.

---

## 🚀 Cómo ejecutar el proyecto

1. Clona el repositorio:
 ```bash
 git clone https://github.com/tu-usuario/aromalife-backend.git
 cd aromalife-backend
 ```

2. Instala dependencias:

```bash
$ yarn install
```

3. Configura las variables de entorno en un archivo `.env` (ver ejemplo `.env.example`).

4. Ejecuta migraciones y arranca el servidor:

```bash
yarn run start
```

5. Accede a la documentación Swagger en [http://localhost:3002/api](http://localhost:3002/api)  
   Accede a GraphQL Playground en [http://localhost:3002/graphql](http://localhost:3002/graphql)

---

## 📂 Estructura del repositorio

El código fuente está organizado en módulos dentro de la carpeta `src/`, siguiendo las mejores prácticas de NestJS y manteniendo una separación clara entre controladores, servicios, entidades y DTOs.

---
