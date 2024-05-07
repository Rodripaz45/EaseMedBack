import { pool } from "../db.js";
import bcrypt from 'bcrypt';

export const getMedico = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT id, nombres, apellidos, especialidades, descripcion, username, horario_inicio, horario_fin, dias_trabajo FROM medicos');
        res.send(rows);
    } catch (error) {
        console.error('Error en la consulta SQL:', error);
        res.status(500).send('Error en el servidor');
    }
};


export const createMedico = async (req, res) => {
    const { nombres, apellidos, especialidades, descripcion, username, password, horario_inicio, horario_fin, dias_trabajo } = req.body;

    // Verificar que el campo 'nombres' no sea nulo o vacío
    if (!nombres || nombres.trim() === '') {
        return res.status(400).send({ message: 'El campo nombres es requerido' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const { rows } = await pool.query(
            'INSERT INTO medicos (nombres, apellidos, especialidades, descripcion, username, password, horario_inicio, horario_fin, dias_trabajo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, nombres, apellidos, especialidades, descripcion, username',
            [nombres, apellidos, JSON.stringify(especialidades), descripcion, username, hashedPassword, horario_inicio, horario_fin, dias_trabajo]
        );

        const medicoToken = rows[0];

        res.status(201).send({ message: 'Médico creado correctamente', medico: medicoToken });
    } catch (error) {
        console.error('Error al insertar en la base de datos:', error);
        res.status(500).send('Error en el servidor');
    }
};

export const loginMedico = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Realiza la consulta SQL para seleccionar el médico por su nombre de usuario
        const query = 'SELECT * FROM medicos WHERE username = $1';
        const values = [username];
            
        const { rows } = await pool.query(query, values);

        // Verifica si se encontró algún médico con el nombre de usuario proporcionado
        if (rows.length > 0) {
            // Verifica si la contraseña proporcionada coincide con la contraseña almacenada (hasheada)
            const medico = rows[0];
            const passwordMatch = await bcrypt.compare(password, medico.password);

            if (passwordMatch) {
                // Crear objeto con los campos del médico a incluir en el token

                res.send({ message: 'Inicio de sesión exitoso', id: medico.id });
            } else {
                // Si las contraseñas no coinciden, devuelve un mensaje de error
                res.status(404).send('Credenciales incorrectas');
            }
        } else {
            // No se encontró ningún médico con ese nombre de usuario
            res.status(404).send('Credenciales incorrectas');
        }
    } catch (error) {
        // Manejo de errores
        console.error('Error en la consulta SQL:', error);
        res.status(500).send('Error en el servidor');
    }
};