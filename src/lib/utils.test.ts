import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn helper', () => {
  it('merges class names and resolves conflicting tailwind classes', () => {
    expect(cn('px-2', 'px-4', 'text-sm')).toBe('px-4 text-sm')
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
  })
})
