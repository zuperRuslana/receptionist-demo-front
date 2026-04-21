import { useNavigate, useLocation } from 'react-router-dom'
import React from 'react'

interface SidebarProps {
  onOpenModal: () => void
}

const iconClass = 'w-[14px] h-[14px] opacity-70 shrink-0'

const channels = [
  { label: 'All Messages', badge: 12 },
  { label: 'Instagram DMs', badge: 5 },
  { label: 'SMS / Messages', badge: null },
  { label: 'Website Chat', badge: null },
  { label: 'Phone Calls', badge: null },
]

const manage = [
  { label: 'Agent Settings', path: '/agent-settings' },
  { label: 'Knowledge Base', path: '/knowledge-base' },
  { label: 'Bookings', path: '/bookings' },
]

const icons: Record<string, React.ReactElement> = {
  'All Messages': (
    <svg className={iconClass} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M4 6h8M4 9h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  'Instagram DMs': (
    <svg className={iconClass} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="14" height="14" rx="7" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  ),
  'SMS / Messages': (
    <svg className={iconClass} viewBox="0 0 16 16" fill="none">
      <path d="M2 3h12v8H2z" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M2 3l6 5 6-5" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  ),
  'Website Chat': (
    <svg className={iconClass} viewBox="0 0 16 16" fill="none">
      <path d="M3 3a1 1 0 011-1h8a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V3z" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M5 7h6M5 10h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  'Phone Calls': (
    <svg className={iconClass} viewBox="0 0 16 16" fill="none">
      <path d="M3 5c0 4.97 4.03 9 9 9l1-2.5-2.5-1-1 1C8 11 5 8 4.5 6.5l1-1L4 3 1 4c0 1 2 5 2 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  'Agent Settings': (
    <svg className={iconClass} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M2 14c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  'Knowledge Base': (
    <svg className={iconClass} viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M5 8h6M5 5h6M5 11h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  'Bookings': (
    <svg className={iconClass} viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M5 3V1M11 3V1M2 7h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
}

const Sidebar = ({ onOpenModal }: SidebarProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeChannel, setActiveChannel] = React.useState<number | null>(null)

  return (
    <div
      className="bg-[#E8E4DB] px-[10px] py-4 flex flex-col gap-0.5"
      style={{ borderRight: '0.5px solid #CCC9C0' }}
    >
      <span className="font-mono text-[9px] text-[#999] tracking-[1.2px] px-2 mt-3 mb-1">
        CHANNELS
      </span>

      {channels.map((item, i) => (
        <button
          key={item.label}
          onClick={() => { setActiveChannel(i); onOpenModal(); }}
          className={`flex items-center gap-2 px-2 py-[7px] rounded-[6px] text-xs w-full text-left transition-colors duration-150 ease-in-out ${
            activeChannel === i
              ? 'bg-[#1A1A18] text-[#F0EDE6]'
              : 'text-[#5C5C58] hover:bg-[#D8D4CB]'
          }`}
        >
          {icons[item.label]}
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <span className="font-mono text-[9px] bg-[#B85C38] text-[#F0EDE6] px-[5px] py-[2px] rounded-[8px]">
              {item.badge}
            </span>
          )}
        </button>
      ))}

      <span className="font-mono text-[9px] text-[#999] tracking-[1.2px] px-2 mt-4 mb-1">
        MANAGE
      </span>

      {manage.map((item) => (
        <button
          key={item.label}
          onClick={() => navigate(item.path)}
          className={`flex items-center gap-2 px-2 py-[7px] rounded-[6px] text-xs w-full text-left transition-colors duration-150 ease-in-out ${
            location.pathname === item.path
              ? 'bg-[#1A1A18] text-[#F0EDE6]'
              : 'text-[#5C5C58] hover:bg-[#D8D4CB]'
          }`}
        >
          {icons[item.label]}
          {item.label}
        </button>
      ))}

    </div>
  )
}

export default Sidebar
