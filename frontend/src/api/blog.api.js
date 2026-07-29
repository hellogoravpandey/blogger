import api from './axios'

export const blogAPI = {
  getAll: () => api.get('/blogs'),

  getById: (id) => api.get(`/blogs/${id}`),

  create: (formData) =>
    api.post('/blogs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id, data) => api.patch(`/blogs/${id}`, data),

  delete: (id) => api.delete(`/blogs/${id}`),

  publish: (id) => api.patch(`/blogs/${id}/publish`, { id }),

  unpublish: (id) => api.patch(`/blogs/${id}/unpublish`, { id }),

  // Note: unlike has a bug in backend (maps to /unpublish) — using correct path anyway
  like: (id) => api.patch(`/blogs/${id}/like`),
  unlike: (id) => api.patch(`/blogs/${id}/unlike`),

  bookmark: (id) => api.patch(`/blogs/${id}/bookmark`),
  unbookmark: (id) => api.patch(`/blogs/${id}/unbookmark`),

  // Note: backend uses GET for comment (bug) — we call GET as defined
  addComment: (blogId, content) =>
    api.get(`/blogs/comment/${blogId}`, { params: {}, data: { content } }),
}
