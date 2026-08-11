import { describe, expect, it } from 'vitest';
import { validateContactLead } from './contact';

describe('validateContactLead', () => {
  it('accepts a complete and valid request', () => {
    const result = validateContactLead({
      nome: 'Maria Santos',
      empresa: 'Aptusclin',
      email: 'maria@aptusclin.com.br',
      telefone: '(66) 99999-9999',
      tipo: 'agendamento',
      mensagem: 'Gostaria de agendar uma visita para nossa empresa.',
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('rejects invalid contact data', () => {
    const result = validateContactLead({
      nome: '  ',
      empresa: '',
      email: 'email-invalido',
      telefone: '',
      tipo: 'agendamento',
      mensagem: 'Oi',
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toMatchObject({
      nome: 'Informe seu nome completo.',
      empresa: 'Informe o nome da empresa.',
      email: 'Informe um e-mail válido.',
      mensagem: 'Descreva sua necessidade com pelo menos 10 caracteres.',
    });
  });
});
