// Importar el modelo de inscripciones y los modelos de usuarios y eventos si son necesarios
import { InscripcionesModel } from '../models/inscripciones.model.js';
import { UsuariosModel } from '../models/usuarios.model.js'; // Necesario para crear/encontrar usuarios
//import { pool } from '../db.js'; // Se asume que pool está disponible para transacciones

// =================================================================
// 1. INSCRIPCIÓN DE UN USUARIO A UN EVENTO (POST /usuarios/:id_evento/inscripciones)
// =================================================================
export const createInscripcion = async (req, res) => {
    // Aquí, id_evento viene de los parámetros de la URL (req.params.id_evento)
    // y los datos del usuario (nombre, email) vienen del cuerpo (req.body).
    const { id_evento } = req.params; 
    const { nombre, email } = req.body; 

    if (!id_evento || !nombre || !email) {
        return res.status(400).json({ 
            message: "Faltan datos obligatorios: id_evento, nombre y email." 
        });
    }

    try {
        // --- 1. Crear o encontrar el usuario por email (evitar duplicados de usuario) ---
        // Se asume que UsuariosModel.create ya tiene la lógica ON DUPLICATE KEY UPDATE o similar.
        const id_usuario = await UsuariosModel.create({ nombre, email }); 
        
        // --- 2. Verificar si ya está inscrito en este evento ---
        // NOTA: Esto requiere un método en InscripcionesModel para verificar la combinación (id_evento, id_usuario).
        // Si no tienes ese método, se realiza una consulta manual aquí.

        const [existing] = await pool.query(
            "SELECT id FROM inscrpciones WHERE id_evento = ? AND id_usuario = ?",
            [id_evento, id_usuario]
        );

        if (existing.length > 0) {
            return res.status(200).json({ 
                message: "Ya estás inscrito en este evento.",
                id_inscripcion: existing[0].id 
            });
        }

        // --- 3. Registrar la inscripción ---
        const insertId = await InscripcionesModel.create({ id_evento, id_usuario });
        
        res.status(201).json({ 
            message: "Inscripción registrada con éxito", 
            id: insertId 
        });

    } catch (error) {
        console.error("Error al crear la inscripción:", error);
        res.status(500).json({ 
            message: "Error interno del servidor al procesar la inscripción." 
        });
    }
};

// =================================================================
// 2. OBTENER INSCRITOS DE UN EVENTO (GET /eventos/:id_evento/usuarios)
//    (Endpoint de Quienes Van)
// =================================================================
export const getInscritosByEvento = async (req, res) => {
    const { id_evento } = req.params;

    if (!id_evento) {
        return res.status(400).json({ 
            message: "El ID del evento es obligatorio." 
        });
    }

    try {
        // NOTA: Tu modelo original tiene un método findByIdEvento, pero busca en la tabla 'eventos'.
        // Aquí necesitamos una consulta JOIN o un nuevo método en el modelo para obtener
        // los datos del usuario (nombre, email) a través de la tabla 'inscrpciones'.
        
        const [usuariosInscritos] = await pool.query(
            `
            SELECT u.nombre, u.email, i.id_evento 
            FROM inscrpciones i
            JOIN usuarios u ON i.id_usuario = u.id
            WHERE i.id_evento = ?
            `,
            [id_evento]
        );
        
        if (usuariosInscritos.length === 0) {
            return res.status(404).json({ 
                message: "No se encontraron inscripciones para este evento." 
            });
        }

        res.json(usuariosInscritos);

    } catch (error) {
        console.error("Error al obtener inscritos por evento:", error);
        res.status(500).json({ 
            message: "Error interno del servidor." 
        });
    }
};

