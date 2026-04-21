import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailSent, setEmailSent] = useState(false)


  const handleSubmit = async () => {
  if (!email.trim()) return
  setLoading(true)
  setError('')
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    const data = await res.json()
    if (data.success) setEmailSent(true)
    else setError(data.error || 'Something went wrong.')
  } catch {
    setError('Something went wrong. Please try again.')
  }
  setLoading(false)
}

  return (
  <div className="min-h-screen bg-[#F0EDE6] flex items-center justify-center p-4">
    <div className="bg-[#FAF8F3] rounded-[14px] p-8 w-full max-w-[400px]" style={{ border: '0.5px solid #CCC9C0' }}>
      <div className="font-mono text-[9px] text-[#999] tracking-widest mb-1">ACCOUNT RECOVERY</div>
      <h1 className="font-condensed text-[28px] font-bold text-[#1A1A18] uppercase mb-6">Reset Password</h1>

      {!emailSent ? (
        <>
          <div className="mb-4">
            <label className="font-mono text-[10px] text-[#5C5C58] tracking-wide block mb-1.5">EMAIL</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              type="email"
              placeholder="your@email.com"
              className="w-full px-3 py-2 text-sm bg-[#F0EDE6] text-[#1A1A18] rounded-lg outline-none"
              style={{ border: '0.5px solid #CCC9C0' }}
            />
          </div>
          {error && <div className="font-mono text-[9px] text-[#B85C38] mb-3">{error}</div>}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 font-mono text-[11px] tracking-widest py-3 rounded-lg text-[#F0EDE6] mb-4 hover:brightness-90 transition-all"
            style={{ background: loading ? '#6A9C79' : '#1A1A18', opacity: loading ? 0.7 : 1 }}
          >
            {loading && <Spinner />}
            {loading ? 'SENDING...' : 'SEND RESET LINK'}
          </button>
          <button onClick={() => navigate('/login')} className="font-mono text-[9px] text-[#999] hover:text-[#1A1A18] transition-colors">
            ← BACK TO LOGIN
          </button>
        </>
      ) : (
        <>
          <div className="font-mono text-[9px] text-[#4A7C59] tracking-wide mb-4">✓ CHECK YOUR EMAIL</div>
          <p className="text-[12px] text-[#5C5C58] leading-[1.6] mb-6">
            We sent a password reset link to <strong>{email}</strong>. Check your inbox and click the link to reset your password.
          </p>
          <div className="font-mono text-[9px] text-[#999] mb-4">Link expires in 1 hour.</div>
          <button onClick={() => navigate('/login')} className="font-mono text-[9px] text-[#999] hover:text-[#1A1A18] transition-colors">
            ← BACK TO LOGIN
          </button>
        </>
      )}
    </div>
  </div>
)
}

export default ForgotPassword