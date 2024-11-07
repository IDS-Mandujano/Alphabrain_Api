const { saveVideoUrl, getVideos,updateVideo, deleteVideo } = require('../models/Video');
const { getGridFSBucket } = require('../config/dbMongo');

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

const editVideo = async (req, res) => {
  const { title, description } = req.body;
  const videoFile = req.file;

  if (!title) {
    return res.status(400).json({ error: 'El campo "title" es obligatorio.' });
  }

  try {
    if (videoFile) {

      const bucket = getGridFSBucket();
      const uploadStream = bucket.openUploadStream(title);
      uploadStream.end(videoFile.buffer);

      uploadStream.on('finish', async () => {
        const videoUrl = `${req.protocol}://${req.get('host')}/api/videos/${uploadStream.id}`;
        await updateVideo(req.params.id, title, description, videoUrl);
      });

      uploadStream.on('error', (error) => {
        console.error("Error al subir el video:", error);
        return res.status(500).json({ error: 'Error al subir el video', details: error.message });
      });
    } else {

      const updatedVideo = await updateVideo(req.params.id, title, description);
      if (!updatedVideo) {
        return res.status(404).json({ error: 'Video no encontrado' });
      }
      return res.status(200).json({ message: 'Video actualizado exitosamente', video: updatedVideo });
    }
  } catch (error) {
    console.error("Error al actualizar el video:", error);
    res.status(500).json({ error: 'Error al actualizar el video', details: error.message });
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

module.exports = { uploadVideo, fetchVideos,editVideo, removeVideo};