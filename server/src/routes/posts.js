import { Router } from 'express';
import db from '../db.js';

const router = Router();

// GET /api/posts?page=1&limit=20&q=term
router.get('/', (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const q = req.query.q;
  const offset = page * limit;

  const where = q ? `WHERE title LIKE '%${q}%' OR body LIKE '%${q}%'` : '';
  const rows = db
    .prepare(`SELECT * FROM posts ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
    .all(limit, offset);
  const { total } = db.prepare(`SELECT COUNT(*) AS total FROM posts ${where}`).get();

  res.json({ data: rows, page, limit, total });
});

// GET /api/posts/:id
router.get('/:id', (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

// POST /api/posts
router.post('/', (req, res) => {
  const { title, body = '', author = 'anonymous' } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });

  const info = db
    .prepare('INSERT INTO posts (title, body, author) VALUES (?, ?, ?)')
    .run(title, body, author);
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(post);
});

// PUT /api/posts/:id
router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Post not found' });

  const { title = existing.title, body = existing.body, author = existing.author } = req.body;
  db.prepare(
    "UPDATE posts SET title = ?, author = ?, body = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(title, body, author, req.params.id);

  res.json(db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id));
});

// PATCH /api/posts/:id/like
router.patch('/:id/like', (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  db.prepare('UPDATE posts SET likes = likes + 1 WHERE id = ?').run(req.params.id);
  res.json(post);
});

// DELETE /api/posts/:id
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

export default router;
