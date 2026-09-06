# Manual Técnico da Plataforma Aptusclin

Este documento é o **Guia Oficial de Arquitetura e Manutenção** do sistema Aptusclin. Ele foi redigido para orientar desenvolvedores e administradores de sistema (sysadmins) que precisem assumir o projeto, realizar manutenções ou expandir funcionalidades.

---

## 1. Stack Tecnológico (Tech Stack)

A aplicação é construída com as seguintes tecnologias modernas:

- **Framework Front-end / Back-end:** [Next.js 16](https://nextjs.org/) (utilizando o paradigma **App Router**).
- **Linguagem:** TypeScript (Strict Mode ativado).
- **Estilização:** Tailwind CSS v4 + Componentes Radix UI / Shadcn UI.
- **Banco de Dados & Storage:** [Supabase](https://supabase.com/) (PostgreSQL).
- **Autenticação Administrativa:** Supabase Auth.
- **Autenticação de Pacientes/Colaboradores:** JWT Customizado via Edge Runtime (biblioteca `jose`).
- **Hospedagem Recomendada:** [Vercel](https://vercel.com/) (Serverless Functions).

---

## 2. Estrutura de Diretórios (`/src`)

A regra de ouro do **App Router** do Next.js é que as rotas web são definidas por pastas dentro de `src/app`.

```text
aptusclin/
├── .github/workflows/        # Rotinas de automação (ex: Backup diário do banco)
├── docs/                     # Documentações do sistema
├── src/
│   ├── app/                  # Roteamento da Aplicação (App Router)
│   │   ├── (public)/         # Rotas institucionais (Home, Unidades)
│   │   ├── admin/            # Painel Administrativo (Interface)
│   │   ├── api/              # Endpoints REST (Back-end)
│   │   ├── login/            # Rota de Login Administrativo
│   │   ├── portal/           # Portal da Empresa (Visualização de colaboradores)
│   │   └── resultados/       # Portal do Paciente (Login e Download de exames)
│   ├── components/           # Componentes React reutilizáveis (UI)
│   ├── lib/                  # Utilitários, constantes e sessão (ex: paciente-session.ts)
│   ├── styles/               # CSS global
│   └── utils/                # Clientes Supabase (Server, Admin, Browser)
├── supabase/
│   └── migrations/           # Scripts SQL de criação de tabelas e políticas de segurança
└── .env.local                # Variáveis de ambiente (NÃO commitado no GitHub)
```

> [!TIP]
> Para alterar o visual do site público, edite os arquivos em `src/app/page.tsx` ou dentro das pastas das unidades em `src/app/unidades`.

---

## 3. Banco de Dados (PostgreSQL no Supabase)

### Principais Tabelas
1. **`empresas`**: Armazena as clínicas/empresas parceiras da Aptusclin.
2. **`colaboradores`**: Funcionários/pacientes vinculados a uma empresa. Possui chaves vitais:
   - `usuario`: Gerado automaticamente no formato "Nome.Sobrenome".
   - `senha_hash`: Senha criptografada via **Bcrypt**.
   - `ativo`: Booleano para controle de acesso.
3. **`exames`**: Registro dos exames realizados. Relaciona-se com `colaboradores_id`.
   - `arquivo_url`: Originalmente armazenava a URL pública do PDF. Agora armazena o caminho interno (path) do arquivo no bucket do Supabase.

### Storage (Laudos/PDFs)
Os arquivos (laudos médicos) ficam salvos no Supabase Storage, em um **Bucket Privado** chamado `exames`. O acesso direto da internet aos arquivos PDF é proibido pelas regras RLS (Row Level Security). O sistema só permite o download através de URLs Assinadas geradas na hora (vide Seção 4).

---

## 4. Segurança e Fluxos de Autenticação (CRÍTICO)

O sistema de gestão médica lida com dados sensíveis (LGPD) e possui uma arquitetura de segurança rígida de duas vias:

### A. Autenticação Administrativa (Supabase Auth)
O painel administrativo (`/admin`) utiliza o sistema nativo do Supabase. Apenas usuários logados que possuam a `role = 'admin'` nos metadados JWT da conta têm permissão para acessar o painel e inserir/editar registros.

### B. Autenticação de Pacientes/Colaboradores (Custom JWT + Bcrypt)
Como colaboradores não usam e-mails padronizados (usam login/senha gerados), a autenticação não usa o Supabase Auth para eles. Funciona assim:
1. **Criptografia (Bcrypt + Lazy Upgrade):** O sistema compara a senha fornecida com a coluna `senha_hash`. **Regra especial (Lazy Upgrade):** Se a senha no banco estiver em "texto puro" (cadastro muito antigo), ele valida, faz o hash Bcrypt em tempo real e atualiza o banco para que nos próximos logins seja totalmente seguro.
2. **Sessão JWT (Anti-IDOR):** Se o login for válido, o sistema (via `src/lib/paciente-session.ts`) assina digitalmente um token JWT usando a chave de ambiente `PACIENTE_SESSION_SECRET`. Esse token vira um **Cookie HTTP-Only** (inacessível via JavaScript malicioso).

### C. Proteção IDOR no Download de Exames
O IDOR (Insecure Direct Object Reference) acontece quando um usuário troca o ID na URL para ver dados de outra pessoa. Proteção:
1. A rota `/api/resultados/[id]/route.ts` vai ler o cookie de sessão do paciente logado.
2. Vai verificar: O `ID` solicitado na URL é exatamente o mesmo `ID` do dono do token no cookie?
3. Se for **diferente**, a API rejeita a conexão (`403 Forbidden`).

### D. URLs Assinadas (Signed URLs)
Para que o paciente baixe o laudo em PDF sem precisar tornar a pasta do Supabase pública:
1. A API usa o cliente **Admin do Supabase** (`getAdminClient()`) para acessar o bucket privado `exames`.
2. Ela gera uma **URL Assinada (Signed URL)** temporária.
3. O link expira em exatamente **15 minutos** (900 segundos). Após 15 minutos, o PDF desaparece daquele endereço.

---

## 5. Rotinas em Back-ground (Automação de Backups)

### Backup Automático de Dados (GitHub Actions)
Existe um arquivo em `.github/workflows/database-backup.yml`. 
Todo dia (à meia-noite), o GitHub Actions dispara uma rotina automática e gratuita que:
1. Conecta no banco PostgreSQL do Supabase remotamente.
2. Executa um comando `pg_dump` completo das tabelas.
3. Compacta o SQL gerado (GZIP) e o guarda em segurança na aba "Actions" do GitHub, como um artefato privado. O próprio GitHub limpa arquivos com mais de 90 dias, mantendo espaço sem cobranças extras.

---

## 6. Guia Prático de Manutenção (Como Alterar o Código)

### Onde alterar o quê?
- **Página Inicial (Site):** `src/app/page.tsx`
- **Textos das Clínicas/Unidades:** Em `src/app/unidades/[slug]/page.tsx`
- **Menu do Painel Admin:** `src/app/admin/layout.tsx` (aqui ficam os atalhos e links da barra lateral).
- **Regras de Criação no Banco:** Qualquer lógica de gravação de dados está na pasta `src/app/api/...`. (Ex: A lógica de criar funcionário novo com hash de senha fica em `/api/colaboradores/route.ts`).
- **Variáveis de Ambiente:** Em produção, acesse o painel da **Vercel** > Settings > Environment Variables. NUNCA coloque chaves secretas no código-fonte. (As variáveis de produção obrigatórias estão documentadas no arquivo `docs/DNS_AND_SSL_SETUP.md`).

### Como rodar o projeto localmente (para Desenvolvedores)
1. Instale dependências: `npm install`
2. Configure o arquivo `.env.local` na raiz do projeto contendo as chaves do Supabase.
3. Inicie o servidor: `npm run dev`
4. Acesse: `http://localhost:3000`

### Como alterar o banco (Supabase)
Se você precisar criar uma coluna nova ou tabela futuramente:
1. Acesse `app.supabase.com` > SQL Editor.
2. Escreva o SQL e execute (ex: `ALTER TABLE exames ADD COLUMN observacao text;`).
3. **MUITO IMPORTANTE:** Lembre-se sempre de ajustar as Políticas RLS (Row Level Security) da tabela nova. Tabelas sem RLS no Supabase são uma falha de segurança se expostas pelas APIs anônimas, embora aqui usemos majoritariamente o back-end Next.js para intermediação.

---

## 7. Escalabilidade e Upgrade (Limites Gratuitos)

A arquitetura moderna deste sistema (Vercel + Supabase) suporta com extrema folga um alto volume (100 a 500 exames dia) sem gargalos de CPU/Memória.
Porém, é fundamental atentar-se aos seguintes limites do **Plano Gratuito (Free Tier)**:
- O **Storage do Supabase** possui um limite grátis de **1GB**. 
- Considerando laudos médicos em PDF, o espaço encherá em poucos meses sob uso intenso.
- **Quando chegar perto de 1GB:** Realize o upgrade no painel do Supabase para o **Plano Pro ($25/mês)**. Isso aumentará instantaneamente o limite de armazenamento para **100GB** e também ativará os backups automáticos no próprio servidor. **Não será necessária nenhuma modificação no código.**
