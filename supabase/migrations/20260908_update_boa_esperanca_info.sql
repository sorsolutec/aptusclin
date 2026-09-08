-- Atualiza informações de contato e endereço da unidade Boa Esperança do Norte
UPDATE public.unidades
SET
  nome = 'Unidade de Boa Esperança do Norte',
  endereco = 'Rua das Azaleias, 1627, Centro',
  telefone = '(66) 99268-0888',
  whatsapp = '5566992680888',
  updated_at = now()
WHERE id = 'boa-esperanca';
