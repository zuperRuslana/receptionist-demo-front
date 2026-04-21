import { useState, useEffect, useRef } from 'react'
import { authFetch } from '../utils/api'
import Spinner from './Spinner'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface TestChatModalProps {
  onClose: () => void
}

interface Conversation {
  id: number
  session_id: string
  is_test: boolean
  created_at: string
}

interface DBMessage {
  id: number
  conversation_id: number
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

const TestChatModal = ({ onClose }: TestChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [agentName, setAgentName] = useState('Agent')
  const [isVisible, setIsVisible] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [sessionId, setSessionId] = useState(() => {
  const token = localStorage.getItem('token')
  const key = `test_session_id_${token?.slice(-8) || 'default'}`
  const existing = localStorage.getItem(key)
  if (existing) return existing
  const newId = `test-${crypto.randomUUID()}`
  localStorage.setItem(key, newId)
  return newId
})

  // Entry animation
  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  // Cleanup close timer
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    }
  }, [])

  // Load agent + history on open
  useEffect(() => {
    fetchAgent()
    fetchHistory()
  }, [])

  const fetchAgent = async () => {
    try {
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/agent`)
      if (!res.ok) return
      const data = await res.json()
      setAgentName(data.name || 'Agent')
    } catch (error) {
      console.error('Failed to fetch agent:', error)
    }
  }

  const fetchHistory = async () => {
  try {
    const currentSessionId = localStorage.getItem('test_session_id')
    if (!currentSessionId) return

    const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/conversations/test`)
    if (!res.ok) return
    const conversations: Conversation[] = await res.json()
    const conversation = conversations.find(c => c.session_id === currentSessionId)
    if (!conversation) return

    const msgRes = await authFetch(`${import.meta.env.VITE_API_URL}/api/conversations/${conversation.id}/messages`)
    if (!msgRes.ok) return
    const msgs: DBMessage[] = await msgRes.json()
    setMessages(msgs.map(m => ({ role: m.role, content: m.content })))
  } catch (error) {
    console.error('Failed to fetch history:', error)
  }
}

  const handleClose = () => {
    setIsVisible(false)
    closeTimerRef.current = setTimeout(onClose, 200)
  }

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/test-chat`, {
        method: 'POST',
        body: JSON.stringify({ message: userMessage, sessionId }),
      })

      if (!res.ok) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Something went wrong. Please try again.'
        }])
        return
      }

      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (error) {
      console.error('Test chat error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Connection error. Please try again.'
      }])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
  const token = localStorage.getItem('token')
  const key = `test_session_id_${token?.slice(-8) || 'default'}`
  const newId = `test-${crypto.randomUUID()}`
  localStorage.setItem(key, newId)
  setSessionId(newId)
  setMessages([])
}

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ background: 'rgba(26,26,24,0.55)' }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className={`bg-[#FAF8F3] rounded-[14px] flex flex-col overflow-hidden w-full max-w-[520px] transition-[opacity,transform] duration-200 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.97]'}`}
        style={{ height: '560px', border: '0.5px solid #CCC9C0' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-[18px] py-[14px] flex-shrink-0"
          style={{ borderBottom: '0.5px solid #CCC9C0' }}
        >
          <div className="flex flex-col gap-[3px]">
            <div className="font-condensed text-[18px] font-bold text-[#1A1A18] uppercase tracking-tight">
              Test Agent
            </div>
            <div className="font-mono text-[9px] text-[#999] tracking-[1px]">
              TESTING — {agentName.toUpperCase()} · NOT VISIBLE TO CUSTOMERS
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] bg-[#FAEEDA] text-[#854F0B] px-2 py-1 rounded-[10px] tracking-wide">
              TEST MODE
            </span>
            <button
              onClick={clearChat}
              className="font-mono text-[9px] text-[#999] px-2 py-1 rounded-[4px] hover:bg-[#EAE7E0] transition-colors"
              style={{ border: '0.5px solid #CCC9C0' }}
            >
              CLEAR ↺
            </button>
            <button
              onClick={handleClose}
              className="font-mono text-[11px] text-[#999] px-2 py-1 rounded-[4px] hover:bg-[#EAE7E0] transition-colors"
              style={{ border: '0.5px solid #CCC9C0' }}
            >
              ✕ close
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-[18px] py-4 flex flex-col gap-[10px]">
          {messages.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <div className="font-mono text-[10px] text-[#CCC9C0] tracking-wide text-center">
                SEND A MESSAGE TO START TESTING
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] text-[13px] leading-[1.55] px-[14px] py-[10px] ${
                  msg.role === 'user'
                    ? 'bg-[#EAE7E0] text-[#1A1A18] rounded-[12px] rounded-br-[3px]'
                    : 'bg-[#1A1A18] text-[#F0EDE6] rounded-[12px] rounded-bl-[3px]'
                }`}
              >
                {msg.content}
              </div>
              <div className="font-mono text-[10px] text-[#999] mt-[3px]">
                {msg.role === 'user' ? 'You' : agentName}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex flex-col items-start">
              <div className="bg-[#EAE7E0] rounded-[12px] rounded-bl-[3px] px-[14px] py-[10px] flex gap-1 items-center">
                <span className="w-[6px] h-[6px] rounded-full bg-[#999] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-[6px] h-[6px] rounded-full bg-[#999] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-[6px] h-[6px] rounded-full bg-[#999] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div
          className="px-[18px] py-3 flex items-center gap-2 flex-shrink-0"
          style={{ borderTop: '0.5px solid #CCC9C0' }}
        >
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message to test your agent..."
            className="flex-1 bg-[#F0EDE6] text-[#1A1A18] text-[13px] px-4 py-[9px] rounded-[20px] outline-none"
            style={{ border: '0.5px solid #CCC9C0' }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="w-9 h-9 rounded-full bg-[#1A1A18] flex items-center justify-center flex-shrink-0 transition-all text-[#F0EDE6] hover:brightness-90"
            style={{ opacity: loading || !input.trim() ? 0.4 : 1 }}
          >
            {loading ? (
              <Spinner size={14} />
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M12 7H2M8 3l4 4-4 4" stroke="#F0EDE6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TestChatModal