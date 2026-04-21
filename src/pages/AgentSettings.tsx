import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authFetch } from '../utils/api'
import Spinner from '../components/Spinner'


interface AgentData {
  name: string
  role: string
  tone: string
  personality: string
  greeting: string
  business_name: string
  description: string
  location: string
  phone: string
  working_hours: string
  booking_url: string,
  custom_instructions: string,
  conversation_style: string
}

const roles = [
  { value: 'receptionist', label: 'Receptionist' },
  { value: 'sales', label: 'Sales Representative' },
  { value: 'legal', label: 'Legal Assistant' },
  { value: 'support', label: 'Customer Support' },
]

const AgentSettings = () => {
  const navigate = useNavigate()

  const [agent, setAgent] = useState<AgentData>({
    name: '',
    role: 'receptionist',
    tone: '',
    personality: '',
    greeting: '',
    business_name: '',
    description: '',
    location: '',
    phone: '',
    working_hours: '',
    booking_url: '',
    custom_instructions: '',
    conversation_style: 'chill_receptionist',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchAgent()
  }, [])

  const fetchAgent = async () => {
    try {
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/agent`)
      const data = await res.json()
      setAgent(data)
    } catch (error) {
      console.error('Failed to fetch agent:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('token')

      // Update agent
      await fetch(`${import.meta.env.VITE_API_URL}/api/agent`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: agent.name,
          role: agent.role,
          tone: agent.tone,
          personality: agent.personality,
          greeting: agent.greeting,
          customInstructions: agent.custom_instructions,
          conversation_style: agent.conversation_style,
        })
      })

      // Update business info
      await fetch(`${import.meta.env.VITE_API_URL}/api/business`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: agent.business_name,
          description: agent.description,
          location: agent.location,
          phone: agent.phone,
          working_hours: agent.working_hours,
          booking_url: agent.booking_url,
        })
      })

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-5 font-mono text-[11px] text-[#999] tracking-widest">
        LOADING...
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl">

      {/* Page title */}
      
      {/* Back arrow */}
    <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 font-mono text-[10px] text-[#999] tracking-wide hover:text-[#1A1A18] transition-colors mb-6"
    >
        ← BACK TO DASHBOARD
    </button>

      <div className="mb-6">
        <div className="font-mono text-[9px] text-[#999] tracking-widest mb-1">MANAGE</div>
        <h1 className="font-condensed text-3xl font-bold text-[#1A1A18] uppercase tracking-tight">
          Agent Settings
        </h1>
      </div>

      {/* Agent Identity */}
      <div
        className="bg-[#FAF8F3] rounded-[14px] p-5 mb-4"
        style={{ border: '0.5px solid #CCC9C0' }}
      >
        <div className="font-mono text-[9px] text-[#999] tracking-widest mb-4">
          AGENT IDENTITY
        </div>

        <div className="flex flex-col gap-4">

          {/* Agent name */}
          <div>
            <label className="font-mono text-[10px] text-[#5C5C58] tracking-wide block mb-1.5">
              AGENT NAME
            </label>
            <input
              value={agent.name}
              onChange={e => setAgent({ ...agent, name: e.target.value })}
              placeholder="e.g. Mary Jane, Alex, Sofia"
              className="w-full px-3 py-2 text-sm bg-[#F0EDE6] text-[#1A1A18] rounded-lg outline-none"
              style={{ border: '0.5px solid #CCC9C0' }}
            />
          </div>

          {/* Role */}
          <div>
            <label className="font-mono text-[10px] text-[#5C5C58] tracking-wide block mb-1.5">
              ROLE
            </label>
            <div className="flex gap-2 flex-wrap">
              {roles.map(r => (
                <button
                  key={r.value}
                  onClick={() => setAgent({ ...agent, role: r.value })}
                  className={`font-mono text-[10px] px-3 py-1.5 rounded-md tracking-wide transition-colors ${
                    agent.role === r.value
                      ? 'bg-[#1A1A18] text-[#F0EDE6]'
                      : 'bg-[#F0EDE6] text-[#5C5C58] hover:bg-[#D8D4CB]'
                  }`}
                  style={{ border: '0.5px solid #CCC9C0' }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Style */}
<div>
  <label className="font-mono text-[10px] text-[#5C5C58] tracking-wide block mb-2">
    CONVERSATION STYLE
  </label>
  <div className="grid grid-cols-2 gap-3">
    {[
      {
        value: 'chill_receptionist',
        label: 'Chill Receptionist',
        desc: 'Calm, short, natural replies. Best for brands that want a soft, non-pushy experience.',
      },
      {
        value: 'sales_receptionist',
        label: 'Sales Receptionist',
        desc: 'Friendly and professional, but more proactive about guiding clients toward booking.',
      },
    ].map(s => (
      <button
        key={s.value}
        onClick={() => setAgent({ ...agent, conversation_style: s.value })}
        className="text-left rounded-[10px] p-3 transition-all hover:brightness-95"
        style={{
          border: agent.conversation_style === s.value ? '0.5px solid #1A1A18' : '0.5px solid #CCC9C0',
          background: agent.conversation_style === s.value ? '#1A1A18' : '#F0EDE6',
        }}
      >
        <div className={`font-mono text-[10px] tracking-wide mb-1 ${agent.conversation_style === s.value ? 'text-[#F0EDE6]' : 'text-[#1A1A18]'}`}>
          {s.label}
        </div>
        <div className={`text-[11px] mb-2 ${agent.conversation_style === s.value ? 'text-[#888]' : 'text-[#999]'}`}>
          {s.desc}
        </div>
        <div className={`text-[11px] italic leading-[1.5] ${agent.conversation_style === s.value ? 'text-[#666]' : 'text-[#5C5C58]'}`}>
          "{s.preview}"
        </div>
      </button>
    ))}
  </div>
</div>

          {/* Tone */}
          <div>
            <label className="font-mono text-[10px] text-[#5C5C58] tracking-wide block mb-1.5">
              TONE
            </label>
            <input
              value={agent.tone}
              onChange={e => setAgent({ ...agent, tone: e.target.value })}
              placeholder="e.g. friendly and professional, formal, casual"
              className="w-full px-3 py-2 text-sm bg-[#F0EDE6] text-[#1A1A18] rounded-lg outline-none"
              style={{ border: '0.5px solid #CCC9C0' }}
            />
          </div>

          {/* Personality */}
          <div>
            <label className="font-mono text-[10px] text-[#5C5C58] tracking-wide block mb-1.5">
              PERSONALITY
            </label>
            <textarea
              value={agent.personality}
              onChange={e => setAgent({ ...agent, personality: e.target.value })}
              placeholder="Describe how your agent should behave and what makes them unique..."
              rows={3}
              className="w-full px-3 py-2 text-sm bg-[#F0EDE6] text-[#1A1A18] rounded-lg outline-none resize-none"
              style={{ border: '0.5px solid #CCC9C0' }}
            />
          </div>

          {/* Greeting */}
          <div>
            <label className="font-mono text-[10px] text-[#5C5C58] tracking-wide block mb-1.5">
              GREETING MESSAGE
            </label>
            <input
              value={agent.greeting}
              onChange={e => setAgent({ ...agent, greeting: e.target.value })}
              placeholder="e.g. Hi! Welcome to Glow Beauty Clinic. How can I help you today?"
              className="w-full px-3 py-2 text-sm bg-[#F0EDE6] text-[#1A1A18] rounded-lg outline-none"
              style={{ border: '0.5px solid #CCC9C0' }}
            />
          </div>
        </div>
      </div>

      {/* Business Info */}
      <div
        className="bg-[#FAF8F3] rounded-[14px] p-5 mb-6"
        style={{ border: '0.5px solid #CCC9C0' }}
      >
        <div className="font-mono text-[9px] text-[#999] tracking-widest mb-4">
          BUSINESS INFORMATION
        </div>

        <div className="flex flex-col gap-4">

          <div>
            <label className="font-mono text-[10px] text-[#5C5C58] tracking-wide block mb-1.5">
              BUSINESS NAME
            </label>
            <input
              value={agent.business_name}
              onChange={e => setAgent({ ...agent, business_name: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#F0EDE6] text-[#1A1A18] rounded-lg outline-none"
              style={{ border: '0.5px solid #CCC9C0' }}
            />
          </div>

          <div>
            <label className="font-mono text-[10px] text-[#5C5C58] tracking-wide block mb-1.5">
              BUSINESS DESCRIPTION
            </label>
            <textarea
              value={agent.description || ''}
              onChange={e => setAgent({ ...agent, description: e.target.value })}
              placeholder="e.g. Premium salon in downtown Miami, specializing in facial treatments and injectables"
              rows={2}
              className="w-full px-3 py-2 text-sm bg-[#F0EDE6] text-[#1A1A18] rounded-lg outline-none resize-none"
              style={{ border: '0.5px solid #CCC9C0' }}
            />
          </div>

          <div>
            <label className="font-mono text-[10px] text-[#5C5C58] tracking-wide block mb-1.5">
              LOCATION
            </label>
            <input
              value={agent.location || ''}
              onChange={e => setAgent({ ...agent, location: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#F0EDE6] text-[#1A1A18] rounded-lg outline-none"
              style={{ border: '0.5px solid #CCC9C0' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-[10px] text-[#5C5C58] tracking-wide block mb-1.5">
                PHONE
              </label>
              <input
                value={agent.phone || ''}
                onChange={e => setAgent({ ...agent, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-[#F0EDE6] text-[#1A1A18] rounded-lg outline-none"
                style={{ border: '0.5px solid #CCC9C0' }}
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-[#5C5C58] tracking-wide block mb-1.5">
                WORKING HOURS
              </label>
              <input
                value={agent.working_hours || ''}
                onChange={e => setAgent({ ...agent, working_hours: e.target.value })}
                placeholder="e.g. Mon-Sat, 9am - 7pm"
                className="w-full px-3 py-2 text-sm bg-[#F0EDE6] text-[#1A1A18] rounded-lg outline-none"
                style={{ border: '0.5px solid #CCC9C0' }}
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-[10px] text-[#5C5C58] tracking-wide block mb-1.5">
              BOOKING URL
            </label>
            <input
              value={agent.booking_url || ''}
              onChange={e => setAgent({ ...agent, booking_url: e.target.value })}
              placeholder="e.g. yourbusiness.com/book"
              className="w-full px-3 py-2 text-sm bg-[#F0EDE6] text-[#1A1A18] rounded-lg outline-none"
              style={{ border: '0.5px solid #CCC9C0' }}
            />
          </div>
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 font-mono text-[11px] tracking-widest px-6 py-3 rounded-lg transition-colors hover:brightness-90"
        style={{
          background: saved ? '#4A7C59' : '#1A1A18',
          color: '#F0EDE6',
          opacity: saving ? 0.7 : 1,
        }}
      >
        {saving && <Spinner />}
        {saving ? 'SAVING...' : saved ? 'SAVED ✓' : 'SAVE CHANGES'}
      </button>

    </div>
  )
}

export default AgentSettings