# Manual Técnico Completo da Plataforma AptusClin

> **Documento Oficial de Engenharia, Arquitetura e Continuidade de Projeto**  
> **Versão:** 2.0 (Atualizado e Consolidado)  
> **Destinatário:** Desenvolvedores, Engenheiros de Software, DevOps e Gestores Técnicos.

---

## Sumário Executivo

A **AptusClin** é uma plataforma corporativa e clínica voltada para a gestão de **Medicina e Segurança do Trabalho** (SST) para unidades de atendimento no estado de Mato Grosso (Sorriso, Nova Mutum, Nova Ubiratã e Boa Esperança do Norte). 

O sistema integra:
1. **Portal Público Multi-Unidade:** Landing page institucional, páginas dedicadas por unidade/cidade com contatos e horários reais, carrossel de novidades e seletor dinâmico de unidades.
2. **Portal de Resultados do Paciente:** Acesso seguro para colaboradores/pacientes consultarem e baixarem laudos de exames médicos (ASO, laboratoriais, audiometrias) com proteção anti-IDOR e links temporários assinados.
3. **Portal das Empresas Conveniadas:** Painel onde empresas contratantes visualizam seus colaboradores e o status dos exames de sua equipe.
4. **Painel Administrativo Completo:** Gestão de clínicas/empresas parceiras, colaboradores, lançamentos de exames com upload de PDF, gestão de unidades físicas (fotos, horários, exames oferecidos), banners da home, usuários do sistema e central de ajuda interativa.
5. **Documentação de APIs (OpenAPI / Swagger):** Interface interativa `/api-docs` para consulta e integração com sistemas externos.

---

## 1. Stack Tecnológico

