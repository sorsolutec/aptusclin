import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Mail, Shield } from 'lucide-react'

export const metadata = {
  title: 'Minha Empresa | Portal Aptusclin',
}

export default async function EmpresaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Minha Empresa</h1>
        <p className="text-sm text-slate-500 mt-1">Informações da conta da sua empresa</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              Dados da Conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Mail className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">E-mail corporativo</p>
                <p className="text-sm font-medium text-slate-800">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Shield className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Tipo de acesso</p>
                <p className="text-sm font-medium text-slate-800">Empresa Parceira</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
