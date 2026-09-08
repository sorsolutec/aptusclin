import { forgotPassword } from '@/app/actions/auth'
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

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; success?: string }>
}) {
  const params = await searchParams
  const hasError = params?.error === 'true'
  const hasSuccess = params?.success === 'true'

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0b3c7d]/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1B8B3A]/5 rounded-full -ml-20 -mb-20 blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md shadow-2xl border-slate-200/80 bg-white/95 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center space-y-2 pb-4 flex flex-col items-center">
          <Logo className="mb-4" />
          <h1 className="text-xl font-bold text-[#002855]">Recuperar Senha</h1>
          <CardDescription className="text-slate-500 text-sm">
            Insira seu e-mail abaixo. Enviaremos um link para você redefinir sua senha.
          </CardDescription>
        </CardHeader>
        
        <form action={forgotPassword}>
          <CardContent className="space-y-4 pb-4">
            {hasError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md">
                Ocorreu um erro. Verifique seu e-mail e tente novamente.
              </div>
            )}
            {hasSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm p-3 rounded-md">
                Se este e-mail estiver cadastrado, você receberá um link de recuperação em instantes. Verifique também sua caixa de spam.
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 text-xs font-bold uppercase tracking-wider">E-mail</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="rh@empresa.com.br" 
                required 
                className="bg-white border-slate-200 focus-visible:ring-[#0b3c7d] focus-visible:border-transparent py-5"
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full bg-[#1B8B3A] hover:bg-[#15732f] text-white font-bold py-5 rounded-lg transition-colors shadow-md">
              Enviar Link de Recuperação
            </Button>
            <Link 
              href="/login" 
              className="text-xs text-[#0b3c7d] hover:text-[#1B8B3A] font-semibold flex items-center gap-1 mt-2 transition-colors"
            >
              ← Voltar para o Login
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
