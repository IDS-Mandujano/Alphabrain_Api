// routes/userRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser); // Nueva ruta para el inicio de sesión

module.exports = router;
