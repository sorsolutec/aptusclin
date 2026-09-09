import { getAdminClient } from '@/utils/supabase/serverAdmin'
import { Card, CardContent } from '@/components/ui/card'
import { DashboardSkeleton } from '@/components/ui/page-loading'
import { Upload, Building2, Users, FileText, TrendingUp, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

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
    href: '/admin/clientes/novo',
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
  const supabaseAdmin = getAdminClient()

  let totalExames = 0
  let totalEmpresas = 0
  let totalColaboradores = 0

  try {
    const [resEx, resEmp, resCol] = await Promise.all([
      supabaseAdmin.from('exames').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('empresas').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('colaboradores').select('*', { count: 'exact', head: true }),
    ])
    totalExames = resEx.count || 0
    totalEmpresas = resEmp.count || 0
    totalColaboradores = resCol.count || 0
  } catch (e) {
    console.error('[AdminDashboard] Erro ao carregar contagens:', e)
  }

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Painel Administrativo</h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie exames, ASOs, empresas e colaboradores</p>
        </div>

        {/* Stats Reais */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Exames e ASOs cadastrados', value: totalExames, icon: FileText, color: 'text-blue-700', bg: 'bg-blue-50' },
            { label: 'Empresas parceiras', value: totalEmpresas, icon: Building2, color: 'text-teal-700', bg: 'bg-teal-50' },
            { label: 'Colaboradores cadastrados', value: totalColaboradores, icon: Users, color: 'text-indigo-700', bg: 'bg-indigo-50' },
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

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-[#002855]">
              <ShieldCheck className="h-4 w-4" />
              <h2 className="text-sm font-bold uppercase tracking-wider">Status Operacional</h2>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              {totalExames === 0
                ? 'Nenhum exame cadastrado no momento. Utilize o botão abaixo para lançar o primeiro exame ou cadastrar empresas.'
                : `Existem ${totalExames} exame(s) e ${totalEmpresas} empresa(s) registradas no sistema.`}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {totalEmpresas} empresa{totalEmpresas !== 1 ? 's' : ''} parceira{totalEmpresas !== 1 ? 's' : ''}
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {totalExames} documento{totalExames !== 1 ? 's' : ''} ativo{totalExames !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-[#002855] p-5 text-white shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <h2 className="text-sm font-bold uppercase tracking-wider">Gestão e Conformidade</h2>
            </div>
            <p className="mt-3 text-sm text-blue-100">Acompanhe os exames e documentos para manter a medicina ocupacional em conformidade.</p>
            <Link href="/admin/documentos" className="mt-4 inline-flex text-sm font-semibold text-white underline underline-offset-4">Ver todos os exames lançados</Link>
          </div>
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
    </Suspense>
  )
}
