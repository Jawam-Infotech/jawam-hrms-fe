/* @vitest-environment jsdom */
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute.jsx'
import { UserContext } from '../context/UserContext.jsx'

function renderRoute(user) {
  return render(<UserContext.Provider value={{ user, isBootstrapping: false }}><MemoryRouter initialEntries={['/announcements']}><Routes><Route path="/announcements" element={<ProtectedRoute allowedRoles={['CEO', 'HR']}><div>Announcements page</div></ProtectedRoute>} /><Route path="/dashboard/ceo" element={<div>CEO dashboard</div>} /><Route path="/dashboard/hr" element={<div>HR dashboard</div>} /><Route path="/dashboard/team-leader" element={<div>TL dashboard</div>} /><Route path="/dashboard" element={<div>Employee dashboard</div>} /><Route path="/login" element={<div>Login page</div>} /></Routes></MemoryRouter></UserContext.Provider>)
}

describe('announcement route access', () => {
  afterEach(() => cleanup())
  it.each(['CEO', 'HR'])('%s can access announcements', (role) => {
    renderRoute({ isLoggedIn: true, role })
    expect(screen.getByText('Announcements page')).toBeTruthy()
  })
  it.each([['TL', 'TL dashboard'], ['EMPLOYEE', 'Employee dashboard']])('%s is redirected', (role, destination) => {
    renderRoute({ isLoggedIn: true, role })
    expect(screen.getByText(destination)).toBeTruthy()
  })
  it('redirects unauthenticated users to login', () => {
    renderRoute({ isLoggedIn: false, role: null })
    expect(screen.getByText('Login page')).toBeTruthy()
  })
})
