# Manual de Operação - Aptusclin

Bem-vindo ao **Manual de Operação** do sistema Aptusclin. Este guia foi criado para auxiliar os funcionários e administradores nas rotinas diárias da clínica, desde o cadastro de empresas até a liberação de exames para os pacientes.

---

## 1. Visão Geral do Sistema

O sistema é dividido em três áreas principais:
1. **Site Institucional:** Onde os clientes encontram as unidades e serviços (`/`).
2. **Portal de Resultados:** Onde o colaborador (paciente) acessa com seu login e senha para baixar o laudo em PDF (`/resultados`).
3. **Painel Administrativo:** Onde você (funcionário da clínica) fará os cadastros e uploads (`/admin`).

---

## 2. Como Cadastrar uma Empresa Parceira

A clínica Aptusclin atende empresas que enviam seus colaboradores para fazer exames (ASO). Antes de cadastrar um paciente, a empresa dele deve existir no sistema.

1. No menu esquerdo, clique em **Empresas**.
2. Clique no botão azul **"Nova Empresa"**.
3. Preencha os dados: Razão Social, CNPJ (opcional), Endereço e Contato.
4. Clique em **Salvar**. A empresa agora aparecerá na lista e poderá ser vinculada a colaboradores.

---

## 3. Como Cadastrar um Colaborador (Paciente)

Para que um paciente possa acessar o resultado na internet, ele precisa ter um cadastro vinculado a uma empresa parceira.

1. No menu esquerdo, vá em **Colaboradores**.
2. Clique em **"Novo Colaborador"**.
3. Preencha o **Nome Completo** do funcionário, selecione a **Empresa** dele e a Unidade de Atendimento (ex: Nova Mutum).
4. O sistema vai gerar automaticamente um **Usuário** (ex: joao.silva) e uma **Senha**.
5. **Importante:** Anote ou entregue esse Usuário e Senha para o paciente na recepção, pois é com esses dados que ele fará o login em casa!
6. Clique em **Salvar**.

---

## 4. Como Lançar (Fazer Upload) de Exames e ASO

Após o exame estar pronto, você precisará subir o PDF no sistema para que o paciente o baixe.

1. Vá no menu esquerdo em **Lançar Exames / ASO**.
2. Clique em **"Novo Lançamento"**.
3. Selecione o **Colaborador** (digite o nome para buscar).
4. Escolha o tipo de documento (Ex: `ASO` ou `Exame Laboratorial`).
5. Dê um título (Ex: "Audiometria 2026").
6. Escolha se o status é Apto ou Inapto.
7. Em **"Arquivo do Exame (PDF/Imagem)"**, clique para buscar o arquivo PDF salvo no seu computador.
8. Clique em **Salvar Lançamento**. Pronto! O PDF já estará disponível para o paciente baixar.

---

## 5. Como o Paciente Acessa o Resultado? (Para Orientar na Recepção)

Quando o paciente perguntar como pega o resultado, oriente da seguinte forma:
1. "Acesse o site **aptusclin.com.br**"
2. "Clique no botão **Resultados / Portal** no menu superior."
3. "Digite o **Usuário** e a **Senha** que estou lhe entregando neste papel."
4. "Na tela principal, clique no botão azul com a setinha ao lado do nome do exame para baixar o seu laudo em PDF."

---

## 6. Solução de Problemas Comuns (FAQ)

**P: O paciente esqueceu a senha, o que eu faço?**
**R:** Vá no painel admin > Colaboradores > Ache o paciente e clique em "Editar". Lá haverá um botão ou opção para "Resetar Senha". O sistema irá gerar e mostrar uma nova senha aleatória. Entregue a nova senha ao paciente.

**P: Fiz o upload do exame no paciente errado! Como corrigir?**
**R:** Vá em **Lançar Exames / ASO**, encontre o exame na lista e clique no ícone vermelho de lixeira para excluir. Em seguida, lance o exame novamente no colaborador correto.

**P: O paciente diz que a página diz "Erro 403" ou "Acesso Negado".**
**R:** Isso acontece se o paciente tentar clicar em um link de laudo antigo (que já expirou após 15 minutos) ou tentar burlar o sistema. Peça para ele fazer login novamente no portal e clicar no botão "Baixar" de novo para gerar um link novo e válido.

**P: Posso ver o exame que eu subi para confirmar se ficou certo?**
**R:** Sim. Se você (Admin) for na lista de Exames e clicar no nome do arquivo, você conseguirá baixá-lo ou visualizá-lo para testar.

**P: Um funcionário foi demitido ou não é mais cliente. Como bloquear?**
**R:** Vá em **Colaboradores**, clique em "Editar" no perfil da pessoa, desmarque a caixinha **"Ativo"** e salve. O login dela parará de funcionar imediatamente.
