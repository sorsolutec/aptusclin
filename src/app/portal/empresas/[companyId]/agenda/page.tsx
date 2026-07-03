"use client";

import Calendar from '@/components/ui/calendar';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';

export default function AgendaPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = use(params);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate a tiny delay for UX (optional)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <section className="flex items-center justify-center min-h-[60vh] bg-gradient-to-b from-indigo-100 to-purple-200 p-6">
        <div className="animate-pulse text-xl font-semibold text-slate-600">Carregando agenda…</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="p-6 bg-gradient-to-b from-red-100 to-red-200 min-h-[60vh]">
        <p className="text-red-800 font-medium">{error}</p>
      </section>
    );
  }

  return (
    <section className="p-6 bg-page rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-primary mb-4">Agenda da Empresa</h2>
      <Calendar companyId={companyId} />
    </section>
  );
}
