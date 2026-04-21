import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Spinner from '../components/Spinner'

const Signup = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    businessName: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
    state: '',
    phone: '',
  })


  const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming'
  ]
 
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')

    if (!form.businessName || !form.email || !form.password) {
      setError('Business name, email and password are required.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (!agreed) {
      setError('Please agree to the Terms of Service.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: form.businessName,
          email: form.email,
          password: form.password,
          location: [form.city, form.state].filter(Boolean).join(', '),
          phone: form.phone,
        })
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
    <div
      className="min-h-screen p-8 flex flex-col justify-between"
      style={{ background: '#F0EDE6', fontFamily: 'Barlow, sans-serif' }}
    >
      {/* Top label */}
      <div className="font-mono text-[9px] text-[#999] tracking-[1.5px]">
        VERIFICATION / REGISTER
      </div>

      {/* Main grid */}
      <div className="grid gap-8 my-6" style={{ gridTemplateColumns: '1fr 1.4fr' }}>

        {/* ── Left column ── */}
        <div className="flex flex-col gap-4">

          {/* Gradient image */}
          <div
            className="rounded-[14px] h-[260px]"
            style={{
              background: 'linear-gradient(135deg, #9FE1CB 0%, #FAC775 40%, #F5C4B3 70%, #C4A8D4 100%)'
            }}
          />

          {/* Info card */}
          <div
            className="bg-[#FAF8F3] rounded-[14px] p-5"
            style={{ border: '0.5px solid #CCC9C0' }}
          >
            <div className="font-mono text-[11px] text-[#CCC9C0] tracking-[4px] mb-2">
              + + + +
            </div>
            <div className="font-mono text-[9px] text-[#999] tracking-[1.5px] mb-2">
              SYSTEM ACCESS PROTOCOL
            </div>
            <p className="text-[12px] text-[#5C5C58] leading-[1.6]">
              Set up your AI agent to handle customer inquiries, bookings, and sales across all your channels — 24/7, without missing a single message.
            </p>
          </div>
        </div>

        {/* ── Right column ── */}
        <div
          className="bg-[#FAF8F3] rounded-[14px] p-7"
          style={{ border: '0.5px solid #CCC9C0' }}
        >
          <div className="font-mono text-[9px] text-[#999] tracking-[1.5px] mb-1">
            VERIFICATION / REGISTER
          </div>
          <h1 className="font-condensed text-[30px] font-bold text-[#1A1A18] uppercase mb-6">
            Create Account
          </h1>

          {/* Business name */}
          <div className="mb-4">
            <label className="font-mono text-[9px] text-[#5C5C58] tracking-[1.5px] block mb-1.5">
              BUSINESS NAME
            </label>
            <input
              value={form.businessName}
              onChange={e => setForm({ ...form, businessName: e.target.value })}
              placeholder="e.g. Glow Beauty Clinic"
              className="w-full px-[14px] py-[11px] bg-[#F0EDE6] text-[#1A1A18] text-[13px] rounded-[10px] outline-none"
              style={{ border: '0.5px solid #CCC9C0' }}
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="font-mono text-[9px] text-[#5C5C58] tracking-[1.5px] block mb-1.5">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@yourbusiness.com"
              className="w-full px-[14px] py-[11px] bg-[#F0EDE6] text-[#1A1A18] text-[13px] rounded-[10px] outline-none"
              style={{ border: '0.5px solid #CCC9C0' }}
            />
          </div>

          {/* Password row */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="font-mono text-[9px] text-[#5C5C58] tracking-[1.5px] block mb-1.5">
                PASSWORD
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-[14px] py-[11px] bg-[#F0EDE6] text-[#1A1A18] text-[13px] rounded-[10px] outline-none"
                style={{ border: '0.5px solid #CCC9C0' }}
              />
            </div>
            <div>
              <label className="font-mono text-[9px] text-[#5C5C58] tracking-[1.5px] block mb-1.5">
                CONFIRM PASSWORD
              </label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full px-[14px] py-[11px] bg-[#F0EDE6] text-[#1A1A18] text-[13px] rounded-[10px] outline-none"
                style={{ border: '0.5px solid #CCC9C0' }}
              />
            </div>
          </div>

          {/* City + State + Phone */}
<div className="grid grid-cols-2 gap-3 mb-4">
  <div>
    <label className="font-mono text-[9px] text-[#5C5C58] tracking-[1.5px] block mb-1.5">
      CITY <span className="text-[#999]">(optional)</span>
    </label>
    <input
      value={form.city}
      onChange={e => setForm({ ...form, city: e.target.value })}
      placeholder="Miami"
      className="w-full px-[14px] py-[11px] bg-[#F0EDE6] text-[#1A1A18] text-[13px] rounded-[10px] outline-none"
      style={{ border: '0.5px solid #CCC9C0' }}
    />
  </div>
  <div>
    <label className="font-mono text-[9px] text-[#5C5C58] tracking-[1.5px] block mb-1.5">
      STATE <span className="text-[#999]">(optional)</span>
    </label>
    <select
      value={form.state}
      onChange={e => setForm({ ...form, state: e.target.value })}
      className="w-full px-[14px] py-[11px] bg-[#F0EDE6] text-[#1A1A18] text-[13px] rounded-[10px] outline-none"
      style={{ border: '0.5px solid #CCC9C0' }}
    >
      <option value="">Select state</option>
      {US_STATES.map(s => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  </div>
</div>
<div className="mb-5">
  <label className="font-mono text-[9px] text-[#5C5C58] tracking-[1.5px] block mb-1.5">
    PHONE <span className="text-[#999]">(optional)</span>
  </label>
  <input
    value={form.phone}
    onChange={e => setForm({ ...form, phone: e.target.value })}
    placeholder="(305) 555-0199"
    className="w-full px-[14px] py-[11px] bg-[#F0EDE6] text-[#1A1A18] text-[13px] rounded-[10px] outline-none"
    style={{ border: '0.5px solid #CCC9C0' }}
  />
</div>
          {/* Terms */}
          <div className="flex items-start gap-2.5 mb-5">
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="mt-0.5 flex-shrink-0 accent-[#4A7C59]"
            />
            <p className="text-[11px] text-[#5C5C58] leading-[1.5]">
              I agree to the{' '}
              <span className="text-[#B85C38] font-medium cursor-pointer">
                Terms of Service
              </span>{' '}
              and confirm my business information is accurate.
            </p>
          </div>

          {error && (
            <p className="font-mono text-[10px] text-[#B85C38] mb-4">{error}</p>
          )}

          {/* Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-[13px] rounded-full flex items-center justify-center gap-3 font-mono text-[11px] tracking-[2px] text-[#F0EDE6] transition-[color,background-color,border-color,transform] duration-100 active:scale-[0.97] hover:brightness-90"
            style={{ background: loading ? '#6A9C79' : '#4A7C59' }}
          >
            {loading && <Spinner />}
            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            {!loading && (
              <span className="w-[22px] h-[22px] rounded-full bg-[#3A6249] flex items-center justify-center text-[11px]">
                →
              </span>
            )}
          </button>

          <p className="text-[12px] text-[#888780] text-center mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-[#B85C38] font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex justify-between items-center">
        <span className="font-mono text-[9px] text-[#B85C38] tracking-[1px]">
          INITIALIZING AGENT WORKSPACE...
        </span>
      </div>
    </div>
  )
}

export default Signup