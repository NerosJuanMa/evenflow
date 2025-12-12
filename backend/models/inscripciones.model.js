import { pool } from "../db.js";

export const InscripcionesModel = {
  async create({ id_evento, id_usuario }) {
    const [result] = await pool.query(
      "INSERT INTO inscrpciones (id_evento, id_usuario) VALUES (?, ?)",
      [id_evento, id_usuario]
    );
    return result.insertId;
  },
  async findByIdUsuario(id_usuario) {
    const [rows] = await pool.query("SELECT * FROM eventos WHERE id_usuario = ?", [id_usuario]);
    return rows[0];
  },

  async findByIdEvento(id_evento) {
    const [rows] = await pool.query("SELECT * FROM eventos WHERE id_evento = ?", [id_evento]);
    return rows[0];
  },

};
