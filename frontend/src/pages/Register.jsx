import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import {
  RiQuillPenLine, RiUser3Line, RiMailLine, RiLockLine,
  RiEyeLine, RiEyeOffLine, RiArrowRightLine, RiLoaderLine,
  RiCheckLine,
} from 'react-icons/ri'

const passwordRules = [
  { test: (p) => p.length >= 8, label: 'At least 8 characters' },
  { test: (p) => /[A-Z]/.test(p), label: 'One uppercase letter' },
  { test: (p) => /[a-z]/.test(p), label: 'One lowercase letter' },
  { test: (p) => /\d/.test(p), label: 'One number' },
  { test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p), label: 'One special character' },
]

export default function Register() {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [pwdFocused, setPwdFocused] = useState(false)

  if (isAuthenticated) {
    navigate('/', { replace: true })
    return null
  }

  const validate = () => {
    const e = {}
    if (!form.username.trim()) e.username = 'Username is required'
    else if (!/^[A-Za-z]{2,50}$/.test(form.username.trim())) e.username = 'Username: 2-50 letters only'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Enter a valid email'
    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,64}$/
    if (!form.password) e.password = 'Password is required'
    else if (!pwdRegex.test(form.password)) e.password = 'Password does not meet requirements'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      await register(form.username.trim(), form.email.trim(), form.password)
      toast.success('Account created! Please verify your email.')
      navigate(`/verify-otp?email=${encodeURIComponent(form.email.trim())}`)
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors((er) => ({ ...er, [field]: '' }))
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-brand-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 items-center justify-center mb-4 shadow-glow">
            <RiQuillPenLine className="text-2xl text-white" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-slate-100 mb-2">Join Blogify</h1>
          <p className="text-slate-500">Create your account and start sharing</p>
        </div>

        <div className="card p-8 shadow-card">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Username */}
            <div>
              <label className="input-label" htmlFor="reg-username">Username</label>
              <div className="relative">
                <RiUser3Line className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="reg-username"
                  type="text"
                  autoComplete="username"
                  placeholder="yourname"
                  value={form.username}
                  onChange={handleChange('username')}
                  className={`input-field pl-10 ${errors.username ? 'border-red-500 focus:border-red-500' : ''}`}
                />
              </div>
              {errors.username && <p className="text-red-400 text-xs mt-1.5">{errors.username}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="input-label" htmlFor="reg-email">Email</label>
              <div className="relative">
                <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange('email')}
                  className={`input-field pl-10 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="input-label" htmlFor="reg-password">Password</label>
              <div className="relative">
                <RiLockLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="reg-password"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={handleChange('password')}
                  onFocus={() => setPwdFocused(true)}
                  onBlur={() => setPwdFocused(false)}
                  className={`input-field pl-10 pr-11 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
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

              {/* Password strength checklist */}
              {(pwdFocused || form.password) && (
                <div className="mt-3 p-3 rounded-xl bg-surface-800/60 border border-slate-700 space-y-1.5 animate-fade-in">
                  {passwordRules.map((rule, i) => {
                    const passed = rule.test(form.password)
                    return (
                      <div key={i} className={`flex items-center gap-2 text-xs transition-colors ${passed ? 'text-emerald-400' : 'text-slate-500'}`}>
                        <RiCheckLine className={`flex-shrink-0 ${passed ? 'opacity-100' : 'opacity-30'}`} />
                        {rule.label}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base mt-2"
            >
              {loading ? (
                <><RiLoaderLine className="animate-spin" /> Creating account...</>
              ) : (
                <>Create Account <RiArrowRightLine /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
