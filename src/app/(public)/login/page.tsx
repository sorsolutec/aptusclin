import { login } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/ui/logo'
import Link from 'next/link'

// Agora a função é async e recebe searchParams como Promise
export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>
}) {
  // Aguardamos a Promise para obter os parâmetros
  const params = await searchParams
  const hasError = params?.error === 'invalid_credentials'

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0b3c7d]/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1B8B3A]/5 rounded-full -ml-20 -mb-20 blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md shadow-2xl border-slate-200/80 bg-white/95 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center space-y-2 pb-4 flex flex-col items-center">
          <Logo className="mb-4" />
          <CardDescription className="text-slate-500 text-sm">
            Acesse o portal de medicina ocupacional para gerenciar exames e ASOs da sua empresa.
          </CardDescription>
        </CardHeader>
        
        <form action={login}>
          <CardContent className="space-y-4 pb-4">
            {hasError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md">
                E-mail ou senha incorretos. Tente novamente.
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 text-xs font-bold uppercase tracking-wider">E-mail corporativo</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="rh@empresa.com.br" 
                required 
                className="bg-white border-slate-200 focus-visible:ring-[#0b3c7d] focus-visible:border-transparent py-5"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700 text-xs font-bold uppercase tracking-wider">Senha</Label>
              </div>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="bg-white border-slate-200 focus-visible:ring-[#0b3c7d] focus-visible:border-transparent py-5"
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full bg-[#0b3c7d] hover:bg-[#093063] text-white font-bold py-5 rounded-lg transition-colors shadow-md">
              Entrar no Portal
            </Button>
            <Link 
              href="/" 
              className="text-xs text-[#0b3c7d] hover:text-[#1B8B3A] font-semibold flex items-center gap-1 mt-2 transition-colors"
            >
              ← Voltar para a página inicial
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}