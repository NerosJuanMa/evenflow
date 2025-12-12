// controllers/asistentes.controller.js
import { AsistentesModel } from "../models/asistentes.model.js";
import { UsuariosModel } from "../models/usuarios.model.js";
import { EventosModel } from "../models/eventos.model.js";

export const AsistentesController = {
  async getAll(req, res) {
    try {
      const asistentes = await AsistentesModel.findAll();
      res.json(asistentes);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener asistentes" });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const asistente = await AsistentesModel.findById(id);

      if (!asistente) return res.status(404).json({ error: "Asistente no encontrado" });

      res.json(asistente);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el asistente" });
    }
  },

  async create(req, res) {
    try {
      const { evento_id, usuario_id, estado } = req.body;

      // Validar existencia
      const evento = await EventosModel.findById(evento_id);
      const usuario = await UsuariosModel.findById(usuario_id);

      if (!evento) return res.status(404).json({ error: "Evento no encontrado" });
      if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

      // 1️⃣ Validación manual antes del insert
      const exists = await AsistentesModel.exists(evento_id, usuario_id);
      if (exists) {
        return res
          .status(409)
          .json({ error: "El usuario ya está apuntado a este evento" });
      }

      // 2️⃣ Si pasa, insertamos
      const id = await AsistentesModel.create({ evento_id, usuario_id, estado });

      res.status(201).json({ id });
    } catch (error) {
      console.error("Error create asistente:", error);

      // 3️⃣ Por si hay un insert simultáneo → protección de base de datos
      if (error.code === "ER_DUP_ENTRY") {
        return res
          .status(409)
          .json({ error: "El usuario ya está apuntado a este evento" });
      }

      res.status(500).json({ error: "Error al agregar asistente" });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;

      const asistente = await AsistentesModel.findById(id);
      if (!asistente) return res.status(404).json({ error: "Asistente no encontrado" });

      await AsistentesModel.update(id, req.body);

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar asistente" });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;

      const asistente = await AsistentesModel.findById(id);
      if (!asistente) return res.status(404).json({ error: "Asistente no encontrado" });

      await AsistentesModel.remove(id);

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar asistente" });
    }
  }
};
