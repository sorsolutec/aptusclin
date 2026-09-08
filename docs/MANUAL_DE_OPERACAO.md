# Manual Operacional Detalhado — Plataforma Aptusclin

Bem-vindo ao **Manual Operacional Oficial** da plataforma Aptusclin (Medicina Ocupacional & Segurança do Trabalho). Este guia foi desenvolvido para orientar administradores, médicos e colaboradores da recepção no uso de todas as funcionalidades do sistema.

---

## 📌 Sumário

1. [Visão Geral da Plataforma](#1-visão-geral-da-plataforma)
2. [Acesso ao Painel Administrativo](#2-acesso-ao-painel-administrativo)
3. [Gestão de Empresas Parceiras](#3-gestão-de-empresas-parceiras)
4. [Gestão de Colaboradores (Pacientes)](#4-gestão-de-colaboradores-pacientes)
5. [Lançamento de Exames e Emissão de ASO em PDF](#5-lançamento-de-exames-e-emissão-de-aso-em-pdf)
6. [Gestão Visual do Site e Mídias (Fotos e Banners)](#6-gestão-visual-do-site-e-mídias-fotos-e-banners)
7. [Configuração de Unidades e Canais de Atendimento](#7-configuração-de-unidades-e-canais-de-atendimento)
8. [Gestão de Usuários do Painel Admin](#8-gestão-de-usuários-do-painel-admin)
9. [Como Orientar o Paciente na Recepção](#9-como-orientar-o-paciente-na-recepção)
10. [Solução de Problemas Frequentes (FAQ Operacional)](#10-solução-de-problemas-frequentes-faq-operacional)

---

## 1. Visão Geral da Plataforma

O sistema da Aptusclin é composto por 3 ecossistemas integrados:

- **Site Institucional Público (`aptusclin.com.br`)**: Apresentação de serviços, seletor de unidades (Sorriso, Boa Esperança do Norte, Nova Ubiratã, Nova Mutum), formulário de contato e carrossel de fotos.
- **Portal de Resultados dos Pacientes (`/resultados`)**: Espaço seguro onde os trabalhadores da empresa parceira fazem login com o seu código/usuário e senha para visualizar e baixar laudos laboratoriais, audiometrias e o ASO em PDF.
- **Painel Administrativo (`/admin`)**: Área restrita para os funcionários da clínica realizarem cadastros, uploads de laudos, gestão de contatos e personalizações visuais das unidades.

---

## 2. Acesso ao Painel Administrativo

### Como Entrar:
1. Acesse o endereço [`https://www.aptusclin.com.br/login`](https://www.aptusclin.com.br/login).
2. Digite seu **E-mail cadastrado** e a sua **Senha**.
3. Clique em **"Entrar no Painel"**.

### Regras de Acesso e Perfis:
- **Administrador**: Possui acesso total ao sistema (cadastros, relatórios, alteração de fotos, criação de operadores).
- **Usuário Comum / Operador**: Pode cadastrar colaboradores, lançar exames e consultar empresas.

---

## 3. Gestão de Empresas Parceiras

Antes de associar exames a um trabalhador, a empresa contratante (cliente da clínica) precisa estar cadastrada no sistema.

### Como Cadastrar uma Empresa:
1. No menu lateral do Painel Admin, clique em **Empresas**.
2. Clique no botão azul **"Nova Empresa"**.
3. Preencha os campos:
   - **Razão Social / Nome da Empresa** (Obrigatório).
   - **CNPJ** (Recomendado para identificação).
   - **Telefone de Contato / E-mail do RH**.
   - **Endereço da Empresa**.
4. Clique em **Salvar Empresa**.

### Edição ou Exclusão:
- Para atualizar telefones ou endereço, clique no ícone de lápis **"Editar"** ao lado da empresa.
- Se a empresa encerrar o contrato, desmarque o campo **"Ativa"** no formulário para ocultá-la das listagens ativas.

---

## 4. Gestão de Colaboradores (Pacientes)

Cada paciente no sistema é um colaborador vinculado a uma empresa cadastrada.

### Como Cadastrar um Novo Colaborador:
1. No menu lateral, acesse **Colaboradores**.
2. Clique em **"Novo Colaborador"**.
3. Preencha os dados do funcionário:
   - **Nome Completo**.
   - **CPF / RG**.
   - **Empresa Contratante** (Selecione na lista).
   - **Unidade de Atendimento** (ex: Nova Mutum, Sorriso, etc.).
4. **Geração de Credenciais**: O sistema gerará automaticamente um **Usuário de Login** e uma **Senha Temporária**.
5. Clique em **Salvar Colaborador**.
6. **Entregue o usuário e senha ao paciente** ou à empresa responsável para que eles possam acessar os resultados online.

### Resetar Senha do Paciente:
- Se o paciente esquecer a senha de acesso ao portal de resultados, acesse **Colaboradores**, clique em **Editar** no cadastro da pessoa e selecione **"Resetar Senha"**. Informe a nova senha gerada ao paciente.

---

## 5. Lançamento de Exames e Emissão de ASO em PDF

Esta é a etapa onde o laudo impresso/gerado pelo laboratório ou médico é publicado no sistema para o colaborador baixar em casa.

### Passo a Passo para Subir um Exame:
1. No menu lateral, clique em **Exames / ASO** (ou **Lançar Exame**).
2. Clique no botão **"Novo Lançamento"**.
3. **Selecione o Colaborador**: Digite o nome ou CPF para buscar o paciente.
4. **Tipo de Exame**: Escolha entre `ASO Admissional`, `ASO Periódico`, `ASO Demissional`, `Audiometria`, `Laboratorial`, etc.
5. **Resultado Clínico**: Marque `Apto` ou `Inapto` conforme o laudo médico.
6. **Data de Realização**: Informe a data do atendimento.
7. **Upload do Documento**: Clique na caixa de arquivo e selecione o arquivo **PDF** ou **Imagem** do laudo no seu computador.
8. Clique em **Salvar e Publicar**.

> [!NOTE]
> Assim que o arquivo é salvo, o link seguro é ativado e o laudo fica imediatamente disponível para download no portal do paciente.

---

## 6. Gestão Visual do Site e Mídias (Fotos e Banners)

Você pode personalizar as imagens do site principal sem precisar de conhecimento técnico em programação.

### Acessando a Gestão de Mídias:
Acesse no painel o menu **Configurações do Site** ou a URL [`/admin/site-settings/home-banner`](https://www.aptusclin.com.br/admin/site-settings/home-banner).

### A. Alterar Fotos das Unidades (Seção "Escolha sua Unidade / Cidades Atendidas"):
1. Na parte superior da página, localize a seção **Fotos dos Cards de Unidades na Página Inicial**.
2. Você verá 4 cards verticais: **Sorriso**, **Boa Esperança do Norte**, **Nova Ubiratã** e **Nova Mutum**.
3. Clique em **"Trocar Foto"** ou **"Adicionar Foto"** no card da unidade desejada.
4. Escolha a imagem no seu computador (recomendado formato JPG ou PNG de boa qualidade).
5. O upload será realizado imediatamente e a nova foto passará a aparecer no site principal.
6. Se quiser voltar à imagem padrão, clique em **"Remover Foto"**.

### B. Gerenciar o Banner Principal Rotativo (Topo da Home):
1. Na seção **Carrossel Banner Principal (Topo)**, arraste um arquivo de imagem para a área pontilhada ou clique para selecionar.
2. Adicione uma **Legenda** e um **Link de Redirecionamento** (opcional, como o link do WhatsApp ou da unidade).
3. Clique em **Adicionar ao Banner Rotativo**.
4. Para alterar a ordem dos slides exibidos, use as setas **Mover para Cima** e **Mover para Baixo**.
5. Ao finalizar, clique no botão azul **"Salvar Banner"** no topo da tela.

---

## 7. Configuração de Unidades e Canais de Atendimento

Cada unidade possui dados de contato, telefones, endereço e horários de atendimento exclusivos.

### Editar Dados de uma Unidade:
1. No menu lateral, acesse **Unidades**.
2. Clique na unidade desejada (ex: *Nova Mutum* ou *Boa Esperança do Norte*).
3. Selecione a aba **Configurações da Unidade**.
4. Atualize os campos necessários:
   - **Endereço Completo**.
   - **Telefone Fixo e WhatsApp** (o sistema gera automaticamente o link direto de conversa `wa.me`).
   - **Horário de Funcionamento** (ex: *Segunda a Sexta: 07:00–11:00, 13:00–17:00*).
   - **Redes Sociais** (link do Instagram e Facebook).
5. Clique em **Salvar Todas as Configurações**.

---

## 8. Gestão de Usuários do Painel Admin

Permite adicionar outros membros da equipe da clínica (médicos, recepcionistas, gestores) com login no painel administrativo.

### Como Cadastrar um Novo Operador:
1. No menu lateral, acesse **Usuários do Sistema** (`/admin/usuarios`).
2. Clique em **"Novo Usuário"**.
3. Digite o **E-mail profissional** do funcionário.
4. Escolha o perfil:
   - `Administrador`: Acesso total.
   - `Usuário Comum`: Acesso a cadastros e exames.
5. Clique em **Salvar**.
6. O usuário será criado no sistema de autenticação e já poderá realizar o login.

---

## 9. Como Orientar o Paciente na Recepção

Quando um paciente ou funcionário da empresa parceira perguntar como obter o laudo ou ASO:

1. **Entregue o papel ou anote**:
   - **Site para acesso**: `aptusclin.com.br`
   - **Usuário de Login**: *(ex: cpf ou nome.sobrenome)*
   - **Senha**: *(ex: senha gerada no cadastro)*
2. **Instrua o passo a passo**:
   - *"Entre no site `aptusclin.com.br` e clique no botão verde no topo chamado **Resultados de Exames**."*
   - *"Digite seu usuário e senha."*
   - *"Assim que entrar, clique no botão **Baixar PDF** ao lado do exame desejado."*

---

## 10. Solução de Problemas Frequentes (FAQ Operacional)

### ❓ O paciente diz que a página exibe "Erro 403 / Link Expirado".
- **Motivo**: Para garantir a privacidade médica (LGPD), os links diretos de download expiram após 15 minutos de inatividade.
- **Solução**: Peça para o paciente fazer login novamente no portal `aptusclin.com.br/resultados` e clicar no botão "Baixar PDF" atualizado.

### ❓ O paciente esqueceu a senha de acesso aos laudos.
- **Solução**: Vá no painel admin em **Colaboradores**, localize o paciente, clique em **Editar** e depois em **Resetar Senha**. Informe a nova senha para o paciente.

### ❓ Enviei um laudo no cadastro de outro paciente por engano.
- **Solução**: Acesse **Exames / ASO**, busque pelo laudo enviado incorretamente e clique no botão de lixeira para excluir. Em seguida, refaça o lançamento selecionando o paciente correto.

### ❓ A foto da unidade não está mudando no site.
- **Solução**: Acesse `/admin/site-settings/home-banner`, localize a cidade desejada no quadro **Cidades Atendidas** e faça o envio da nova imagem. O sistema atualizará a foto imediatamente.
