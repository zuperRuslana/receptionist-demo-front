// StatsGrid — 2×2 grid of KPI cells with large Barlow Condensed numbers.
// Internal borders are 0.5px via inline style because Tailwind only does 1px natively.
// Each cell's border depends on its position: right border for col 1, bottom border for row 1.
const stats = [
  { label: 'AVG RESPONSE',       value: '1.2s' },
  { label: 'RESOLUTION RATE',    value: '94%'  },
  { label: 'DAILY CONVERSATIONS',value: '48'   },
  { label: 'BOOKINGS TODAY',     value: '7'    },
]

const StatsGrid = () => (
  <div
    className="grid grid-cols-2 bg-[#FAF8F3] rounded-[14px] overflow-hidden"
    style={{ border: '0.5px solid #CCC9C0' }}
  >
    {stats.map((s, i) => (
      <div
        key={s.label}
        className="px-[26px] py-[22px]"
        style={{
          borderRight:  i % 2 === 0 ? '0.5px solid #CCC9C0' : 'none',
          borderBottom: i < 2       ? '0.5px solid #CCC9C0' : 'none',
        }}
      >
        {/* Label */}
        <div className="font-mono text-[9px] text-[#999] tracking-[1px] mb-2.5">
          {s.label}
        </div>

        {/* Big value — Barlow Condensed Bold, orange */}
        <div className="font-condensed text-[42px] font-bold text-[#B85C38] leading-none tracking-[-1px]">
          {s.value}
        </div>

        {/* Decorative dots */}
        <div className="font-mono text-[13px] text-[#D3D1C7] mt-2 tracking-[4px]">• • •</div>
      </div>
    ))}
  </div>
)

export default StatsGrid
