// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { testConnection } from "./db.js"; // Función para probar la conexión a DB

import eventosRoutes from "./routes/eventos.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import asistentesRoutes from "./routes/asistentes.routes.js";

import authRoutes from "./routes/auth.routes.js";
import { verifyToken } from "./middlewares/auth.middleware.js";

dotenv.config();
const app = express();

// Middlewares

app.use(cors());
app.use(express.json()); // Debe estar antes de las rutas para manejar correctamente los cuerpos JSON

// Middleware de logging para desarrollo
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.path}`);
//   next();
// });
// Ruta base para comprobar que el servidor funciona
app.get("/", (req, res) => {
  res.json({ message: "API EventFlow funcionando 🚀" });
});

// Probar conexión a DB al iniciar (manejo correcto con async/await)
async function startServer() {
  try {
    await testConnection(); // Asumimos que testConnection() es una función async
    console.log("Conexión a la base de datos establecida.");

    // Rutas públicas
        app.use("/api/auth", authRoutes); 
        // app.use("/api/eventos", eventosRoutes);
        // app.use("/api/usuarios", usuariosRoutes);
        // app.use("/api/asistentes", asistentesRoutes);

    // Rutas protegidas
        app.use("/api/eventos", verifyToken, eventosRoutes);
        app.use("/api/usuarios", verifyToken, usuariosRoutes);
        app.use("/api/asistentes", verifyToken, asistentesRoutes);

    // Iniciar servidor
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🔥 Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1); // Si la conexión falla, detenemos el servidor
  }
}

// Llamar a la función para iniciar el servidor
startServer();

// Manejo de errores global (no capturados)
app.use((err, req, res, next) => {
  console.error("Error inesperado:", err);
  res.status(500).json({ message: "Error en el servidor, por favor intente más tarde." });
});
