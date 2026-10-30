import { useState } from 'react';

export default function PostForm({ initial, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [body, setBody] = useState(initial?.body ?? '');
  const [author, setAuthor] = useState(initial?.author ?? '');
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    try {
      await onSubmit({ title, body, author: author || undefined });
      if (!initial) {
        setTitle('');
        setBody('');
        setAuthor('');
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="input" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
      <textarea className="input" rows={3} placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} />
      {error && <p className="hot">{error}</p>}
      <div className="row">
        <button className="btn" type="submit">{initial ? 'Save' : 'Create'}</button>
        {onCancel && (
          <button className="btn" type="button" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
}
