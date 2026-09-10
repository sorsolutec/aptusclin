'use client';

import { useState, useEffect } from 'react';

interface LeadsNavBadgeProps {
  initialCount?: number;
}

export function LeadsNavBadge({ initialCount = 0 }: LeadsNavBadgeProps) {
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
        // Ignora erros de rede temporários
      }
    }

    // Polling a cada 20 segundos
    const interval = setInterval(checkUnread, 20000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (count <= 0) return null;

  return (
    <span className="ml-auto relative flex items-center">
      <span className="animate-ping absolute -left-0.5 inline-flex h-3 w-3 rounded-full bg-amber-400 opacity-75"></span>
      <span className={`relative inline-flex items-center gap-1 rounded-full ${count > 0 ? 'bg-amber-600' : 'bg-rose-600'} px-2 py-0.5 text-[11px] font-extrabold text-white shadow-md shadow-amber-950/40`}
        >
        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
        {count > 99 ? '99+' : count}
      </span>
    </span>
  );
}
