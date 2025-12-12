// controllers/eventos.controller.js
import { EventosModel } from "../models/eventos.model.js";

export const EventosController = {
  async getAll(req, res) {
    const eventos = await EventosModel.findAll();
    res.json(eventos);
  },

  async getOne(req, res) {
    const id = req.params.id;
    const evento = await EventosModel.findById(id);
    if (!evento) return res.status(404).json({ error: "Evento no encontrado" });
    res.json(evento);
  },

  async create(req, res) {
    const nuevoId = await EventosModel.create(req.body);
    res.status(201).json({ message: "Evento creado", id: nuevoId });
  },

  async update(req, res) {
    const id = req.params.id;
    await EventosModel.update(id, req.body);
    res.json({ message: "Evento actualizado" });
  },

  async remove(req, res) {
    const id = req.params.id;
    await EventosModel.remove(id);
    res.json({ message: "Evento eliminado" });
  }
};
