import { Router } from "express";
import { InscripcionesController } from "../controllers/inscripciones.controller.js";

const router = Router();

// Ruta para registrar una inscripción
// POST /api/eventos/:id_evento/inscripciones
router.post('/eventos/:id_evento/inscripciones', InscripcionesController.createInscripcion);

// Ruta para obtener los inscritos (Quienes van)
// GET /api/eventos/:id_evento/inscritos
router.get('/eventos/:id_evento/inscritos', InscripcionesController.getInscritosByEvento);

export default router;