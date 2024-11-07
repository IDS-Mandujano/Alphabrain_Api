const express = require('express');
const { uploadVideo, fetchVideos, removeVideo } = require('../controllers/videoController');
const { getGridFSBucket } = require('../config/dbMongo');
const multer = require('multer');
const { ObjectId } = require('mongodb');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('video'), uploadVideo);
router.delete('/:id', removeVideo);
router.get('/', fetchVideos);

router.get('/:id', async (req, res) => {
  try {
    const bucket = getGridFSBucket();
    const downloadStream = bucket.openDownloadStream(new ObjectId(req.params.id));

    res.setHeader('Content-Type', 'video/mp4');

    downloadStream.on('data', (chunk) => res.write(chunk));
    downloadStream.on('end', () => {
      console.log("Video stream completed");
      res.end();
    });
    downloadStream.on('error', (error) => {
      console.error("Error en download stream:", error);
      res.status(404).json({ error: 'Video no encontrado', details: error.message });
    });
  } catch (error) {
    console.error("Error fetching video:", error);
    res.status(500).json({ error: 'Error al obtener el video', details: error.message });
  }
});

module.exports = router;