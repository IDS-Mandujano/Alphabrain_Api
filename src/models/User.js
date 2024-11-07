const { pool } = require('../config/db');

const createUser = async (username, correo, contrasena) => {
  const result = await pool.query(
    'INSERT INTO users (username, correo, contrasena) VALUES ($1, $2, $3) RETURNING *',
    [username, correo, contrasena]
  );
  return result.rows[0];
};

module.exports = { createUser };