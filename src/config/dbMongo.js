const mongoose = require('mongoose');
let bucket;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'videos' });
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  }
};

const getGridFSBucket = () => {
  if (!bucket) {
    throw new Error('GridFSBucket no está inicializado. Asegúrate de que la conexión a MongoDB esté completa.');
  }
  return bucket;
};

module.exports = { connectDB, getGridFSBucket };