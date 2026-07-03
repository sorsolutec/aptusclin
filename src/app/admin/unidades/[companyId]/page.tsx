'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { use } from 'react';
import {
  FlaskConical, CalendarDays, Image, Users,
  CheckCircle, Clock, AlertCircle, ArrowUpRight
} from 'lucide-react';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  href?: string;
  color?: string;
}

function StatCard({ icon: Icon, label, value, sub, href, color = '#002855' }: StatCardProps) {
  const content = (
    <div
      className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-md transition-shadow flex items-center gap-4 cursor-pointer"
    >
      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-extrabold text-slate-800 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5 truncate">{sub}</p>}
      </div>
      {href && <ArrowUpRight className="w-4 h-4 text-slate-300 flex-shrink-0" />}
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

export default function UnitDashboardPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = use(params);
  const [stats, setStats] = useState({ exames: 0, agendamentos: 0 });
  const [unidade, setUnidade] = useState<{ nome: string; slides: unknown[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/unidades/${companyId}`).then(r => r.ok ? r.json() : null),
    ]).then(([u]) => {
      if (u) setUnidade(u);
      setLoading(false);
    });

    // Busca estatísticas de exames da unidade
    fetch(`/api/admin/exames?companyId=${companyId}`)
      .then(r => r.ok ? r.json() : { data: [] })
      .then(({ data }) => setStats(prev => ({ ...prev, exames: data?.length ?? 0 })));
  }, [companyId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-[#002855] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-8">
        <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Painel Admin</p>
        <h1 className="text-2xl font-extrabold text-slate-800 mt-1">
          {unidade?.nome ?? companyId}
        </h1>
        <p className="text-slate-400 text-sm mt-1">Gerencie os dados, conteúdo e usuários desta unidade.</p>
      </div>

      {/* STATS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={FlaskConical}
          label="Exames"
          value={stats.exames}
          sub="Total cadastrado"
          href={`/admin/unidades/${companyId}/exames`}
          color="#002855"
        />
        <StatCard
          icon={Image}
          label="Slides"
          value={Array.isArray(unidade?.slides) ? unidade.slides.length : 0}
          sub="Fotos no carrossel"
          href={`/admin/unidades/${companyId}/slides`}
          color="#1B8B3A"
        />
        <StatCard
          icon={CalendarDays}
          label="Agendamentos"
          value={stats.agendamentos}
          sub="Esta semana"
          href={`/admin/unidades/${companyId}/agenda`}
          color="#d97706"
        />
      </div>

      {/* ACESSO RÁPIDO */}
      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Acesso Rápido</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { href: `/admin/unidades/${companyId}/slides`, title: 'Gerenciar Fotos / Slides', desc: 'Adicione ou remova imagens do carrossel da home.', icon: Image, color: '#1B8B3A' },
          { href: `/admin/unidades/${companyId}/exames`, title: 'Gerenciar Exames', desc: 'Cadastre, edite e organize os exames disponíveis.', icon: FlaskConical, color: '#002855' },
          { href: `/admin/unidades/${companyId}/agenda`, title: 'Ver Agendamentos', desc: 'Consulte os agendamentos da unidade.', icon: CalendarDays, color: '#d97706' },
          { href: `/admin/unidades/${companyId}/usuarios`, title: 'Usuários da Unidade', desc: 'Gerencie os usuários e acessos desta unidade.', icon: Users, color: '#7c3aed' },
        ].map(({ href, title, desc, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-md transition-shadow flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <p className="font-semibold text-slate-800">{title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
