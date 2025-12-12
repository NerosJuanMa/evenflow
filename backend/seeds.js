// seeds.js
import { pool } from "./db.js";

async function seedDB() {
  try {
    console.log("🌱 Insertando datos de ejemplo...");

    // Limpiar tablas (opcional)
    await pool.query("DELETE FROM usuarios");
    await pool.query("DELETE FROM eventos");
    
    
    // Insertar eventos
    const eventos = [
      ["Inicio APP", "Creacion del usuario Admin", "2025-01-01 18:00:00", "Admin", ],
      ["Taller de Fotografía", "Aprende fotografía profesional", "2025-03-10 18:00:00", "Taller"],
      ["Concierto Acústico", "Música en vivo", "2025-03-15 20:00:00", "Música"],
      ["Charla de Tecnología", "Tendencias en IA", "2025-04-02 17:30:00", "Conferencia"]
    ];

    for (const ev of eventos) {
      await pool.query(
        "INSERT INTO eventos (titulo, descripcion, fecha, categoria) VALUES (?, ?, ?, ?)",
        ev
      );
    }

    // Insertar inscripciones de ejemplo
    await pool.query(`
      INSERT INTO usuarios (nombre, email, password, rol)
      VALUES         
        ('ADMIN', 'jmmudarra@gmail.com',123456, 'admin'),
        ('Carlos Pérez', 'carlos@example.com',123456, 'user'),
        ('Lucía Gómez', 'lucia@example.com',123456, 'user');
    `);

    // Insertar asistencias de ejemplo
    await pool.query(`
      INSERT INTO asistentes (evento_id, usuario_id, estado)
      VALUES         
        ('1', '1', 'pendiente'),
        ('1', '2', 'pendiente'),
        ('2', '1', 'pendiente');
    `);

    console.log("✅ Datos insertados correctamente.");
    process.exit();
  } catch (error) {
    console.error("❌ Error insertando datos:", error);
    process.exit(1);
  }
}

seedDB();
