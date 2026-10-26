import { useState } from 'react'
import ProjectCard from '../cards/ProjectCard.jsx'

function HRProjectsView({ projects = [] }) {
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  // Calculate organizational allocation metrics
  const totalEmployeesAllocated = projects.reduce(
    (acc, p) => acc + (p.members?.length || p.membersCount || 0),
    0,
  )

  const teamProjectsCount = projects.filter((p) => p.staffingMode !== 'SOLO').length
  const soloProjectsCount = projects.filter((p) => p.staffingMode === 'SOLO').length

  const filteredProjects = projects.filter((p) => {
    const matchesFilter = filter === 'ALL' || p.status === filter
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                          (p.primaryPm && p.primaryPm.toLowerCase().includes(search.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div>
        <h1 className="text-[30px] font-black text-[#111827]">Company Projects &amp; Resource Allocation</h1>
        <p className="text-[14px] text-[#5f6679] mt-1">
          Company-wide organizational visibility to track workforce capacity, project staffing, and delivery milestones.
        </p>
      </div>

      {/* HR Read-Only Governance Banner */}
      <div className="rounded-[20px] border border-[#dbeafe] bg-[#eff6ff] p-4 text-[#1e40af] text-xs">
        <p className="font-bold">Organization Oversight (HR Scope):</p>
        <p className="mt-0.5">
          Per locked governance rules, HR has read-only access to monitor all company projects and headcount distribution. Task creation, approvals, and change requests are restricted to technical leads and executive management.
        </p>
      </div>

      {/* Organizational KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[20px] border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-[#6b7280]">Total Active Initiatives</p>
          <p className="mt-2 text-[28px] font-black text-[#2563eb]">
            {projects.filter((p) => p.status === 'ACTIVE').length}
          </p>
          <p className="text-xs text-[#9ca3af] mt-1">{projects.length} total projects across company</p>
        </div>

        <div className="rounded-[20px] border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-[#6b7280]">Allocated Headcount</p>
          <p className="mt-2 text-[28px] font-black text-[#10b981]">{totalEmployeesAllocated}</p>
          <p className="text-xs text-[#9ca3af] mt-1">Total project seat assignments</p>
        </div>

        <div className="rounded-[20px] border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-[#6b7280]">Staffing Structure</p>
          <p className="mt-2 text-[20px] font-bold text-[#111827]">
            {teamProjectsCount} Team <span className="text-xs font-normal text-[#6b7280]">/</span> {soloProjectsCount} Solo
          </p>
          <p className="text-xs text-[#9ca3af] mt-1">Team initiatives vs. independent contributors</p>
        </div>

        <div className="rounded-[20px] border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-[#6b7280]">Governance Authority</p>
          <p className="mt-2 text-[18px] font-black text-[#475569]">Read-Only Monitor</p>
          <p className="text-xs text-[#059669] font-medium mt-1">✓ Complete Directory Access</p>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#e5e7eb] pb-4">
        <div className="flex items-center gap-2">
          {['ALL', 'ACTIVE', 'PLANNED', 'ON_HOLD', 'COMPLETED'].map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                filter === tab
                  ? 'bg-[#111827] text-white shadow-sm'
                  : 'bg-[#f1f5f9] text-[#6b7280] hover:bg-[#e2e8f0]'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects or PMs..."
            className="w-full rounded-full border border-[#e5e7eb] bg-white px-4 py-1.5 text-xs text-[#111827] focus:border-[#2563eb] focus:outline-none"
          />
        </div>
      </div>

      {/* Company Projects Catalog */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        {filteredProjects.length === 0 && (
          <div className="col-span-full rounded-[24px] border border-dashed border-[#d1d5db] bg-white py-12 text-center text-xs text-[#9ca3af]">
            No projects found matching the filter criteria.
          </div>
        )}
      </div>
    </div>
  )
}

export default HRProjectsView
