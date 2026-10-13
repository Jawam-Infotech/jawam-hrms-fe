import ListSectionCard from '../../../ui/ListSectionCard.jsx'

const projectStatus = [
  { name: 'IMS Software', status: 'Doing Progress' },
  { name: 'HRMS Software', status: 'Doing Progress' },
  { name: 'Website Redesigning', status: 'Doing Progress' },
]

function ProjectStatusCard({ onFooterClick }) {
  return (
    <ListSectionCard
      title="Project Status"
      footerText="View All Announcement"
      onFooterClick={onFooterClick}
    >
      <div className="space-y-4">
        {projectStatus.map((project) => (
          <div
            key={project.name}
            className="pb-4 border-b border-[#e5e7eb] last:border-0"
          >
            <p className="text-[14px] font-semibold text-[#111827]">
              {project.name}
            </p>
            <p className="text-[12px] text-[#6b7280] mt-1">
              {project.status}
            </p>
          </div>
        ))}
      </div>
    </ListSectionCard>
  )
}

export default ProjectStatusCard
