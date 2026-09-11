# Plano de Implementação — Seção de Formulários Aptusclin

**Site:** aptusclin.com.br
**Data:** Setembro 2026
**Stack recomendada:** Next.js (React + Node.js) — consistente com a stack já usada no site

---

## 1. Contexto

O site já possui:
- Painel Administrativo em `/login`
- Seção de Resultados de Exames em `/resultados`
- Unidades em Sorriso, Nova Ubiratã, Boa Esperança do Norte e Nova Mutum
- Formulário de contato simples na home

**Objetivo:** adicionar uma seção onde empresas clientes escolhem um tipo de formulário, preenchem e enviam — com o envio caindo numa área de gestão no painel administrativo e disparando notificação por e-mail e/ou WhatsApp.

---

## 2. Formulários mais comuns em medicina do trabalho

### Solicitação de exames ocupacionais (principal)
- Pedido de ASO (Atestado de Saúde Ocupacional): admissional, periódico, demissional, mudança de função, retorno ao trabalho
- Dados do colaborador: nome, CPF, função/cargo, setor
- Riscos ocupacionais da função (para a clínica definir exames complementares)

### Documentos de apoio anexados pela empresa
- PCMSO (Programa de Controle Médico de Saúde Ocupacional)
- PGR/PPRA (Programa de Gerenciamento de Riscos)
- Ficha de EPI / exposição a agentes de risco

### Formulários específicos por tipo de exame
- Requisição de exames complementares (audiometria, espirometria, exames laboratoriais, raio-x, acuidade visual)
- Anamnese ocupacional

### Pós-atendimento
- Emissão/liberação do ASO assinado
- Envio de dados ao eSocial (evento S-2220)

---

## 3. Arquitetura proposta

### 3.1 Frontend público
Nova seção `/formularios` no site:
- Usuário escolhe o tipo de formulário
- Formulário correto é carregado dinamicamente
- Campos adaptados por tipo (ex: admissional pede dados diferentes de retorno ao trabalho)
- Integração fluida: pode ser acessado via menu geral ou com a unidade pré-selecionada a partir da página de cada cidade (ex: `/formularios?unidade=sorriso`)

#### 3.1.1 Comprovante de Envio, Impressão e Compartilhamento
Após a conclusão do envio, a tela de confirmação apresentará:
- **Número do Protocolo:** Código único (ex: `APT-2026-0042`) para acompanhamento.
- **Opção de Impressão / Salvar em PDF (Guia de Encaminhamento):**
  - Botão "Imprimir / Salvar em PDF" com estilização específica para impressão em folha A4 (`@media print`).
  - Layout formal com: Logo da Aptusclin, Protocolo, Dados da Empresa, Dados do Trabalhador, Tipo de Exame Solicitado, Endereço e Horários da Unidade e Orientações ao Paciente (levar documento com foto, jejum, etc.).
  - Serve como comprovante tanto para o RH arquivar quanto para entregar impresso nas mãos do trabalhador encaminhado à clínica.
- **Opção de Compartilhamento:**
  - Botão "Compartilhar via WhatsApp": Gera mensagem formatada para o RH enviar diretamente ao trabalhador ou supervisor com o protocolo, orientações e localização da clínica no Google Maps.
  - Botão "Copiar Link do Protocolo" ou uso da Web Share API no celular.
  - Envio automático de confirmação com a cópia dos dados para o e-mail do solicitante.

### 3.2 Modelo de dados
Cada envio vira um registro estruturado contendo:
- Empresa solicitante
- Dados do colaborador (nome, CPF, cargo, setor)
- Tipo de exame/formulário
- Unidade/cidade vinculada (Sorriso, Nova Ubiratã, Boa Esperança do Norte, Nova Mutum)
- Anexos (PCMSO, PGR, quando aplicável)
- Status (novo, em análise, respondido)

### 3.3 Painel de gestão
Nova aba "Formulários Recebidos" dentro do `/login` existente:
- Listagem com filtro por status, unidade e tipo
- Histórico por empresa
- Sem duplicar autenticação — usa o login já existente

### 3.4 Notificações

**E-mail**
- Disparo automático para a unidade responsável ao receber novo formulário
- Pode usar o servidor de e-mail próprio (Mailcow) já em configuração

**WhatsApp**
- Notificação (não os dados sensíveis) para o WhatsApp da unidade correspondente
- Recomendado usar a API oficial do WhatsApp Business (Meta) para confiabilidade a longo prazo, apesar do custo por mensagem e processo de aprovação

---

## 4. Consideração de LGPD

Como o sistema envolve dados de saúde (exames, riscos ocupacionais):
- Armazenar com controle de acesso adequado
- Mensagens de notificação via WhatsApp devem conter apenas "novo formulário recebido, acesse o painel" — nunca dados de saúde diretamente na mensagem

---

## 5. Passos de implementação

1. Criar seção `/formularios` no site público
2. Modelar os formulários no banco de dados
3. Adicionar seção de gestão no Painel Administrativo existente
4. Configurar notificação por e-mail
5. Configurar notificação por WhatsApp

---

## 6. Próximos passos em aberto

- Definir se o formulário público em Next.js ou o modelo de dados/API é o ponto de partida do desenvolvimento
- Confirmar qual solução de e-mail será usada para o disparo (Mailcow self-hosted em configuração)
- Definir processo de aprovação da API do WhatsApp Business
