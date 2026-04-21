// ChatModal — the 2-panel chat overlay.
// Left panel: list of active conversations (click to switch).
// Right panel: messages for the selected conversation.
// `open` / `onClose` are controlled from App.tsx.
// Clicking the dark backdrop also closes the modal (matches HTML's handleClick).
import { useState } from 'react'

type ChatId = 'lana' | 'sofia' | 'anna' | 'maria' | 'jessica'

interface Message { role: 'client' | 'agent'; text: string; time: string }

interface Chat {
  name: string
  meta: string
  time: string
  pill: string
  pillStyle: React.CSSProperties
  preview: string
  msgs: Message[]
}

// All chat data mirrors the HTML <script> block exactly
const chats: Record<ChatId, Chat> = {
  lana: {
    name: 'Lana K.', meta: 'Customer ID: 4821 · New Client · Instagram',
    time: 'Just now', pill: 'IG',
    pillStyle: { background: '#F5E8EE', color: '#8B3A5A' },
    preview: 'How much for full legs + brazilian?',
    msgs: [
      { role: 'client', text: 'Hi, how much is laser for full legs and brazilian?', time: '2:14 PM' },
      { role: 'agent',  text: 'Great news! The combo deal for Full Legs + Brazilian is $350 — saving you $50! As a new client you get 20% off, so just $280 for your first session 🎉', time: '2:14 PM · Mary Jane' },
      { role: 'client', text: 'Amazing! Can I book this week?', time: '2:15 PM' },
      { role: 'agent',  text: 'Absolutely! Could I start with your full name? 🌟', time: '2:15 PM · Mary Jane' },
      { role: 'client', text: "It's Lana Kovalenko", time: '2:16 PM' },
      { role: 'agent',  text: 'Lovely! Could I grab your phone number so we can send a reminder before your appointment?', time: '2:16 PM · Mary Jane' },
    ],
  },
  sofia: {
    name: 'Sofia M.', meta: 'Customer ID: 3312 · Returning Client · SMS',
    time: '3m ago', pill: 'SMS',
    pillStyle: { background: '#E3EFE6', color: '#2E6640' },
    preview: 'I want to book lip filler for Friday',
    msgs: [
      { role: 'client', text: 'Hi! I want to book lip filler for this Friday', time: '2:11 PM' },
      { role: 'agent',  text: 'Hi Sofia! Great choice 💋 Lip filler starts from $650/syringe. For Friday we have 10:00, 12:00, 13:00, 14:00 and 16:00. Which works for you?', time: '2:11 PM · Mary Jane' },
      { role: 'client', text: 'Can I do 13:00?', time: '2:12 PM' },
      { role: 'agent',  text: 'Perfect — 13:00 on Friday is available! Let me confirm your email to send the booking confirmation.', time: '2:12 PM · Mary Jane' },
    ],
  },
  anna: {
    name: 'Anna R.', meta: 'Customer ID: 5509 · New Client · Website Chat',
    time: '7m ago', pill: 'WEB',
    pillStyle: { background: '#E3EBF5', color: '#2E4D80' },
    preview: 'Does Botox hurt? How many units...',
    msgs: [
      { role: 'client', text: 'Does Botox hurt? And how many units would I need for my forehead?', time: '2:07 PM' },
      { role: 'agent',  text: "Most clients describe it as a tiny pinch — very quick! Forehead lines typically need 10–30 units at $9/unit ($90–$270). For a personalized plan I'd recommend a free consultation 😊", time: '2:07 PM · Mary Jane' },
      { role: 'client', text: "That's not bad at all. How do I book?", time: '2:09 PM' },
    ],
  },
  maria: {
    name: 'Maria T.', meta: 'Customer ID: 2287 · Returning Client · Instagram',
    time: '12m ago', pill: 'IG',
    pillStyle: { background: '#F5E8EE', color: '#8B3A5A' },
    preview: 'Can I reschedule my appointment?',
    msgs: [
      { role: 'client', text: 'Hi I need to reschedule my appointment for next Tuesday', time: '1:58 PM' },
      { role: 'agent',  text: 'Of course Maria! Could you share your current appointment details?', time: '1:58 PM · Mary Jane' },
      { role: 'client', text: 'Maria Torres, HydraFacial on Wednesday at 11:00', time: '1:59 PM' },
      { role: 'agent',  text: 'Got it! For next Tuesday we have 10:00, 12:00 and 14:00 available. Which would you prefer?', time: '1:59 PM · Mary Jane' },
    ],
  },
  jessica: {
    name: 'Jessica L.', meta: 'Customer ID: 6741 · New Client · Phone Call',
    time: '18m ago', pill: 'CALL',
    pillStyle: { background: '#F5EEE3', color: '#7A5020' },
    preview: "What's included in full body laser?",
    msgs: [
      { role: 'client', text: 'What exactly is included in the full body laser package?', time: '1:42 PM' },
      { role: 'agent',  text: 'The Full Body Laser at $1,500 covers legs, arms, underarms, brazilian, stomach and back. New clients get 20% off — bringing it to $1,200! 🌟', time: '1:42 PM · Mary Jane' },
      { role: 'client', text: "Wow that's a great deal. How many sessions will I need?", time: '1:43 PM' },
      { role: 'agent',  text: 'Typically 6–8 sessions spaced 4–6 weeks apart. Would you like to book a free consultation?', time: '1:43 PM · Mary Jane' },
    ],
  },
}

