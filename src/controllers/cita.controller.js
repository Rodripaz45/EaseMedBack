import { pool } from "../db.js";

export const createCita = async (req, res) => {
    const { id_medico, id_paciente, fecha, hora } = req.body;

    try {
        // Verificar si ya existe una cita con el mismo doctor en la misma fecha y hora
        const { rows: existingCitas } = await pool.query(
            'SELECT id_cita FROM cita WHERE id_medico = $1 AND fecha = $2 AND hora = $3',
            [id_medico, fecha, hora]
        );

        if (existingCitas.length > 0) {
            return res.status(400).send({ message: 'Ya existe una cita con este doctor en la misma fecha y hora.' });
        }

        // Si no existe, crear la cita
        const { rows } = await pool.query(
            'INSERT INTO cita (id_medico, id_paciente, fecha, hora) VALUES ($1, $2, $3, $4) RETURNING id_cita, id_medico, id_paciente, fecha, hora',
            [id_medico, id_paciente, fecha, hora]
        );

        const citaCreated = rows[0];

        res.status(201).send({ message: 'Cita creada correctamente', cita: citaCreated });
    } catch (error) {
        console.error('Error al insertar en la base de datos:', error);
        res.status(500).send('Error en el servidor');
    }
};

export const getCita = async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT c.id_cita, c.id_medico, m.nombres AS nombre_medico, c.id_paciente, p.nombre AS nombre_paciente, c.fecha, c.hora
            FROM cita c
            INNER JOIN medicos m ON c.id_medico = m.id
            INNER JOIN pacientes p ON c.id_paciente = p.id
            WHERE c.fecha >= CURRENT_DATE -- Filtrar por fecha desde hoy en adelante
            ORDER BY c.fecha ASC, c.hora ASC -- Ordenar por fecha ascendente y luego por hora ascendente
        `);
        res.send(rows);
    } catch (error) {
        console.error('Error en la consulta SQL:', error);
        res.status(500).send('Error en el servidor');
    }
};
export const getCitasPorMedico = async (req, res) => {
    const { id_medico } = req.query; // Suponiendo que el ID del médico se pasa como parámetro en la URL

    try {
        const { rows } = await pool.query(`
            SELECT c.id_cita, c.id_medico, m.nombres AS nombre_medico, c.id_paciente, p.nombre AS nombre_paciente, c.fecha, c.hora
            FROM cita c
            INNER JOIN medicos m ON c.id_medico = m.id
            INNER JOIN pacientes p ON c.id_paciente = p.id
            WHERE c.id_medico = $1
            AND c.fecha >= CURRENT_DATE -- Filtrar por fecha desde hoy en adelante
            ORDER BY c.fecha ASC, c.hora ASC -- Ordenar por fecha ascendente y luego por hora ascendente
        `, [id_medico]);

        res.send(rows);
    } catch (error) {
        console.error('Error en la consulta SQL:', error);
        res.status(500).send('Error en el servidor');
    }
};

// Obtener citas por ID de paciente
export const getCitasPorPaciente = async (req, res) => {
    const { id_paciente } = req.query; // Suponiendo que el ID del paciente se pasa como parámetro en la URL
    try {
        const { rows } = await pool.query(`
            SELECT c.id_cita, c.id_medico, m.nombres AS nombre_medico, c.id_paciente, p.nombre AS nombre_paciente, c.fecha, c.hora
            FROM cita c
            INNER JOIN medicos m ON c.id_medico = m.id
            INNER JOIN pacientes p ON c.id_paciente = p.id
            WHERE c.id_paciente = $1
            AND c.fecha >= CURRENT_DATE -- Filtrar por fecha desde hoy en adelante
            ORDER BY c.fecha ASC, c.hora ASC -- Ordenar por fecha ascendente y luego por hora ascendente
        `, [id_paciente]);

        res.send(rows);
    } catch (error) {
        console.error('Error en la consulta SQL:', error);
        res.status(500).send('Error en el servidor');
    }
};

export const getCitasDelDia = async (req, res) => {
    try {
        const currentDate = new Date().toISOString().slice(0, 10); 

        const { rows } = await pool.query(`
            SELECT c.id_cita, c.id_medico, m.nombres AS nombre_medico, c.id_paciente, p.nombre AS nombre_paciente, c.fecha, c.hora
            FROM cita c
            INNER JOIN medicos m ON c.id_medico = m.id
            INNER JOIN pacientes p ON c.id_paciente = p.id
            WHERE c.fecha = $1
        `, [currentDate]);

        res.send(rows);
    } catch (error) {
        console.error('Error en la consulta SQL:', error);
        res.status(500).send('Error en el servidor');
    }
};

export const deleteCita = async (req, res) => {
    const { id } = req.params; // Suponiendo que el ID de la cita se pasa como parámetro en la URL

    try {
        // Verificar si la cita existe
        const { rowCount } = await pool.query('DELETE FROM cita WHERE id_cita = $1', [id]);

        if (rowCount === 0) {
            return res.status(404).send({ message: 'La cita especificada no existe.' });
        }

        res.status(200).send({ message: 'Cita eliminada correctamente.' });
    } catch (error) {
        console.error('Error al eliminar la cita:', error);
        res.status(500).send('Error en el servidor');
    }
};