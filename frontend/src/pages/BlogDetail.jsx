import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { blogAPI } from '../api/blog.api'
import { useAuth } from '../context/AuthContext'
import { formatDistanceToNow, format } from 'date-fns'
import toast from 'react-hot-toast'
import {
  RiUser3Line, RiCalendarLine, RiHeartLine, RiHeartFill,
  RiBookmarkLine, RiBookmarkFill, RiArrowLeftLine, RiLoaderLine,
  RiSendPlaneLine, RiEditLine, RiDeleteBinLine,
} from 'react-icons/ri'

const BACKEND_URL = 'http://localhost:3000'

export default function BlogDetail() {
  const { id } = useParams()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [comment, setComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true)
      try {
        const res = await blogAPI.getById(id)
        const b = res.data.blog
        setBlog(b)
        setLikeCount(b?.likes?.length ?? 0)
        if (user && b?.likes?.includes(user.user_id)) setLiked(true)
      } catch {
        setError('Could not load this blog post.')
      } finally {
        setLoading(false)
      }
    }
    fetchBlog()
  }, [id, user])

  const handleLike = async () => {
    if (!isAuthenticated) { toast.error('Sign in to like posts'); return }
    try {
      if (liked) {
        await blogAPI.unlike(id)
        setLikeCount((c) => c - 1)
        setLiked(false)
      } else {
        await blogAPI.like(id)
        setLikeCount((c) => c + 1)
        setLiked(true)
      }
    } catch { toast.error('Could not update like') }
  }

  const handleBookmark = async () => {
    if (!isAuthenticated) { toast.error('Sign in to bookmark'); return }
    try {
      if (bookmarked) {
        await blogAPI.unbookmark(id)
        setBookmarked(false)
        toast.success('Bookmark removed')
      } else {
        await blogAPI.bookmark(id)
        setBookmarked(true)
        toast.success('Bookmarked!')
      }
    } catch { toast.error('Could not update bookmark') }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog?')) return
    setDeleting(true)
    try {
      await blogAPI.delete(id)
      toast.success('Blog deleted')
      navigate('/dashboard')
    } catch { toast.error('Could not delete blog') }
    finally { setDeleting(false) }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) { toast.error('Sign in to comment'); return }
    if (!comment.trim()) return
    setSubmittingComment(true)
    try {
      await blogAPI.addComment(id, comment.trim())
      toast.success('Comment added!')
      setComment('')
    } catch { toast.error('Could not add comment') }
    finally { setSubmittingComment(false) }
  }

  const isOwner = user && blog && (
    user.user_id === blog.createdBy?._id ||
    user.user_id === blog.createdBy
  )

  const imageUrl = blog?.coverImageURL ? `${BACKEND_URL}${blog.coverImageURL}` : null
  const author = typeof blog?.createdBy === 'object' ? blog.createdBy?.username : 'Anonymous'

  // Loading state
  if (loading) return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <RiLoaderLine className="text-brand-400 text-4xl animate-spin" />
    </div>
  )

  // Error state
  if (error) return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="font-heading text-xl font-bold text-slate-300 mb-2">Post not found</h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    </div>
  )

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero cover */}
      <div className="relative h-72 md:h-96 w-full overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={blog.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-900/40 via-surface-850 to-violet-900/40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/50 to-transparent" />
      </div>

      <div className="page-container max-w-3xl -mt-20 relative pb-20">
        {/* Back */}
        <Link to="/" className="btn-ghost inline-flex mb-6 text-sm">
          <RiArrowLeftLine /> Back to feed
        </Link>

        {/* Title card */}
        <div className="card p-8 mb-6 animate-slide-up">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mb-4">
            <span className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center">
                <RiUser3Line className="text-white text-xs" />
              </div>
              <span className="text-slate-300 font-medium">{author}</span>
            </span>
            <span className="text-slate-700">·</span>
            <span className="flex items-center gap-1">
              <RiCalendarLine />
              {blog?.createdAt ? format(new Date(blog.createdAt), 'MMM d, yyyy') : ''}
            </span>
            <span className="text-slate-700">·</span>
            <span>{blog?.createdAt ? formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true }) : ''}</span>
          </div>

          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-slate-100 mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Action bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 text-sm font-medium transition-all hover:scale-105 active:scale-95 ${
                  liked ? 'text-red-400' : 'text-slate-500 hover:text-red-400'
                }`}
              >
                {liked ? <RiHeartFill className="text-lg" /> : <RiHeartLine className="text-lg" />}
                {likeCount} {likeCount === 1 ? 'like' : 'likes'}
              </button>
              <button
                onClick={handleBookmark}
                className={`flex items-center gap-2 text-sm font-medium transition-all hover:scale-105 active:scale-95 ${
                  bookmarked ? 'text-brand-400' : 'text-slate-500 hover:text-brand-400'
                }`}
              >
                {bookmarked ? <RiBookmarkFill className="text-lg" /> : <RiBookmarkLine className="text-lg" />}
                {bookmarked ? 'Saved' : 'Save'}
              </button>
            </div>

            {/* Owner actions */}
            {isOwner && (
              <div className="flex items-center gap-2">
                <Link to={`/edit/${blog._id}`} className="btn-secondary text-sm py-1.5 px-3">
                  <RiEditLine /> Edit
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="btn-danger text-sm py-1.5 px-3"
                >
                  {deleting ? <RiLoaderLine className="animate-spin" /> : <RiDeleteBinLine />}
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="card p-8 mb-6 animate-fade-in">
          <div className="blog-content">
            {blog.body?.split('\n').map((para, i) => (
              para.trim() ? <p key={i}>{para}</p> : <br key={i} />
            ))}
          </div>
        </div>

        {/* Comment section */}
        <div className="card p-6 animate-fade-in">
          <h3 className="font-heading font-bold text-lg text-slate-100 mb-4">Leave a comment</h3>
          {isAuthenticated ? (
            <form onSubmit={handleComment} className="flex gap-3">
              <input
                id="comment-input"
                type="text"
                placeholder="Share your thoughts..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="input-field flex-1"
              />
              <button
                id="comment-submit"
                type="submit"
                disabled={submittingComment || !comment.trim()}
                className="btn-primary px-4"
              >
                {submittingComment
                  ? <RiLoaderLine className="animate-spin" />
                  : <RiSendPlaneLine />}
              </button>
            </form>
          ) : (
            <p className="text-slate-500 text-sm">
              <Link to="/login" className="text-brand-400 hover:text-brand-300">Sign in</Link> to leave a comment.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
