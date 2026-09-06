-- ============================================================
-- Aptusclin: Segurança do Storage de Exames (laudos/PDFs)
-- Execução: Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- ============================================================

-- 1. Garante que o bucket 'exames' existe e está PRIVADO
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'exames',
  'exames',
  false,              -- PRIVADO: não acessível por URL pública
  52428800,           -- 50 MB por arquivo
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
  SET public = false,
      file_size_limit = 52428800;

-- 2. Remove políticas públicas existentes (se houver)
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
DROP POLICY IF EXISTS "Public exames read" ON storage.objects;

-- 3. Política: apenas usuários autenticados (admin) podem fazer upload
CREATE POLICY "Admins podem fazer upload de laudos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'exames'
    AND (
      (auth.jwt() ->> 'role') = 'admin'
      OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    )
  );

-- 4. Política: apenas usuários autenticados (admin) podem atualizar
CREATE POLICY "Admins podem atualizar laudos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'exames'
    AND (
      (auth.jwt() ->> 'role') = 'admin'
      OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    )
  );

-- 5. Política: apenas usuários autenticados (admin) podem excluir
CREATE POLICY "Admins podem excluir laudos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'exames'
    AND (
      (auth.jwt() ->> 'role') = 'admin'
      OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    )
  );

-- 6. Política: leitura direta via SELECT proibida publicamente
--    (O acesso será feito exclusivamente por URLs assinadas temporárias geradas pelo servidor)
--    Nenhuma política de SELECT é necessária — o acesso via service role key do servidor é irrestrito.

-- 7. Habilita RLS na tabela de objetos (se ainda não estiver ativa)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
