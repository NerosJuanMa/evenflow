# Rutas y Endpoints API - EventFlow

## Eventos
- GET /api/eventos -> Obtener listado de eventos
- GET /api/eventos/:id -> Obtener detalle de un evento
- POST /api/eventos -> Crear un nuevo evento (body: titulo, descripcion, fecha, categoria)
- PUT /api/eventos/:id -> Actualizar evento
- DELETE /api/eventos/:id -> Borrar evento

## Inscripciones / Usuarios
- POST /api/eventos/:id/inscripciones -> Inscribir un usuario al evento (body: nombre, email)
- GET /api/eventos/:id/inscripciones -> Listar inscritos en un evento (opcional)
