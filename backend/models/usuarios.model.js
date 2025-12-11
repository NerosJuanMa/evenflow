// models/usuarios.model.js
import { pool } from "../db.js";

export const UsuariosModel = {
  async create({ nombre, email, evento_id }) {
    const [result] = await pool.query(
      "INSERT INTO usuarios (nombre, email, evento_id) VALUES (?, ?, ?)",
      [nombre, email, evento_id]
    );
    return result.insertId;
  },

  async findByEvent(evento_id) {
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE evento_id = ?",
      [evento_id]
    );
    return rows;
  }
};
