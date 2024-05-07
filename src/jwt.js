import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Obtener la firma del token JWT de las variables de entorno
const JWT_SECRET = process.env.JWT_SECRET;


export const generateToken = (usuarioToken) => {
    try {
        // Generar el token JWT
        const token = jwt.sign(usuarioToken, JWT_SECRET, { expiresIn: '2h' });
        return token;
    } catch (error) {
        // Manejo de errores
        console.error('Error al generar el token:', error);
        return null;
    }
};


// Función para validar el token JWT
export const validateToken = (token, claveSecreta) => {
  try {
    // Verifica y decodifica el token utilizando la clave secreta
    const decoded = jwt.verify(token, claveSecreta);
    // Si el token es válido, puedes acceder a la información decodificada en decoded
    console.log(decoded); // Puedes hacer lo que necesites con la información decodificada
    return decoded; // Opcional: puedes devolver la información decodificada si la necesitas en otro lugar
  } catch (error) {
    // Si hay un error al validar el token, puedes manejarlo aquí o lanzar una excepción
    throw new Error('Token no válido');
  }
};
