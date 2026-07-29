import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { blogAPI } from '../api/blog.api'
import toast from 'react-hot-toast'
import { RiLoaderLine, RiArrowLeftLine, RiSaveLine } from 'react-icons/ri'

export default function EditBlog() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', body: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await blogAPI.getById(id)
        const blog = res.data.blog
        setForm({ title: blog.title || '', body: blog.body || '' })
      } catch {
        toast.error('Could not load blog for editing')
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchBlog()
  }, [id])

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.body.trim()) e.body = 'Content is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSaving(true)
    try {
      await blogAPI.update(id, { title: form.title.trim(), body: form.body.trim() })
      toast.success('Blog updated successfully!')
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update blog'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const wordCount = form.body.trim().split(/\s+/).filter(Boolean).length

  if (loading) return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <RiLoaderLine className="text-brand-400 text-4xl animate-spin" />
    </div>
  )

  return (
    <div className="pt-16 min-h-screen">
      <div className="page-container max-w-3xl py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="btn-ghost p-2">
            <RiArrowLeftLine className="text-xl" />
          </Link>
          <div>
            <h1 className="font-heading text-2xl font-bold text-slate-100">Edit Story</h1>
            <p className="text-slate-500 text-sm">Make changes and save</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card p-6 space-y-5">
            {/* Title */}
            <div>
              <label className="input-label" htmlFor="edit-title">Title *</label>
              <input
                id="edit-title"
                type="text"
                value={form.title}
                onChange={(e) => { setForm((f) => ({ ...f, title: e.target.value })); setErrors((er) => ({ ...er, title: '' })) }}
                className={`input-field text-lg font-medium ${errors.title ? 'border-red-500' : ''}`}
                placeholder="Your story title..."
              />
              {errors.title && <p className="text-red-400 text-xs mt-1.5">{errors.title}</p>}
            </div>

            {/* Body */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="input-label" htmlFor="edit-body">Content *</label>
                <span className="text-xs text-slate-500">{wordCount} words</span>
              </div>
              <textarea
                id="edit-body"
                rows={20}
                value={form.body}
                onChange={(e) => { setForm((f) => ({ ...f, body: e.target.value })); setErrors((er) => ({ ...er, body: '' })) }}
                className={`input-field resize-none leading-relaxed ${errors.body ? 'border-red-500' : ''}`}
                placeholder="Write your content..."
              />
              {errors.body && <p className="text-red-400 text-xs mt-1.5">{errors.body}</p>}
            </div>
          </div>

          {/* Note about cover image */}
          <div className="card p-4 border-amber-800/30 bg-amber-900/10">
            <p className="text-amber-400 text-sm">
              ℹ️ Cover image cannot be changed after creation. To change it, delete and recreate the blog.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              id="edit-blog-save"
              type="submit"
              disabled={saving}
              className="btn-primary py-3 px-8 text-base"
            >
              {saving ? (
                <><RiLoaderLine className="animate-spin" /> Saving...</>
              ) : (
                <><RiSaveLine /> Save Changes</>
              )}
            </button>
            <Link to="/dashboard" className="btn-secondary py-3 px-6">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
