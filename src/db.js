import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Client } = pkg;

// Obtener la información de conexión desde las variables de entorno
const { DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME } = process.env;

// Crear una instancia del cliente PostgreSQL
export const pool = new Client({
    user: DATABASE_USER,
    host: DATABASE_HOST,
    database: DATABASE_NAME,
    password: DATABASE_PASSWORD,
    port: 5432, // Puerto por defecto de PostgreSQL
    ssl: {
        rejectUnauthorized: false // Configuración para permitir conexiones inseguras, úsala solo para pruebas
    }
});

// Conecta a la base de datos
pool.connect()
  .then(() => console.log('Conexión exitosa a PostgreSQL'))
  .catch(err => console.error('Error al conectar a PostgreSQL', err));
