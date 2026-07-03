"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, X, Loader2 } from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: string;
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ email: '', role: 'user' });
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Falha ao buscar usuários');
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      console.error('Erro ao carregar usuários', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openNewUserModal = () => {
    setEditingUser(null);
    setFormData({ email: '', role: 'user' });
    setError(null);
    setIsModalOpen(true);
  };

  const editUser = (user: User) => {
    setEditingUser(user);
    setFormData({ email: user.email, role: user.role });
    setError(null);
    setIsModalOpen(true);
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Deseja realmente excluir este usuário?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao excluir usuário');
      }
      setUsers(users.filter((u) => u.id !== id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);

    try {
      const url = editingUser ? `/api/admin/users/${editingUser.id}` : '/api/admin/users';
      const method = editingUser ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao salvar usuário');

      setIsModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <section className="p-6 bg-slate-900 text-slate-100 rounded-2xl shadow-xl border border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Gerenciar Usuários</h2>
          <p className="text-sm text-slate-400 mt-1">Crie e edite as credenciais de acesso do portal administrativo</p>
        </div>
        <Button 
          onClick={openNewUserModal}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Novo Usuário
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : (
        <div className="overflow-hidden border border-slate-800 rounded-xl bg-slate-950/40">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">E‑mail</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Perfil</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-200">{u.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        u.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-slate-800 text-slate-450'
                      }`}>
                        {u.role === 'admin' ? 'Admin' : 'Usuário'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => editUser(u)}
                          className="h-8 w-8 text-slate-400 hover:text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteUser(u.id)}
                          className="h-8 w-8 text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-500 text-sm">
                    Nenhum usuário cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Modal de criação/edição */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm z-50 p-4">
              <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute right-4 top-4 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-bold text-white mb-4">
                  {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                </h3>
                {error && (
                  <div className="mb-4 p-3 bg-red-950/40 border border-red-800/40 text-red-300 text-sm rounded-xl">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">E‑mail</label>
                    <input
                      type="email"
                      required
                      placeholder="usuario@dominio.com"
                      className="w-full pl-3 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder-slate-700 text-sm transition-all"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Perfil</label>
                    <select
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white text-sm transition-all"
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="admin">Administrador</option>
                      <option value="user">Usuário comum</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <Button 
                      type="button" 
                      variant="ghost"
                      onClick={() => setIsModalOpen(false)}
                      className="text-slate-400 hover:text-white hover:bg-slate-800/50"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={actionLoading}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
