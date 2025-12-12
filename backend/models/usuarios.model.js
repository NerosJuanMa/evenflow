// models/usuarios.model.js
import { pool } from "../db.js";
import bcrypt from "bcrypt";

export const UsuariosModel = {
  async findAll() {
    const [rows] = await pool.query(
      "SELECT id, nombre, email, rol, created_at FROM usuarios ORDER BY created_at DESC"
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      "SELECT id, nombre, email, rol, created_at FROM usuarios WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);
    return rows[0]; // incluye password
  },

  async create({ nombre, email, password, rol = "user" }) {
    const hashed = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)",
      [nombre, email, hashed, rol]
    );

    return result.insertId;
  },

  async update(id, data) {
    const { nombre, email, password, rol } = data;

    // Si hay contraseña, la hasheamos
    let hashed = null;
    if (password) {
      hashed = await bcrypt.hash(password, 10);
    }

    await pool.query(
      `UPDATE usuarios 
       SET nombre = ?, email = ?, ${password ? "password = ?, " : ""} rol = ?
       WHERE id = ?`,
      password
        ? [nombre, email, hashed, rol, id]
        : [nombre, email, rol, id]
    );

    return true;
  },

  async remove(id) {
    await pool.query("DELETE FROM usuarios WHERE id=?", [id]);
    return true;
  },
};


