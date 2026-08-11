import { NextResponse } from 'next/server';

/**
 * Simple wrapper around NextResponse.json to keep imports concise.
 */
export function json<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}
