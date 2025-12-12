// initdb.js
import { pool } from "./db.js";

async function initDB() {
  try {
    console.log("🛠 Creando tablas...");
    await pool.query("DROP TABLE usuarios;");
    await pool.query("DROP TABLE eventos;");
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
      // Crear tabla inscripciones (eventos_usuarios: un usuario puede estar en varios eventos pero en el evento no se puede repetir usuario)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS inscripciones (
        id_one INT AUTO_INCREMENT PRIMARY KEY,
        id_evento INT NOT NULL,
        id_usuario INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_evento) REFERENCES eventos(id) ON DELETE CASCADE
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
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
