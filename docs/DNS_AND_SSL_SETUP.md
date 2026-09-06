# Guia: Domínio Próprio e Certificado SSL na Vercel

## Pré-requisitos
- Domínio registrado (ex: `aptusclin.com.br`) com acesso ao painel DNS do provedor (HostGator, Registro.br, Cloudflare, etc.)
- Projeto `aptusclin` já publicado na Vercel conectado ao repositório `sorsolutec/aptusclin`

---

## 1. Adicionar o Domínio no Painel da Vercel

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard) e abra o projeto **aptusclin**.
2. Clique em **Settings** → **Domains**.
3. Digite seu domínio (ex: `aptusclin.com.br`) e clique em **Add**.
4. A Vercel vai exibir os registros DNS que você deve configurar no seu provedor.

---

## 2. Configurar os Registros DNS no Provedor

Acesse o painel de gerenciamento de DNS do seu provedor de domínio (HostGator cPanel > Zona DNS / Registro.br / Cloudflare) e adicione os seguintes registros:

| Tipo   | Nome/Host | Valor/Destino             | TTL    |
|--------|-----------|---------------------------|--------|
| **A**  | `@`       | `76.76.21.21`             | 1 hora |
| **CNAME** | `www`  | `cname.vercel-dns.com`    | 1 hora |

> [!IMPORTANT]
> Se o seu domínio **já usa Cloudflare** como proxy (nuvem laranja), altere o CNAME para DNS only (nuvem cinza) para que a Vercel possa emitir o certificado SSL corretamente.

> [!NOTE]
> A propagação DNS pode levar de **5 minutos até 48 horas** dependendo do provedor. Em geral, provedores brasileiros propagam em 15–30 minutos.

---

## 3. Verificação e Emissão Automática do SSL

Após a propagação DNS:

1. Volte ao painel da Vercel → **Settings** → **Domains**.
2. O status do domínio mudará para ✅ **Valid Configuration**.
3. A Vercel emitirá automaticamente o certificado **Let's Encrypt** (SSL gratuito, renovação automática vitalícia).
4. O redirecionamento `HTTP → HTTPS` é **habilitado automaticamente** pela Vercel sem configuração adicional.

---

## 4. Variáveis de Ambiente em Produção na Vercel

Após o deploy, configure as variáveis de ambiente no painel:

**Vercel** → **Settings** → **Environment Variables** → **Add**

| Nome da Variável | Valor | Ambiente |
|:---|:---|:---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://anolzttfkkwuympfxohs.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(chave anon do .env.local)* | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | *(chave service role do .env.local)* | Production |
| `PACIENTE_SESSION_SECRET` | *(string aleatória mínimo 32 caracteres — gere em `openssl rand -hex 32`)* | Production |

> [!CAUTION]
> **Nunca commite** o arquivo `.env.local` no GitHub. Ele já está no `.gitignore`. As variáveis de produção devem ser configuradas exclusivamente pelo painel da Vercel.

---

## 5. Gerar o Segredo de Sessão do Paciente

Execute o comando abaixo no terminal para gerar um segredo seguro para `PACIENTE_SESSION_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copie o resultado e cole na variável de ambiente da Vercel.

---

## 6. Transição para Supabase Pro (quando necessário)

Quando o volume de armazenamento de PDFs ultrapassar **900 MB** ou a latência do banco aumentar, migre para o **Supabase Pro**:

1. Acesse [app.supabase.com](https://app.supabase.com) → Projeto **aptusclin** → **Settings** → **Billing**.
2. Clique em **Upgrade to Pro** (U$ 25/mês ≈ R$ 140/mês).
3. Após o upgrade, vá em **Settings** → **Database** → habilite **Automatic Daily Backups**.
4. O workflow de backup do GitHub Actions pode continuar funcionando em paralelo como camada extra de segurança.
