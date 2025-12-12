// controllers/eventos.controller.js
import { EventosModel } from "../models/eventos.model.js";

export const EventosController = {
    async getAll(req, res) {
    try {
      const eventos = await EventosModel.findAll();
      
      // ⭐ AÑADIR asistentesIds
      const asistentes = await AsistentesModel.findAll();
      const mapaAsistentes = {};
      asistentes.forEach(a => {
        if (!mapaAsistentes[a.evento_id]) mapaAsistentes[a.evento_id] = [];
        mapaAsistentes[a.evento_id].push(a.usuario_id);
      });

      const eventosConAsistentes = eventos.map(ev => ({
        id: ev.id,
        titulo: ev.titulo,
        descripcion: ev.descripcion,
        fecha: ev.fecha,
        lugar: ev.lugar || ev.categoria, // adaptado a tu modelo
        creadorId: ev.creador_id,
        asistentesIds: mapaAsistentes[ev.id] || []
      }));

      res.json(eventosConAsistentes);
    } catch (error) {
      console.error("Error getAll eventos:", error);
      res.status(500).json({ error: "Error al obtener los eventos" });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const evento = await EventosModel.findById(id);

      if (!evento) {
        return res.status(404).json({ error: "Evento no encontrado" });
      }

      res.json(evento);
    } catch (error) {
      console.error("Error getById evento:", error);
      res.status(500).json({ error: "Error al obtener el evento" });
    }
  },

  async create(req, res) {
    try {
      const id = await EventosModel.create(req.body);

      res.status(201).json({ id });
    } catch (error) {
      console.error("Error create evento:", error);
      res.status(500).json({ error: "Error al crear el evento" });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;

      const evento = await EventosModel.findById(id);
      if (!evento) {
        return res.status(404).json({ error: "Evento no encontrado" });
      }

      await EventosModel.update(id, req.body);

      res.json({ success: true });
    } catch (error) {
      console.error("Error update evento:", error);
      res.status(500).json({ error: "Error al actualizar el evento" });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;

      const evento = await EventosModel.findById(id);
      if (!evento) {
        return res.status(404).json({ error: "Evento no encontrado" });
      }

      await EventosModel.remove(id);

      res.json({ success: true });
    } catch (error) {
      console.error("Error remove evento:", error);
      res.status(500).json({ error: "Error al eliminar el evento" });
    }
  }
};
