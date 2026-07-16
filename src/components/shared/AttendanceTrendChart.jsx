import { useState } from 'react'
import { monthlyAttendance, weeklyAttendance } from '../../data/attendanceTrends'

export default function AttendanceTrendChart() {
  const [viewMode, setViewMode] = useState('monthly')
  const [selectedMonth, setSelectedMonth] = useState('Jul')
  const [hoverIndex, setHoverIndex] = useState(null)

  const chartData = viewMode === 'monthly' ? monthlyAttendance : weeklyAttendance[selectedMonth]
  const chartLabel = viewMode === 'monthly' ? 'Monthly attendance' : `${selectedMonth} weekly attendance`
  const selectedLabel = viewMode === 'monthly' ? 'Click a month to drill into weekly view' : `Showing weeks for ${selectedMonth}`

  const yAxisLabels = [100, 98, 96, 94, 92, 90]
  const maxValue = 100
  const minValue = 90
  const range = maxValue - minValue
  const chartWidth = 700
  const chartHeight = 280
  const points = chartData.map((item, index) => {
    const x = 50 + (index / (chartData.length - 1)) * (chartWidth - 100)
    const y = chartHeight - ((item.value - minValue) / range) * (chartHeight - 80) - 20
    return { ...item, x, y }
  })

  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')

  const handlePointClick = (label) => {
    if (viewMode === 'monthly') {
      setSelectedMonth(label)
      setViewMode('weekly')
      setHoverIndex(null)
    }
  }

  return (
    <div className="rounded-[30px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[20px] font-black text-[#111827]">{chartLabel}</h2>
          <p className="text-[14px] text-[#6b7280]">{selectedLabel}</p>
        </div>
        <div className="inline-flex rounded-full bg-[#f3f4f6] p-1">
          <button
            type="button"
            onClick={() => {
              setViewMode('monthly')
              setHoverIndex(null)
            }}
            className={`rounded-full px-5 py-2 text-[14px] font-semibold transition ${viewMode === 'monthly' ? 'bg-[#111827] text-white' : 'text-[#6b7280] hover:bg-[#e5e7eb]'}`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => {
              setViewMode('weekly')
              setHoverIndex(null)
            }}
            className={`rounded-full px-5 py-2 text-[14px] font-semibold transition ${viewMode === 'weekly' ? 'bg-[#111827] text-white' : 'text-[#6b7280] hover:bg-[#e5e7eb]'}`}
          >
            Weekly
          </button>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto">
        <div className="relative min-w-[720px] rounded-[28px] border border-[#e5e7eb] bg-[#fbfcfe] p-6">
          <svg viewBox="0 0 720 320" className="w-full h-[320px]">
            {yAxisLabels.map((label, index) => {
              const y = 40 + index * 44
              return (
                <g key={label}>
                  <line x1={50} y1={y} x2={670} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                  <text x={20} y={y + 5} className="text-[12px] fill-[#9ca3af]">
                    {label}%
                  </text>
                </g>
              )
            })}
            <path d={linePath} fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d={`${linePath} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`}
              fill="rgba(16, 185, 129, 0.15)"
            />
            {points.map((point, index) => (
              <g key={point.label}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={hoverIndex === index ? 10 : 7}
                  fill={hoverIndex === index ? '#2563eb' : '#10b981'}
                  stroke="#fff"
                  strokeWidth="3"
                  style={{ cursor: viewMode === 'monthly' ? 'pointer' : 'default' }}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                  onClick={() => handlePointClick(point.label)}
                />
                <text x={point.x} y={305} textAnchor="middle" className="text-[12px] fill-[#6b7280]">
                  {point.label}
                </text>
                {hoverIndex === index && (
                  <text x={point.x} y={point.y - 12} textAnchor="middle" className="text-[12px] font-semibold fill-[#111827]">
                    {point.value}%
                  </text>
                )}
              </g>
            ))}
          </svg>

          {hoverIndex !== null && (
            <div className="absolute left-[220px] top-24 rounded-2xl bg-white px-4 py-3 text-sm shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
              <p className="text-[#6b7280]">{chartData[hoverIndex].label}</p>
              <p className="mt-1 text-[18px] font-black text-[#111827]">{chartData[hoverIndex].value}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}