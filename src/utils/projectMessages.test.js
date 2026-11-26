import { describe, expect, it } from 'vitest'
import { changeRejectedMessage, completionRejectedMessage } from './projectMessages.js'

describe('changeRejectedMessage', () => {
  it('is a generic confirmation that names the task and carries no typed reviewer reason', () => {
    expect(changeRejectedMessage('Login page')).toBe('Change request for task "Login page" was rejected.')
  })

  it('falls back to a generic task name when none is given', () => {
    expect(changeRejectedMessage(undefined)).toBe('Change request for task "Task" was rejected.')
  })

  it('takes no reason argument, so a typed reason cannot be included', () => {
    expect(changeRejectedMessage.length).toBe(1)
  })
})

describe('completionRejectedMessage', () => {
  it('names the task and states the rejection without any reviewer reason', () => {
    expect(completionRejectedMessage('Login page')).toBe(
      'Deliverable for task "Login page" was rejected. Open the task to see the next steps.'
    )
  })

  it('falls back to a generic task name when none is given', () => {
    expect(completionRejectedMessage(undefined)).toContain('for task "Task" was rejected')
    expect(completionRejectedMessage('')).toContain('for task "Task" was rejected')
  })

  it('takes no reason argument, so a reason cannot be included', () => {
    expect(completionRejectedMessage.length).toBe(1)
  })
})
