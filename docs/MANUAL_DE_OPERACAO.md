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
- **Usuário Comum / Operador**: Pode cadastrar colaboradores, lançar laudos e consultar empresas.

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

---

## 5. Lançamento de Exames e Emissão de ASO em PDF

Esta é a etapa onde o laudo impresso/gerado pelo laboratório ou médico é publicado no sistema para o colaborador baixar em casa.

### Passo a Passo para Subir um Exame:
1. No menu lateral, clique em **Exames / ASO**.
2. Clique em **"Novo Lançamento"**.
3. **Selecione o Colaborador**: Digite o nome ou CPF para buscar o paciente.
4. **Tipo de Exame**: Escolha entre `ASO Admissional`, `ASO Periódico`, `ASO Demissional`, `Audiometria`, `Laboratorial`, etc.
5. **Resultado Clínico**: Marque `Apto` ou `Inapto`.
6. **Upload do Documento**: Selecione o arquivo **PDF** do laudo no seu computador.
7. Clique em **Salvar e Publicar**.

---

## 6. Gestão Visual do Site e Mídias (Fotos e Banners)

### Acessando a Gestão de Mídias:
Acesse no painel o menu **Configurações do Site** ou a URL [`/admin/site-settings/home-banner`](https://www.aptusclin.com.br/admin/site-settings/home-banner).

### A. Alterar Fotos das Unidades (Seção "Escolha sua Unidade / Cidades Atendidas"):
1. Na seção **Fotos dos Cards de Unidades na Página Inicial**, localize o card da unidade (Sorriso, Boa Esperança, Nova Ubiratã ou Nova Mutum).
2. Clique em **"Trocar Foto"** para enviar uma imagem da clínica.
3. Se quiser voltar à imagem padrão, clique em **"Remover Foto"**.

### B. Gerenciar o Banner Principal Rotativo (Topo da Home):
1. Arraste um arquivo de imagem para a área pontilhada.
2. Adicione legenda e link de redirecionamento (opcional).
3. Ajuste a ordem com as setas e clique em **"Salvar Banner"**.

---

## 7. Configuração de Unidades e Canais de Atendimento

1. No menu lateral, acesse **Unidades** > selecione a unidade > aba **Configurações da Unidade**.
2. Atualize **Endereço**, **Telefone Fixo**, **WhatsApp** (gera o link direto `wa.me`) e **Horário de Atendimento**.
3. Clique em **Salvar Todas as Configurações**.

---

## 8. Gestão de Usuários do Painel Admin

1. No menu lateral, acesse **Usuários do Sistema** (`/admin/usuarios`).
2. Clique em **"Novo Usuário"** e informe o e-mail profissional e o perfil (`Administrador` ou `Usuário Comum`).
3. Clique em **Salvar**.

---

## 9. Como Orientar o Paciente na Recepção

1. Entregue o usuário e senha cadastrados no sistema.
2. Instrua: *"Acesse `aptusclin.com.br`, clique no botão **Resultados de Exames** no topo, faça login e clique em Baixar PDF ao lado do seu exame."*

---

## 10. Solução de Problemas Frequentes (FAQ Operacional)

### ❓ O paciente diz que a página exibe "Erro 403 / Link Expirado".
- **Solução**: Links de download de PDF expiram em 15 minutos para proteção da LGPD. Peça para o paciente fazer login novamente em `aptusclin.com.br/resultados` e clicar em Baixar.

### ❓ O paciente esqueceu a senha de acesso aos laudos.
- **Solução**: Vá em **Colaboradores**, localize o paciente, clique em **Editar** e selecione **Resetar Senha**.

### ❓ A foto da unidade não está mudando no site.
- **Solução**: Acesse `/admin/site-settings/home-banner`, vá no quadro **Cidades Atendidas** e envie a foto desejada.
