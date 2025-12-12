// routes/eventos.routes.js
import { Router } from "express";
import { UsuariosController } from "../controllers/usuarios.controller.js";

const router = Router();


// Inscripciones

router.post("/:id/inscripciones", UsuariosController.inscribir);
router.get("/:id/inscripciones", UsuariosController.getInscritos);
router.get("/", UsuariosController.getUsuarios);

export default router;