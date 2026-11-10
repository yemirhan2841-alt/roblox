const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

router.get('/profile/:id', (req, res) => {
  try {
    const user = db.prepare('SELECT id, username, avatar_url, robux, created_at FROM users WHERE id = ?').get(req.params.id);
    if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/friends', authenticate, (req, res) => {
  try {
    const friends = db.prepare(`
      SELECT u.id, u.username, u.avatar_url
      FROM friends f
      JOIN users u ON u.id = f.friend_id
      WHERE f.user_id = ?
    `).all(req.user.id);
    res.json(friends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/friends/:id', authenticate, (req, res) => {
  try {
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ error: 'Kendinizi arkadaş ekleyemezsiniz' });
    }
    const friend = db.prepare('SELECT id FROM users WHERE id = ?').get(req.params.id);
    if (!friend) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    try {
      db.prepare('INSERT INTO friends (user_id, friend_id) VALUES (?, ?)').run(req.user.id, req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: 'Zaten arkadaşsınız' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/messages', authenticate, (req, res) => {
  try {
    const messages = db.prepare(`
      SELECT m.id, m.text, m.created_at, u.username AS from_username
      FROM messages m
      JOIN users u ON u.id = m.from_id
      WHERE m.to_id = ?
      ORDER BY m.created_at DESC
      LIMIT 50
    `).all(req.user.id);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/messages', authenticate, (req, res) => {
  try {
    const { to_id, text } = req.body;
    if (!to_id || !text) return res.status(400).json({ error: 'Alıcı ve mesaj gerekli' });
    db.prepare('INSERT INTO messages (from_id, to_id, text) VALUES (?, ?, ?)').run(req.user.id, to_id, text);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;