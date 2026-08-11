/**
 * Utility to parse domain/subdomain matching in development and production environments.
 */
export function parseDomain(host: string): { subdomain: string | null; baseDomain: string } {
  const cleanHost = host.split(':')[0].toLowerCase();

  // Dev local
  if (cleanHost === 'localhost' || cleanHost === '127.0.0.1') {
    return { subdomain: null, baseDomain: cleanHost };
  }

  // Dev local with subdomain (e.g. sorriso.localhost)
  if (cleanHost.endsWith('.localhost')) {
    const subdomain = cleanHost.slice(0, -'.localhost'.length);
    return { subdomain, baseDomain: 'localhost' };
  }

  // Production with aptusclin.com.br
  if (cleanHost === 'aptusclin.com.br') {
    return { subdomain: null, baseDomain: 'aptusclin.com.br' };
  }
  if (cleanHost.endsWith('.aptusclin.com.br')) {
    const subdomain = cleanHost.slice(0, -'.aptusclin.com.br'.length);
    return { subdomain, baseDomain: 'aptusclin.com.br' };
  }

  // Vercel deployment support
  if (cleanHost.endsWith('.vercel.app')) {
    const prefix = cleanHost.slice(0, -'.vercel.app'.length);
    const parts = prefix.split('.');
    if (parts.length > 1) {
      const subdomain = parts.slice(0, -1).join('.');
      const mainName = parts[parts.length - 1];
      return { subdomain, baseDomain: `${mainName}.vercel.app` };
    } else {
      return { subdomain: null, baseDomain: `${prefix}.vercel.app` };
    }
  }

  // General fallback (extracts base domain dynamically)
  const parts = cleanHost.split('.');
  if (parts.length > 2) {
    const endsWithComBr = cleanHost.endsWith('.com.br') || cleanHost.endsWith('.net.br') || cleanHost.endsWith('.org.br');
    const suffixCount = endsWithComBr ? 3 : 2;
    if (parts.length > suffixCount) {
      const subdomain = parts.slice(0, parts.length - suffixCount).join('.');
      const baseDomain = parts.slice(-suffixCount).join('.');
      return { subdomain, baseDomain };
    }
  }

  return { subdomain: null, baseDomain: cleanHost };
}
