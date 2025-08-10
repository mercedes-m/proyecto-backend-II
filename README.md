Proyecto Backend II 
Este es un proyecto desarrollado con Node.js, Express, MongoDB, Passport y JWT. Implementa autenticación de usuarios, gestión de productos y carritos, y comunicación en tiempo real con WebSockets.

Requisitos previos
Antes de comenzar, asegúrate de tener instalado:
Node.js (v16 o superior recomendado)
MongoDB en ejecución local o conexión a Mongo Atlas
Git

Instalación
Clona el repositorio desde GitHub:
git clone <URL_DEL_REPOSITORIO>

Ingresa en la carpeta del proyecto:
cd proyecto-backendII

Instala las dependencias:
npm install

Crea un archivo .env en la raíz del proyecto con el siguiente contenido:
PORT=8080
MONGO_URI=mongodb://localhost:27017/entrega-final
JWT_SECRET=tu_secreto_super_seguro

Inicia el servidor:
npm start
El servidor quedará corriendo en http://localhost:8080

Endpoints principales

Autenticación
POST /api/sessions/register → Crear usuario
POST /api/sessions/login → Iniciar sesión y recibir token JWT
GET /api/sessions/current → Obtener usuario autenticado (requiere enviar token en Authorization: Bearer <token>)

Productos
GET /api/products → Listar productos
POST /api/products → Crear producto (requiere rol admin)
PUT /api/products/:id → Actualizar producto
DELETE /api/products/:id → Eliminar producto

Carrito
POST /api/carts → Crear carrito
POST /api/carts/:cid/product/:pid → Agregar producto al carrito
DELETE /api/carts/:cid/product/:pid → Eliminar producto del carrito

Pruebas en Postman
1.Importa la colección de Postman incluida en la carpeta postman/ 
2.Realiza primero un POST a /api/sessions/register para crear un usuario.
3.Luego haz POST a /api/sessions/login para obtener el token JWT.
4.Copia el token y añádelo en las peticiones que requieran autenticación usando el header:

Authorization: Bearer <tu_token>

Notas
La carpeta node_modules y archivos sensibles como .env están ignorados en .gitignore.
El proyecto está configurado para trabajar con MongoDB local, pero puedes modificar MONGO_URI para usar Mongo Atlas.
Asegúrate de que MongoDB esté ejecutándose antes de iniciar el servidor.