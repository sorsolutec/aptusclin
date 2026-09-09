# Guia Detalhado – Lançamento de Exames

## Visão Geral

O módulo **Exames / ASO** permite que o operador (usuário comum do painel) registre um novo exame para um colaborador (paciente) e disponibilize o laudo em PDF para download pelo portal do paciente.

### Quando Utilizar
- **Primeiro exame (admissional)**
- **Exames periódicos** (NR‑7, NR‑9, NR‑15)
- **Exames demissionais**
- **Audiometrias** e **exames laboratoriais**

## Fluxo de Trabalho Passo a Passo

1. **Acessar a Tela de Novo Lançamento**
   - Navegue no menu lateral: **Exames / ASO → Novo Lançamento** ou acesse diretamente a URL `/admin/exames/novo`.
   - A página carrega o formulário abaixo.

2. **Selecionar o Colaborador**
   - Campo **"Buscar colaborador"** (autocomplete). Digite parte do **nome** ou **CPF**.
   - O sistema consulta a tabela `colaboradores` (via Supabase RPC `search_colaboradores`) e exibe sugestões com **Nome**, **CPF**, **Empresa** e **Unidade**.
   - Se o colaborador não existir, use o botão **"Cadastrar novo colaborador"** (link para a página de cadastro de colaboradores) antes de prosseguir.

3. **Escolher o Tipo de Exame**
   - `select` com opções predefinidas:
     - **ASO Admissional**
     - **ASO Periódico**
     - **ASO Demissional**
     - **Audiometria**
     - **Laboratorial**
     - **Outros (campo livre)**
   - Cada tipo tem regras de obrigatoriedade de campos (ex.: **Data de validade** obrigatória para ASO Periódico).

4. **Preencher Dados Clínicos**
   - **Resultado**: *Apto* / *Inapto* (radio buttons). Se **Inapto**, será exibido campo **"Motivo da Inaptidão"** (texto livre, até 250 caracteres).
   - **Data da Realização**: campo `date` (padrão = hoje). Não permite datas futuras.
   - **Validade** (opcional): para exames que expiram, preencha `dd/mm/aaaa`.
   - **Observações**: campo `textarea`, máximo 500 caracteres.

