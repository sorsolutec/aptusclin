'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ChangePassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      setError('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('password', password);

      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocorreu um erro ao alterar a senha.');
      }

      setSuccess(true);
      setTimeout(() => {
        // Redireciona para o portal após alteração bem sucedida
        router.push('/portal/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100 font-sans p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1e1b4b,transparent_50%)] opacity-70 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,#0f172a,transparent_60%)] opacity-70 pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/30 rounded-xl flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-indigo-400 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Defina sua nova senha</h1>
          <p className="text-sm text-slate-400 mt-2 text-center">
            Este é seu primeiro acesso. Por questões de segurança, altere sua senha antes de prosseguir.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-800/40 text-red-300 text-sm rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-sm rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>Senha alterada com sucesso! Redirecionando para o portal...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Nova Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || success}
                placeholder="Insira sua nova senha"
                className="w-full pl-4 pr-12 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder-slate-600 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading || success}
                className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">Mínimo de 6 caracteres.</p>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/10 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Alterando senha...
              </>
            ) : (
              'Salvar Nova Senha'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
