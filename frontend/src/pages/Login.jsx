import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { RiQuillPenLine, RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine, RiArrowRightLine, RiLoaderLine } from 'react-icons/ri'

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/', { replace: true })
    return null
  }

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      await login(form.email.trim(), form.password)
      toast.success('Welcome back! 👋')
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      if (msg.includes('verification')) {
        toast.error('Email not verified. Check your inbox.')
        navigate(`/verify-otp?email=${encodeURIComponent(form.email)}`)
      } else {
        toast.error(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors((er) => ({ ...er, [field]: '' }))
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4 relative">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 items-center justify-center mb-4 shadow-glow">
            <RiQuillPenLine className="text-2xl text-white" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-slate-100 mb-2">Welcome back</h1>
          <p className="text-slate-500">Sign in to continue to Blogify</p>
        </div>

        {/* Form Card */}
        <div className="card p-8 shadow-card">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label className="input-label" htmlFor="login-email">Email</label>
              <div className="relative">
                <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange('email')}
                  className={`input-field pl-10 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="input-label" htmlFor="login-password">Password</label>
              <div className="relative">
                <RiLockLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="login-password"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Your password"
                  value={form.password}
                  onChange={handleChange('password')}
                  className={`input-field pl-10 pr-11 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPwd ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base mt-2"
            >
              {loading ? (
                <>
                  <RiLoaderLine className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <RiArrowRightLine />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
