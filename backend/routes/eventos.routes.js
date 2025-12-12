
import { Router } from "express";
import { EventosController } from "../controllers/eventos.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { canManageEvents, canViewEvent } from "../middlewares/permissions.middleware.js";

const router = Router();

// Crear y Ver eventos: cualquiera autenticado
router.get("/", verifyToken, canViewEvent, EventosController.getAll);
router.get("/:id", verifyToken, canViewEvent, EventosController.getById);
router.post("/", verifyToken, canViewEvent, EventosController.create);

// editar y eliminar: solo admin

router.put("/:id", verifyToken, canManageEvents, EventosController.update);
router.delete("/:id", verifyToken, canManageEvents, EventosController.remove);

export default router;
