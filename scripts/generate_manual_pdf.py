import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#64748b"))
        
        # Oculta cabeçalho/rodape na capa (página 1)
        if self._pageNumber > 1:
            # Cabeçalho
            self.drawString(54, 750, "Aptusclin — Manual Operacional Oficial da Plataforma")
            self.setStrokeColor(colors.HexColor("#e2e8f0"))
            self.setLineWidth(0.5)
            self.line(54, 742, 558, 742)
            
            # Rodapé
            page_text = f"Página {self._pageNumber} de {page_count}"
            self.drawRightString(558, 36, page_text)
            self.drawString(54, 36, "© Aptusclin Medicina Ocupacional & Saúde do Trabalhador")
            self.line(54, 48, 558, 48)
            
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Cores oficiais da marca Aptusclin
    NAVY = colors.HexColor("#002855")
    GREEN = colors.HexColor("#1B8B3A")
    DARK = colors.HexColor("#1e293b")
    SLATE = colors.HexColor("#64748b")
    LIGHT_BG = colors.HexColor("#f8fafc")
    BORDER_COLOR = colors.HexColor("#e2e8f0")

    # Custom styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=32,
        textColor=NAVY,
        alignment=0,
        spaceAfter=10
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=14,
        leading=18,
        textColor=GREEN,
        alignment=0,
        spaceAfter=20
    )

    h1_style = ParagraphStyle(
        'Heading1Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=NAVY,
        spaceBefore=18,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=GREEN,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=DARK,
        spaceAfter=8
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=DARK,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor("#0f5132")
    )

    story = []

    # ── CAPA DO MANUAL ────────────────────────────────────────────────────────
    story.append(Spacer(1, 40))
    story.append(Paragraph("Aptus<b>clin</b>", ParagraphStyle('LogoStyle', fontName='Helvetica-Bold', fontSize=28, textColor=NAVY)))
    story.append(Paragraph("MEDICINA DO TRABALHO & SAÚDE OCUPACIONAL", ParagraphStyle('SubLogoStyle', fontName='Helvetica-Bold', fontSize=9, textColor=GREEN, spaceAfter=30)))
    
    story.append(HRFlowable(width="100%", thickness=4, color=GREEN, spaceAfter=25, spaceBefore=0))
    
    story.append(Paragraph("Manual Operacional Completo da Plataforma", title_style))
    story.append(Paragraph("Guia Prático e Detalhado de Operação do Sistema Aptusclin", subtitle_style))
    
    story.append(Spacer(1, 15))

    meta_data = [
        [Paragraph("<b>Documento:</b> Manual de Operação do Sistema", body_style), Paragraph("<b>Versão:</b> 2.0 (Atualizado 2026)", body_style)],
        [Paragraph("<b>Destinado a:</b> Administradores, Médicos e Recepção", body_style), Paragraph("<b>Status:</b> Oficial / Homologado", body_style)],
        [Paragraph("<b>Plataforma:</b> aptusclin.com.br", body_style), Paragraph("<b>Ambiente:</b> Produção & Painel Admin", body_style)]
    ]
    t_meta = Table(meta_data, colWidths=[250, 250])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('PADDING', (0,0), (-1,-1), 10),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_meta)
    
    story.append(Spacer(1, 25))

    # ── 1. VISÃO GERAL ────────────────────────────────────────────────────────
    story.append(Paragraph("1. Visão Geral da Plataforma", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceAfter=8, spaceBefore=0))
    story.append(Paragraph("O sistema da Aptusclin é composto por 3 ecossistemas integrados:", body_style))
    
    story.append(Paragraph("• <b>Site Institucional Público (aptusclin.com.br):</b> Apresentação de serviços, seletor de unidades (Sorriso, Boa Esperança do Norte, Nova Ubiratã, Nova Mutum), formulário de contato e carrossel de mídias.", bullet_style))
    story.append(Paragraph("• <b>Portal de Resultados dos Pacientes (/resultados):</b> Espaço seguro onde os trabalhadores fazem login para visualizar e baixar laudos laboratoriais, audiometrias e o ASO em PDF.", bullet_style))
    story.append(Paragraph("• <b>Painel Administrativo (/admin):</b> Área restrita para cadastro de empresas, colaboradores, upload de laudos e gestão visual das unidades.", bullet_style))

    # ── 2. ACESSO AO PAINEL ADMIN ─────────────────────────────────────────────
    story.append(Paragraph("2. Acesso ao Painel Administrativo", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceAfter=8, spaceBefore=0))
    story.append(Paragraph("1. Acesse o endereço <u>https://www.aptusclin.com.br/login</u>.", bullet_style))
    story.append(Paragraph("2. Digite seu <b>E-mail cadastrado</b> e a sua <b>Senha de acesso</b>.", bullet_style))
    story.append(Paragraph("3. Clique em <b>'Entrar no Painel'</b>.", bullet_style))
    story.append(Paragraph("<b>Perfis de Acesso:</b> Administradores possuem acesso total a cadastros e configurações visuais. Usuários comuns/operadores possuem acesso a cadastros de pacientes e upload de exames.", body_style))

    # ── 3. GESTÃO DE EMPRESAS PARCEIRAS ───────────────────────────────────────
    story.append(Paragraph("3. Gestão de Empresas Parceiras", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceAfter=8, spaceBefore=0))
    story.append(Paragraph("Antes de associar exames a um trabalhador, a empresa contratante deve estar cadastrada:", body_style))
    story.append(Paragraph("1. No menu lateral do Painel Admin, acesse <b>Empresas</b>.", bullet_style))
    story.append(Paragraph("2. Clique no botão azul <b>'Nova Empresa'</b>.", bullet_style))
    story.append(Paragraph("3. Preencha a <b>Razão Social</b>, <b>CNPJ</b>, telefone e endereço.", bullet_style))
    story.append(Paragraph("4. Clique em <b>Salvar Empresa</b>.", bullet_style))

    # ── 4. GESTÃO DE COLABORADORES ─────────────────────────────────────────────
    story.append(Paragraph("4. Gestão de Colaboradores (Pacientes)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceAfter=8, spaceBefore=0))
    story.append(Paragraph("1. Acesse o menu <b>Colaboradores</b> e clique em <b>'Novo Colaborador'</b>.", bullet_style))
    story.append(Paragraph("2. Preencha Nome Completo, CPF, Empresa Contratante e Unidade de Atendimento.", bullet_style))
    story.append(Paragraph("3. O sistema gerará automaticamente um <b>Usuário</b> e uma <b>Senha Temporária</b>.", bullet_style))
    story.append(Paragraph("4. <b>Importante:</b> Entregue o usuário e senha gerados ao paciente para que ele faça o login em casa.", bullet_style))

    # ── 5. LANÇAMENTO DE EXAMES E ASO ──────────────────────────────────────────
    story.append(Paragraph("5. Lançamento de Exames e Emissão de ASO em PDF", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceAfter=8, spaceBefore=0))
    story.append(Paragraph("1. No menu lateral, acesse <b>Exames / ASO</b>.", bullet_style))
    story.append(Paragraph("2. Clique em <b>'Novo Lançamento'</b> e busque o nome do colaborador.", bullet_style))
    story.append(Paragraph("3. Selecione o tipo de exame (<i>ASO Admissional, Periódico, Audiometria, Laboratorial</i>).", bullet_style))
    story.append(Paragraph("4. Defina a aptidão (<b>Apto</b> ou <b>Inapto</b>) e selecione o arquivo PDF no computador.", bullet_style))
    story.append(Paragraph("5. Clique em <b>Salvar e Publicar</b>. O laudo ficará disponível imediatamente para download no portal.", bullet_style))

    # Callout Box sobre segurança
    callout_data = [[
        Paragraph("<b>Nota de Segurança (LGPD):</b> Por motivos de privacidade médica, os links diretos de download do PDF expiram após 15 minutos de inatividade. O paciente deve acessar o portal <i>aptusclin.com.br/resultados</i> para gerar um link novo.", callout_style)
    ]]
    t_callout = Table(callout_data, colWidths=[500])
    t_callout.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#d1e7dd")),
        ('PADDING', (0,0), (-1,-1), 8),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#badbcc")),
    ]))
    story.append(Spacer(1, 5))
    story.append(t_callout)
    story.append(Spacer(1, 10))

    # ── 6. GESTÃO VISUAL DE MÍDIAS ─────────────────────────────────────────────
    story.append(Paragraph("6. Gestão Visual do Site e Mídias (Fotos e Banners)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceAfter=8, spaceBefore=0))
    story.append(Paragraph("Acesse no painel o menu <b>Configurações do Site</b> ou a URL <u>/admin/site-settings/home-banner</u>.", body_style))
    
    story.append(Paragraph("<b>A. Fotos das Unidades (Seção 'Cidades Atendidas'):</b>", h2_style))
    story.append(Paragraph("• Cada unidade (Sorriso, Boa Esperança do Norte, Nova Ubiratã, Nova Mutum) possui um card dedicado.", bullet_style))
    story.append(Paragraph("• Clique em <b>'Trocar Foto'</b> para enviar uma imagem da clínica. O envio atualiza o site principal instantaneamente.", bullet_style))
    story.append(Paragraph("• Para voltar à imagem padrão de demonstração, clique em <b>'Remover Foto'</b>.", bullet_style))

    story.append(Paragraph("<b>B. Carrossel Banner Principal (Topo da Home):</b>", h2_style))
    story.append(Paragraph("• Envie arquivos de imagem (16:9 ou 4:3) para o carrossel rotativo.", bullet_style))
    story.append(Paragraph("• Defina legendas e links opcionais de redirecionamento (ex: WhatsApp ou link interno).", bullet_style))
    story.append(Paragraph("• Ajuste a ordem de exibição usando as setas e clique em <b>'Salvar Banner'</b>.", bullet_style))

    # ── 7. CONFIGURAÇÃO DE UNIDADES ────────────────────────────────────────────
    story.append(Paragraph("7. Configuração de Unidades e Canais de Atendimento", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceAfter=8, spaceBefore=0))
    story.append(Paragraph("1. No menu <b>Unidades</b>, escolha a cidade desejada.", bullet_style))
    story.append(Paragraph("2. Ajuste o **Endereço Completo**, **Telefone Fixo** e **WhatsApp** (gera o link direto `wa.me`).", bullet_style))
    story.append(Paragraph("3. Defina o **Horário de Atendimento** (ex: <i>Segunda a Sexta: 07:00–11:00, 13:00–17:00</i>).", bullet_style))
    story.append(Paragraph("4. Preencha as redes sociais (Instagram e Facebook) e clique em <b>Salvar Configurações</b>.", bullet_style))

    # ── 8. TABELA DE CONTATOS DAS UNIDADES ────────────────────────────────────
    story.append(Paragraph("8. Tabela Direta de Contatos das Unidades", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceAfter=8, spaceBefore=0))

    unidades_table_data = [
        [Paragraph("<b>Unidade</b>", body_style), Paragraph("<b>Telefone / WhatsApp Direto</b>", body_style), Paragraph("<b>E-mail Oficial</b>", body_style)],
        [Paragraph("Sorriso", body_style), Paragraph("(66) 99644-0425", body_style), Paragraph("sorriso@aptusclin.com.br", body_style)],
        [Paragraph("Nova Ubiratã", body_style), Paragraph("(66) 99619-9138", body_style), Paragraph("nova-ubirata@aptusclin.com.br", body_style)],
        [Paragraph("Boa Esperança do Norte", body_style), Paragraph("(66) 99268-0888", body_style), Paragraph("boa-esperanca@aptusclin.com.br", body_style)],
        [Paragraph("Nova Mutum", body_style), Paragraph("(65) 98443-3296", body_style), Paragraph("nova-mutum@aptusclin.com.br", body_style)],
    ]
    t_unidades = Table(unidades_table_data, colWidths=[140, 170, 190])
    t_unidades.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), NAVY),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_unidades)
    story.append(Spacer(1, 15))

    # ── 9. ORIENTAÇÕES NA RECEPÇÃO & FAQ ──────────────────────────────────────
    story.append(Paragraph("9. Solução de Dúvidas Frequentes (FAQ Operacional)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceAfter=8, spaceBefore=0))
    
    story.append(Paragraph("<b>Q: Como orientar o paciente a pegar o resultado?</b>", body_style))
    story.append(Paragraph("R: Peça para ele acessar <u>aptusclin.com.br</u>, clicar em <b>Resultados de Exames</b> e digitar o usuário e a senha fornecidos na recepção.", bullet_style))

    story.append(Paragraph("<b>Q: O paciente esqueceu a senha, o que fazer?</b>", body_style))
    story.append(Paragraph("R: Acesse <b>Colaboradores</b> no painel admin, busque o paciente, clique em <b>Editar</b> e depois em <b>Resetar Senha</b>. Entregue a nova senha ao paciente.", bullet_style))

    story.append(Paragraph("<b>Q: Lancei um laudo na pessoa errada. Como corrigir?</b>", body_style))
    story.append(Paragraph("R: Vá em <b>Exames / ASO</b>, clique no ícone de lixeira vermelha ao lado do exame para excluir e faça o lançamento novamente no colaborador correto.", bullet_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF gerado com sucesso: {filename}")

if __name__ == '__main__':
    out_dir = os.path.join(os.path.dirname(__file__), '..', 'public')
    os.makedirs(out_dir, exist_ok=True)
    target_path = os.path.join(out_dir, 'manual_operacional_aptusclin.pdf')
    build_pdf(target_path)
