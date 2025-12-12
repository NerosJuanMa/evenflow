// controllers/usuarios.controller.js
import { UsuariosModel } from "../models/usuarios.model.js";

export const UsuariosController = {
  async inscribir(req, res) {
    const evento_id = req.params.id;
    const { nombre, email } = req.body;

    const nuevoId = await UsuariosModel.create({ nombre, email, evento_id });
    res.status(201).json({ message: "Usuario inscrito", id: nuevoId });
  },

  async getInscritos(req, res) {
    const evento_id = req.params.id;
    const usuarios = await UsuariosModel.findByEvent(evento_id);
    res.json(usuarios);
  },

   async getUsuarios(req, res) {
    const allusuarios = await UsuariosModel.findAll();
    res.json(allusuarios);
  }
};
