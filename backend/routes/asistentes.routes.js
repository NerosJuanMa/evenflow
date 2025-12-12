// routes/asistentes.routes.js
import { Router } from "express";
import { AsistentesController } from "../controllers/asistentes.controller.js";

const router = Router();

// ⭐ NUEVAS RUTAS para el frontend
router.post("/eventos/:eventoId/inscribirse", async (req, res) => {
  try {
    const { eventoId } = req.params;
    const usuarioId = req.user.id; // del JWT
    
    const exists = await AsistentesModel.exists(eventoId, usuarioId);
    if (exists) {
      return res.status(409).json({ error: "Ya estás inscrito" });
    }

    await AsistentesModel.create({ evento_id: eventoId, usuario_id: usuarioId });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error al inscribirse" });
  }
});

router.delete("/eventos/:eventoId/inscribirse", async (req, res) => {
  try {
    const { eventoId } = req.params;
    const usuarioId = req.user.id;
    
    await pool.query(
      "DELETE FROM asistentes WHERE evento_id = ? AND usuario_id = ?", 
      [eventoId, usuarioId]
    );
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error al desinscribirse" });
  }
});

// resto de rutas admin...

// Obtener todos los asistentes
router.get("/", AsistentesController.getAll);

// Obtener asistente por ID
router.get("/:id", AsistentesController.getById);

// Crear asistente (registrar usuario en un evento)
router.post("/", AsistentesController.create);

// Actualizar inscripción (estado, usuario, evento)
router.put("/:id", AsistentesController.update);

// Eliminar asistente (borrarlo de un evento)
router.delete("/:id", AsistentesController.remove);

export default router;
