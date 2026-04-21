import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Spinner from '../components/Spinner'

const ResetPassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || window.location.hash.slice(1) || ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!password || password !== confirm) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => navigate('/login'), 2000)
      } else {
        setError(data.error || 'Failed to reset password')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#F0EDE6] flex items-center justify-center p-4">
      <div className="bg-[#FAF8F3] rounded-[14px] p-8 w-full max-w-[400px]" style={{ border: '0.5px solid #CCC9C0' }}>
        <div className="font-mono text-[9px] text-[#999] tracking-widest mb-1">ACCOUNT RECOVERY</div>
        <h1 className="font-condensed text-[28px] font-bold text-[#1A1A18] uppercase mb-6">New Password</h1>

        {success ? (
          <div className="font-mono text-[10px] text-[#4A7C59] tracking-wide">✓ PASSWORD UPDATED — REDIRECTING...</div>
        ) : (
          <>
            <div className="flex flex-col gap-4 mb-4">
              <div>
                <label className="font-mono text-[10px] text-[#5C5C58] tracking-wide block mb-1.5">NEW PASSWORD</label>
                <input
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  type="password"
                  placeholder="Min 8 characters"
                  className="w-full px-3 py-2 text-sm bg-[#F0EDE6] text-[#1A1A18] rounded-lg outline-none"
                  style={{ border: '0.5px solid #CCC9C0' }}
                />
              </div>
              <div>
                <label className="font-mono text-[10px] text-[#5C5C58] tracking-wide block mb-1.5">CONFIRM PASSWORD</label>
                <input
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  type="password"
                  placeholder="Repeat password"
                  className="w-full px-3 py-2 text-sm bg-[#F0EDE6] text-[#1A1A18] rounded-lg outline-none"
                  style={{ border: '0.5px solid #CCC9C0' }}
                />
              </div>
            </div>
            {error && <div className="font-mono text-[9px] text-[#B85C38] mb-3">{error}</div>}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 font-mono text-[11px] tracking-widest py-3 rounded-lg text-[#F0EDE6] hover:brightness-90 transition-all"
              style={{ background: loading ? '#6A9C79' : '#1A1A18', opacity: loading ? 0.7 : 1 }}
            >
              {loading && <Spinner />}
              {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default ResetPassword