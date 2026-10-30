import db from './db.js';

const count = Number(process.argv[2]) || 25;
const authors = ['alice', 'bob', 'carol', 'dave', 'erin', 'frank'];
const words = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'.split(' ');
const sentence = (n) => Array.from({ length: n }, () => words[Math.floor(Math.random() * words.length)]).join(' ');

db.exec('DELETE FROM posts');
const insert = db.prepare(
  'INSERT INTO posts (title, body, author, likes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
);

const now = Date.now();
db.transaction(() => {
  for (let i = 0; i < count; i++) {
    const ts = new Date(now - i * 60_000).toISOString().replace('T', ' ').slice(0, 19);
    insert.run(`Post #${i + 1}: ${sentence(4)}`, sentence(60), authors[i % authors.length], i % 17, ts, ts);
  }
})();

console.log(`Seeded ${count} posts`);
