const { createUser } = require('../models/User');
const { pool } = require('../config/db');


const registerUser = async (req, res) => {
  const { username, correo, contrasena } = req.body;

  try {
    const newUser = await createUser(username, correo, contrasena);
    res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const result = await pool.query(
      'SELECT id, username, correo FROM users WHERE (username = $1 OR correo = $1) AND contrasena = $2',
      [correo, contrasena]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const user = result.rows[0];
    res.json({ id: user.id, username: user.username, correo: user.correo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerUser,loginUser };