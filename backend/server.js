// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import eventosRoutes from "./routes/eventos.routes.js";
import { testConnection } from "./db.js";

dotenv.config();
const app = express();

// Middlewares

app.use(cors());
app.use(express.json());

// Ruta base para comprobar que el servidor funciona
app.get("/", (req, res) => {
  res.json({ message: "API EventFlow funcionando 🚀" });
});

// Probar conexión a DB al iniciar
testConnection();

// Rutas API
app.use("/api/eventos", eventosRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor ejecutándose en http://localhost:${PORT}`);
});
