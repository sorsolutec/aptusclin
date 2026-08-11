import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { updateSession } from './middleware'

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}))

const mockedCreateServerClient = vi.mocked(createServerClient)

describe('updateSession', () => {
  beforeEach(() => {
    mockedCreateServerClient.mockReset()
  })

  it('redirects unauthenticated users trying to access portal or admin', async () => {
    mockedCreateServerClient.mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    } as never)

    const request = new NextRequest('http://localhost:3005/admin')
    const response = await updateSession(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/login')
  })

  it('redirects non-admin users away from admin routes', async () => {
    mockedCreateServerClient.mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { user_metadata: { role: 'user' }, app_metadata: {} } },
        }),
      },
    } as never)

    const request = new NextRequest('http://localhost:3005/admin')
    const response = await updateSession(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/portal/dashboard')
  })

  it('allows access to public routes without authentication', async () => {
    mockedCreateServerClient.mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    } as never)

    const request = new NextRequest('http://localhost:3005/')
    const response = await updateSession(request)

    expect(response.status).toBe(200)
  })
})
