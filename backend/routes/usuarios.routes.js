// routes/usuarios.routes.js
import { Router } from "express";
import { UsuariosController } from "../controllers/usuarios.controller.js";

const router = Router();

// ⭐ NUEVO: Usuario actual (para el frontend)
router.get("/me", (req, res) => {
  res.json(req.user); // ya viene de verifyToken
});

// Obtener todos los usuarios
router.get("/", UsuariosController.getAll);

// Obtener un usuario por ID
router.get("/:id", UsuariosController.getById);

// Crear usuario
router.post("/", UsuariosController.create);

// Actualizar usuario
router.put("/:id", UsuariosController.update);

// Eliminar usuario
router.delete("/:id", UsuariosController.remove);

export default router;
