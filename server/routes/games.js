const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

router.get('/', (req, res) => {
  try {
    const { category, search, featured, limit = 50, offset = 0 } = req.query;
    let query = 'SELECT * FROM games WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (featured === 'true') {
      query += ' AND is_featured = 1';
    }

    query += ' ORDER BY is_featured DESC, plays DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const games = db.prepare(query).all(params);
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/categories', (req, res) => {
  try {
    const rows = db.prepare('SELECT category, COUNT(*) AS count FROM games GROUP BY category ORDER BY count DESC').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const game = db.prepare('SELECT * FROM games WHERE id = ?').get(req.params.id);
    if (!game) return res.status(404).json({ error: 'Oyun bulunamadı' });
    res.json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/play', authenticate, (req, res) => {
  try {
    const game = db.prepare('SELECT * FROM games WHERE id = ?').get(req.params.id);
    if (!game) return res.status(404).json({ error: 'Oyun bulunamadı' });
    db.prepare('UPDATE games SET plays = plays + 1 WHERE id = ?').run(req.params.id);
    res.json({ success: true, embed_url: game.embed_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/like', authenticate, (req, res) => {
  try {
    const game = db.prepare('SELECT * FROM games WHERE id = ?').get(req.params.id);
    if (!game) return res.status(404).json({ error: 'Oyun bulunamadı' });

    const existing = db.prepare('SELECT * FROM game_likes WHERE user_id = ? AND game_id = ?').get(req.user.id, req.params.id);
    if (existing) {
      db.prepare('DELETE FROM game_likes WHERE user_id = ? AND game_id = ?').run(req.user.id, req.params.id);
      db.prepare('UPDATE games SET likes = likes - 1 WHERE id = ?').run(req.params.id);
      return res.json({ liked: false });
    }

    db.prepare('INSERT INTO game_likes (user_id, game_id) VALUES (?, ?)').run(req.user.id, req.params.id);
    db.prepare('UPDATE games SET likes = likes + 1 WHERE id = ?').run(req.params.id);
    res.json({ liked: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/like/status', authenticate, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM game_likes WHERE user_id = ? AND game_id = ?').get(req.user.id, req.params.id);
    res.json({ liked: !!existing });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;