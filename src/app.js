// src/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const { connectDB: connectMongoDB } = require('./config/dbMongo');
const { connectDB: connectPostgresDB } = require('./config/db');
const videoRoutes = require('./routes/videoRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

connectMongoDB();
connectPostgresDB();

app.use('/api/videos', videoRoutes);
app.use('/api/users', userRoutes);

module.exports = app;