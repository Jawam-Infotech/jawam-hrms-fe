// Notice text for project actions. Completion-review rejection notices are generic: they name the task and never include
// the reviewer's reason. The reason is out of scope for these notices (only Task-Change Request reasons are governed by
// D-37, and those are shown by the authorized change-request view).

export function completionRejectedMessage(taskName) {
  return `Deliverable for task "${taskName || 'Task'}" was rejected. Open the task to see the next steps.`
}

// The toast after a Task-Change Request decision. It is a generic confirmation. The reviewer's typed reason is not
// included, so the reason is not broadcast. The reason is shown only through the authorized change-request endpoint.
export function changeRejectedMessage(taskName) {
  return `Change request for task "${taskName || 'Task'}" was rejected.`
}
