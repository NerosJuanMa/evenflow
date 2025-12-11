# EventFlow - Proyecto MF0492

**Resumen**

EventFlow es una aplicación web full-stack para gestionar eventos locales. Permite crear, listar y gestionar eventos, y que usuarios se inscriban. Backend en Node.js + Express con MySQL/MariaDB; frontend en HTML/CSS/JS que consume la API.


## Estructura del proyecto

```
/eventflow
  /backend
    server.js
    db.js
    models/
      eventos.model.js
      usuarios.model.js
    controllers/
      eventos.controller.js
      usuarios.controller.js
    routes/
      eventos.routes.js
    initdb.js
    seeds.js
    package.json
    .env
  /frontend
    index.html
    styles.css
    app.js
  README.md
  docs/
    ER_diagram.png
    ROUTES.md
    PLAN.md
```

## Tecnologías
- Node.js + Express
- MySQL / MariaDB
- Fetch API desde frontend
- npm, nodemon (dev)

## Configuración rápida
1. Clonar repo
2. Crear base de datos (ej: eventflow_db)
3. Copiar .env.sample a .env y editar credenciales
4. Instalar dependencias en /backend: `npm install`
5. Iniciar servidor: `npm run dev`
6. Abrir frontend `index.html` o servirlo con un servidor estático

## Scripts recomendados (backend/package.json)
- `start`: node server.js
- `dev`: nodemon server.js

## Endpoints principales
Ver ROUTES.md dentro de /docs

## Desarrollo y pruebas
- Usar seeds.js para datos iniciales
- Probar con Postman o curl

## README: tareas inmediatas
- Implementar modelos y controladores
- Crear endpoints básicos
- Implementar frontend con fetch
- Preparar documentación final

## Contacto
Desarrollador: Tu nombre aquí
