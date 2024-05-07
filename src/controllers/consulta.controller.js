import bcrypt from 'bcrypt';
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

        // Encriptar los datos sensibles con bcrypt
        const hashedDiagnostico = await bcrypt.hash(diagnostico, 4);
        const hashedRecetaMedica = await bcrypt.hash(receta_medica, 4);
        const hashedObservaciones = await bcrypt.hash(observaciones, 4);

        // Insertar la consulta en la base de datos con los datos encriptados y los IDs obtenidos
        const { rows } = await pool.query(
            'INSERT INTO consulta (id_cita, id_medico, id_paciente, diagnostico, receta_medica, observaciones) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_cita, id_medico, id_paciente, fecha',
            [id_cita, id_medico, id_paciente, hashedDiagnostico, hashedRecetaMedica, hashedObservaciones]
        );

        const consultaCreated = rows[0];

        res.status(201).send({ message: 'Consulta creada correctamente', consulta: consultaCreated });
    } catch (error) {
        console.error('Error al insertar en la base de datos:', error);
        res.status(500).send('Error en el servidor');
    }
};


const desencriptarCampo = async (valorEncriptado) => {
    const desencriptado = await bcrypt.compare(valorEncriptado, valorEncriptado);

    return desencriptado;
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

        // Desencriptar los campos necesarios
        const citasDesencriptadas = rows.map(async (cita) => {
            const { diagnostico, receta_medica, observaciones } = cita;
            const diagnosticoDesencriptado = await desencriptarCampo(diagnostico);
            const recetaMedicaDesencriptada = await desencriptarCampo(receta_medica);
            const observacionesDesencriptadas = await desencriptarCampo(observaciones);

            return {
                ...cita,
                diagnostico: diagnosticoDesencriptado,
                receta_medica: recetaMedicaDesencriptada,
                observaciones: observacionesDesencriptadas,
            };
        });

        // Esperar a que se completen todas las desencripciones
        const citasDesencriptadasCompletas = await Promise.all(citasDesencriptadas);

        res.status(200).json(citasDesencriptadasCompletas);
    } catch (error) {
        console.error('Error al obtener las consultas del paciente:', error);
        res.status(500).send('Error en el servidor');
    }
};