import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')

    try {
      const user = await login(email.trim(), pin.trim())
      const dest =
        user.role === 'admin' ? '/admin'
        : user.role === 'secretary' ? '/secretary'
        : '/teacher'
      navigate(dest)
    } catch (err) {
      setError(err.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f2b3d] relative overflow-hidden px-4 py-8">
      {/* Background Glows */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#1a5f7a] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#00b4d8] blur-3xl" />
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-sm bg-white dark:bg-[#1b263b] rounded-2xl shadow-2xl p-6 sm:p-8 animate-fade-in-up border dark:border-[#2f3e52]">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#0f2b3d] flex items-center justify-center mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#0f2b3d] dark:text-white">Welcome Back</h2>
          <p className="text-sm text-[#64748b] dark:text-[#a0aec0] mt-1">
            Enter your credentials to access your portal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-5">
          
          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold text-[#43474c] dark:text-[#a0aec0] mb-1.5 ml-1">
              Email Address
            </label>
            <div className="flex items-center w-full px-3.5 py-3 rounded-lg border border-transparent bg-[#f1f5f9] dark:bg-[#0d1b2a] focus-within:bg-white focus-within:border-[#00b4d8] dark:focus-within:bg-[#1b263b] transition-all duration-200">
              <Mail className="w-5 h-5 text-[#94a3b8] shrink-0" />
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@geo.com"
                className="flex-1 w-full bg-transparent border-none outline-none text-[#0f2b3d] dark:text-white text-sm pl-3 placeholder-[#94a3b8]"
              />
            </div>
          </div>

          {/* PIN Input */}
          <div>
            <label className="block text-xs font-semibold text-[#43474c] dark:text-[#a0aec0] mb-1.5 ml-1">
              Security PIN
            </label>
            <div className="flex items-center w-full px-3.5 py-3 rounded-lg border border-transparent bg-[#f1f5f9] dark:bg-[#0d1b2a] focus-within:bg-white focus-within:border-[#00b4d8] dark:focus-within:bg-[#1b263b] transition-all duration-200">
              <Lock className="w-5 h-5 text-[#94a3b8] shrink-0" />
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                required
                value={pin}
                onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="••••••"
                className="flex-1 w-full bg-transparent border-none outline-none text-[#0f2b3d] dark:text-white text-sm font-mono pl-3 placeholder-[#94a3b8]"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-xs text-[#e63946] bg-[#e63946]/10 px-3 py-2 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-lg bg-[#0f2b3d] hover:bg-[#1a5f7a] text-white font-semibold text-sm flex items-center justify-center gap-2 transition disabled:opacity-60 mt-2 shadow-md"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
            {loading ? 'Verifying…' : 'Access Portal'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-[#c3c7cc]/20 dark:border-[#2f3e52] text-center text-[11px] text-[#94a3b8]">
          Contact your administrator if you cannot log in
        </div>
      </div>
    </div>
  )
}