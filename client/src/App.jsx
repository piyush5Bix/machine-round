import { useEffect, useState } from 'react';
import { api } from './api.js';
import PostForm from './components/PostForm.jsx';
import PostItem from './components/PostItem.jsx';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api
      .list({ page: 1, limit: 500 })
      .then((res) => {
        setPosts(res.data);
        setTotal(res.total);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(values) {
    const created = await api.create(values);
    setPosts([created, ...posts]);
    setTotal(total + 1);
  }

  async function handleUpdate(values) {
    const updated = await api.update(editing.id, values);
    setPosts(posts.map((p) => (p.id === updated.id ? updated : p)));
    setEditing(null);
  }

  async function handleDelete(id) {
    await api.remove(id);
    setPosts(posts.filter((p) => p.id !== id));
    setTotal(total - 1);
  }

  async function handleLike(post) {
    const updated = await api.like(post.id);
    post.likes = updated.likes;
    setPosts(posts);
  }

  const visible = posts.filter((p) =>
    (p.title + p.body).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="app">
      <header className="bar">
        <h1>Posts</h1>
        <span className="metric">
          {visible.length} / {total}
        </span>
      </header>

      <section className="panel">
        <h2>{editing ? `Edit #${editing.id}` : 'New post'}</h2>
        <PostForm
          initial={editing}
          onSubmit={editing ? handleUpdate : handleCreate}
          onCancel={editing ? () => setEditing(null) : undefined}
        />
      </section>

      <input
        className="input search"
        placeholder="Filter posts…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p className="dim">Loading…</p>}
      {error && <p className="hot">{error}</p>}

      <ul className="list">
        {visible.map((post, i) => (
          <PostItem
            key={i}
            post={post}
            onEdit={() => setEditing(post)}
            onDelete={() => handleDelete(post.id)}
            onLike={() => handleLike(post)}
          />
        ))}
      </ul>
    </main>
  );
}
