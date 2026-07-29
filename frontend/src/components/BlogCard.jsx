import { Link } from 'react-router-dom'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { RiHeartLine, RiHeartFill, RiBookmarkLine, RiBookmarkFill, RiUser3Line, RiCalendarLine, RiArrowRightLine } from 'react-icons/ri'
import { useAuth } from '../context/AuthContext'
import { blogAPI } from '../api/blog.api'
import toast from 'react-hot-toast'

const BACKEND_URL = 'http://localhost:8004'

export default function BlogCard({ blog, onUpdate }) {
  const { isAuthenticated } = useAuth()
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(blog?.likes?.length ?? 0)
  const [loadingLike, setLoadingLike] = useState(false)
  const [loadingBookmark, setLoadingBookmark] = useState(false)

  const handleLike = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Sign in to like posts')
      return
    }
    setLoadingLike(true)
    try {
      if (liked) {
        await blogAPI.unlike(blog._id)
        setLikeCount((c) => c - 1)
        setLiked(false)
      } else {
        await blogAPI.like(blog._id)
        setLikeCount((c) => c + 1)
        setLiked(true)
      }
    } catch {
      toast.error('Could not update like')
    } finally {
      setLoadingLike(false)
    }
  }

  const handleBookmark = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Sign in to bookmark posts')
      return
    }
    setLoadingBookmark(true)
    try {
      if (bookmarked) {
        await blogAPI.unbookmark(blog._id)
        setBookmarked(false)
        toast.success('Bookmark removed')
      } else {
        await blogAPI.bookmark(blog._id)
        setBookmarked(true)
        toast.success('Bookmarked!')
      }
    } catch {
      toast.error('Could not update bookmark')
    } finally {
      setLoadingBookmark(false)
    }
  }

  const imageUrl = blog?.coverImageURL
    ? `${BACKEND_URL}${blog.coverImageURL}`
    : null

  const timeAgo = blog?.createdAt
    ? formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })
    : ''

  const excerpt = blog?.body?.substring(0, 160) + (blog?.body?.length > 160 ? '...' : '')
  const author = typeof blog?.createdBy === 'object' ? blog.createdBy?.username : 'Anonymous'

  return (
    <article className="card-hover group overflow-hidden animate-fade-in">
      <Link to={`/blog/${blog._id}`} className="block">
        {/* Cover Image */}
        <div className="relative h-48 bg-gradient-to-br from-brand-900/50 to-surface-800 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={blog.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-900/30 via-surface-800 to-violet-900/30">
              <span className="text-5xl font-heading font-bold text-brand-600/30">
                {blog?.title?.[0]?.toUpperCase() || 'B'}
              </span>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-900/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center">
                <RiUser3Line className="text-white text-[10px]" />
              </div>
              <span className="text-slate-400 font-medium">{author}</span>
            </span>
            <span className="text-slate-700">·</span>
            <span className="flex items-center gap-1">
              <RiCalendarLine />
              {timeAgo}
            </span>
          </div>

          {/* Title */}
          <h2 className="font-heading font-bold text-lg text-slate-100 mb-2 leading-tight group-hover:text-brand-400 transition-colors line-clamp-2">
            {blog.title}
          </h2>

          {/* Excerpt */}
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-4">
            {excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <span className="text-xs text-brand-400 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
              Read more <RiArrowRightLine />
            </span>
            <div className="flex items-center gap-3">
              {/* Like */}
              <button
                onClick={handleLike}
                disabled={loadingLike}
                className={`flex items-center gap-1.5 text-sm transition-all hover:scale-110 active:scale-95 ${
                  liked ? 'text-red-400' : 'text-slate-500 hover:text-red-400'
                }`}
              >
                {liked ? <RiHeartFill /> : <RiHeartLine />}
                <span className="text-xs">{likeCount}</span>
              </button>
              {/* Bookmark */}
              <button
                onClick={handleBookmark}
                disabled={loadingBookmark}
                className={`text-lg transition-all hover:scale-110 active:scale-95 ${
                  bookmarked ? 'text-brand-400' : 'text-slate-500 hover:text-brand-400'
                }`}
              >
                {bookmarked ? <RiBookmarkFill /> : <RiBookmarkLine />}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
