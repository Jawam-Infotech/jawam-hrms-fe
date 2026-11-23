// Project Module In-App Notification Dispatcher
// Manages activity notifications across roles (CEO, TL, PM, Employee)
// Updates both the bell notification tray and triggers real-time toast popups

export const NOTIF_STORAGE_KEY = 'jawam_custom_notifications_v1'
export const NOTIF_POPUP_EVENT = 'jawam_notification_popup_trigger'
export const NOTIF_BC_CHANNEL = 'jawam_notifications_bc'

/**
 * Checks whether a notification is intended for a specific user based on role, user ID, or user name
 */
export function isNotificationTargetingUser(notif, currentUser) {
  if (!notif) return false
  if (!currentUser) return false

  const curRole = String(currentUser.role || '').toUpperCase()
  const curId = String(currentUser.id || currentUser.user_id || '')
  const curName = String(currentUser.name || '').trim().toLowerCase()

  // 1. Exact user ID match
  if (notif.targetUserId && curId && String(notif.targetUserId) === curId) {
    return true
  }

  // 2. Exact user Name match
  if (notif.targetUserName && curName && String(notif.targetUserName).trim().toLowerCase() === curName) {
    return true
  }

  // 3. Broadcast to ALL
  if (!notif.targetRole || notif.targetRole === 'ALL') {
    return true
  }

  // 4. TL / PM leadership role match:
  // If notification is targeted to TL, PM, or TL_PM, any active TL or CEO qualifies as leadership
  const targetUpper = String(notif.targetRole).toUpperCase()
  const isLeadUser = curRole === 'TL' || curRole === 'CEO'
  const isLeadTarget = targetUpper === 'TL_PM' || targetUpper === 'PM' || targetUpper === 'TL'

  if (isLeadTarget && isLeadUser) {
    // If a specific targetUserId is provided, check if it matches
    if (notif.targetUserId && curId && String(notif.targetUserId) === curId) {
      return true
    }
    // If no specific user ID is locked, any TL/CEO overseeing projects receives the notification
    if (!notif.targetUserId) {
      return true
    }
  }

  // 5. Standard Role match
  if (targetUpper === curRole) {
    // If it also specifies a targetUserId that doesn't match this user, it's NOT for this user
    if (notif.targetUserId && curId && String(notif.targetUserId) !== curId) {
      return false
    }
    // If it also specifies a targetUserName that doesn't match this user, it's NOT for this user
    if (notif.targetUserName && curName && String(notif.targetUserName).trim().toLowerCase() !== curName) {
      return false
    }
    return true
  }

  return false
}

/**
 * Dispatch an in-app notification to the bell tray and trigger an on-screen toast popup
 * @param {Object} options
 * @param {string} options.title - Notification title (e.g., '📋 New Project Request')
 * @param {string} options.message - Notification message content
 * @param {string} [options.type] - Notification type: 'info' | 'success' | 'warning' | 'error'
 * @param {string} [options.targetRole] - Target role: 'CEO' | 'TL' | 'PM' | 'EMPLOYEE' | 'ALL'
 * @param {string|number} [options.targetUserId] - Specific user ID recipient (optional)
 * @param {string} [options.targetUserName] - Specific user name recipient (optional)
 * @param {string} [options.link] - Actionable redirect link (e.g., '/projects/2')
 */
export function dispatchProjectNotification({
  title = 'Project Notification',
  message = '',
  type = 'info',
  targetRole = 'ALL',
  targetUserId = null,
  targetUserName = null,
  link = '/projects',
}) {
  const newNotif = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title,
    message,
    type,
    targetRole,
    targetUserId: targetUserId ? String(targetUserId) : null,
    targetUserName: targetUserName ? String(targetUserName) : null,
    link,
    created_at: new Date().toISOString(),
    is_read: false,
  }

  // 1. Persist to shared custom notifications for the bell tray
  try {
    const raw = localStorage.getItem(NOTIF_STORAGE_KEY)
    const existing = raw ? JSON.parse(raw) : []
    // Keep latest 100 notifications
    const updated = [newNotif, ...existing].slice(0, 100)
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.error('Failed to save project notification:', err)
  }

  // 2. Dispatch custom event for real-time in-app toast popup in the current window
  try {
    const event = new CustomEvent(NOTIF_POPUP_EVENT, { detail: newNotif })
    window.dispatchEvent(event)
  } catch (err) {
    console.error('Failed to dispatch notification event:', err)
  }

  // 3. Broadcast across browser tabs via BroadcastChannel if available
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel(NOTIF_BC_CHANNEL)
      bc.postMessage(newNotif)
      bc.close()
    }
  } catch (err) {
    console.error('Failed to broadcast notification:', err)
  }

  return newNotif
}
