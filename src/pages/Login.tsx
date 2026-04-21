import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Spinner from '../components/Spinner'

const Login = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error)
        return
      }
      localStorage.setItem('token', data.token)
      localStorage.setItem('businessId', data.businessId)
      navigate('/')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-[#F0EDE6] p-8 flex flex-col justify-between">
      <div />

      <div className="flex justify-center">
      <div
        className="w-full max-w-3xl grid grid-cols-2 rounded-[14px] overflow-hidden"
        style={{ minHeight: '560px', border: '0.5px solid #CCC9C0' }}
      >
        {/* ── Left panel ── */}
        <div
          className="p-8 flex flex-col justify-between"
          style={{ background: 'linear-gradient(160deg, #B8CFC0 0%, #C8D4CC 40%, #D4C9B8 100%)' }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4A7C59]" />
            <span className="font-mono text-[11px] text-[#2C3B2E] tracking-widest">
              RECEPTIONIST OS
            </span>
          </div>
          <div>
            <div className="font-mono text-[12px] text-[#7A9B82] tracking-[4px] mb-5">
              + + + +
            </div>
            <p className="text-[21px] font-light text-[#2C3B2E] leading-[1.45] mb-4">
              Every unanswered message is a client you didn't know you lost.
            </p>
            <div className="font-mono text-[9px] text-[#7A9B82] tracking-[1.5px]">
              RECEPTIONIST OS / AGENT PLATFORM
            </div>
          </div>
          <div className="font-mono text-[9px] text-[#7A9B82] tracking-[1px]">
            SYSTEM V.01 / LOGIN_AUTH
          </div>
        </div>
  
        {/* ── Right panel ── */}
        <div className="bg-[#FAF8F3] px-10 py-12 flex flex-col justify-center">
          <h1 className="font-condensed text-4xl font-bold text-[#1A1A18] uppercase tracking-tight mb-1">
            Agent Access
          </h1>
          <p className="text-[13px] font-light text-[#888780] mb-9">
            Enter credentials to initialize your session
          </p>
  
          <div className="mb-5">
            <label className="font-mono text-[9px] text-[#5C5C58] tracking-[1.5px] block mb-2">
              EMAIL
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@yourbusiness.com"
              className="w-full px-4 py-3 bg-[#F0EDE6] text-[#1A1A18] text-sm rounded-[10px] outline-none"
              style={{ border: '0.5px solid #CCC9C0' }}
            />
          </div>
  
          <div className="mb-5">
            <label className="font-mono text-[9px] text-[#5C5C58] tracking-[1.5px] block mb-2">
              PASSWORD
            </label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 bg-[#F0EDE6] text-[#1A1A18] text-sm rounded-[10px] outline-none"
              style={{ border: '0.5px solid #CCC9C0' }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>
  
          <div className="flex justify-between items-center mb-6">
            <label className="flex items-center gap-2 text-xs text-[#5C5C58] cursor-pointer">
              <input type="checkbox" className="accent-[#4A7C59]" />
              Remember me
            </label>
            <button onClick={() => navigate('/forgot-password')} className="font-mono text-[9px] text-[#999] hover:text-[#1A1A18] transition-colors">
  Forgot password?
</button>
          </div>
  
          {error && (
            <p className="font-mono text-[10px] text-[#B85C38] mb-4">{error}</p>
          )}
  
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 rounded-full flex items-center justify-center gap-3 font-mono text-[11px] tracking-[2px] text-[#F0EDE6] transition-[color,background-color,border-color,transform] duration-100 active:scale-[0.97] hover:brightness-90"
            style={{ background: loading ? '#6A9C79' : '#4A7C59' }}
          >
            {loading && <Spinner />}
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
            {!loading && (
              <span className="w-6 h-6 rounded-full bg-[#3A6249] flex items-center justify-center text-xs">
                →
              </span>
            )}
          </button>
  
          <p className="text-xs text-[#888780] text-center mt-5">
            New operator?{' '}
            <Link to="/signup" className="text-[#B85C38] font-medium">
              Request access credentials
            </Link>
          </p>
  
          <div className="font-mono text-[12px] text-[#CCC9C0] tracking-[4px] mt-8">
            • • •
          </div>
        </div>
      </div>
      </div>

      {/* Bottom bar */}
      <div className="flex justify-between items-center">
        <span className="font-mono text-[9px] text-[#B85C38] tracking-[1px]">
          RECONNECTING TO AGENT WORKSPACE...
        </span>
      </div>
    </div>
  )
  
}

export default Login