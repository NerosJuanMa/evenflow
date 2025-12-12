// controllers/usuarios.controller.js
import { UsuariosModel } from "../models/usuarios.model.js";

export const UsuariosController = {
  async getAll(req, res) {
    try {
      const usuarios = await UsuariosModel.findAll();
      res.json(usuarios);
    } catch (error) {
      console.error("Error getAll usuarios:", error);
      res.status(500).json({ error: "Error al obtener los usuarios" });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const usuario = await UsuariosModel.findById(id);

      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.json(usuario);
    } catch (error) {
      console.error("Error getById usuario:", error);
      res.status(500).json({ error: "Error al obtener el usuario" });
    }
  },

  async create(req, res) {
    try {
      const id = await UsuariosModel.create(req.body);
      res.status(201).json({ id });
    } catch (error) {
      console.error("Error create usuario:", error);
      res.status(500).json({ error: "Error al crear el usuario" });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;

      const usuario = await UsuariosModel.findById(id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      await UsuariosModel.update(id, req.body);

      res.json({ success: true });
    } catch (error) {
      console.error("Error update usuario:", error);
      res.status(500).json({ error: "Error al actualizar el usuario" });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;

      const usuario = await UsuariosModel.findById(id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      await UsuariosModel.remove(id);

      res.json({ success: true });
    } catch (error) {
      console.error("Error remove usuario:", error);
      res.status(500).json({ error: "Error al eliminar el usuario" });
    }
  }
};
