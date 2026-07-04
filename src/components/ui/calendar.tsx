
"use client";

import React, { useEffect, useState } from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Event } from '@/types/event';

// Helper to map dates to events count
const mapEventsByDate = (events: Event[]) => {
  const map: Record<string, Event[]> = {};
  events.forEach((ev) => {
    if (!ev.start_at) return;
    const d = new Date(ev.start_at);
    if (isNaN(d.getTime())) return;
    const date = d.toISOString().split('T')[0];
    if (!map[date]) map[date] = [];
    map[date].push(ev);
  });
  return map;
};

export default function Calendar({ companyId }: { companyId?: string }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [eventsByDate, setEventsByDate] = useState<Record<string, Event[]>>({});

  // Load events from API
  useEffect(() => {
    const url = companyId ? `/api/events?companyId=${companyId}` : '/api/events';
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setEventsByDate(mapEventsByDate(data));
      })
      .catch((err) => console.error('Failed to load events', err));
  }, [companyId]);

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    const key = date.toISOString().split('T')[0];
    const dayEvents = eventsByDate[key];
    if (dayEvents && dayEvents.length) {
      return (
        <div className="mt-1 text-xs text-primary font-medium">
          {dayEvents.length} evento{dayEvents.length > 1 ? 's' : ''}
        </div>
      );
    }
    return null;
  };

  const dayKey = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
  const dayEvents = eventsByDate[dayKey] || [];

  return (
    <section className="bg-page p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-primary mb-4">Agenda de Eventos</h2>
      <ReactCalendar
        onChange={(value) => {
          if (Array.isArray(value)) {
            // If range selection, pick first date
            setSelectedDate(value[0] ?? null);
          } else if (value) {
            setSelectedDate(value as Date);
          } else {
            setSelectedDate(null);
          }
        }}
        value={selectedDate}
        tileContent={tileContent}
        className="bg-white rounded"
      />
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-primary mb-2">
          Eventos em {selectedDate ? selectedDate.toLocaleDateString() : '---'}
        </h3>
        {dayEvents.length === 0 ? (
          <p className="text-muted">Nenhum evento para esta data.</p>
        ) : (
          <ul className="space-y-2">
            {dayEvents.map((ev) => (
              <li key={ev.id} className="p-3 bg-white rounded shadow">
                <strong className="block text-primary">{ev.title}</strong>
                <span className="block text-sm text-muted">
                  {ev.start_at && !isNaN(new Date(ev.start_at).getTime()) 
                    ? new Date(ev.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                    : '--:--'}
                  {' - '}
                  {ev.end_at && !isNaN(new Date(ev.end_at).getTime()) 
                    ? new Date(ev.end_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                    : '--:--'}
                </span>
                {ev.location && <span className="block text-sm">Local: {ev.location}</span>}
                {ev.description && (
                  <p className="mt-1 text-sm text-muted">{ev.description}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
