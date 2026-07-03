import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { tenantMap } from '@/lib/tenant';

const SKIP_PREFIXES = [
  '/api',
  '/_next',
  '/assets',
  '/favicon.ico',
  '/login',
  '/auth',
];

export async function proxy(request: NextRequest) {
  const supabaseResponse = await updateSession(request);

  // Se o updateSession retornou um redirecionamento (ex: para /login), retorna imediatamente
  if (supabaseResponse.headers.has('location')) {
    return supabaseResponse;
  }

  const url = request.nextUrl.clone();
  const hostHeader = request.headers.get('host') ?? '';
  const host = hostHeader.split(':')[0]; // remove porta opcional

  // Ignorar rotas internas/assets
  if (SKIP_PREFIXES.some(p => url.pathname.startsWith(p))) {
    return supabaseResponse;
  }

  // Detectar subdomínio
  const parts = host.split('.');
  const hasSubdomain = parts.length >= 2 && host !== 'localhost' && host !== '127.0.0.1';
  const subdomain = hasSubdomain ? parts[0] : null;

  // ── Sem subdomínio (domínio principal ou localhost) ──────────────────────
  if (!subdomain) {
    // Rota raiz → Landing Page principal (src/app/page.tsx)
    if (url.pathname === '/' || url.pathname === '') {
      return supabaseResponse; // Next.js serve a Landing Page normalmente
    }
    // Demais rotas do domínio principal (portal, admin geral, etc.) funcionam normalmente
    return supabaseResponse;
  }

  // ── Com subdomínio (página de uma unidade) ───────────────────────────────
  const companyId = tenantMap[subdomain];
  if (!companyId) {
    return supabaseResponse; // Subdomínio desconhecido
  }

  // Já está dentro da rota correta → não reescreve
  if (
    url.pathname.startsWith(`/portal/empresas/${companyId}`) ||
    url.pathname.startsWith(`/admin/unidades/${companyId}`)
  ) {
    return supabaseResponse;
  }

  let newPathname: string;

  // Raiz "/" do subdomínio → Home da Unidade
  if (url.pathname === '/' || url.pathname === '') {
    newPathname = `/portal/empresas/${companyId}`;
  }
  // "/admin" ou "/admin/..." do subdomínio → Painel Admin da Unidade
  else if (url.pathname === '/admin' || url.pathname.startsWith('/admin/')) {
    const adminSuffix = url.pathname.slice('/admin'.length); // ex: '' ou '/exames'
    newPathname = `/admin/unidades/${companyId}${adminSuffix}`;
  }
  // "/portal" (acesso ao portal da unidade)
  else if (url.pathname.startsWith('/portal')) {
    const portalSuffix = url.pathname.slice('/portal'.length);
    newPathname = `/portal/empresas/${companyId}${portalSuffix}`;
  }
  // Qualquer outra rota → prefixo com a rota do portal
  else {
    newPathname = `/portal/empresas/${companyId}${url.pathname}`;
  }

  url.pathname = newPathname;
  const rewriteResponse = NextResponse.rewrite(url);

  // Propaga os cookies de sessão do Supabase
  supabaseResponse.cookies.getAll().forEach(c => {
    rewriteResponse.cookies.set(c.name, c.value);
  });

  return rewriteResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
