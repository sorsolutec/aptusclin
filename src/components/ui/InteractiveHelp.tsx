"use client"

import { useState } from 'react'
import {
  X, BookOpen, Users, Upload, Building, HelpCircle,
  FileDown, Image as ImageIcon, PhoneCall, ShieldCheck, ExternalLink
} from 'lucide-react'

export function InteractiveHelp() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'guia' | 'midias' | 'faq'>('guia')

  return (
    <>
      {/* Botão Flutuante de Ajuda */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-[#002855] text-white rounded-full shadow-2xl hover:bg-[#001c3d] hover:scale-105 transition-all z-50 flex items-center justify-center border-2 border-white/20 animate-bounce-slow"
        aria-label="Ajuda do Sistema Aptusclin"
        title="Ajuda e Manual do Sistema"
      >
        <HelpCircle className="w-6 h-6 text-white" />
      </button>

      {/* Modal de Ajuda Interativo */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[88vh] rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-slate-200 dark:border-slate-800">
            
            {/* Menu Lateral do Modal */}
            <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-950 p-6 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between flex-shrink-0">
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#002855] text-white flex items-center justify-center">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-800 dark:text-white leading-tight">Central de Ajuda</h2>
                    <p className="text-[11px] text-slate-400">Aptusclin Operacional</p>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab('guia')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all text-xs font-semibold flex items-center gap-2.5 ${activeTab === 'guia' ? 'bg-[#002855] text-white shadow-sm' : 'hover:bg-slate-200/60 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400'}`}
                >
                  <BookOpen className="w-4 h-4" /> Passo a Passo Inicial
                </button>

                <button 
                  onClick={() => setActiveTab('midias')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all text-xs font-semibold flex items-center gap-2.5 ${activeTab === 'midias' ? 'bg-[#002855] text-white shadow-sm' : 'hover:bg-slate-200/60 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400'}`}
                >
                  <ImageIcon className="w-4 h-4" /> Fotos & Banners
                </button>
                
                <button 
                  onClick={() => setActiveTab('faq')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all text-xs font-semibold flex items-center gap-2.5 ${activeTab === 'faq' ? 'bg-[#002855] text-white shadow-sm' : 'hover:bg-slate-200/60 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400'}`}
                >
                  <ShieldCheck className="w-4 h-4" /> Dúvidas Frequentes
                </button>
              </div>

              {/* Botão de Download do PDF Completo */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4">
                <a
                  href="/manual_operacional_aptusclin.pdf"
                  target="_blank"
                  download="manual_operacional_aptusclin.pdf"
                  className="w-full flex items-center justify-center gap-2 bg-[#1B8B3A] hover:bg-[#166b2d] text-white text-xs font-bold py-2.5 px-3 rounded-xl transition shadow-md group"
                >
                  <FileDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                  <span>Baixar Manual (PDF)</span>
                </a>
              </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="flex-1 flex flex-col overflow-hidden relative bg-white dark:bg-slate-900">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors z-10"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                {activeTab === 'guia' ? (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1B8B3A] bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                        Guia de Rotinas
                      </span>
                      <h3 className="text-2xl font-black text-[#002855] dark:text-white mt-2">Passo a Passo de Operação</h3>
                      <p className="text-slate-500 text-xs mt-1">Aprenda a realizar as principais rotinas diárias da clínica no sistema.</p>
                    </div>

                    <div className="grid gap-4">
                      {/* Section 1 */}
                      <div className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="p-2 bg-blue-100 text-[#002855] rounded-xl dark:bg-blue-900/40 dark:text-blue-300">
                            <Building className="w-4 h-4" />
                          </div>
                          <h4 className="font-bold text-sm text-[#002855] dark:text-white">1. Cadastrando Empresas Parceiras</h4>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">Antes de atender um paciente, a empresa dele deve estar no sistema.</p>
                        <ol className="list-decimal list-inside text-xs space-y-1 text-slate-700 dark:text-slate-300">
                          <li>No menu lateral, vá em <strong>Empresas</strong> e clique em <strong>Nova Empresa</strong>.</li>
                          <li>Preencha Razão Social, CNPJ, telefone e endereço.</li>
                          <li>Clique em <strong>Salvar Empresa</strong>.</li>
                        </ol>
                      </div>

                      {/* Section 2 */}
                      <div className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="p-2 bg-emerald-100 text-[#1B8B3A] rounded-xl dark:bg-emerald-900/40 dark:text-emerald-300">
                            <Users className="w-4 h-4" />
                          </div>
                          <h4 className="font-bold text-sm text-[#002855] dark:text-white">2. Cadastrando Colaboradores (Pacientes)</h4>
                        </div>
                        <ol className="list-decimal list-inside text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                          <li>Vá no menu em <strong>Colaboradores</strong> e clique em <strong>Novo Colaborador</strong>.</li>
                          <li>Preencha Nome Completo, CPF e vincule à Empresa e Unidade.</li>
                          <li>O sistema gerará um <strong>Usuário</strong> e <strong>Senha</strong> de acesso ao portal.</li>
                          <li className="font-semibold text-emerald-700 dark:text-emerald-400">💡 Entregue o usuário e senha ao paciente para ele consultar o laudo em casa!</li>
                        </ol>
                      </div>

                      {/* Section 3 */}
                      <div className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="p-2 bg-purple-100 text-purple-700 rounded-xl dark:bg-purple-900/40 dark:text-purple-300">
                            <Upload className="w-4 h-4" />
                          </div>
                          <h4 className="font-bold text-sm text-[#002855] dark:text-white">3. Lançamento de Exames (Upload em PDF)</h4>
                        </div>
                        <ol className="list-decimal list-inside text-xs space-y-1 text-slate-700 dark:text-slate-300">
                          <li>No menu lateral, clique em <strong>Exames / ASO</strong> &gt; <strong>Novo Lançamento</strong>.</li>
                          <li>Busque o colaborador pelo nome ou CPF.</li>
                          <li>Defina o tipo (ASO, Audiometria, etc.), aptidão e selecione o arquivo PDF.</li>
                          <li>Clique em <strong>Salvar e Publicar</strong> para disponibilizar ao paciente.</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                ) : activeTab === 'midias' ? (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#002855] bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-full">
                        Gestão do Site
                      </span>
                      <h3 className="text-2xl font-black text-[#002855] dark:text-white mt-2">Fotos das Unidades & Banners</h3>
                      <p className="text-slate-500 text-xs mt-1">Como personalizar o visual do site principal e trocar fotos das cidades.</p>
                    </div>

                    <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
                      <div className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
                        <h4 className="font-bold text-sm text-[#002855] dark:text-white mb-2 flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-[#1B8B3A]" /> Fotos das Unidades (Escolha sua Unidade)
                        </h4>
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Acesse no painel o menu <strong>Configurações do Site</strong> ou a URL <code>/admin/site-settings/home-banner</code>.</li>
                          <li>No quadro superior <strong>Cidades Atendidas</strong>, localize a unidade desejada (Sorriso, Boa Esperança, Nova Ubiratã, Nova Mutum).</li>
                          <li>Clique em <strong>Trocar Foto</strong> e escolha a imagem no seu computador.</li>
                          <li>A alteração é publicada instantaneamente no site principal!</li>
                        </ol>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
                        <h4 className="font-bold text-sm text-[#002855] dark:text-white mb-2 flex items-center gap-2">
                          <PhoneCall className="w-4 h-4 text-[#002855]" /> Horários e Telefones das Unidades
                        </h4>
                        <p className="mb-2">Acesse <strong>Unidades</strong> no menu lateral, escolha a unidade desejada e vá na aba <strong>Configurações</strong> para atualizar o horário de atendimento, telefone e WhatsApp.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1B8B3A] bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                        FAQ Operacional
                      </span>
                      <h3 className="text-2xl font-black text-[#002855] dark:text-white mt-2">Dúvidas Frequentes</h3>
                      <p className="text-slate-500 text-xs mt-1">Soluções rápidas para situações do dia a dia da recepção e atendimento.</p>
                    </div>

                    <div className="space-y-3">
                      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-850/50">
                        <h4 className="font-bold text-xs text-[#002855] dark:text-white mb-1">O paciente reclamou de &quot;Erro 403 / Link Expirado&quot; ao baixar o laudo.</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">Por normas de privacidade (LGPD), os links diretos de PDF expiram em 15 minutos. Peça para o paciente fazer login novamente no portal <code>aptusclin.com.br/resultados</code> e clicar em Baixar PDF.</p>
                      </div>

                      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-850/50">
                        <h4 className="font-bold text-xs text-[#002855] dark:text-white mb-1">O paciente esqueceu a senha, como resetar?</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">Vá em <strong>Colaboradores</strong>, localize a pessoa, clique em <strong>Editar</strong> e selecione <strong>Resetar Senha</strong>. Entregue a nova senha ao paciente.</p>
                      </div>

                      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-850/50">
                        <h4 className="font-bold text-xs text-[#002855] dark:text-white mb-1">Lancei um exame no paciente errado!</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">Vá em <strong>Exames / ASO</strong>, localize o lançamento incorreto na lista, clique no ícone vermelho de lixeira para apagar e refaça o lançamento no paciente correto.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Rodapé com atalho de download */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Manual Operacional Aptusclin v2.0</span>
                <a
                  href="/manual_operacional_aptusclin.pdf"
                  target="_blank"
                  download="manual_operacional_aptusclin.pdf"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B8B3A] hover:underline"
                >
                  <FileDown className="w-3.5 h-3.5" /> Baixar Manual em PDF
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estilos CSS utilitários para scrollbar e animação */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.4);
          border-radius: 20px;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-4%); }
          50% { transform: translateY(0); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
      `}} />
    </>
  )
}
