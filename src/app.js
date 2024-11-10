const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const { connectDB: connectMongoDB } = require('./config/dbMongo');
const { connectDB: connectPostgresDB } = require('./config/db');
const videoRoutes = require('./routes/videoRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//url local-Front : http://localhost:4200/
//url EC2-Front : http://34.236.126.231

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