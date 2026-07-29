import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { blogAPI } from '../api/blog.api'
import { useAuth } from '../context/AuthContext'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'
import {
  RiQuillPenLine, RiLoaderLine, RiEditLine, RiDeleteBinLine,
  RiEyeLine, RiEyeOffLine, RiAddLine, RiUser3Line,
} from 'react-icons/ri'

export default function Dashboard() {
  const { user } = useAuth()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [togglingId, setTogglingId] = useState(null)

  const fetchBlogs = async () => {
    setLoading(true)
    try {
      const res = await blogAPI.getAll()
      // Filter blogs created by the current user
      const myBlogs = (res.data.blogs || []).filter((b) => {
        const creatorId = typeof b.createdBy === 'object' ? b.createdBy?._id : b.createdBy
        return creatorId === user?.user_id
      })
      setBlogs(myBlogs)
    } catch {
      toast.error('Could not load your blogs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this blog permanently?')) return
    setDeletingId(id)
    try {
      await blogAPI.delete(id)
      toast.success('Blog deleted')
      setBlogs((b) => b.filter((blog) => blog._id !== id))
    } catch {
      toast.error('Could not delete blog')
    } finally {
      setDeletingId(null)
    }
  }

  const handleTogglePublish = async (blog) => {
    const isPublished = blog.status === 'published'
    setTogglingId(blog._id)
    try {
      if (isPublished) {
        await blogAPI.unpublish(blog._id)
        toast.success('Moved to draft')
      } else {
        await blogAPI.publish(blog._id)
        toast.success('Published!')
      }
      await fetchBlogs()
    } catch {
      toast.error('Could not update blog status')
    } finally {
      setTogglingId(null)
    }
  }

  const stats = {
    total: blogs.length,
    published: blogs.filter((b) => b.status === 'published').length,
    drafts: blogs.filter((b) => b.status !== 'published').length,
    likes: blogs.reduce((acc, b) => acc + (b.likes?.length ?? 0), 0),
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="page-container py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center shadow-glow">
              <RiUser3Line className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-slate-100">
                My Dashboard
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">Manage your stories</p>
            </div>
          </div>
          <Link to="/create" className="btn-primary">
            <RiAddLine className="text-lg" /> New Blog
          </Link>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Posts', value: stats.total, color: 'from-brand-600 to-violet-600' },
            { label: 'Published', value: stats.published, color: 'from-emerald-600 to-teal-600' },
            { label: 'Drafts', value: stats.drafts, color: 'from-amber-600 to-orange-600' },
            { label: 'Total Likes', value: stats.likes, color: 'from-red-600 to-pink-600' },
          ].map((s) => (
            <div key={s.label} className="card p-5 animate-fade-in">
              <div className={`text-3xl font-heading font-extrabold bg-gradient-to-r ${s.color} bg-clip-text text-transparent mb-1`}>
                {s.value}
              </div>
              <div className="text-sm text-slate-500 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Blog list */}
        <div>
          <h2 className="section-title mb-4">Your Stories</h2>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <RiLoaderLine className="text-brand-400 text-3xl animate-spin" />
            </div>
          )}

          {!loading && blogs.length === 0 && (
            <div className="card p-12 text-center animate-fade-in">
              <RiQuillPenLine className="text-5xl text-brand-600/40 mx-auto mb-4" />
              <h3 className="font-heading text-xl font-bold text-slate-300 mb-2">No stories yet</h3>
              <p className="text-slate-500 mb-6">Start writing your first blog post</p>
              <Link to="/create" className="btn-primary">
                <RiAddLine /> Write your first blog
              </Link>
            </div>
          )}

          {!loading && blogs.length > 0 && (
            <div className="space-y-4">
              {blogs.map((blog) => (
                <div key={blog._id} className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-slate-700 transition-all animate-fade-in">
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={blog.status === 'published' ? 'badge-published' : 'badge-draft'}>
                        {blog.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <h3 className="font-heading font-semibold text-slate-100 truncate">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {blog.createdAt ? formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true }) : ''}
                      {' · '}
                      {blog.likes?.length ?? 0} likes
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link to={`/blog/${blog._id}`} className="btn-ghost text-sm py-1.5 px-3">
                      <RiEyeLine /> View
                    </Link>
                    <Link to={`/edit/${blog._id}`} className="btn-secondary text-sm py-1.5 px-3">
                      <RiEditLine /> Edit
                    </Link>
                    <button
                      onClick={() => handleTogglePublish(blog)}
                      disabled={togglingId === blog._id}
                      className={`text-sm py-1.5 px-3 rounded-xl border font-semibold flex items-center gap-1.5 transition-all ${
                        blog.status === 'published'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                      }`}
                    >
                      {togglingId === blog._id ? (
                        <RiLoaderLine className="animate-spin" />
                      ) : blog.status === 'published' ? (
                        <><RiEyeOffLine /> Unpublish</>
                      ) : (
                        <><RiEyeLine /> Publish</>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      disabled={deletingId === blog._id}
                      className="btn-danger text-sm py-1.5 px-3"
                    >
                      {deletingId === blog._id
                        ? <RiLoaderLine className="animate-spin" />
                        : <RiDeleteBinLine />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
