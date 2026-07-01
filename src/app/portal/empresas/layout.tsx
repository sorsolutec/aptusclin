import React from 'react';
import type { ReactNode } from 'react';

export default function EmpresasLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-6">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Empresa Dashboard</h1>
      </header>
      <main className="container mx-auto">{children}</main>
    </section>
  );
}
