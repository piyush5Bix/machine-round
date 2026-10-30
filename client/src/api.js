async function request(path, options) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed (${res.status})`);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  list: (params = {}) => request(`/posts?${new URLSearchParams(params)}`),
  get: (id) => request(`/posts/${id}`),
  create: (post) => request('/posts', { method: 'POST', body: JSON.stringify(post) }),
  update: (id, post) => request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(post) }),
  like: (id) => request(`/posts/${id}/like`, { method: 'PATCH' }),
  remove: (id) => request(`/posts/${id}`, { method: 'DELETE' }),
};
