import { describe, expect, it } from 'vitest'
import { memberIdentity, memberKey, withoutMember } from './projectMemberIdentity.js'

describe('project member identity', () => {
  it('identifies a member by user_id, falling back to id', () => {
    expect(memberIdentity({ user_id: 12, id: 99, name: 'Asha' })).toBe('12')
    expect(memberIdentity({ id: 7, name: 'Asha' })).toBe('7')
    expect(memberIdentity({ name: 'Asha' })).toBeNull()
  })

  it('never uses the name as an identity', () => {
    expect(memberIdentity({ name: 'Asha Rao' })).toBeNull()
    expect(memberKey({ name: 'Asha Rao' }, 0)).not.toContain('Asha')
  })

  it('removes only the member whose id matches, even when another member has the same name', () => {
    const members = [
      { user_id: 1, name: 'Asha Rao', is_active: true },
      { user_id: 2, name: 'Asha Rao', is_active: true },
    ]
    const remaining = withoutMember(members, 1)
    expect(remaining.map((m) => m.user_id)).toEqual([2])
    expect(remaining[0].name).toBe('Asha Rao')
  })

  it('keeps a member who has no id, rather than matching it by name', () => {
    const members = [{ name: 'Asha Rao' }, { user_id: 2, name: 'Asha Rao' }]
    expect(withoutMember(members, 2)).toEqual([{ name: 'Asha Rao' }])
  })

  it('removes nothing when the target id is missing', () => {
    const members = [{ user_id: 1, name: 'Asha Rao' }]
    expect(withoutMember(members, undefined)).toBe(members)
    expect(withoutMember(members, null)).toBe(members)
    expect(withoutMember(members, '')).toBe(members)
  })

  it('de-duplicates rows by id, and keeps id-less rows separate even when their names match', () => {
    const rows = [{ user_id: 5, name: 'A' }, { user_id: 5, name: 'A' }, { name: 'B' }, { name: 'B' }]
    const keys = rows.map((row, index) => memberKey(row, index))
    expect(keys[0]).toBe(keys[1])
    expect(keys[2]).not.toBe(keys[3])
  })
})
