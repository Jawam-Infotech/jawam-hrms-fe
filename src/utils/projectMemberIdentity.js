// Stable identity for project members. The backend member row carries user_id (jawam-hrms-be project/serializers.py,
// MemberSerializer). Names are display text only and are never used to match, merge or remove a member.

// The member's id as a string, or null when the row carries no id.
export function memberIdentity(member) {
  const id = member?.user_id ?? member?.id
  return id === undefined || id === null || id === '' ? null : String(id)
}

// A key for de-duplicating member rows. Rows with the same id share a key. A row without an id gets its own key from its
// position, so it can never merge with another member just because the names match.
export function memberKey(member, index) {
  const id = memberIdentity(member)
  return id !== null ? `id:${id}` : `row:${index}`
}

// The members without the one whose id is userId. Matching is by id only. Another member with the same name is kept. A
// missing userId removes nothing.
export function withoutMember(members, userId) {
  const target = userId === undefined || userId === null || userId === '' ? null : String(userId)
  if (target === null) return members
  return members.filter((m) => memberIdentity(m) !== target)
}
