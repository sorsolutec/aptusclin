import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  CalendarDays,
  ArrowUpRight,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Dashboard | Portal Aptusclin',
}

const statCards = [
  {
    title: 'Exames Disponíveis',
    value: '—',
    description: 'Aguardando retirada',
    icon: FileText,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    title: 'Concluídos',
    value: '—',
    description: 'Últimos 30 dias',
    icon: CheckCircle,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    title: 'Em Análise',
    value: '—',
    description: 'Em processamento',
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    title: 'Pendentes',
    value: '—',
    description: 'Aguardam ação',
    icon: AlertCircle,
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Capitaliza a primeira letra
  const todayFormatted = today.charAt(0).toUpperCase() + today.slice(1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" />
            {todayFormatted}
          </p>
        </div>
        <Link href="/portal/documentos">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <FileText className="w-4 h-4" />
            Ver documentos
          </Button>
        </Link>
      </div>

      {/* Welcome banner */}
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Bem-vindo ao</p>
            <h2 className="text-xl font-bold mt-0.5">Portal Aptusclin</h2>
            <p className="text-blue-200 text-sm mt-2 max-w-md">
              Acesse aqui os documentos e laudos de exames da sua empresa.
              Todos os resultados ficam disponíveis para download seguro.
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-slate-200 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{stat.description}</p>
                  </div>
                  <div className={`${stat.bg} p-2 rounded-lg`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent activity + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Últimos documentos */}
        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-700">
                Documentos Recentes
              </CardTitle>
              <Link href="/portal/documentos">
                <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700 gap-1 h-7">
                  Ver todos
                  <ArrowUpRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                <FileText className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-600">Nenhum documento ainda</p>
              <p className="text-xs text-slate-400 mt-1">
                Quando houver documentos disponíveis, eles aparecerão aqui.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Ações rápidas */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: 'Ver exames disponíveis', href: '/portal/documentos', icon: FileText, badge: null },
              { label: 'Dados da empresa', href: '/portal/empresa', icon: CheckCircle, badge: null },
            ].map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.href} href={action.href}>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm text-slate-700 flex-1">{action.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </Link>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}