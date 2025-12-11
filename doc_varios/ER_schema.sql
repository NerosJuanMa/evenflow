-- Esquema SQL para EventFlow (MySQL/MariaDB)
CREATE DATABASE IF NOT EXISTS eventflow_db;
USE eventflow_db;

CREATE TABLE IF NOT EXISTS eventos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT,
  fecha DATETIME NOT NULL,
  categoria VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  email VARCHAR(200) NOT NULL,
  evento_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE
);
-- Índices sugeridos
CREATE INDEX idx_evento_fecha ON eventos(fecha);
CREATE INDEX idx_usuario_email ON usuarios(email);
