import { describe, expect, it } from 'vitest';
import { parseDomain } from './domain';

describe('parseDomain', () => {
  it('handles local dev hosts with no subdomain', () => {
    expect(parseDomain('localhost')).toEqual({
      subdomain: null,
      baseDomain: 'localhost',
    });
    expect(parseDomain('localhost:3005')).toEqual({
      subdomain: null,
      baseDomain: 'localhost',
    });
    expect(parseDomain('127.0.0.1')).toEqual({
      subdomain: null,
      baseDomain: '127.0.0.1',
    });
    expect(parseDomain('127.0.0.1:3005')).toEqual({
      subdomain: null,
      baseDomain: '127.0.0.1',
    });
  });

  it('handles local dev hosts with subdomains', () => {
    expect(parseDomain('sorriso.localhost')).toEqual({
      subdomain: 'sorriso',
      baseDomain: 'localhost',
    });
    expect(parseDomain('sorriso.localhost:3005')).toEqual({
      subdomain: 'sorriso',
      baseDomain: 'localhost',
    });
  });

  it('handles aptusclin.com.br hosts', () => {
    expect(parseDomain('aptusclin.com.br')).toEqual({
      subdomain: null,
      baseDomain: 'aptusclin.com.br',
    });
    expect(parseDomain('aptusclin.com.br:3000')).toEqual({
      subdomain: null,
      baseDomain: 'aptusclin.com.br',
    });
    expect(parseDomain('sorriso.aptusclin.com.br')).toEqual({
      subdomain: 'sorriso',
      baseDomain: 'aptusclin.com.br',
    });
    expect(parseDomain('sorriso.aptusclin.com.br:80')).toEqual({
      subdomain: 'sorriso',
      baseDomain: 'aptusclin.com.br',
    });
  });

  it('handles vercel.app deployments', () => {
    expect(parseDomain('aptusclin.vercel.app')).toEqual({
      subdomain: null,
      baseDomain: 'aptusclin.vercel.app',
    });
    expect(parseDomain('sorriso.aptusclin.vercel.app')).toEqual({
      subdomain: 'sorriso',
      baseDomain: 'aptusclin.vercel.app',
    });
  });

  it('handles other domains with com.br format', () => {
    expect(parseDomain('outro.com.br')).toEqual({
      subdomain: null,
      baseDomain: 'outro.com.br',
    });
    expect(parseDomain('sorriso.outro.com.br')).toEqual({
      subdomain: 'sorriso',
      baseDomain: 'outro.com.br',
    });
  });

  it('handles general domain fallbacks', () => {
    expect(parseDomain('my-site.com')).toEqual({
      subdomain: null,
      baseDomain: 'my-site.com',
    });
    expect(parseDomain('sub.my-site.com')).toEqual({
      subdomain: 'sub',
      baseDomain: 'my-site.com',
    });
  });
});
