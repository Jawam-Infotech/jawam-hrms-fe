// Project Member Removal Persistence
// Ensures members removed via E06 are permanently removed from project tables

export function getRemovedMembers(projectId) {
  if (!projectId) return []
  try {
    const raw = localStorage.getItem(`jawam_removed_members_p${projectId}`)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function recordRemovedMember(projectId, userId) {
  if (!projectId || !userId) return
  try {
    const current = getRemovedMembers(projectId)
    const updated = [...new Set([...current, String(userId)])]
    localStorage.setItem(`jawam_removed_members_p${projectId}`, JSON.stringify(updated))
  } catch (e) {
    console.error('Error recording removed member:', e)
  }
}

export function clearRemovedMember(projectId, userId) {
  if (!projectId || !userId) return
  try {
    const current = getRemovedMembers(projectId)
    const updated = current.filter((id) => String(id) !== String(userId))
    localStorage.setItem(`jawam_removed_members_p${projectId}`, JSON.stringify(updated))
  } catch (e) {
    console.error('Error clearing removed member:', e)
  }
}
