const STORAGE_KEY = 'jawamhr_task_rejections'

function getAllRejections() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function getTaskRejection(taskId) {
  if (!taskId) return null
  const all = getAllRejections()
  return all[String(taskId)] || null
}

export function recordTaskRejection(taskId, { reason = '', rejectedBy = '', rejectedAt = null } = {}) {
  if (!taskId) return null
  const all = getAllRejections()
  const current = all[String(taskId)] || {}
  const updatedRecord = {
    taskId: String(taskId),
    reason: reason.trim() || current.reason || 'Rework required by reviewer.',
    rejectedBy: rejectedBy || current.rejectedBy || 'Reviewer',
    rejectedAt: rejectedAt || new Date().toISOString(),
    count: (current.count || 0) + 1,
  }
  all[String(taskId)] = updatedRecord
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch (err) {
    console.warn('Failed to persist task rejection to storage:', err)
  }
  return updatedRecord
}

export function clearTaskRejection(taskId) {
  if (!taskId) return
  const all = getAllRejections()
  if (all[String(taskId)]) {
    delete all[String(taskId)]
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
    } catch (err) {
      console.warn('Failed to clear task rejection from storage:', err)
    }
  }
}
