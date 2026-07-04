'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User, ArrowLeft, Save, Loader2, Camera, Shield, AlertCircle, CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/client'

export default function MeuPerfilPage() {
  const router = useRouter()
  const [salvando, setSalvando] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  // Lazy: só cria o client no browser, nunca durante SSR do build
  const getClient = () => createClient()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    avatar_url: ''
  })

  useEffect(() => {
    async function loadUser() {
      const supabase = getClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Tenta buscar da tabela employees (se for colaborador da clínica)
      const { data: emp } = await (supabase as any)
        .from('employees')
        .select('*')
        .eq('id', user.id)
        .single()

      if (emp) {
        setForm({
          name: emp.name || user.user_metadata?.name || '',
          email: user.email || '',
          phone: emp.phone || '',
          password: '',
          avatar_url: emp.avatar_url || ''
        })
      } else {
        setForm({
          name: user.user_metadata?.name || '',
          email: user.email || '',
          phone: '',
          password: '',
          avatar_url: user.user_metadata?.avatar_url || ''
        })
      }
      setCarregando(false)
    }
    loadUser()
  }, [])

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setSalvando(true)
    setErro('')
    setSucesso('')

    try {
      const supabase = getClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        // Ignora se o bucket não existir apenas no dev (vamos pedir pro user criar)
        if (uploadError.message.includes('Bucket not found')) {
           throw new Error('O bucket "avatars" ainda não foi criado no Supabase.')
        }
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setForm(f => ({ ...f, avatar_url: publicUrl }))
      setSucesso('Foto enviada com sucesso! Lembre-se de salvar as alterações.')
    } catch (err: any) {
      setErro(err.message || 'Erro ao enviar foto.')
    } finally {
      setSalvando(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSalvando(true)
    setErro('')
    setSucesso('')

    try {
      const supabase = getClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Não autenticado')

      // Atualiza senha se preenchido
      if (form.password.trim().length > 0) {
        if (form.password.length < 6) {
          throw new Error('A senha deve ter pelo menos 6 caracteres')
        }
        const { error: authError } = await supabase.auth.updateUser({
          password: form.password
        })
        if (authError) throw authError
      }

      // Atualiza dados na tabela employees
      const { error: empError } = await (supabase as any)
        .from('employees')
        .update({
          name: form.name,
          phone: form.phone,
          avatar_url: form.avatar_url
        })
        .eq('id', user.id)

      if (empError) {
        // Pode ser um usuário admin genérico que não está na employees, ignoramos
        if (empError.code !== 'PGRST116') {
          console.warn('Erro ao atualizar employees:', empError)
        }
      }

      // Atualiza metadata no auth
      await supabase.auth.updateUser({
        data: { name: form.name, avatar_url: form.avatar_url }
      })

      setSucesso('Perfil atualizado com sucesso!')
      setForm(f => ({ ...f, password: '' }))
    } catch (err: any) {
      setErro(err.message || 'Erro ao salvar alterações.')
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) {
    return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pt-8 pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button onClick={() => router.back()} variant="outline" size="icon" className="border-slate-200 text-slate-500">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Meu Perfil</h1>
          <p className="text-sm text-slate-500 mt-0.5">Gerencie suas informações pessoais e senha de acesso</p>
        </div>
      </div>

      {erro && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
        </div>
      )}
      
      {sucesso && (
        <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-emerald-700 text-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> {sucesso}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            {/* Capa de fundo + Foto */}
            <div className="h-32 bg-gradient-to-r from-[#002855] to-blue-900 relative">
              <div className="absolute -bottom-12 left-8 flex items-end gap-5">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center overflow-hidden shadow-md">
                    {form.avatar_url ? (
                      <img src={form.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-slate-400" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:bg-slate-50 text-slate-600 transition">
                    <Camera className="w-4 h-4" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={salvando} />
                  </label>
                </div>
                <div className="mb-2 text-white shadow-sm">
                  <h2 className="text-xl font-bold drop-shadow-md">{form.name || 'Usuário'}</h2>
                  <p className="text-xs text-blue-200 font-medium">{form.email}</p>
                </div>
              </div>
            </div>

            <div className="px-8 pt-16 pb-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nome de Exibição</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">E-mail de Login</label>
                  <input
                    type="email"
                    value={form.email}
                    disabled
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Telefone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="(00) 00000-0000"
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-slate-400" />
                  <h3 className="text-sm font-bold text-slate-700">Segurança</h3>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nova Senha</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Deixe em branco para manter a senha atual"
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Mínimo de 6 caracteres.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" onClick={() => router.back()} variant="outline" className="border-slate-200 text-slate-600">
            Cancelar
          </Button>
          <Button type="submit" disabled={salvando} className="bg-[#002855] hover:bg-[#001a3d] text-white font-semibold gap-2">
            {salvando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar Alterações
          </Button>
        </div>
      </form>
    </div>
  )
}
