export interface ContactLeadInput {
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  tipo: string;
  mensagem: string;
}

export interface ContactLeadValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactLeadInput, string>>;
}

export function validateContactLead(input: ContactLeadInput): ContactLeadValidationResult {
  const errors: Partial<Record<keyof ContactLeadInput, string>> = {};

  if (!input.nome?.trim()) {
    errors.nome = 'Informe seu nome completo.';
  }

  if (!input.empresa?.trim()) {
    errors.empresa = 'Informe o nome da empresa.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email?.trim() || '')) {
    errors.email = 'Informe um e-mail válido.';
  }

  if (!input.telefone?.trim()) {
    errors.telefone = 'Informe um telefone para contato.';
  }

  if (!input.mensagem?.trim() || input.mensagem.trim().length < 10) {
    errors.mensagem = 'Descreva sua necessidade com pelo menos 10 caracteres.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
