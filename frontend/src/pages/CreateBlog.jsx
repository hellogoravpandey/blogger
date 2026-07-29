import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { blogAPI } from '../api/blog.api'
import toast from 'react-hot-toast'
import {
  RiUploadCloud2Line, RiCloseLine, RiLoaderLine,
  RiArrowLeftLine, RiImageLine,
} from 'react-icons/ri'

export default function CreateBlog() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [form, setForm] = useState({ title: '', body: '' })
  const [coverFile, setCoverFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [dragOver, setDragOver] = useState(false)

  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB')
      return
    }
    setCoverFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    else if (form.title.trim().length < 5) e.title = 'Title must be at least 5 characters'
    if (!form.body.trim()) e.body = 'Blog content is required'
    else if (form.body.trim().length < 20) e.body = 'Write at least 20 characters'
    if (!coverFile) e.cover = 'Cover image is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)

    const formData = new FormData()
    formData.append('title', form.title.trim())
    formData.append('body', form.body.trim())
    formData.append('coverImageURL', coverFile)

    try {
      await blogAPI.create(formData)
      toast.success('Blog created successfully! 🎉')
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create blog'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const wordCount = form.body.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="pt-16 min-h-screen">
      <div className="page-container max-w-3xl py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="btn-ghost p-2">
            <RiArrowLeftLine className="text-xl" />
          </Link>
          <div>
            <h1 className="font-heading text-2xl font-bold text-slate-100">Write a new story</h1>
            <p className="text-slate-500 text-sm">Share your ideas with the world</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          {/* Cover Image */}
          <div className="card p-6">
            <label className="input-label mb-3">Cover Image *</label>

            {preview ? (
              <div className="relative rounded-xl overflow-hidden h-52">
                <img src={preview} alt="cover preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => { setCoverFile(null); setPreview(null) }}
                    className="bg-surface-900/90 text-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium border border-slate-700 hover:border-red-500 hover:text-red-400 transition-all"
                  >
                    <RiCloseLine /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                className={`border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                  dragOver
                    ? 'border-brand-500 bg-brand-500/10'
                    : 'border-slate-700 hover:border-brand-500/60 hover:bg-surface-800/50'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${dragOver ? 'bg-brand-500/20 text-brand-400' : 'bg-surface-800 text-slate-500'}`}>
                  {dragOver ? <RiUploadCloud2Line className="text-2xl" /> : <RiImageLine className="text-2xl" />}
                </div>
                <div className="text-center">
                  <p className="text-slate-400 text-sm font-medium">
                    {dragOver ? 'Drop to upload' : 'Click or drag & drop'}
                  </p>
                  <p className="text-slate-600 text-xs mt-1">PNG, JPG, WEBP up to 5MB</p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              id="cover-image-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
            {errors.cover && <p className="text-red-400 text-xs mt-2">{errors.cover}</p>}
          </div>

          {/* Title */}
          <div className="card p-6 space-y-4">
            <div>
              <label className="input-label" htmlFor="blog-title">Title *</label>
              <input
                id="blog-title"
                type="text"
                placeholder="An eye-catching title for your story..."
                value={form.title}
                onChange={(e) => { setForm((f) => ({ ...f, title: e.target.value })); setErrors((er) => ({ ...er, title: '' })) }}
                className={`input-field text-lg font-medium ${errors.title ? 'border-red-500' : ''}`}
              />
              {errors.title && <p className="text-red-400 text-xs mt-1.5">{errors.title}</p>}
            </div>

            {/* Body */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="input-label" htmlFor="blog-body">Content *</label>
                <span className="text-xs text-slate-500">{wordCount} words</span>
              </div>
              <textarea
                id="blog-body"
                rows={18}
                placeholder="Tell your story... Write freely, edit later."
                value={form.body}
                onChange={(e) => { setForm((f) => ({ ...f, body: e.target.value })); setErrors((er) => ({ ...er, body: '' })) }}
                className={`input-field resize-none leading-relaxed ${errors.body ? 'border-red-500' : ''}`}
              />
              {errors.body && <p className="text-red-400 text-xs mt-1.5">{errors.body}</p>}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4">
            <button
              id="create-blog-submit"
              type="submit"
              disabled={loading}
              className="btn-primary py-3 px-8 text-base"
            >
              {loading ? (
                <><RiLoaderLine className="animate-spin" /> Publishing...</>
              ) : (
                'Publish Blog'
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