5. **Upload do Laudo (PDF)**
   - Botão **"Selecionar arquivo"** aceita apenas **.pdf** (validação MIME `application/pdf`).
   - Tamanho máximo: **5 MB** (configurado em `supabase/storage`.
   - O arquivo é enviado para o bucket **`aptusclin-media`** na pasta `exames/{colaborador_id}/` com nome padrão `exame_{timestamp}.pdf`.
   - O **URL público** é armazenado na coluna `arquivo_url` da tabela `exames`.

6. **Revisão e Confirmação**
   - Após preencher todos os campos, o botão **"Salvar e Publicar"** habilita.
   - O front‑end realiza validações locais:
     - Campos obrigatórios preenchidos.
     - CPF no formato `XXX.XXX.XXX‑XX` (regex `^\d{3}\.\d{3}\.\d{3}\-\d{2}$`).
     - CNPJ válido para a empresa (quando preenchido).
   - Em caso de erro, mensagens **inline** são exibidas.

7. **Persistência no Banco (Supabase)**
   ```sql
   INSERT INTO public.exames (
     colaborador_id,
     tipo,
     resultado,
     motivo_inaptidao,
     data_realizacao,
     validade,
     observacoes,
     arquivo_url,
     criado_por,
     criado_em
   ) VALUES (
     $1, $2, $3, $4, $5, $6, $7, $8, auth.uid(), now()
   );
   ```
   - O `auth.uid()` garante que o usuário autenticado (operador) seja registrado como criador.
   - As **RLS policies** permitem `INSERT` apenas para usuários com role `operador` ou `administrador`.

8. **Notificação ao Paciente**
   - Um **trigger** (`after insert on exames`) dispara um **WebHook** que envia um e‑mail automático para o colaborador com link temporário (válido 15 min) para download do PDF.
   - O e‑mail inclui: nome do exame, data, resultado e instruções de próximo passo.

9. **Visualização no Portal do Paciente**
   - No portal `/resultados`, a página **Meus Exames** lista todos os exames associados ao colaborador.
   - Cada linha exibe ícone de **download** (link expira após 15 min por motivos de LGPD).
   - Caso o exame tenha **resultado Inapto**, exibe mensagem de orientação (ex.: “Agende nova coleta”).

---

# Guia Detalhado – Cadastro de Empresas Parceiras

## Visão Geral

Empresas (clientes) são organizações que contratam os serviços de medicina ocupacional. Cada empresa tem:
- Dados de identificação (Razão Social, CNPJ)
- Dados de contato (e‑mail RH, telefone, endereço)
- Plano de serviços contratado
- Usuário de acesso ao **Portal do Cliente**

## Fluxo de Trabalho Passo a Passo

1. **Acessar a Tela de Cadastro**
   - Menu lateral: **Empresas → Nova Empresa** ou URL `/admin/empresas/nova`.

2. **Preenchimento dos Campos**
   | Campo | Descrição | Obrigatório | Formato / Validação |
   |-------|-----------|--------------|---------------------|
   | **Nome Fantasia** | Nome comercial da empresa | Sim | Texto livre, até 100 chars |
   | **Razão Social** | Nome legal (CNPJ) | Sim | Texto livre, até 150 chars |
   | **CNPJ** | Identificador fiscal | Sim | Regex `^\d{2}\.\d{3}\.\d{3}\/[0-9]{4}\-\d{2}$` |
   | **E‑mail RH** | Contato do responsável de RH | Sim | Validar email padrão `^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$` |
   | **Telefone / WhatsApp** | Canal de comunicação | Sim | Aceita formatos `(XX) XXXXX‑XXXX` ou `+55XX...` |
   | **Endereço Comercial** | Rua, número, bairro, cidade, UF | Sim | Texto livre |
   | **Responsável no RH** | Nome da pessoa de contato | Sim | Texto livre |
   | **Plano de Serviços** | Seleção do pacote contratado | Sim | `select` com opções:
   - Medicina Ocupacional Completa (NR‑7/9/15/16)
   - Apenas ASO & Periódicos
   - Check‑ups Corporativos
   - Gestão Integrada de SST |

3. **Validação de Dados no Front‑End**
   - **CNPJ**: máscara de entrada `99.999.999/9999-99` + validação de dígitos verificadores.
   - **E‑mail**: verificação de domínio (ex.: `empresa.com.br`).
   - **Telefone**: máscara `(99) 99999‑9999` ou `+55 99 99999‑9999`.
   - Se algum campo falhar, o botão **Cadastrar** permanece desabilitado e mensagens de erro são mostradas próximo ao campo.

4. **Persistência no Banco (Supabase)**
   ```sql
   INSERT INTO public.empresas (
     nome_fantasia,
     razao_social,
     cnpj,
     email_rh,
     telefone,
     endereco,
     responsavel_rh,
     plano_servico,
     criado_por,
     criado_em
   ) VALUES (
     $1, $2, $3, $4, $5, $6, $7, $8, auth.uid(), now()
   );
   ```
   - O ID gerado (`empresa_id`) será usado como **foreign key** nas tabelas de **colaboradores** e **exames**.

5. **Criação da Conta de Acesso ao Portal do Cliente**
   - Um **trigger** `after insert on empresas` gera automaticamente um **usuário** no schema `auth.users` com: 
     - **email** = `email_rh`
     - **senha temporária** = hash aleatório (ex.: `crypto.randomUUID()`), enviada por e‑mail ao RH.
   - O usuário recebe o papel `cliente` que tem acesso apenas ao seu **dashboard** (`/portal/empresas/{empresa_id}`).

6. **Envio de E‑mail de Boas‑vindas**
   - O WebHook de Supabase dispara um e‑mail usando o serviço **SendGrid** (ou similar) contendo:
     - Link de ativação (válido 48 h).
     - Credenciais temporárias.
     - Guia rápido de primeiros passos.

7. **Permissões (RLS)**
   - **Administradores**: `SELECT`, `INSERT`, `UPDATE`, `DELETE` em todas as colunas.
   - **Operadores**: `INSERT`, `SELECT` (apenas nas colunas de contato) – não podem excluir ou alterar empresas já cadastradas.
   - **Clientes** (`role = 'cliente'`): `SELECT` **somente** na própria empresa (`empresa_id = auth.uid()`).

8. **Edição / Atualização da Empresa**
   - Na listagem `/admin/empresas`, clique no **ícone lápis** ao lado da empresa.
   - O formulário de edição contém os mesmos campos com valores pré‑populados.
   - Campos críticos (**CNPJ**, **e‑mail**) podem ser editados **somente** por administradores.
   - Após salvar, o webhook atualiza o usuário de acesso caso o e‑mail tenha sido alterado.

9. **Exclusão de Empresa (caso necessário)**
   - Só administradores podem excluir.
   - A exclusão **cascata** remove:
     - Todos os colaboradores vinculados (`colaboradores.empresa_id`)
     - Todos os exames associados a esses colaboradores.
   - Um **prompt de confirmação** informa a quantidade de registros que serão removidos.

10. **Boas‑práticas e Dicas**
    - **Sempre validar CNPJ** antes de salvar para evitar duplicidade.
    - **Consistência de e‑mail**: use um domínio corporativo para evitar conflitos com usuários internos.
    - **Auditoria**: tabela `log_empresas` registra `INSERT`, `UPDATE`, `DELETE` com `user_id`, `timestamp` e `payload` JSON.
    - **Teste**: antes de liberar a funcionalidade, use o ambiente **sandbox** da Supabase para criar registros de teste e validar RLS.

---

## Referências Técnicas
- Supabase RLS Policies (`policies/empresas.sql`)
- Trigger `after_insert_empresas` em `functions/triggers.sql`
- Componentes React usados:
  - `useForm` (hook custom)
  - `useSupabaseClient` (SDK)
  - `zod` para schema validation
- API internas: `POST /api/empresas`, `POST /api/exames`

> **Importante** – Mantenha este guia atualizado sempre que houver mudanças nas regras de negócio ou no schema do banco.
