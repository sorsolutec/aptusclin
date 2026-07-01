import React from 'react';
import Calendar from '@/components/ui/calendar';

export default function AgendaPage() {
  return (
    <section className="p-6 bg-page min-h-screen">
      <h1 className="text-2xl font-bold text-primary mb-4">Agenda de Eventos</h1>
      <Calendar />
    </section>
  );
}
