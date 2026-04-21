import { useNavigate, useLocation } from 'react-router-dom'

interface TopBarProps {
  onOpenTestChat: () => void
}

const TopBar = ({onOpenTestChat}: TopBarProps) => {
    const navigate = useNavigate()
    const location = useLocation()

    const navItems = [
        { label: '01/ home', path: '/' },
        { label: '02/ inbox', path: '/inbox' },
        { label: '03/ bookings', path: '/bookings' },
        { label: '04/ settings', path: '/agent-settings' },
        { label: '05/ test', path: null, onClick: onOpenTestChat },
      ]

    return (
      <div className="col-span-2 bg-[#1A1A18] flex items-center justify-between px-6 h-12">
        
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4A7C59] animate-pulse" />
          <span className="font-mono text-[#F0EDE6] text-xs tracking-widest">
            Agentique AI
          </span>
        </div>
  
        {/* Nav */}
        <nav className="flex gap-1">
            {navItems.map((item) => (
                 <button
                    key={item.label}
                    onClick={() => item.path ? navigate(item.path) : item.onClick?.()}
                    className={`font-mono text-[11px] px-3 py-1 rounded tracking-wide transition-colors duration-150 ease-in-out ${
                      item.path && location.pathname === item.path
                        ? 'bg-[#F0EDE6] text-[#1A1A18]'
                        : 'text-[#666] hover:text-[#F0EDE6]'
                    }`}
                >
                    {item.label}
                </button>
            ))}
        </nav>

        {/* Logout */}
        <button
          onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('businessId'); navigate('/login') }}
          className="font-mono text-[11px] bg-[#4A7C59] text-[#F0EDE6] px-3 py-1 rounded-full tracking-wide hover:bg-[#3a6147] transition-colors duration-150"
        >
          logout
        </button>
      </div>
    )
  }
  
  export default TopBar
