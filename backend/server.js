// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import eventosRoutes from "./routes/eventos.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import asistentesRoutes from "./routes/asistentes.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();
const app = express();

// Middlewares

app.use(cors());
app.use(express.json()); // Debe estar antes de las rutas para manejar correctamente los cuerpos JSON

// Middleware de logging para desarrollo
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
// Ruta base para comprobar que el servidor funciona
app.get("/", (req, res) => {
  res.json({ message: "API EventFlow funcionando 🚀" });
});

// Rutas de la API
app.use("/api/auth", authRoutes); 
app.use("/api/eventos", eventosRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/asistentes", asistentesRoutes);

// Arrancar el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Servidor ejecutándose en http://localhost:${PORT}`);
});



// Manejo de errores global (no capturados)
app.use((err, req, res, next) => {
  console.error("Error inesperado:", err);
  res.status(500).json({ message: "Error en el servidor, por favor intente más tarde." });
});
