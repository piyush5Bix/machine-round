export default function PostItem({ post, onEdit, onDelete, onLike }) {
  return (
    <li className="card">
      <div className="card-head">
        <h3>{post.title}</h3>
        <span className="dim mono">
          #{post.id} · {post.author} · {post.created_at}
        </span>
      </div>
      <p>{post.body}</p>
      <div className="row">
        <button className="btn sm" onClick={onLike}>♥ {post.likes}</button>
        <button className="btn sm" onClick={onEdit}>Edit</button>
        <button className="btn sm hot-btn" onClick={onDelete}>Delete</button>
      </div>
    </li>
  );
}
