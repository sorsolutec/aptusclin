import { NextResponse } from 'next/server';

/**
 * Simple wrapper around NextResponse.json to keep imports concise.
 */
export function json(data: any, init?: ResponseInit) {
  return NextResponse.json(data, init);
}
