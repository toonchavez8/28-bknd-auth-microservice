

## 1. Descripción General del Proyecto

El objetivo es desarrollar un **microservicio backend** que proporcione funcionalidades esenciales de **autenticación de usuarios**.
El sistema permitirá:

* Registro de nuevos usuarios.
* Inicio de sesión con credenciales válidas.

Se utilizarán **JSON Web Tokens (JWT)** como mecanismo de seguridad para sesiones.

---

## 2. Stack Tecnológico y Restricciones

El proyecto debe cumplir estrictamente con las siguientes tecnologías:

* **Entorno de Ejecución:** Node.js (Versión LTS recomendada).
* **Lenguaje:** TypeScript (altamente recomendado por el uso de TypeORM) o JavaScript moderno.
* **ORM:** TypeORM.
* **Base de Datos:** A elección (PostgreSQL, MySQL, MariaDB, etc.).
* **Seguridad:**

  * `bcrypt` (o `argon2`) para hashing de contraseñas.
  * `jsonwebtoken` para generación de tokens.

---

## 3. Modelo de Datos (Entidades TypeORM)

### Entidad requerida: **User**

| Campo       | Tipo            | Restricciones    | Descripción                                   |
| ----------- | --------------- | ---------------- | --------------------------------------------- |
| `id`        | UUID o Auto-Inc | Primary Key      | Identificador único del usuario.              |
| `username`  | String          | Not Null         | Nombre de usuario.                            |
| `email`     | String          | Unique, Not Null | Correo electrónico único en el sistema.       |
| `password`  | String          | Not Null         | Hash de la contraseña. **Nunca** texto plano. |
| `createdAt` | DateTime        | Default Now      | Fecha de creación.                            |

---

## 4. Requerimientos Funcionales (API Endpoints)

Todos los endpoints deben estar bajo un prefijo común, por ejemplo:

```
/api/auth
```

---

### 4.1. Registro de Usuario (Sign-Up)

* **Método:** `POST`
* **Ruta:** `/api/auth/register`
* **Descripción:** Crea una nueva cuenta de usuario.

#### 📥 Cuerpo de la petición (JSON):

```json
{
  "username": "ejemploUser",
  "email": "usuario@dominio.com",
  "password": "ContraseñaSegura123!"
}
```

#### 🔄 Proceso del Servidor:

1. Validar campos `username`, `email` y `password`.
2. Verificar si el `email` ya existe (si existe → `409 Conflict`).
3. Hashear la contraseña usando `bcrypt` con un salt mínimo de 10 rondas.
4. Crear instancia de **User** con los datos y contraseña hasheada.
5. Guardar usando el repositorio de TypeORM.

#### ✔️ Respuesta Exitosa (201 Created):

```json
{
  "message": "Usuario registrado exitosamente",
  "userId": "uuid-del-nuevo-usuario"
}
```

> ⚠️ Nunca incluir contraseñas ni hashes en la respuesta.

---

### 4.2. Inicio de Sesión (Login)

* **Método:** `POST`
* **Ruta:** `/api/auth/login`
* **Descripción:** Autentica al usuario y retorna un token JWT.

#### 📥 Cuerpo de la petición (JSON):

```json
{
  "email": "usuario@dominio.com",
  "password": "ContraseñaSegura123!"
}
```

#### 🔄 Proceso del Servidor:

1. Buscar al usuario por email. Si no existe → `401 Unauthorized`.
2. Comparar contraseña ingresada con hash almacenado (`bcrypt.compare()`).

   * Si no coincide → `401 Unauthorized`.
3. Generar un **JWT** con:

   * **Payload:** `id`, `email` (información no sensible).
   * **Secreto:** desde variables de entorno.
   * **Expiración:** `1 día (24h)`.

#### ✔️ Respuesta Exitosa (200 OK):

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI... (token completo)",
  "tokenType": "Bearer",
  "expiresIn": "1d"
}
```

---

## 5. Requerimientos No Funcionales

### 📌 Variables de Entorno (.env)

Toda configuración sensible debe almacenarse en variables de entorno:

* Credenciales de base de datos
* Puerto del servidor
* Secreto JWT

### 📌 Manejo de Errores

La API debe devolver códigos HTTP apropiados:

* `400` — Datos inválidos
* `401` — Autenticación fallida
* `409` — Conflictos (ej. email duplicado)
* `500` — Error interno del servidor

### 📌 Estructura de Código Sugerida

```
/src
  /controllers
  /services
  /entities
  /routes
  /middleware
```

---
