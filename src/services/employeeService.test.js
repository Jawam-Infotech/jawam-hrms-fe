import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./api/employee.api.js', () => ({
  getDepartments: vi.fn(),
  getDesignations: vi.fn(),
}))

import {
  getDepartments,
  getDesignations,
} from './employeeService.js'

import {
  getDepartments as getDepartmentsRequest,
  getDesignations as getDesignationsRequest,
} from './api/employee.api.js'

describe('employee master data services', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns department master data from the API', async () => {
    const departments = [
      {
        id: 1,
        name: 'Engineering',
        is_active: true,
      },
      {
        id: 2,
        name: 'HR',
        is_active: true,
      },
    ]

    getDepartmentsRequest.mockResolvedValue(departments)

    await expect(getDepartments()).resolves.toEqual(departments)

    expect(getDepartmentsRequest).toHaveBeenCalledTimes(1)
  })

  it('returns designation master data from the API', async () => {
    const designations = [
      {
        id: 1,
        name: 'Software Engineer',
        is_active: true,
      },
      {
        id: 2,
        name: 'HR Manager',
        is_active: true,
      },
    ]

    getDesignationsRequest.mockResolvedValue(designations)

    await expect(getDesignations()).resolves.toEqual(designations)

    expect(getDesignationsRequest).toHaveBeenCalledTimes(1)
  })

  it('returns an empty array when departments response is not an array', async () => {
    getDepartmentsRequest.mockResolvedValue({
      results: [],
    })

    await expect(getDepartments()).resolves.toEqual([])
  })

  it('returns an empty array when designations response is not an array', async () => {
    getDesignationsRequest.mockResolvedValue({
      results: [],
    })

    await expect(getDesignations()).resolves.toEqual([])
  })
})