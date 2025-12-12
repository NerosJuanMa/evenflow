// initdb.js
import { pool } from "./db.js";

async function initDB() {
  try {
    console.log("🛠 Creando tablas...");
    await pool.query("DROP TABLE IF EXISTS asistentes;");
    await pool.query("DROP TABLE IF EXISTS usuarios;");
    await pool.query("DROP TABLE IF EXISTS eventos;");
    
    // Crear tabla eventos
    await pool.query(`
    CREATE TABLE IF NOT EXISTS eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    fecha DATETIME NOT NULL,
    categoria VARCHAR(100),
    creador_id INT,
    lugar VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_evento_fecha (fecha)
    );
    
    `);
      
    // Crear tabla usuarios (inscripciones)
    await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(200) NOT NULL,
    password VARCHAR(150) NOT NULL,
    rol ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY uq_usuario_email (email),
    INDEX idx_usuario_email (email)
    );
    
    `);
      // Crear tabla inscripciones (eventos_usuarios: un usuario puede estar en varios eventos pero en el evento no se puede repetir usuario)
    await pool.query(`
    CREATE TABLE IF NOT EXISTS asistentes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    evento_id INT NOT NULL,
    usuario_id INT NOT NULL,
    estado ENUM('confirmado','pendiente','cancelado') DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,

    UNIQUE KEY uq_evento_usuario (evento_id, usuario_id),
    INDEX idx_asist_evento (evento_id),
    INDEX idx_asist_usuario (usuario_id)
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
