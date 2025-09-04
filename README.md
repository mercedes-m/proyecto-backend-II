# Proyecto Backend II

Este es un proyecto desarrollado con Node.js, Express, MongoDB, Passport y JWT.  
Implementa autenticación de usuarios, gestión de productos, carritos de compra y tickets.  
Además se aplicó arquitectura en capas (controllers, services, repositories y DTOs).

## Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- Node.js (v16 o superior recomendado)  
- MongoDB en ejecución local o conexión a Mongo Atlas  
- Git  
- Postman (para probar los endpoints)

## Instalación

1. Clona el repositorio desde GitHub:  
   git clone https://github.com/mercedes-m/proyecto-backend-II.git

2. Ingresa en la carpeta del proyecto:  
   cd proyecto-backend-II

3. Instala las dependencias:  
   npm install

4. Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:  
   PORT=8080  
   MONGO_URI=mongodb://localhost:27017/entrega-final  
   JWT_SECRET=tu_secreto_super_seguro  

5. Inicia el servidor en modo desarrollo:  
   npm run dev  

   El servidor quedará corriendo en:  
   http://localhost:8080

## Endpoints principales

### Autenticación

- POST /api/sessions/register → Crear usuario  
- POST /api/sessions/login → Iniciar sesión y recibir token JWT  
- GET /api/sessions/current → Obtener usuario autenticado (requiere enviar token en Authorization: Bearer)

### Productos

- GET /api/products → Listar productos (con filtros y paginación)  
- GET /api/products/:id → Obtener producto por ID  
- POST /api/products → Crear producto (requiere rol admin)  
- PUT /api/products/:id → Actualizar producto (requiere rol admin)  
- DELETE /api/products/:id → Eliminar producto (requiere rol admin)

### Carrito

- POST /api/carts → Crear carrito  
- GET /api/carts/:cid → Obtener carrito por ID  
- POST /api/carts/:cid/product/:pid → Agregar producto al carrito  
- PUT /api/carts/:cid/product/:pid → Actualizar cantidad de un producto  
- DELETE /api/carts/:cid/product/:pid → Eliminar producto del carrito  
- PUT /api/carts/:cid → Actualizar todos los productos del carrito  
- DELETE /api/carts/:cid → Vaciar carrito

### Tickets

- POST /api/tickets/purchase/:cid → Generar ticket de compra a partir de un carrito

## Pruebas en Postman

1. Importa la colección de Postman incluida en la carpeta `postman/`.  
2. Realiza primero un `POST /api/sessions/register` para crear un usuario.  
3. Luego haz `POST /api/sessions/login` para obtener el token JWT.  
4. Copia el token y añádelo en las peticiones que requieran autenticación usando el header:  
   Authorization: Bearer <tu_token>  

   ⚠️ También podés usar la variable `{{TOKEN}}` si cargas el token en el entorno de Postman.

## Notas

- La carpeta `node_modules` y archivos sensibles como `.env` están ignorados en `.gitignore`.  
- El proyecto está configurado para trabajar con MongoDB local, pero puedes modificar `MONGO_URI` para usar Mongo Atlas.  
- Asegúrate de que MongoDB esté ejecutándose antes de iniciar el servidor.  