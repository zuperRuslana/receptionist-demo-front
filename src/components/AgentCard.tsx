import { useState, useEffect } from 'react'
import { authFetch } from '../utils/api'


interface Agent {
  name: string
  role: string
  status: 'active' | 'inactive' | 'pending'

}

const shimmerStyle = {
  background: 'linear-gradient(90deg, #E8E4DB 25%, #F0EDE6 50%, #E8E4DB 75%)',
  backgroundSize: '200% 100%',
}

const AgentCard = () => {
  const [agent, setAgent] = useState<Agent>({ name: '', role: '', status: 'pending' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/agent`)
  
        if (!res.ok) {
          console.error('Failed to fetch agent:', res.status)
          return
        }
  
        const data = await res.json()
        setAgent(data)
      } catch (error) {
        console.error('Failed to fetch agent:', error)
      } finally {
        setLoading(false)
      }
    }  
    fetchAgent() 
  }, [])      

  const statusConfig = {
    active:   { label: 'OPERATIONAL',     color: 'text-[#1A1A18] border-[#1A1A18]', dot: 'bg-[#4A7C59]' },
    inactive: { label: 'INACTIVE',        color: 'text-[#B85C38] border-[#B85C38]', dot: 'bg-[#B85C38]' },
    pending:  { label: 'NOT CONFIGURED',  color: 'text-[#999] border-[#CCC9C0]',    dot: 'bg-[#CCC9C0]' },
  }
  const s = statusConfig[agent.status as keyof typeof statusConfig] || statusConfig.pending


  const roleLabel: Record<string, string> = {
    receptionist: 'AI Receptionist',
    sales: 'Sales Representative',
    legal: 'Legal Assistant',
    support: 'Customer Support',
  }
  

  return (
    
    <div
      className="bg-[#FAF8F3] rounded-[14px] overflow-hidden"
      style={{ border: '0.5px solid #CCC9C0' }}
    >
      <div
        className="h-40"
        style={{ background: 'linear-gradient(135deg, #7BAE8A 0%, #C4A882 50%, #D4876A 100%)' }}
      />

      <div className="p-4">
        <div className="font-mono text-[11px] text-[#CCC9C0] tracking-[4px] mb-1">+ + + +</div>
        <div className="font-mono text-[9px] text-[#999] tracking-[1px] mb-1.5">
          REPRESENTATIVE ID / 001-A
        </div>

        {loading ? (
          <div className="flex flex-col gap-2 mt-1">
            {/* Name placeholder */}
            <div
              className="h-7 w-32 rounded animate-shimmer"
              style={shimmerStyle}
            />
            {/* Role placeholder */}
            <div
              className="h-2.5 w-20 rounded animate-shimmer"
              style={shimmerStyle}
            />
            {/* Status chip placeholder */}
            <div
              className="h-5 w-24 rounded animate-shimmer mt-1"
              style={shimmerStyle}
            />
          </div>
        ) : (
          <>
            <div className="font-condensed text-[30px] font-bold text-[#1A1A18] leading-[1.05] tracking-[-0.5px] uppercase mb-1">
              {agent.name || 'AI Assistant'}
            </div>
            <div className="font-mono text-[9px] text-[#888780] tracking-[0.5px] mb-2.5">
              {roleLabel[agent.role] || agent.role}
            </div>
            <div className={`inline-flex items-center gap-1.5 font-mono text-[9px] border px-2.5 py-1 rounded-[2px] tracking-[1px] ${s.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
              {s.label}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AgentCard