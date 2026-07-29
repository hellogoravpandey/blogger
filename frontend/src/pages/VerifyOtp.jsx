import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { RiMailCheckLine, RiLoaderLine, RiArrowLeftLine, RiRefreshLine } from 'react-icons/ri'

const OTP_LENGTH = 6
const RESEND_COOLDOWN = 60

export default function VerifyOtp() {
  const { verifyOtp, sendOtp } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const email = params.get('email') || ''

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''))
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const inputRefs = useRef([])

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const next = [...otp]
    next[index] = value.slice(-1)
    setOtp(next)
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    const next = [...otp]
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i]
    setOtp(next)
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < OTP_LENGTH) {
      toast.error('Please enter the full 6-digit OTP')
      return
    }
    setLoading(true)
    try {
      await verifyOtp(email, code)
      toast.success('Email verified! You can now sign in. 🎉')
      navigate('/login')
    } catch (err) {
      const msg = err.response?.data?.message || 'Verification failed'
      toast.error(msg)
      setOtp(Array(OTP_LENGTH).fill(''))
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email || cooldown > 0) return
    setResending(true)
    try {
      await sendOtp(email)
      toast.success('OTP resent! Check your inbox.')
      setCooldown(RESEND_COOLDOWN)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to resend OTP'
      toast.error(msg)
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4 relative">
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-brand-600/8 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-brand-600 items-center justify-center mb-4 shadow-glow">
            <RiMailCheckLine className="text-3xl text-white" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-slate-100 mb-2">Verify your email</h1>
          <p className="text-slate-500 max-w-xs mx-auto">
            We sent a 6-digit code to{' '}
            <span className="text-brand-400 font-medium break-all">{email || 'your email'}</span>
          </p>
        </div>

        <div className="card p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP inputs */}
            <div>
              <label className="input-label text-center block mb-4">Enter your OTP</label>
              <div className="flex justify-center gap-3" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    id={`otp-digit-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className={`w-12 h-14 text-center text-xl font-bold rounded-xl border
                      bg-surface-900 text-slate-100 transition-all duration-200 outline-none
                      ${digit
                        ? 'border-brand-500 ring-2 ring-brand-500/20 text-brand-300'
                        : 'border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              id="otp-submit"
              type="submit"
              disabled={loading || otp.join('').length < OTP_LENGTH}
              className="btn-primary w-full py-3 text-base"
            >
              {loading ? (
                <><RiLoaderLine className="animate-spin" /> Verifying...</>
              ) : (
                'Verify Email'
              )}
            </button>
          </form>

          {/* Resend */}
          <div className="text-center mt-5">
            <p className="text-sm text-slate-500">
              Didn't receive the code?{' '}
              {cooldown > 0 ? (
                <span className="text-slate-400">Resend in {cooldown}s</span>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="text-brand-400 hover:text-brand-300 font-medium transition-colors inline-flex items-center gap-1"
                >
                  {resending ? <RiLoaderLine className="animate-spin" /> : <RiRefreshLine />}
                  Resend OTP
                </button>
              )}
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/register" className="text-sm text-slate-500 hover:text-slate-300 flex items-center justify-center gap-1 transition-colors">
              <RiArrowLeftLine /> Back to register
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