const chatOrder: ChatId[] = ['lana', 'sofia', 'anna', 'maria', 'jessica']

interface ChatModalProps {
  open: boolean
  onClose: () => void
}

const ChatModal = ({ open, onClose }: ChatModalProps) => {
  const [selected, setSelected] = useState<ChatId>('lana')
  const chat = chats[selected]

  return (
    // Backdrop — clicking it directly (not the modal card) closes it
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-200 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      style={{ background: 'rgba(26,26,24,0.55)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Modal card: 700px wide, 560px tall, 2-column grid */}
      <div
        className={`bg-[#FAF8F3] rounded-[14px] w-[700px] max-w-[95vw] h-[560px] grid grid-cols-[230px_1fr] overflow-hidden transition-[opacity,transform] duration-200 ease-out ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.97]'}`}
        style={{ border: '0.5px solid #CCC9C0' }}
      >

        {/* ── Left panel: conversation list ── */}
        <div className="bg-[#F0EDE6] flex flex-col" style={{ borderRight: '0.5px solid #CCC9C0' }}>

          {/* List header */}
          <div
            className="flex justify-between items-center px-4 py-3.5"
            style={{ borderBottom: '0.5px solid #CCC9C0' }}
          >
            <span className="text-[13px] font-medium text-[#1A1A18]">Active Chats</span>
            <span className="font-mono text-[10px] text-[#999]">5 pending</span>
          </div>

          {/* Scrollable chat list */}
          <div className="flex-1 overflow-y-auto">
            {chatOrder.map((id) => {
              const c = chats[id]
              return (
                <div
                  key={id}
                  onClick={() => setSelected(id)}
                  className={`px-4 py-3 cursor-pointer ${selected === id ? 'bg-[#EAE7E0]' : 'hover:bg-[#EAE7E0]'}`}
                  style={{ borderBottom: '0.5px solid #EAE7E0' }}
                >
                  <div className="flex justify-between mb-0.5">
                    <span className="text-[13px] font-medium text-[#1A1A18]">{c.name}</span>
                    <span className="font-mono text-[10px] text-[#999]">{c.time}</span>
                  </div>
                  <div className="text-[11px] text-[#888]">
                    {/* Channel pill */}
                    <span
                      className="font-mono text-[9px] px-[5px] py-[2px] rounded-[3px] mr-1"
                      style={c.pillStyle}
                    >
                      {c.pill}
                    </span>
                    {c.preview}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Right panel: active conversation ── */}
        <div className="flex flex-col">

          {/* Conversation header */}
          <div
            className="flex justify-between items-start px-[18px] py-3.5"
            style={{ borderBottom: '0.5px solid #CCC9C0' }}
          >
            <div>
              <div className="text-[15px] font-medium text-[#1A1A18]">{chat.name}</div>
              <div className="text-[11px] text-[#999] mt-0.5">{chat.meta}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-[#4A7C59] cursor-pointer">View profile →</span>
              {/* onClose called directly — ChatModal stays in DOM, CSS transition handles the exit */}
              <button
                onClick={onClose}
                className="font-mono text-[11px] text-[#999] px-2 py-1 rounded cursor-pointer hover:bg-[#EAE7E0]"
                style={{ border: '0.5px solid #CCC9C0', background: 'transparent' }}
              >
                ✕ close
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 px-[18px] py-4 flex flex-col gap-2.5 overflow-y-auto">
            {chat.msgs.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'agent' ? 'items-end' : 'items-start'}`}>
                <div
                  className="max-w-[82%] text-[13px] leading-[1.55] px-[14px] py-[10px] rounded-xl"
                  style={
                    m.role === 'agent'
                      ? { background: '#1A1A18', color: '#F0EDE6', borderBottomRightRadius: '3px' }
                      : { background: '#EAE7E0', color: '#1A1A18', borderBottomLeftRadius: '3px' }
                  }
                >
                  {m.text}
                </div>
                <div className={`font-mono text-[10px] text-[#999] mt-[3px] ${m.role === 'agent' ? 'text-right' : ''}`}>
                  {m.time}
                </div>
              </div>
            ))}
          </div>

          {/* Input row */}
          <div className="px-[18px] py-3" style={{ borderTop: '0.5px solid #CCC9C0' }}>
            <input
              className="w-full rounded-[20px] px-4 py-[9px] text-xs bg-[#EAE7E0] text-[#888] outline-none"
              style={{ border: '0.5px solid #CCC9C0', fontFamily: 'Barlow, sans-serif' }}
              placeholder="Type a response or type '/' for quick actions..."
            />
          </div>
        </div>

      </div>
    </div>
  )
}

export default ChatModal
