import { useMemo, useState } from 'react'

const VIEWBOX_WIDTH = 840
const VIEWBOX_HEIGHT = 280
const PADDING = { top: 28, right: 28, bottom: 52, left: 56 }

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function formatPercent(value) {
  return value === null || value === undefined ? '-' : `${Math.round(value * 10) / 10}%`
}

function normalizeTrendPoint(point = {}, index = 0) {
  return {
    label: point.label || point.month || point.week || String(index + 1),
    value: point.value === null || point.value === undefined ? null : Number(point.value),
    presentEmployees: point.presentEmployees === null || point.presentEmployees === undefined ? null : Number(point.presentEmployees),
  }
}

function buildPointCoordinates(points = []) {
  const plotWidth = VIEWBOX_WIDTH - PADDING.left - PADDING.right
  const plotHeight = VIEWBOX_HEIGHT - PADDING.top - PADDING.bottom

  return points.map((point, index) => {
    const denominator = Math.max(points.length - 1, 1)
    const x = points.length === 1 ? PADDING.left + plotWidth / 2 : PADDING.left + (plotWidth * index) / denominator
    const y = point.value === null ? null : PADDING.top + (1 - clamp(point.value, 0, 100) / 100) * plotHeight

    return { ...point, x, y }
  })
}

function createSmoothLinePaths(points = []) {
  const paths = []
  let segment = []

  const addSegment = () => {
    if (segment.length === 0) return

    if (segment.length === 1) {
      paths.push(`M ${segment[0].x} ${segment[0].y}`)
    } else {
      let path = `M ${segment[0].x} ${segment[0].y}`

      for (let index = 1; index < segment.length; index += 1) {
        const previous = segment[index - 1]
        const current = segment[index]
        const controlX = previous.x + (current.x - previous.x) / 2
        path += ` Q ${controlX} ${previous.y}, ${current.x} ${current.y}`
      }

      paths.push(path)
    }

    segment = []
  }

  points.forEach((point) => {
    if (point.y === null) {
      addSegment()
    } else {
      segment.push(point)
    }
  })

  addSegment()
  return paths
}

function createAreaPaths(points = []) {
  const paths = []
  let segment = []

  const addSegment = () => {
    if (segment.length < 2) {
      segment = []
      return
    }

    const linePaths = createSmoothLinePaths(segment)
    if (!linePaths.length) {
      segment = []
      return
    }

    const linePath = linePaths[0]
    const lastPoint = segment[segment.length - 1]
    const firstPoint = segment[0]
    const bottom = VIEWBOX_HEIGHT - PADDING.bottom

    paths.push(`${linePath} L ${lastPoint.x} ${bottom} L ${firstPoint.x} ${bottom} Z`)
    segment = []
  }

  points.forEach((point) => {
    if (point.y === null) {
      addSegment()
    } else {
      segment.push(point)
    }
  })

  addSegment()
  return paths
}

function getTooltipPosition(point = {}) {
  const horizontalOffset = point.x > VIEWBOX_WIDTH * 0.7 ? -185 : 18
  const verticalOffset = point.y < VIEWBOX_HEIGHT * 0.35 ? 18 : -148

  return {
    left: `${((point.x + horizontalOffset) / VIEWBOX_WIDTH) * 100}%`,
    top: `${((point.y + verticalOffset) / VIEWBOX_HEIGHT) * 100}%`,
  }
}

