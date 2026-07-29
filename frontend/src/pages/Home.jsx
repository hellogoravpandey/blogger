import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { blogAPI } from '../api/blog.api'
import BlogCard from '../components/BlogCard'
import SkeletonCard from '../components/SkeletonCard'
import { RiFlashlightLine, RiSearchLine, RiRefreshLine } from 'react-icons/ri'

export default function Home() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  const fetchBlogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await blogAPI.getAll()
      setBlogs(res.data.blogs || [])
    } catch (err) {
      setError('Failed to load blogs. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  const filtered = blogs.filter((b) =>
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    (typeof b.createdBy === 'object' && b.createdBy?.username?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* Background blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="page-container relative text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 text-sm font-medium mb-6">
            <RiFlashlightLine className="animate-pulse-slow" />
            Your next favourite read is here
          </div>
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            Ideas worth{' '}
            <span className="gradient-text">sharing</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover stories, ideas, and expertise from writers on any topic. A place to read,
            write, and deepen your understanding.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="btn-primary text-base py-3 px-8">
              Start writing free
            </Link>
            <a href="#feed" className="btn-secondary text-base py-3 px-8">
              Explore stories
            </a>
          </div>
        </div>
      </section>

      {/* Feed */}
      <section id="feed" className="page-container pb-20">
        {/* Search + header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="section-title">Latest Stories</h2>
            <p className="text-slate-500 text-sm mt-1">
              {loading ? 'Loading...' : `${filtered.length} article${filtered.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                id="search-blogs"
                type="text"
                placeholder="Search stories or authors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-9 py-2.5 text-sm"
              />
            </div>
            <button
              onClick={fetchBlogs}
              className="btn-secondary p-2.5"
              title="Refresh"
            >
              <RiRefreshLine className={`text-lg ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="card border-red-800/50 bg-red-900/10 p-6 text-center animate-fade-in">
            <p className="text-red-400 mb-3">{error}</p>
            <button onClick={fetchBlogs} className="btn-secondary text-sm">
              Try again
            </button>
          </div>
        )}

        {/* Skeletons */}
        {loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Blogs Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((blog) => (
              <BlogCard key={blog._id} blog={blog} onUpdate={fetchBlogs} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-6xl mb-4">✍️</div>
            <h3 className="font-heading text-xl font-bold text-slate-300 mb-2">
              {search ? 'No results found' : 'No stories yet'}
            </h3>
            <p className="text-slate-500 mb-6">
              {search
                ? `No blogs match "${search}"`
                : 'Be the first to share your story with the world.'}
            </p>
            <Link to="/create" className="btn-primary">
              Write the first blog
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
