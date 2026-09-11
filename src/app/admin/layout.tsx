import Image from 'next/image'
import { logout } from '@/app/actions/auth'
import { createClient } from '@/utils/supabase/server'
import {
  LayoutDashboard,
  FileText,
  Building2,
  LogOut,
  Users,
  Upload,
  ChevronRight,
  Shield,
  MapPin,
  Home,
  MessageSquare,
  ClipboardList,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { InteractiveHelp } from '@/components/ui/InteractiveHelp'
import { redirect } from 'next/navigation'
import { Logo } from '@/components/ui/logo'
import { LeadsNavBadge } from '@/components/admin/LeadsNavBadge'
import { LeadsHeaderAlert } from '@/components/admin/LeadsHeaderAlert'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/solicitacoes', label: 'Solicitações de ASO', icon: ClipboardList, solicitacoesBadge: true },
  { href: '/admin/leads', label: 'Leads / Contatos', icon: MessageSquare, hasBadge: true },
  { href: '/admin/unidades', label: 'Unidades', icon: MapPin },
  { href: '/admin/site-settings/home-banner', label: 'Banner da Home', icon: Home },
  { href: '/admin/exames', label: 'Lançar Exames / ASO', icon: Upload },
  { href: '/admin/clientes', label: 'Clientes', icon: Building2 },
  { href: '/admin/colaboradores', label: 'Colaboradores', icon: Users },
  { href: '/admin/documentos', label: 'Todos os Documentos', icon: FileText },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Protege a rota: só admin pode acessar
  const role = user?.user_metadata?.role ?? user?.app_metadata?.role
  if (!user || role !== 'admin') {
    redirect('/login')
  }

  // Busca a contagem de leads não lidos (status = 'novo')
  let unreadLeadsCount = 0;
  let unreadSolicitacoesCount = 0;
  try {
    const { getAdminClient } = await import('@/utils/supabase/serverAdmin');
    const adminClient = getAdminClient();
    const { count: leadsCount } = await adminClient
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'novo');
    unreadLeadsCount = leadsCount || 0;

    const { count: solCount } = await adminClient
      .from('solicitacoes_exames')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'novo');
    unreadSolicitacoesCount = solCount || 0;
  } catch {
    unreadLeadsCount = 0;
    unreadSolicitacoesCount = 0;
  }

  const email = user.email ?? ''
  const initials = email.slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0b3c7d] flex flex-col fixed h-full z-10 border-r border-[#07244a]">
        {/* Logo */}
        <div className="p-5 border-b border-white/10 bg-white">
          <Logo className="scale-90 transform origin-left" />
          <div className="mt-2 flex items-center gap-1">
            <span className="text-[9px] bg-[#1B8B3A]/20 text-[#1B8B3A] font-extrabold px-2 py-0.5 rounded tracking-wider uppercase">
              PAINEL ADMIN
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon, hasBadge, solicitacoesBadge }: any) => {
            const hasAlert = (hasBadge && unreadLeadsCount > 0) || (solicitacoesBadge && unreadSolicitacoesCount > 0);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors group ${hasAlert ? 'ring-2 ring-amber-500' : ''}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-sm font-medium">{label}</span>
                {hasBadge && <LeadsNavBadge initialCount={unreadLeadsCount} />}
                {solicitacoesBadge && unreadSolicitacoesCount > 0 && (
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-extrabold text-white shadow-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
                    {unreadSolicitacoesCount > 99 ? '99+' : unreadSolicitacoesCount}
                  </span>
                )}
                {!hasBadge && !solicitacoesBadge && (
                  <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-8 h-8 bg-white/10 text-white rounded-full flex items-center justify-center text-xs font-bold overflow-hidden">
              {user?.user_metadata?.avatar_url ? (
                <Image src={user.user_metadata.avatar_url} alt="Avatar" fill className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.user_metadata?.name || email}</p>
              <p className="text-xs text-white/40">Administrador</p>
            </div>
          </div>
          <div className="space-y-1">
            <Link href="/perfil">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-white/50 hover:text-white hover:bg-white/5"
              >
                <Users className="w-4 h-4" />
                Meu Perfil
              </Button>
            </Link>
            <form action={logout}>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-white/50 hover:text-red-400 hover:bg-white/5"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#0b3c7d]" />
              <span className="text-sm font-bold text-[#0b3c7d]">Área Administrativa</span>
            </div>
            <LeadsHeaderAlert initialCount={unreadLeadsCount} />
          </div>
          <Link href="/portal/dashboard" className="text-xs text-slate-400 hover:text-[#1B8B3A] transition-colors">
            Ver como cliente →
          </Link>
        </header>

        {/* Page */}
        <main className="flex-1 p-6">
          {children}
          <InteractiveHelp />
        </main>
      </div>
    </div>
  )
}
