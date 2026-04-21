import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authFetch } from '../utils/api'

interface Service {
  id: number
  name: string
  category: string
  price: string
}

const KnowledgeBase = () => {
  const navigate = useNavigate()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/services`)
        if (res.ok) setServices(await res.json())
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  return (
    <div
      className="bg-[#FAF8F3] rounded-[14px] overflow-hidden"
      style={{ border: '0.5px solid #CCC9C0' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '0.5px solid #CCC9C0' }}
      >
        <span className="font-mono text-[10px] text-[#1A1A18] tracking-[1.5px]">
          KNOWLEDGE BASE
        </span>
        <button
          onClick={() => navigate('/knowledge-base')}
          className="font-mono text-[9px] text-[#4A7C59] hover:text-[#1A1A18] transition-colors tracking-wide"
        >
          MANAGE →
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="font-mono text-[10px] text-[#CCC9C0] text-center py-6 tracking-[1px]">
          LOADING...
        </div>
      ) : services.length === 0 ? (
        <div className="p-4 flex flex-col items-center gap-2">
          <div className="font-mono text-[10px] text-[#CCC9C0] tracking-[1px]">
            NO SERVICES ADDED YET
          </div>
          <button
            onClick={() => navigate('/knowledge-base')}
            className="font-mono text-[9px] text-[#4A7C59] border border-[#4A7C59] px-3 py-1 rounded transition-colors hover:bg-[#4A7C59] hover:text-[#F0EDE6]"
          >
            + ADD SERVICES
          </button>
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['SERVICE', 'CATEGORY', 'PRICE'].map(h => (
                <th
                  key={h}
                  className="font-mono text-[9px] text-[#999] tracking-[1px] px-4 py-[8px] text-left"
                  style={{ borderBottom: '0.5px solid #EAE7E0' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {services.slice(0, 5).map(s => (
              <tr key={s.id} className="hover:bg-[#F0EDE6] transition-colors">
                <td className="text-[12px] text-[#1A1A18] px-4 py-[8px]" style={{ borderBottom: '0.5px solid #EAE7E0' }}>
                  {s.name}
                </td>
                <td className="px-4 py-[8px]" style={{ borderBottom: '0.5px solid #EAE7E0' }}>
                  <span className="font-mono text-[9px] bg-[#EAE7E0] text-[#5C5C58] px-2 py-[2px] rounded-[10px]">
                    {s.category || '—'}
                  </span>
                </td>
                <td className="text-[12px] text-[#1A1A18] px-4 py-[8px]" style={{ borderBottom: '0.5px solid #EAE7E0' }}>
                  {s.price || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Footer — show if more than 5 */}
      {services.length > 5 && (
        <div
          className="px-4 py-2 flex justify-between items-center"
          style={{ borderTop: '0.5px solid #EAE7E0' }}
        >
          <span className="font-mono text-[9px] text-[#999] tracking-wide">
            +{services.length - 5} MORE SERVICES
          </span>
          <button
            onClick={() => navigate('/knowledge-base')}
            className="font-mono text-[9px] text-[#4A7C59] hover:text-[#1A1A18] transition-colors"
          >
            VIEW ALL →
          </button>
        </div>
      )}
    </div>
  )
}

export default KnowledgeBase