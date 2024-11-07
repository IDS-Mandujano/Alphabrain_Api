const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,
});

const connectDB = async () => {
  try {
    await pool.connect();
    console.log('Conectado a PostgreSQL');
    
  } catch (error) {
    console.error('Error al conectar a PostgreSQL:', error.message);
    process.exit(1);
  }
};

module.exports = { connectDB, pool };