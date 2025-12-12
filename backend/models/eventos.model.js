// models/eventos.model.js
import { pool } from "../db.js";

export const EventosModel = {
  async findAll() {
    const [rows] = await pool.query(`
      SELECT id, titulo, descripcion, fecha, lugar, categoria, creador_id 
      FROM eventos ORDER BY fecha ASC
    `);
    return rows;
  },

  async findById(id) {
     const [rows] = await pool.query(`
      SELECT id, titulo, descripcion, fecha, lugar, categoria, creador_id 
      FROM eventos WHERE id = ?
    `, [id]);
    return rows[0];
  },

  async create({ titulo, descripcion, fecha, categoria, creador_id }) {
    const [result] = await pool.query(`
      INSERT INTO eventos (titulo, descripcion, fecha, lugar, categoria, creador_id) 
      VALUES (?, ?, ?, ?, ?, ?)
    `, [titulo, descripcion, fecha, categoria, creador_id]);
    return result.insertId;
  },

  async update(id, data) {
    const { titulo, descripcion, fecha, categoria } = data;

    await pool.query(
      "UPDATE eventos SET titulo=?, descripcion=?, fecha=?, categoria=? WHERE id=?",
      [titulo, descripcion, fecha, categoria, id]
    );

    return true;
  },

  async remove(id) {
    await pool.query("DELETE FROM eventos WHERE id=?", [id]);
    return true;
  }
};
