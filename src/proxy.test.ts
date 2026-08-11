import { describe, expect, it, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { proxy } from './proxy';
import { updateSession } from '@/utils/supabase/middleware';

vi.mock('@/utils/supabase/middleware', () => ({
  updateSession: vi.fn(),
}));

const mockedUpdateSession = vi.mocked(updateSession);

describe('proxy middleware', () => {
  it('skips prefix routes immediately', async () => {
    mockedUpdateSession.mockResolvedValue(NextResponse.next());

    const request = new NextRequest('http://localhost:3005/api/events', {
      headers: { host: 'localhost:3005' },
    });
    const response = await proxy(request);
    expect(response.headers.get('x-middleware-rewrite')).toBeNull();
  });

  it('handles main domain (no subdomain) root route', async () => {
    mockedUpdateSession.mockResolvedValue(NextResponse.next());

    const request = new NextRequest('http://localhost:3005/', {
      headers: { host: 'localhost:3005' },
    });
    const response = await proxy(request);
    expect(response.headers.get('x-middleware-rewrite')).toBeNull();
  });

  it('handles main domain (no subdomain) for aptusclin.com.br root route', async () => {
    mockedUpdateSession.mockResolvedValue(NextResponse.next());

    const request = new NextRequest('https://aptusclin.com.br/', {
      headers: { host: 'aptusclin.com.br' },
    });
    const response = await proxy(request);
    expect(response.headers.get('x-middleware-rewrite')).toBeNull();
  });

  it('rewrites subdomain root on localhost to company portal route', async () => {
    mockedUpdateSession.mockResolvedValue(NextResponse.next());

    const request = new NextRequest('http://sorriso.localhost:3005/', {
      headers: { host: 'sorriso.localhost:3005' },
    });
    const response = await proxy(request);
    expect(response.headers.get('x-middleware-rewrite')).toContain('/portal/empresas/sorriso');
  });

  it('rewrites subdomain root on aptusclin.com.br to company portal route', async () => {
    mockedUpdateSession.mockResolvedValue(NextResponse.next());

    const request = new NextRequest('https://sorriso.aptusclin.com.br/', {
      headers: { host: 'sorriso.aptusclin.com.br' },
    });
    const response = await proxy(request);
    expect(response.headers.get('x-middleware-rewrite')).toContain('/portal/empresas/sorriso');
  });

  it('rewrites subdomain /admin on aptusclin.com.br to unit admin route', async () => {
    mockedUpdateSession.mockResolvedValue(NextResponse.next());

    const request = new NextRequest('https://sorriso.aptusclin.com.br/admin', {
      headers: { host: 'sorriso.aptusclin.com.br' },
    });
    const response = await proxy(request);
    expect(response.headers.get('x-middleware-rewrite')).toContain('/admin/unidades/sorriso');
  });

  it('rewrites subdomain /portal on aptusclin.com.br to company portal route', async () => {
    mockedUpdateSession.mockResolvedValue(NextResponse.next());

    const request = new NextRequest('https://sorriso.aptusclin.com.br/portal', {
      headers: { host: 'sorriso.aptusclin.com.br' },
    });
    const response = await proxy(request);
    expect(response.headers.get('x-middleware-rewrite')).toContain('/portal/empresas/sorriso');
  });

  it('rewrites other paths on subdomain to company portal relative routes', async () => {
    mockedUpdateSession.mockResolvedValue(NextResponse.next());

    const request = new NextRequest('https://sorriso.aptusclin.com.br/agenda', {
      headers: { host: 'sorriso.aptusclin.com.br' },
    });
    const response = await proxy(request);
    expect(response.headers.get('x-middleware-rewrite')).toContain('/portal/empresas/sorriso/agenda');
  });
});
