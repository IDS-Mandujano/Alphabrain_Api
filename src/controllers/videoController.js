const { saveVideoUrl, getVideos, deleteVideo } = require('../models/Video');
const { getGridFSBucket } = require('../config/dbMongo');

const videoModel = require('../models/Video');
console.log(videoModel);

const uploadVideo = async (req, res) => {
  const { title, description, publication_date } = req.body;
  const videoData = req.file.buffer;

  const allowedMimeTypes = ['video/mp4', 'video/x-m4v', 'video/ogg'];
  const mimeType = req.file.mimetype;

  if (!allowedMimeTypes.includes(mimeType)) {
    return res.status(400).json({ error: 'Tipo de archivo no compatible. Solo se permiten archivos de video.' });
  }

  try {
    const bucket = getGridFSBucket();
    const uploadStream = bucket.openUploadStream(title);

    uploadStream.end(videoData);

    uploadStream.on('finish', async () => {
      console.log("Uploaded video ID:", uploadStream.id);
      const videoId = uploadStream.id;
      const videoUrl = `${req.protocol}://${req.get('host')}/api/videos/${videoId}`;

      const savedVideo = await saveVideoUrl(title, description, videoUrl, publication_date);
      res.status(201).json({ message: 'Video subido exitosamente', video: savedVideo });
    });

    uploadStream.on('error', (error) => {
      console.error("Error en upload stream:", error);
      res.status(500).json({ error: 'Error al subir el video a MongoDB', details: error.message });
    });
  } catch (error) {
    console.error("Error general al subir el video:", error);
    res.status(500).json({ error: 'Error interno al procesar el video', details: error.message });
  }
};

const fetchVideos = async (req, res) => {
  try {
    const videos = await getVideos();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeVideo = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deleteVideo(id);
    res.status(200).json({ message: 'Video eliminado exitosamente', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadVideo, fetchVideos, removeVideo};