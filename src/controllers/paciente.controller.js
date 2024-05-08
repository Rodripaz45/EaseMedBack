import { pool } from "../db.js";
import { generateToken, validateToken } from '../jwt.js';
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
    const { email, password, nombre, apellido, fecha_nacimiento, documento_identidad, telefono, direccion } = req.body;

    try {
        // Genera un hash de la contraseña utilizando bcrypt
        const hashedPassword = await bcrypt.hash(password, 6);

        const query = 'INSERT INTO pacientes (email, password, nombre, apellido, fecha_nacimiento, documento_identidad, telefono, direccion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
        const values = [email, hashedPassword, nombre, apellido, fecha_nacimiento, documento_identidad, telefono, direccion];

        const { rows } = await pool.query(query, values);

        //Anadir alergias
        
        const usuarioToken = {
            id: rows.insertId,
            email: email,
            nombre: nombre,
            apellido: apellido,
            fecha_nacimiento: fecha_nacimiento,
            documento_identidad: documento_identidad,
            telefono: telefono,
            direccion: direccion
        };
        
        const token = generateToken(usuarioToken);

        res.send({token: token, id: rows.insertId});
    } catch (error) {
        // Manejo de errores
        console.error('Error al insertar en la base de datos:', error);
        res.status(500).send('Error en el servidor');
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Realiza la consulta SQL para seleccionar el usuario por su email
        const query = 'SELECT * FROM pacientes WHERE email = $1';
        const values = [email];
            
        const { rows } = await pool.query(query, values);


        // Verifica si se encontró algún usuario con el email proporcionado
        if (rows.length > 0) {
            // Verifica si la contraseña proporcionada coincide con la contraseña almacenada (hasheada)
            const user = rows[0];
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                // Crear objeto con los campos del usuario a incluir en el token
                const usuarioToken = {
                    id: user.id,
                    email: user.email,
                    nombre: user.nombre,
                    apellido: user.apellido,
                    fecha_nacimiento: user.fecha_nacimiento,
                    documento_identidad: user.documento_identidad,
                    telefono: user.telefono,
                    direccion: user.direccion
                };

                const token = generateToken(usuarioToken);

                res.send({token: token, id: user.id});
            } else {
                // Si las contraseñas no coinciden, devuelve un mensaje de error
                res.status(404).send('Credenciales incorrectas');
            }
        } else {
            // No se encontró ningún usuario con ese email
            res.status(404).send('Credenciales incorrectas');
        }
    } catch (error) {
        // Manejo de errores
        console.error('Error en la consulta SQL:', error);
        res.status(500).send('Error en el servidor');
    }
};

export const getById = async (req, res) => {
    const { id } = req.query; // Obtener el ID del usuario de los parámetros de la URL

    try {
        // Realizar la consulta SQL para seleccionar el usuario por su ID
        const { rows } = await pool.query('SELECT id, nombre, apellido, fecha_nacimiento, documento_identidad, telefono, direccion FROM pacientes WHERE id = $1', [id]);

        // Verificar si se encontró algún usuario con el ID proporcionado
        if (rows.length > 0) {
            const pacientes = rows[0]; // Obtener el primer usuario encontrado (debería ser único por ID)

            res.send(pacientes); // Enviar el usuario como respuesta
        } else {
            // No se encontró ningún usuario con ese ID
            res.status(404).send('Usuario no encontrado');
        }
    } catch (error) {
        // Manejo de errores
        console.error('Error en la consulta SQL:', error);
        res.status(500).send('Error en el servidor');
    }
};



