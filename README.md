# EventFlow - Proyecto Full Stack MF0492 – Gestión de Eventos

## Quickstart

1. Copia `.env.sample` a `.env` y ajusta credenciales.
2. En la carpeta backend: `npm install`
3. Crear base de datos: `node initdb.js`
4. Insertar datos de ejemplo: `node seeds.js`
5. Ejecutar servidor: `npm run dev`
6. Abrir `frontend/index.html` en el navegador.


📌 Descripción general

EventFlow es una aplicación web que permite gestionar eventos locales. Permite crear, listar y gestionar eventos, y que usuarios se inscriban. Incluye un backend en Node.js + Express conectado a MySQL, y un frontend en HTML/CSS/JS que consume la API.

El administrador puede crear eventos, listarlos y gestionar inscripciones.
El usuario final puede ver los eventos y registrarse.

🏗 Tecnologías utilizadas
Backend

Node.js

Express

MySQL / MariaDB

mysql2 (pool de conexión)

Dotenv

Cors

Frontend

HTML5

CSS3

JavaScript (Fetch API)

📁 Estructura del proyecto
/eventflow
  /backend
    .gitignore
    .env
    package.json 
    server.js
    db.js
    initdb.js
    seeds.js
    /models
       eventos.model.js
       usuarios.model.js
    /controllers
       eventos.controller.js
       usuarios.controller.js
    /routes
       eventos.routes.js

  /frontend
    index.html
    styles.css
    app.js
  /docs
    ER_diagram.png
    ROUTES.md
    PLAN.md
    README_0.md  
  /doc_varios
    ER_schema.sql
//////Pendiente de revisar:   
  scripts/
    run_init.sh
    test_requests.sh
  IMPROVEMENTS.md
  README.md
  


////////////////
🔌 Instalación y ejecución
1️⃣ Instalar dependencias
cd backend
npm install

2️⃣ Configurar variables de entorno

Crear archivo .env basado en .env.sample:

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_clave
DB_NAME=eventflow_db
PORT=3000

3️⃣ Crear bases de datos y tablas
node initdb.js

4️⃣ Insertar datos de prueba
node seeds.js

5️⃣ Iniciar el servidor
npm run dev

6️⃣ Abrir el frontend

Abre el archivo:

/frontend/index.html

🔁 API Principal (resumen)
Eventos
GET  /api/eventos
GET  /api/eventos/:id
POST /api/eventos
PUT  /api/eventos/:id
DELETE /api/eventos/:id

Inscripciones
POST /api/eventos/:id/inscripciones
GET  /api/eventos/:id/inscripciones


Más detalles en /docs/ROUTES.md.

🧪 2. Guía de pruebas manuales
✔ Comprobar backend

Abrir navegador y visitar:

http://localhost:3000


→ Debe mostrar: { "message": "API EventFlow funcionando 🚀" }

✔ Probar endpoints con Postman:

Listar eventos

GET http://localhost:3000/api/eventos


Crear evento

POST http://localhost:3000/api/eventos


Body JSON:

{
  "titulo": "Prueba",
  "descripcion": "Evento de prueba",
  "fecha": "2025-05-10 18:00:00",
  "categoria": "Demo"
}


Inscribir usuario

POST http://localhost:3000/api/eventos/1/inscripciones

✔ Probar frontend

Abrir index.html y comprobar:

Muestra los eventos

Permite crear uno nuevo

Se actualiza automáticamente

Estilos correctos

📚 3. Documentación interna (JSDoc)

Añadir comentarios JSDoc en modelos y controladores.
Ejemplo:

/**
 * Obtiene todos los eventos de la base de datos
 * @returns {Promise<Array>}
 */
async findAll() { ... }


Para generar docs:

npx jsdoc -c jsdoc.json

🚀 4. Lista de mejoras futuras

Login y panel administrador

Buscador de eventos por categoría

Editar inscripciones

Paginación en el listado

Exportar participantes a CSV

Subir imagen del evento

Añadir notificaciones por email

📝 5. Notas para entrega o defensa del proyecto

Cuando presentes el proyecto, explica:

✔ Qué problema resuelve
✔ Estructura full stack (frontend + backend + BD)
✔ Cómo se conectan las capas (Fetch → Express → MySQL)
✔ Los endpoints principales
✔ El flujo de negocio: Crear evento → Mostrar → Inscribir

También es recomendable tener:

✔ Capturas del frontend
✔ Un vídeo corto de funcionamiento
✔ El diagrama ER
✔ El archivo SQL del esquema

