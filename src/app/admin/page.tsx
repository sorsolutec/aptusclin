import { createClient } from '@/utils/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, Building2, Users, FileText, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Admin | Aptusclin' }

const atalhos = [
  {
    href: '/admin/exames/novo',
    icon: Upload,
    label: 'Lançar novo exame / ASO',
    desc: 'Adicionar resultado de exame para um colaborador',
    cor: 'bg-[#002855] text-white hover:bg-[#001a3d]',
  },
  {
    href: '/admin/empresas/nova',
    icon: Building2,
    label: 'Cadastrar empresa',
    desc: 'Adicionar nova empresa cliente ao sistema',
    cor: 'bg-[#00b4d8] text-white hover:bg-[#0096c7]',
  },
  {
    href: '/admin/colaboradores',
    icon: Users,
    label: 'Ver colaboradores',
    desc: 'Listar e gerenciar colaboradores cadastrados',
    cor: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50',
  },
  {
    href: '/admin/documentos',
    icon: FileText,
    label: 'Todos os documentos',
    desc: 'Consultar todos os exames e ASOs lançados',
    cor: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50',
  },
]

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Painel Administrativo</h1>
        <p className="text-sm text-slate-500 mt-1">Gerencie exames, ASOs, empresas e colaboradores</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Exames lançados', value: '185', icon: FileText, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Empresas ativas', value: '3', icon: Building2, color: 'text-teal-700', bg: 'bg-teal-50' },
          { label: 'Colaboradores', value: '182', icon: Users, color: 'text-indigo-700', bg: 'bg-indigo-50' },
          { label: 'Lançados hoje', value: '2', icon: TrendingUp, color: 'text-emerald-700', bg: 'bg-emerald-50' },
        ].map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="border-slate-200 shadow-sm">
              <CardContent className="p-5 flex items-start gap-4">
                <div className={`${s.bg} p-2.5 rounded-xl`}>
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Ações rápidas */}
      <div>
        <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-3">Ações rápidas</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {atalhos.map((a) => {
            const Icon = a.icon
            return (
              <Link key={a.href} href={a.href}>
                <div className={`flex items-center gap-4 p-5 rounded-xl transition-colors cursor-pointer shadow-sm ${a.cor}`}>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{a.label}</p>
                    <p className="text-xs opacity-70 mt-0.5">{a.desc}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
