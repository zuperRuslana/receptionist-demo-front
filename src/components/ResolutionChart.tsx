const bars = [
  { day: 'Mon', h: 35 },
  { day: 'Tue', h: 58 },
  { day: 'Wed', h: 82 },
  { day: 'Thu', h: 62 },
  { day: 'Fri', h: 48 },
  { day: 'Sat', h: 70 },
]

const ResolutionChart = () => (
  <div
    className="bg-[#FAF8F3] rounded-[14px] px-5 py-[18px]"
    style={{ border: '0.5px solid #CCC9C0' }}
  >
    {/* Header row: title + average */}
    <div className="flex justify-between items-baseline mb-4">
      <span className="text-sm font-medium text-[#1A1A18]">Resolution Rate</span>
      <span className="font-mono text-[11px] text-[#999]">94% Avg</span>
    </div>

    {/* Bar chart — 80px tall, bars grow from the bottom */}
    <div className="flex items-end gap-2 h-20 mb-2">
      {bars.map((b, i) => (
        <div key={b.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
          <div
            className="w-full rounded-t-[6px] animate-barGrow"
            style={{
              height: `${b.h}%`,
              background: 'linear-gradient(180deg, #D3D1C7 0%, #E8E4DB 100%)',
              transformOrigin: 'bottom',
              animationDelay: `${i * 60}ms`,
            }}
          />
          <span className="text-[11px] text-[#999]">{b.day}</span>
        </div>
      ))}
    </div>

    {/* Divider */}
    <div className="my-3" style={{ borderTop: '0.5px solid #CCC9C0' }} />

    {/* Description */}
    <p className="text-xs text-[#888] leading-[1.6]">
      Mary Jane resolved 48 conversations this week. Escalation rate: 6%.
    </p>
  </div>
)

export default ResolutionChart
