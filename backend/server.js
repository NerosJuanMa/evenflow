// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import eventosRoutes from "./routes/eventos.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import asistentesRoutes from "./routes/asistentes.routes.js";
import authRoutes from "./routes/auth.routes.js";

import { pool } from "./db.js";
import { verificarToken } from "./middlewares/auth.middleware.js";

dotenv.config();
const app = express();

/* ======================
   MIDDLEWARES GLOBALES
====================== */
app.use(cors());
app.use(express.json());

// Logger para desarrollo
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

/* ======================
   RUTA TEST
====================== */
app.get("/", (req, res) => {
  res.json({ message: "API EventFlow funcionando 🚀" });
});

/* ======================
   EVENTOS DEL USUARIO LOGUEADO
   (para mostrar 'Ya inscrito')
====================== */
app.get("/api/mis-eventos", verificarToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT evento_id
      FROM asistentes
      WHERE usuario_id = ?
      `,
      [req.user.id]
    );

    // Devolvemos SOLO los IDs
    res.json(rows.map(r => r.evento_id));
  } catch (error) {
    console.error("❌ Error en /api/mis-eventos:", error);
    res.status(500).json({
      mensaje: "Error obteniendo eventos del usuario"
    });
  }
});

/* ======================
   RUTAS PRINCIPALES
====================== */
app.use("/api/auth", authRoutes);
app.use("/api/eventos", eventosRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/asistentes", asistentesRoutes);

/* ======================
   MANEJO DE ERRORES GLOBAL
====================== */
app.use((err, req, res, next) => {
  console.error("❌ Error inesperado:", err);
  res.status(500).json({
    mensaje: "Error interno del servidor"
  });
});

/* ======================
   ARRANQUE DEL SERVIDOR
====================== */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Servidor ejecutándose en http://localhost:${PORT}`);
});

