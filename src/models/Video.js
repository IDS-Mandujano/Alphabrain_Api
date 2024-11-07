const { pool } = require('../config/db');

async function saveVideoUrl(title, description, videoUrl, publicationDate) {
  const result = await pool.query(
    'INSERT INTO videos (title, description, video_url, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, description, videoUrl, publicationDate || new Date()]
  );
  return result.rows[0];
}

async function updateVideo(id, title, description, videoUrl, created_at) {
  const result = await pool.query(
    `UPDATE videos 
     SET title = $1, description = $2, video_url = COALESCE($3, video_url), created_at = $4 
     WHERE id = $5 RETURNING *`,
    [title, description, videoUrl, created_at, id]
  );
  return result.rows[0];
}

async function deleteVideo(id) {
  await pool.query('DELETE FROM videos WHERE id = $1', [id]);
  return { message: 'Video eliminado exitosamente' };
}

async function getVideos() {
  const result = await pool.query('SELECT * FROM videos');
  return result.rows;
}

module.exports = { saveVideoUrl, updateVideo, deleteVideo, getVideos };