| Camada | Tecnologia | Detalhes & Motivação |
| :--- | :--- | :--- |
| **Framework Full-Stack** | Next.js 16.2.9 (App Router) | Renderização híbrida (SSR, SSG e Server Components), Turbopack para build ultrarrápido. |
| **Linguagem** | TypeScript 5+ | Tipagem estrita (`strict: true`) em 100% do código. |
| **Estilização** | Tailwind CSS v4 + Radix UI + Lucide React | Design responsivo, moderno, componentes acessíveis e ícones padronizados. |
| **Banco de Dados** | PostgreSQL no [Supabase](https://supabase.com/) | Banco relacional robusto com RLS (Row Level Security) e extensões SQL. |
| **Storage de Arquivos** | Supabase Storage | Buckets dedicados (`aptusclin-media` público para fotos/banners e `exames` privado para laudos). |
| **Autenticação Admin** | Supabase Auth (GoTrue) | Sessões gerenciadas via cookies seguros e controle de acesso baseado em roles. |
| **Autenticação Pacientes** | Custom JWT (`jose`) + Bcrypt | Autenticação independente de e-mail com hash Bcrypt, *lazy upgrade* e cookie HTTP-Only. |
| **Testes Automatizados** | Vitest | Testes unitários e de integração de utilitários, autenticação, middleware e domínio. |
| **CI/CD & Automação** | GitHub Actions | Validação de build, testes, spec OpenAPI e rotina de backup diário via `pg_dump`. |
| **Hospedagem** | Vercel (Recomendado) | Deploy contínuo integrado ao GitHub com Serverless Functions na Edge. |

---

## 2. Arquitetura e Estrutura de Pastas

A organização do repositório segue rigorosamente os padrões do **Next.js App Router**:

```text
aptusclin/
├── .github/
│   └── workflows/
│       ├── ci.yml                     # Pipeline de validação (lint, build e testes)
│       ├── api-spec.yml               # Validação do Swagger v2 via swagger-cli
│       └── database-backup.yml        # Backup diário automatizado do banco Supabase
├── docs/
│   ├── MANUAL_TECNICO.md              # Este manual de engenharia
│   ├── MANUAL_DE_OPERACAO.md          # Manual de uso funcional para operadores
│   ├── DNS_AND_SSL_SETUP.md           # Guia de configuração de domínios e certificados
│   └── detailed_exames_empresas.md    # Especificação do fluxo de exames e empresas
├── public/
│   ├── assets/logo.svg                # Logotipo oficial em vetor
│   ├── images/fictitious-clinic.jpg   # Imagem padrão de clínicas/unidades (fallback)
│   ├── favicon.ico                    # Ícone de favoritos
│   ├── manual_operacional_aptusclin.pdf # PDF do manual disponível no painel
│   └── swagger.yaml                   # Especificação OpenAPI completa para a rota /api-docs
├── scripts/
│   └── generate_manual_pdf.py         # Script Python (ReportLab) gerador do manual PDF
├── src/
│   ├── app/                           # Rotas da aplicação (App Router)
│   │   ├── (public)/login/            # Login administrativo
│   │   ├── admin/                     # Módulo do Painel Administrativo
│   │   │   ├── empresas/              # Listagem e cadastro de empresas
│   │   │   ├── colaboradores/         # Listagem, cadastro e edição de pacientes
│   │   │   ├── exames/                # Listagem, lançamento (`novo`) e edição (`editar/[id]`)
│   │   │   ├── unidades/              # Gerenciamento de unidades físicas e fotos
│   │   │   ├── site-settings/         # Configurações de banner da home e cards
│   │   │   └── usuarios/              # Gerenciamento de operadores do painel
│   │   ├── api/                       # Endpoints REST (Back-end Serverless)
│   │   │   ├── admin/                 # Rotas restritas para admin (empresas, exames, users)
│   │   │   ├── auth/                  # Rotas de sessão e seed-admin
│   │   │   ├── clientes/              # Listagem de empresas clientes
│   │   │   ├── colaboradores/         # CRUD de colaboradores/pacientes
│   │   │   ├── exames/                # Lançamento e download de exames
│   │   │   ├── resultados/            # Auth e consulta segura de exames do paciente
│   │   │   └── unidades/              # Consulta pública e update de unidades
│   │   ├── api-docs/                  # Interface gráfica Swagger UI
│   │   ├── auth/callback/             # Callback de autenticação do Supabase
│   │   ├── portal/                    # Portal da Empresa (dashboard e exames da equipe)
│   │   ├── resultados/                # Portal do Paciente (consulta e download de laudos)
│   │   ├── unidades/                  # Páginas públicas de cada unidade por slug
│   │   ├── layout.tsx                 # Layout raiz da aplicação
│   │   └── page.tsx                   # Landing page principal
│   ├── components/                    # Componentes reutilizáveis
│   │   ├── ui/                        # Botões, inputs, tabelas, modais, Help, cards
│   │   ├── HeroUnitSelector.tsx       # Seletor interativo de unidades no topo
│   │   ├── HomeCarousel.tsx           # Carrossel da página inicial
│   │   └── UnitHomePage.tsx           # Template moderno de landing page de unidade
│   ├── lib/                           # Lógicas de domínio, validação e sessão
│   │   ├── paciente-session.ts        # Gerenciamento de JWT do paciente (jose)
│   │   ├── domain.ts                  # Resolução de unidades e subdomínios (multitenancy)
│   │   └── tenant.ts                  # Dados padrão e metadados das unidades
│   ├── utils/                         # Clientes e utilitários
│   │   ├── supabase/
│   │   │   ├── client.ts              # Cliente Supabase Browser (Frontend)
│   │   │   ├── server.ts              # Cliente Supabase Server (com cookies)
│   │   │   └── serverAdmin.ts         # Cliente Supabase com Service Role Key
│   │   └── response.ts                # Padronizador de respostas JSON da API
│   ├── proxy.ts                       # Middleware e controle de roteamento dinâmico
│   └── styles/                        # CSS global e tokens do tema
├── supabase/
│   └── migrations/                    # 22 migrações SQL que estruturam todo o banco
├── package.json                       # Dependências e scripts
├── tsconfig.json                      # Configuração TypeScript
├── next.config.ts                     # Configuração Next.js
└── vitest.config.ts                   # Configuração de testes unitários
```

---

## 3. Banco de Dados e Migrações (Supabase PostgreSQL)

O banco de dados foi estruturado com segurança por padrão e histórico versionado na pasta `supabase/migrations/`:

### Tabelas Principais

1. **`unidades`**: Unidades de atendimento físico da AptusClin.
   - Colunas: `id` (slug, ex: `sorriso`, `nova-mutum`, `nova-ubirata`, `boa-esperanca`), `nome`, `cidade`, `estado`, `endereco`, `telefone`, `whatsapp`, `email`, `horario_funcionamento`, `foto_url`, `site_banner`, `facebook`, `instagram`, `exames_disponiveis`.
2. **`empresas`**: Empresas e clientes corporativos que contratam a AptusClin para exames ocupacionais.
   - Colunas: `id` (UUID), `razao_social`, `nome_fantasia`, `cnpj_cpf`, `telefone`, `email`, `unidade_id`, `ativo`, `created_at`.
3. **`colaboradores`**: Pacientes/trabalhadores vinculados a uma empresa.
   - Colunas: `id` (UUID), `empresa_id`, `nome`, `cpf`, `cargo`, `setor`, `usuario`, `senha_hash`, `ativo`, `created_at`.
4. **`exames`**: Registros de exames ocupacionais e clínicos realizados.
   - Colunas: `id` (UUID), `colaborador_id`, `empresa_id`, `tipo_exame` (ASO Admissional, Periódico, Demissional, Audiometria, Laboratorial, etc.), `data_realizacao`, `data_validade`, `resultado` (`Apto`, `Inapto`), `motivo_inaptidao`, `observacoes`, `arquivo_url` (caminho no bucket Supabase Storage), `created_at`.
5. **`events`**: Tabela auxiliar para agendamentos e notificações operacionais.

### Políticas de Segurança (Row Level Security - RLS)

- Todas as tabelas têm **RLS Ativado** (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`).
- **Leitura Pública Controlada:** Apenas tabelas de conteúdo estritamente público (como `unidades` para carregar telefones, endereços e banners no site) possuem políticas `SELECT` anônimas.
- **Acesso a Dados Médicos e Cadastrais:** As tabelas `colaboradores`, `empresas` e `exames` têm acesso anônimo bloqueado. Acesso de leitura/escrita ocorre exclusivamente via Server Actions e API Routes autenticadas do Next.js usando `supabase/server.ts` ou `supabase/serverAdmin.ts`.

### Buckets de Storage

1. **`aptusclin-media` (Público):** Armazena imagens de fachada das clínicas, fotos de cards e banners customizados da home.
2. **`exames` (Privado):** Armazena os laudos médicos em formato PDF (`application/pdf`). **Nenhum arquivo neste bucket possui URL pública permanente.** O download só é possível via Signed URLs temporárias.

---

## 4. Engenharia de Segurança & Autenticação

A aplicação lida com dados médicos sensíveis e atende a critérios rigorosos da **LGPD (Lei Geral de Proteção de Dados)**:

### 1. Autenticação Administrativa
- Gerenciada pelo **Supabase Auth** no endpoint `/login`.
- Utiliza sessões com tokens JWT em cookies seguros.
- A criação de novos administradores via painel (`/admin/usuarios`) utiliza a API de Administração do Supabase (`auth.admin.createUser`) por meio de [serverAdmin.ts](file:///c:/Users/SSTECNOL/Documents/aptusclin/src/utils/supabase/serverAdmin.ts), com validação de força de senha e atribuição de e-mail institucional.

### 2. Autenticação de Pacientes (Sem E-mail)
- Colaboradores operacionais não possuem e-mail corporativo individual. Seu login é realizado através de `usuario` (ex: `joao.silva`) e `senha`.
- **Criptografia Bcrypt com Lazy Upgrade:** Ao autenticar em `/api/resultados/auth`, o sistema compara a senha fornecida com o hash Bcrypt. Se a senha no banco ainda estiver no formato antigo (texto puro de sistemas legados), o sistema valida a credencial e imediatamente substitui no banco pelo hash Bcrypt seguro (`$2b$10$...`).
- **Sessão JWT Segura:** O token é gerado via biblioteca `jose` usando a chave secreta `PACIENTE_SESSION_SECRET` e injetado em um cookie com flags `HttpOnly`, `SameSite=Lax` e `Secure` (em produção).

### 3. Proteção Anti-IDOR (Insecure Direct Object Reference)
- O IDOR ocorre quando um usuário mal-intencionado tenta alterar o ID na URL para baixar laudos de outros pacientes.
- A rota `/api/resultados/[id]` valida obrigatoriamente se o ID contido no JWT assinado do cookie corresponde **exatamente** ao ID do registro solicitado. Qualquer divergência resulta em `403 Forbidden` imediato.

### 4. URLs Assinadas (Signed URLs)
- Quando o paciente clica para visualizar o PDF do laudo, a rota `/api/exames/download` utiliza a `SUPABASE_SERVICE_ROLE_KEY` para gerar uma **Signed URL** com validade de **15 minutos (900 segundos)**.
- O link expira automaticamente após o período, impedindo vazamentos por compartilhamento de links.

---

## 5. Rotas do Sistema & Funcionalidades

### Painel Administrativo (`/admin`)
- **`/admin`**: Dashboard geral com métricas, contagem de exames, colaboradores e atalhos rápidos.
- **`/admin/empresas` & `/admin/empresas/nova`**: Cadastro de empresas clientes vinculadas a unidades.
- **`/admin/colaboradores` & `/admin/colaboradores/novo`**: Cadastro de colaboradores com geração automática de credenciais e vínculo empresarial.
- **`/admin/exames`**: Tabela de laudos com filtros por status (`Apto`/`Inapto`), empresa e período.
- **`/admin/exames/novo`**: Formulário de lançamento com busca inteligente de colaborador (autocomplete por nome/CPF), seleção de tipo de exame, upload validado de laudo PDF e envio direto para o bucket Supabase.
- **`/admin/exames/editar/[id]`**: Edição e atualização de laudos já cadastrados.
- **`/admin/unidades` & `/admin/unidades/[companyId]`**: Gestão cadastral e visual de cada unidade (telefone, endereço, horários de atendimento, fotos).
- **`/admin/site-settings/home-banner`**: Gestão dos banners do carrossel e das fotos que ilustram os cards de cada cidade na landing page.
- **`/admin/usuarios`**: Gestão de operadores do painel administrativo.
- **Ajuda Interativa**: Componente flutuante [InteractiveHelp.tsx](file:///c:/Users/SSTECNOL/Documents/aptusclin/src/components/ui/InteractiveHelp.tsx) com busca de dúvidas e link para o manual operacional em PDF.

### Portais
- **`/resultados` & `/resultados/[id]`**: Portal do Paciente com login por usuário/senha, visualização de exames realizados, datas e botão de download do laudo oficial.
- **`/portal/dashboard` & `/portal/empresas/[companyId]`**: Portal da Empresa para visualização consolidada dos colaboradores daquela empresa e status de seus ASOs.
- **`/api-docs`**: Visualizador Swagger UI com documentação interativa das rotas da API.

---

## 6. Variáveis de Ambiente Obrigatórias

Para executar o projeto localmente ou em produção, crie um arquivo `.env.local` na raiz com as seguintes chaves:

```ini
# Supabase - Conexão e Autenticação
NEXT_PUBLIC_SUPABASE_URL=https://<seu-projeto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Segurança de Sessão de Pacientes
PACIENTE_SESSION_SECRET=uma-chave-secreta-muito-longa-e-segura-com-pelo-menos-32-caracteres

# Chave para execução da rota seed de administrador (/api/auth/seed-admin)
ADMIN_SEED_SECRET=sua-chave-secreta-de-seed-admin

# URL Base da Aplicação (Opcional em desenvolvimento, essencial em produção)
NEXT_PUBLIC_SITE_URL=https://aptusclin.com.br
```

> [!CAUTION]
> A `SUPABASE_SERVICE_ROLE_KEY` possui privilégios de superusuário no banco. **NUNCA** adicione o prefixo `NEXT_PUBLIC_` a ela e **NUNCA** a exponha no código do cliente (frontend).

---

## 7. Guia Passo a Passo para Assumir o Projeto

Se você está recebendo este projeto para continuar o desenvolvimento ou realizar manutenção, siga o roteiro abaixo:

### Passo 1: Pré-requisitos
- **Node.js**: Versão 20 LTS ou superior.
- **npm**: Versão 10 ou superior.
- **Git**: Instalado e configurado.
- Acesso ao projeto no painel do **Supabase** e na **Vercel**.

### Passo 2: Clonar e Instalar Dependências
```bash
git clone <url-do-repositorio>
cd aptusclin
npm install
```

### Passo 3: Configurar Variáveis de Ambiente
Copie as variáveis de ambiente necessárias para o arquivo `.env.local` conforme detalhado na Seção 6.

### Passo 4: Executar os Testes Automatizados
Certifique-se de que a suíte de testes está 100% verde:
```bash
npm test
```
*O Vitest executará os 22 testes de middleware, proxy, formatação e sessões.*

### Passo 5: Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```
Acesse `http://localhost:3000` no navegador.

### Passo 6: Validar o Build de Produção
Antes de enviar qualquer código para o GitHub, valide se o build compila sem falhas:
```bash
npm run build
```

---

## 8. Como Realizar Alterações Comuns

### 1. Adicionar ou Modificar Campos no Banco de Dados
1. Nunca altere o banco diretamente sem registrar o script.
2. Crie um arquivo SQL na pasta `supabase/migrations/` seguindo o padrão de nomenclatura por data:  
   `supabase/migrations/YYYYMMDD_descricao_da_alteracao.sql`.
3. Aplique o script no **SQL Editor** do painel do Supabase.
4. Lembre-se de configurar as políticas de RLS correspondentes.

### 2. Adicionar uma Nova Unidade / Cidade
1. Insira o registro na tabela `unidades` do banco de dados (especificando `id`, `nome`, `cidade`, `endereco`, `telefone`, `whatsapp`, etc.).
2. Adicione os metadados e aliases correspondentes em `src/lib/tenant.ts`.
3. A nova unidade aparecerá automaticamente no seletor de unidades do Hero e na página inicial.

### 3. Alterar a Documentação da API
1. Atualize a especificação OpenAPI no arquivo `swagger.v2.yaml` na raiz do projeto.
2. Copie a versão atualizada para `public/swagger.yaml` para atualizar a visualização em `/api-docs`.
3. O workflow do GitHub Actions (`.github/workflows/api-spec.yml`) validará automaticamente a sintaxe do arquivo no push.

### 4. Atualizar o Manual Operacional do Usuário (PDF)
1. Edite o arquivo `docs/MANUAL_DE_OPERACAO.md`.
2. Para regerar o PDF baixável pelos clientes, utilize o script Python:
   ```bash
   pip install reportlab
   python scripts/generate_manual_pdf.py
   ```
   O script gerará o arquivo atualizado diretamente em `public/manual_operacional_aptusclin.pdf`.

---

## 9. Manutenção e Rotinas Operacionais

### Backup Diário do Banco de Dados
- Configurado via GitHub Actions em `.github/workflows/database-backup.yml`.
- Executado todos os dias à meia-noite (UTC).
- Conecta-se ao banco via string de conexão do PostgreSQL, gera um dump completo via `pg_dump`, compacta em `.sql.gz` e armazena como artefato seguro nos servidores do GitHub por 90 dias.

### Monitoramento de Recursos e Storage
- O bucket `exames` armazena arquivos PDF dos laudos.
- Monitore o uso de armazenamento no painel do Supabase (`Storage` > `Usage`).
- Caso atinja 80% da cota gratuita (1 GB), recomenda-se o upgrade para o plano Supabase Pro (100 GB de storage), sem necessidade de qualquer alteração no código-fonte.
