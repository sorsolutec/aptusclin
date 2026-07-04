import { logout } from '@/app/actions/auth'
import { createClient } from '@/utils/supabase/server'
import {
  LayoutDashboard,
  FileText,
  Building2,
  LogOut,
  Bell,
  ChevronRight,
  User,
  Calendar,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'

const navItems = [
  { href: '/portal/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/portal/documentos', label: 'Documentos', icon: FileText },
  { href: '/portal/empresa', label: 'Minha Empresa', icon: Building2 },
  { href: '/portal/agenda', label: 'Agenda', icon: Calendar },
]

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const email = user?.email ?? ''
  const initials = email.slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-page flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-10">
        {/* Logo */}
        <div className="p-5 border-b border-slate-100">
          <Logo className="scale-90 transform origin-left" />
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-[#002855]/10 hover:text-[#002855] transition-colors group"
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{label}</span>
              <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-8 h-8 bg-[#002855] text-white rounded-full flex items-center justify-center text-xs font-bold overflow-hidden">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-700 truncate">{user?.user_metadata?.name || email}</p>
              <p className="text-xs text-slate-400">Empresa</p>
            </div>
          </div>
          <div className="space-y-1">
            <Link href="/perfil">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              >
                <User className="w-4 h-4" />
                Meu Perfil
              </Button>
            </Link>
            <form action={logout}>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-slate-500 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div />
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 bg-[#0b3c7d] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}