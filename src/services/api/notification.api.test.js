import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./axios.js', () => ({
  default: {
    get: vi.fn(),
  },
}))

import api from './axios.js'
import { getAllNotifications } from './notification.api.js'

describe('notification pagination', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads every page and removes duplicate notification IDs', async () => {
    api.get
      .mockResolvedValueOnce({
        data: {
          count: 3,
          next: 'notifications/?page=2',
          results: [
            { id: 1, message: 'First' },
            { id: 2, message: 'Second' },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: {
          count: 3,
          next: null,
          results: [
            { id: 2, message: 'Second duplicate' },
            { id: 3, message: 'Third' },
          ],
        },
      })

    await expect(getAllNotifications()).resolves.toEqual({
      count: 3,
      results: [
        { id: 1, message: 'First' },
        { id: 2, message: 'Second' },
        { id: 3, message: 'Third' },
      ],
    })

    expect(api.get).toHaveBeenNthCalledWith(
      1,
      'notifications/',
      { params: {} }
    )
    expect(api.get).toHaveBeenNthCalledWith(
      2,
      'notifications/?page=2'
    )
  })
})
