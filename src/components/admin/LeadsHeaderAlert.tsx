'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, Bell } from 'lucide-react';

interface LeadsHeaderAlertProps {
  initialCount?: number;
}

export function LeadsHeaderAlert({ initialCount = 0 }: LeadsHeaderAlertProps) {
  const [count, setCount] = useState<number>(initialCount);

  useEffect(() => {
    let isMounted = true;

    async function checkUnread() {
      try {
        const res = await fetch('/api/admin/leads/unread-count');
        if (res.ok) {
          const json = await res.json();
          if (isMounted && typeof json.count === 'number') {
            setCount(json.count);
          }
        }
      } catch {
        // Silêncio em caso de erro de rede
      }
    }

    const interval = setInterval(checkUnread, 20000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (count <= 0) return null;

  return (
    <Link
      href="/admin/leads"
      className="inline-flex items-center gap-2 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-700 transition shadow-sm animate-pulse"
      title="Clique para visualizar os contatos aguardando atendimento"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
      </span>
      <MessageSquare className="w-3.5 h-3.5 text-rose-600" />
      <span>
        {count} novo{count > 1 ? 's' : ''} contato{count > 1 ? 's' : ''} aguardando
      </span>
    </Link>
  );
}
