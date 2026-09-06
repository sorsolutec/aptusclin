"use client"

import { useState } from 'react'
import { LifeBuoy, X, BookOpen, Users, Upload, Building, HelpCircle } from 'lucide-react'

export function InteractiveHelp() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'guia' | 'faq'>('guia')

  return (
    <>
      {/* Botão Flutuante */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-primary text-primary-foreground rounded-full shadow-xl hover:bg-primary/90 transition-all z-50 flex items-center justify-center animate-bounce-slow"
        aria-label="Ajuda do Sistema"
      >
        <LifeBuoy className="w-6 h-6" />
      </button>

      {/* Modal/Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-background w-full max-w-4xl max-h-[85vh] rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-border">
            
            {/* Menu Lateral do Modal */}
            <div className="w-full md:w-64 bg-muted p-6 border-r border-border flex flex-col gap-2 flex-shrink-0">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-primary" /> Ajuda
              </h2>
              
              <button 
                onClick={() => setActiveTab('guia')}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${activeTab === 'guia' ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-muted-foreground/10 text-muted-foreground'}`}
              >
                <BookOpen className="w-4 h-4" /> Passo a Passo
              </button>
              
              <button 
                onClick={() => setActiveTab('faq')}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${activeTab === 'faq' ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-muted-foreground/10 text-muted-foreground'}`}
              >
                <HelpCircle className="w-4 h-4" /> Dúvidas Frequentes
              </button>
            </div>

            {/* Conteúdo Principal */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                {activeTab === 'guia' ? (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Guia Rápido de Operação</h3>
                      <p className="text-muted-foreground mb-6">Aprenda a realizar as rotinas diárias da clínica no sistema.</p>
                    </div>

                    <div className="grid gap-6">
                      {/* Section 1 */}
                      <div className="bg-card border border-border p-5 rounded-lg shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-blue-100 text-blue-700 rounded-md dark:bg-blue-900/30 dark:text-blue-400">
                            <Building className="w-5 h-5" />
                          </div>
                          <h4 className="font-bold text-lg">1. Cadastrando Empresas</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">Antes de atender um paciente, a empresa dele deve estar no sistema.</p>
                        <ol className="list-decimal list-inside text-sm space-y-1 ml-2 text-foreground/80">
                          <li>Vá no menu lateral em <strong>Empresas</strong>.</li>
                          <li>Clique em <strong>Nova Empresa</strong>.</li>
                          <li>Preencha a Razão Social, CNPJ e salve.</li>
                        </ol>
                      </div>

                      {/* Section 2 */}
                      <div className="bg-card border border-border p-5 rounded-lg shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-green-100 text-green-700 rounded-md dark:bg-green-900/30 dark:text-green-400">
                            <Users className="w-5 h-5" />
                          </div>
                          <h4 className="font-bold text-lg">2. Cadastrando Colaboradores (Pacientes)</h4>
                        </div>
                        <ol className="list-decimal list-inside text-sm space-y-2 ml-2 text-foreground/80">
                          <li>Vá no menu em <strong>Colaboradores</strong> e clique em <strong>Novo Colaborador</strong>.</li>
                          <li>Preencha o Nome e vincule à Empresa correta.</li>
                          <li>O sistema vai gerar um <strong>Usuário</strong> e <strong>Senha</strong> automáticos.</li>
                          <li className="font-medium text-amber-600 dark:text-amber-400">🚨 Anote este usuário e senha e entregue ao paciente na recepção!</li>
                        </ol>
                      </div>

                      {/* Section 3 */}
                      <div className="bg-card border border-border p-5 rounded-lg shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-purple-100 text-purple-700 rounded-md dark:bg-purple-900/30 dark:text-purple-400">
                            <Upload className="w-5 h-5" />
                          </div>
                          <h4 className="font-bold text-lg">3. Lançando Exames (Upload de PDF)</h4>
                        </div>
                        <ol className="list-decimal list-inside text-sm space-y-1 ml-2 text-foreground/80">
                          <li>Vá no menu em <strong>Lançar Exames / ASO</strong>.</li>
                          <li>Clique em <strong>Novo Lançamento</strong> e busque o colaborador.</li>
                          <li>Preencha o título e selecione o arquivo PDF do computador.</li>
                          <li>Salve. O exame já estará disponível para o paciente baixar.</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Perguntas Frequentes (FAQ)</h3>
                      <p className="text-muted-foreground mb-6">Soluções rápidas para problemas comuns do dia a dia.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="border border-border rounded-lg p-4 bg-muted/30">
                        <h4 className="font-bold mb-2 text-foreground">O paciente esqueceu a senha, o que eu faço?</h4>
                        <p className="text-sm text-muted-foreground">Vá em <strong>Colaboradores</strong>, encontre o paciente e clique em Editar. Role para baixo e utilize a opção de Resetar Senha. O sistema gerará uma nova, entregue a ele.</p>
                      </div>

                      <div className="border border-border rounded-lg p-4 bg-muted/30">
                        <h4 className="font-bold mb-2 text-foreground">Como o paciente acessa o laudo em casa?</h4>
                        <p className="text-sm text-muted-foreground">Oriente o paciente a acessar <code>aptusclin.com.br</code>, clicar em <strong>Resultados</strong> e fazer login com o usuário e senha gerados no momento do cadastro.</p>
                      </div>

                      <div className="border border-border rounded-lg p-4 bg-muted/30">
                        <h4 className="font-bold mb-2 text-foreground">Lancei o exame na pessoa errada!</h4>
                        <p className="text-sm text-muted-foreground">Não se preocupe. Vá na lista de <strong>Exames</strong>, localize o exame que foi lançado errado e clique no ícone de Lixeira vermelha para apagá-lo. Em seguida, cadastre de novo na pessoa certa.</p>
                      </div>

                      <div className="border border-border rounded-lg p-4 bg-muted/30">
                        <h4 className="font-bold mb-2 text-foreground">O paciente reclamou de "Erro 403" ou Acesso Negado ao baixar o PDF.</h4>
                        <p className="text-sm text-muted-foreground">Por motivos de segurança, o link do PDF se autodestrói em 15 minutos. Se o paciente demorou muito para clicar ou tentar repassar o link para terceiros, ele vai dar erro. Peça para ele fazer o login novamente e clicar em Baixar de novo.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Adiciona um css básico para scroll e animação caso o tailwind não tenha */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 20px;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(0); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
      `}} />
    </>
  )
}
