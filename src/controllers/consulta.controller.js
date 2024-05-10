import { pool } from '../db.js';

export const createConsulta = async (req, res) => {
    const { id_cita, diagnostico, receta_medica, observaciones } = req.body;

    try {
        // Obtener los IDs de medico y paciente correspondientes a la cita
        const { rows: citaData } = await pool.query(
            'SELECT id_medico, id_paciente FROM cita WHERE id_cita = $1',
            [id_cita]
        );

        if (citaData.length === 0) {
            return res.status(404).send({ message: 'La cita especificada no existe.' });
        }

        const { id_medico, id_paciente } = citaData[0];

        // Insertar la consulta en la base de datos con los datos y los IDs obtenidos
        const { rows } = await pool.query(
            'INSERT INTO consulta (id_cita, id_medico, id_paciente, diagnostico, receta_medica, observaciones) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_cita, id_medico, id_paciente, fecha',
            [id_cita, id_medico, id_paciente, diagnostico, receta_medica, observaciones]
        );

        const consultaCreated = rows[0];

        res.status(201).send({ message: 'Consulta creada correctamente', consulta: consultaCreated });
    } catch (error) {
        console.error('Error al insertar en la base de datos:', error);
        res.status(500).send('Error en el servidor');
    }
};

export const getConsultasPorPaciente = async (req, res) => {
    const { id } = req.query;

    try {
        const { rows } = await pool.query(
            `SELECT id_cita, id_medico, diagnostico, receta_medica, observaciones, fecha
            FROM consulta
            WHERE id_paciente = $1`,
            [id]
        );

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener las consultas del paciente:', error);
        res.status(500).send('Error en el servidor');
    }
};
