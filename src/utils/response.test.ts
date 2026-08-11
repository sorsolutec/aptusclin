import { describe, expect, it } from 'vitest'
import { json } from './response'

describe('json helper', () => {
  it('returns a json response with the provided payload and status', async () => {
    const response = json({ ok: true }, { status: 201 })

    expect(response.status).toBe(201)
    await expect(response.json()).resolves.toEqual({ ok: true })
  })
})
