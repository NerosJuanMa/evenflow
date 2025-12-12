// controllers/auth.controller.js
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { pool } from "../db.js";


export const AuthController = {
  async register(req, res) {
    try {
      const { nombre, email, password } = req.body;

      // Validaciones mínimas
      if (!email || !password || !nombre) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
      }

      // Verificar si ya existe
      const [existing] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
      if (existing.length > 0) {
        return res.status(409).json({ error: "El email ya está registrado" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await pool.query(
        "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, 'user')",
        [nombre, email, hashedPassword]
      );

      res.status(201).json({ id: result.insertId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al registrar usuario" });
    }
  },

  
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);

      if (rows.length === 0) {
        return res.status(401).json({ error: "Credenciales incorrectas" });
      }

      const user = rows[0];

      const passwordOK = await bcrypt.compare(password, user.password);
      if (!passwordOK) {
        return res.status(401).json({ error: "Credenciales incorrectas" });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          rol: user.rol,
          nombre: user.nombre
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al iniciar sesión" });
    }
  }
};
