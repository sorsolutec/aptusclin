'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutGrid,
  FlaskConical,
  CalendarDays,
  Image,
  Users,
  ChevronLeft,
  Settings,
} from 'lucide-react';
import { tenantConfig } from '@/lib/tenant';

interface Props {
  children: React.ReactNode;
  companyId: string;
}

const NAV_ITEMS = (id: string) => [
  { href: `/admin/unidades/${id}`, label: 'Dashboard', icon: LayoutGrid, exact: true },
  { href: `/admin/unidades/${id}/exames`, label: 'Exames', icon: FlaskConical },
  { href: `/admin/unidades/${id}/agenda`, label: 'Agenda', icon: CalendarDays },
  { href: `/admin/unidades/${id}/slides`, label: 'Slides / Fotos', icon: Image },
  { href: `/admin/unidades/${id}/usuarios`, label: 'Usuários', icon: Users },
];

export default function UnitAdminShell({ children, companyId }: Props) {
  const pathname = usePathname();
  const config = tenantConfig[companyId];
  const [unidadeNome, setUnidadeNome] = useState(config?.nome ?? companyId);

  useEffect(() => {
    fetch(`/api/unidades/${companyId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.nome) setUnidadeNome(data.nome); })
      .catch(() => {});
  }, [companyId]);

  function isActive(href: string, exact = false) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* SIDEBAR */}
      <aside className="w-60 bg-[#002855] flex flex-col shadow-xl flex-shrink-0">
        {/* Cabeçalho */}
        <div className="px-5 py-5 border-b border-white/10">
          <Link href="/admin" className="inline-flex items-center gap-1 text-blue-300 hover:text-white text-xs mb-3 transition">
            <ChevronLeft className="w-3 h-3" />
            Admin Geral
          </Link>
          <p className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">Painel da Unidade</p>
          <h1 className="text-white font-bold text-sm mt-0.5 leading-tight">{unidadeNome}</h1>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS(companyId).map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  active
                    ? 'bg-white text-[#002855]'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Rodapé */}
        <div className="px-3 py-4 border-t border-white/10">
          <Link
            href={`/portal/empresas/${companyId}`}
            target="_blank"
            className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition px-3 py-2"
          >
            <Settings className="w-3.5 h-3.5" />
            Ver site da unidade
          </Link>
        </div>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  );
}
