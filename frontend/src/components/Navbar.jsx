import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import {
  RiQuillPenLine,
  RiDashboardLine,
  RiLogoutBoxLine,
  RiMenuLine,
  RiCloseLine,
  RiUser3Line,
  RiHome4Line,
} from 'react-icons/ri'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  console.log("user ?? :: ", user);
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const navLinks = [
    { to: '/', icon: <RiHome4Line />, label: 'Home' },
    ...(isAuthenticated
      ? [
          { to: '/dashboard', icon: <RiDashboardLine />, label: 'Dashboard' },
        ]
      : []),
  ]

  const isActive = (path) => location.pathname === path

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow">
              <RiQuillPenLine className="text-white text-lg" />
            </div>
            <span className="font-heading font-bold text-xl gradient-text">Blogify</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(to)
                    ? 'text-brand-400 bg-brand-500/10 border border-brand-500/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-surface-800'
                }`}
              >
                {icon}
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/create" className="btn-primary text-sm py-2 px-4">
                  <RiQuillPenLine className="text-base" />
                  Write
                </Link>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-800 border border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center">
                    <RiUser3Line className="text-white text-xs" />
                  </div>
                  <span className="text-sm text-slate-300 font-medium max-w-[80px] truncate">
                    {user.user_id || 'user'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-ghost text-sm text-slate-400 hover:text-red-400"
                  title="Logout"
                >
                  <RiLogoutBoxLine className="text-base" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden btn-ghost p-2"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <RiCloseLine className="text-xl" /> : <RiMenuLine className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-slate-800 animate-slide-up">
          <div className="page-container py-4 flex flex-col gap-2">
            {navLinks.map(({ to, icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive(to)
                    ? 'text-brand-400 bg-brand-500/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-surface-800'
                }`}
              >
                {icon}
                {label}
              </Link>
            ))}
            <div className="border-t border-slate-800 pt-3 mt-1 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link to="/create" className="btn-primary text-sm justify-start">
                    <RiQuillPenLine />
                    Write a blog
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn-danger text-sm justify-start"
                  >
                    <RiLogoutBoxLine />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary text-sm">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary text-sm">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
