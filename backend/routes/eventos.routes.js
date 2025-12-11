// routes/eventos.routes.js
import { Router } from "express";
import { EventosController } from "../controllers/eventos.controller.js";
import { UsuariosController } from "../controllers/usuarios.controller.js";

const router = Router();

// Eventos
router.get("/", EventosController.getAll);
router.get("/:id", EventosController.getOne);
router.post("/", EventosController.create);
router.put("/:id", EventosController.update);
router.delete("/:id", EventosController.remove);

// Inscripciones
router.post("/:id/inscripciones", UsuariosController.inscribir);
router.get("/:id/inscripciones", UsuariosController.getInscritos);

export default router;
