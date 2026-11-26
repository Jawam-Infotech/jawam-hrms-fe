import CelebrationModal from '../../shared/CelebrationModal.jsx'
import useCelebrations from '../../../hooks/useCelebrations.js'

function DashboardCelebrationCoordinator() {
  const { activeCelebration, isModalOpen, closeCelebration } = useCelebrations()

  if (!activeCelebration) return null

  return (
    <CelebrationModal
      isOpen={isModalOpen}
      celebrationType={activeCelebration.type}
      employeeName={activeCelebration.employeeName}
      completedYears={activeCelebration.completedYears}
      onClose={closeCelebration}
    />
  )
}

export default DashboardCelebrationCoordinator