function AttendanceTrendChart({ weeklyData = [], monthlyData = [], loading = false }) {
  const hasEnhancedData = weeklyData.length > 0 || monthlyData.length > 0
  const [viewMode, setViewMode] = useState('weekly')
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const effectiveViewMode = viewMode === 'weekly'
    ? weeklyData.length > 0 ? 'weekly' : monthlyData.length > 0 ? 'monthly' : 'weekly'
    : monthlyData.length > 0 ? 'monthly' : weeklyData.length > 0 ? 'weekly' : 'monthly'

  const selectedData = useMemo(() => {
    if (!hasEnhancedData) return []

    const source = effectiveViewMode === 'weekly'
      ? weeklyData.length > 0 ? weeklyData : monthlyData
      : monthlyData.length > 0 ? monthlyData : weeklyData

    return source.map(normalizeTrendPoint)
  }, [effectiveViewMode, hasEnhancedData, monthlyData, weeklyData])

  const chartPoints = useMemo(() => buildPointCoordinates(selectedData), [selectedData])
  const linePaths = useMemo(() => createSmoothLinePaths(chartPoints), [chartPoints])
  const areaPaths = useMemo(() => createAreaPaths(chartPoints), [chartPoints])
  const hasEnhancedChartData = chartPoints.some((point) => point.y !== null)

  if (!hasEnhancedData) return null

  return (
    <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h2 className="text-[20px] font-black text-[#111827]">Attendance Trend Graph</h2>
          <p className="mt-1 text-[14px] text-[#6b7280]">Attendance percentage across the selected date range.</p>
        </div>

        <div className="inline-flex rounded-full border border-[#d1d5db] bg-[#f9fafb] p-1">
          {['weekly', 'monthly'].map((option) => {
            const isActive = effectiveViewMode === option
            const isDisabled = option === 'weekly' ? weeklyData.length === 0 : monthlyData.length === 0

            return (
              <button
                key={option}
                type="button"
                onClick={() => setViewMode(option)}
                disabled={isDisabled}
                className={`rounded-full px-4 py-2 text-[13px] font-extrabold transition ${isActive ? 'bg-[#3b82f6] text-white shadow-sm' : 'text-[#6b7280] hover:text-[#111827]'} ${isDisabled ? 'cursor-not-allowed opacity-40' : ''}`}
              >
                {option === 'weekly' ? 'Weekly' : 'Monthly'}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-5 rounded-[24px] border border-[#e5e7eb] bg-[#fbfcfe] p-4 sm:p-6">
        {loading ? (
          <div className="grid min-h-[260px] place-items-center rounded-[20px] bg-white text-[14px] font-semibold text-[#6b7280]">Loading attendance trend...</div>
        ) : hasEnhancedChartData ? (
          <>
            <div className="relative overflow-hidden rounded-[20px] bg-white">
              <svg viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} className="h-[240px] w-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="attendance-line-gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {[0, 25, 50, 75, 100].map((tick) => {
                  const y = PADDING.top + (1 - tick / 100) * (VIEWBOX_HEIGHT - PADDING.top - PADDING.bottom)

                  return (
                    <g key={tick}>
                      <line x1={PADDING.left} x2={VIEWBOX_WIDTH - PADDING.right} y1={y} y2={y} stroke="#e5e7eb" strokeDasharray="4 6" />
                      <text x={18} y={y + 4} fill="#6b7280" fontSize="12" fontWeight="700">{tick}%</text>
                    </g>
                  )
                })}

                {areaPaths.map((path, index) => <path key={`area-${index}`} d={path} fill="url(#attendance-line-gradient)" />)}
                {linePaths.map((path, index) => <path key={`line-${index}`} d={path} fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />)}

                {chartPoints.map((point, index) => {
                  if (point.y === null) return null

                  const isActive = hoveredIndex === index

                  return (
                    <g key={`${point.label}-${index}`} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
                      <circle cx={point.x} cy={point.y} r={isActive ? 7 : 5} fill="#ffffff" stroke="#3b82f6" strokeWidth={isActive ? 4 : 3} style={{ transition: 'all 180ms ease' }} />
                      {isActive && <circle cx={point.x} cy={point.y} r="13" fill="#3b82f6" opacity="0.12" />}
                    </g>
                  )
                })}

                {chartPoints.map((point, index) => (
                  <line key={`x-${point.label}-${index}`} x1={point.x} x2={point.x} y1={VIEWBOX_HEIGHT - PADDING.bottom} y2={VIEWBOX_HEIGHT - PADDING.bottom + 10} stroke="#cbd5e1" />
                ))}

                {chartPoints.map((point, index) => (
                  <text key={`label-${point.label}-${index}`} x={point.x} y={VIEWBOX_HEIGHT - 16} fill="#111827" fontSize="12" fontWeight="700" textAnchor="middle">{point.label}</text>
                ))}
              </svg>

              {chartPoints.map((point, index) => {
                if (point.y === null || hoveredIndex !== index) return null

                return (
                  <div key={`tooltip-${point.label}-${index}`} className="pointer-events-none absolute z-20 w-[180px] rounded-[16px] border border-[#e5e7eb] bg-white px-4 py-3 shadow-[0_18px_48px_rgba(15,23,42,0.14)]" style={getTooltipPosition(point)}>
                    <p className="text-[12px] font-black text-[#111827]">{point.label}</p>
                    <div className="mt-2 space-y-1 text-[12px] text-[#6b7280]">
                      <div className="flex items-center justify-between gap-3">
                        <span>{effectiveViewMode === 'monthly' ? 'Average Attendance' : 'Attendance'}</span>
                        <span className="font-extrabold text-[#111827]">{formatPercent(point.value)}</span>
                      </div>

                      {effectiveViewMode === 'weekly' && (
                        <div className="flex items-center justify-between gap-3">
                          <span>Present Employees</span>
                          <span className="font-extrabold text-[#111827]">{point.presentEmployees ?? '-'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-[13px] font-semibold text-[#6b7280]">
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#3b82f6]" />Attendance %</div>
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#dbeafe]" />Selected range</div>
            </div>
          </>
        ) : (
          <div className="grid min-h-[260px] place-items-center rounded-[20px] bg-white text-[14px] font-semibold text-[#6b7280]">No attendance trend data found for the selected range.</div>
        )}
      </div>
    </div>
  )
}

export default AttendanceTrendChart