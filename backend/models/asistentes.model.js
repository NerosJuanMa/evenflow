// models/asistentes.model.js
import { pool } from "../db.js";

export const AsistentesModel = {
  async findAll() {
    const [rows] = await pool.query(`
      SELECT a.*, u.nombre AS usuario_nombre, u.email AS usuario_email,
             e.titulo AS evento_titulo, e.fecha AS evento_fecha
      FROM asistentes a
      JOIN usuarios u ON a.usuario_id = u.id
      JOIN eventos e ON a.evento_id = e.id
      ORDER BY a.created_at DESC
    `);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query("SELECT * FROM asistentes WHERE id = ?", [id]);
    return rows[0];
  },

  async exists(evento_id, usuario_id) {
    const [rows] = await pool.query(
      "SELECT id FROM asistentes WHERE evento_id = ? AND usuario_id = ?",
      [evento_id, usuario_id]
    );
    return rows.length > 0;
  },

  async create({ evento_id, usuario_id, estado = "pendiente" }) {
    const [result] = await pool.query(
      "INSERT INTO asistentes (evento_id, usuario_id, estado) VALUES (?, ?, ?)",
      [evento_id, usuario_id, estado]
    );
    return result.insertId;
  },

  async update(id, data) {
    const { evento_id, usuario_id, estado } = data;

    await pool.query(
      "UPDATE asistentes SET evento_id=?, usuario_id=?, estado=? WHERE id=?",
      [evento_id, usuario_id, estado, id]
    );

    return true;
  },

  async remove(id) {
    await pool.query("DELETE FROM asistentes WHERE id=?", [id]);
    return true;
  }
};
