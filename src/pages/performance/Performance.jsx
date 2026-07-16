import { useContext } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { UserContext } from '../../context/UserContext'

const summaryData = [
  {
    title: 'Performance Score',
    value: '89%',
    detail: 'Track your overall rating',
    icon: '📊',
    colorClass: 'text-[#2563eb]',
    bgClass: 'bg-[#eff6ff]',
  },
  {
    title: 'Current Rating',
    value: 'Exceed Expectations',
    detail: 'Goal achievement status',
    icon: '⭐',
    colorClass: 'text-[#0f766e]',
    bgClass: 'bg-[#ecfdf5]',
  },
  {
    title: 'Quarterly Progress',
    value: '+8%',
    detail: 'Improvement from last quarter',
    icon: '📈',
    colorClass: 'text-[#16a34a]',
    bgClass: 'bg-[#dcfce7]',
  },
  {
    title: 'Area of Improvement',
    value: '3',
    detail: 'Key focus opportunities',
    icon: '🩺',
    colorClass: 'text-[#b91c1c]',
    bgClass: 'bg-[#fee2e2]',
  },
]

const breakdownData = [
  { label: 'Attendance & Reliability', value: 92, color: '#ef4444' },
  { label: 'Task Completion', value: 85, color: '#2563eb' },
  { label: 'Work Updates Consistency', value: 90, color: '#0ea5e9' },
  { label: 'Project Contributions', value: 80, color: '#22c55e' },
  { label: 'Team Leader Review', value: 75, color: '#f59e0b' },
]

const historyRows = [
  { quarter: 'Q2 2026 (Apr - Jun)', score: '82%', trend: '+6%', rating: 'Exceeds Expectation' },
  { quarter: 'Q1 2026 (Jan - Mar)', score: '78%', trend: '+8%', rating: 'Meets Expectation' },
  { quarter: 'Q4 2025 (Oct - Dec)', score: '70%', trend: '-2%', rating: 'Meets Expectation' },
  { quarter: 'Q3 2025 (Jul - Sept)', score: '72%', trend: '+3%', rating: 'Meets Expectation' },
]

const strengths = [
  'Consistent Work Updates',
  'Strong Project Contribution',
  'Excellent Attendance',
  'Good Communication',
  'Quick Learner',
]

const focusAreas = [
  'Focus on Task Prioritisation',
  'Better Time Estimation',
  'Increase Documentation Quality',
]

function Performance() {
  const { user } = useContext(UserContext)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-[32px] font-black text-[#111827]">Performance</h1>
            <p className="text-[16px] text-[#5f6679] mt-2">
              Track your performance, achievement and growth
            </p>
          </div>
          <div className="rounded-full border border-[#e5e7eb] bg-white px-5 py-3 text-[14px] font-semibold text-[#111827]">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryData.map((item) => (
            <div key={item.title} className="rounded-[18px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[14px] font-semibold text-[#6b7280]">{item.title}</p>
                  <p className="mt-4 text-[28px] font-black text-[#111827]">{item.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-2xl ${item.bgClass} flex items-center justify-center text-[20px] ${item.colorClass}`}>
                  {item.icon}
                </div>
              </div>
              <p className="mt-4 text-[13px] text-[#6b7280]">{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
          <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[20px] font-black text-[#111827]">Performance Breakdown</h2>
                <p className="text-[14px] text-[#6b7280] mt-1">See how your key metrics are performing.</p>
              </div>
              <div className="inline-flex items-center gap-3 rounded-full border border-[#e5e7eb] bg-[#f8fafc] px-4 py-3 text-[14px] font-semibold text-[#111827]">
                <span className="h-3 w-3 rounded-full bg-[#10b981]" />
                Overall performance
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {breakdownData.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-[14px] font-semibold text-[#374151]">
                    <span>{item.label}</span>
                    <span className="text-[#111827]">{item.value}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-[#e5e7eb]">
                    <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <h2 className="text-[20px] font-black text-[#111827]">Quarterly Review Summary</h2>
            <div className="mt-6 space-y-4 text-[14px] text-[#6b7280]">
              <div className="flex justify-between gap-4">
                <span>Performance Score</span>
                <span className="font-semibold text-[#111827]">82%</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Rating</span>
                <span className="font-semibold text-[#111827]">Exceeds Expectation</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Review Period</span>
                <span className="font-semibold text-[#111827]">Apr 01 - Jun 30, 2026</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Reviewed By</span>
                <span className="font-semibold text-[#111827]">Nandan Kumar</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Review Date</span>
                <span className="font-semibold text-[#111827]">Jun 20, 2026</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.55fr_0.85fr]">
          <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <h2 className="text-[20px] font-black text-[#111827]">Performance History</h2>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-left text-[14px] text-[#374151]">
                <thead className="border-b border-[#e5e7eb] text-[#6b7280]">
                  <tr>
                    <th className="py-4 font-semibold">Quarter</th>
                    <th className="py-4 font-semibold">Score</th>
                    <th className="py-4 font-semibold">Trend</th>
                    <th className="py-4 font-semibold">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {historyRows.map((row) => (
                    <tr key={row.quarter} className="border-b border-[#f3f4f6] hover:bg-[#f8fafc]">
                      <td className="py-4 font-semibold text-[#111827]">{row.quarter}</td>
                      <td className="py-4">{row.score}</td>
                      <td className="py-4 text-[#16a34a]">{row.trend}</td>
                      <td className="py-4">
                        <span className="rounded-full border border-[#e5e7eb] bg-[#f8fafc] px-3 py-1 text-[12px] font-semibold text-[#111827]">
                          {row.rating}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <h2 className="text-[20px] font-black text-[#111827]">Strengths</h2>
              <ul className="mt-4 space-y-3 text-[14px] text-[#374151]">
                {strengths.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#2563eb]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <h2 className="text-[20px] font-black text-[#111827]">Focus Areas</h2>
              <ul className="mt-4 space-y-3 text-[14px] text-[#374151]">
                {focusAreas.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#22c55e]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Performance
