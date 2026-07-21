import Card from '../ui/Card.jsx'

function ProjectsSummaryCard({ projects }) {
  return (
    <Card className="rounded-[16px] border border-[#e5e5e5] bg-white p-6">
      <h3 className="mb-2 font-extrabold text-[#111827]">Active Projects</h3>
      <p className="text-[16px] font-extrabold text-[#3b82f6]">{projects.active}</p>
      <div className="mt-2 text-[12px] text-[#5f6679]">{projects.details}</div>
    </Card>
  )
}

export default ProjectsSummaryCard
