// initdb.js
import { pool } from "./db.js";

async function initDB() {
  try {
    console.log("🛠 Creando tablas...");

    // Crear tabla eventos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS eventos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(200) NOT NULL,
        descripcion TEXT,
        fecha DATETIME NOT NULL,
        categoria VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Crear tabla usuarios (inscripciones)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        email VARCHAR(200) NOT NULL,
        evento_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE
      );
    `);

    console.log("✅ Tablas creadas correctamente.");
    process.exit();
  } catch (error) {
    console.error("❌ Error creando tablas:", error);
    process.exit(1);
  }
}

initDB();
