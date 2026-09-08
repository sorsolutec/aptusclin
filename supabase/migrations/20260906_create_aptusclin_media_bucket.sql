-- ============================================================
-- Aptusclin: Bucket público para fotos de unidades e slides
-- Execução: Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- ============================================================

-- 1. Cria o bucket 'aptusclin-media' como PÚBLICO (fotos e slides das unidades)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'aptusclin-media',
  'aptusclin-media',
  true,               -- PÚBLICO: as imagens são acessíveis via URL pública
  10485760,           -- 10 MB por arquivo
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
  SET public = true,
      file_size_limit = 10485760;

-- 2. Remove políticas existentes para evitar conflitos
DROP POLICY IF EXISTS "Leitura pública aptusclin-media" ON storage.objects;
DROP POLICY IF EXISTS "Admins upload aptusclin-media" ON storage.objects;
DROP POLICY IF EXISTS "Admins update aptusclin-media" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete aptusclin-media" ON storage.objects;

-- 3. Leitura pública (qualquer um pode ver as fotos)
CREATE POLICY "Leitura pública aptusclin-media"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'aptusclin-media');

-- 4. Upload permitido apenas por admins (via service_role no servidor)
--    O service_role bypassa RLS, mas adicionamos política autenticada como fallback
CREATE POLICY "Admins upload aptusclin-media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'aptusclin-media'
    AND (
      (auth.jwt() ->> 'role') = 'admin'
      OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    )
  );

-- 5. Update permitido apenas por admins
CREATE POLICY "Admins update aptusclin-media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'aptusclin-media'
    AND (
      (auth.jwt() ->> 'role') = 'admin'
      OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    )
  );

-- 6. Delete permitido apenas por admins
CREATE POLICY "Admins delete aptusclin-media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'aptusclin-media'
    AND (
      (auth.jwt() ->> 'role') = 'admin'
      OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    )
  );

-- 7. Tabela de configurações globais do site (para banner da home, etc.)
CREATE TABLE IF NOT EXISTS site_settings (
  key   TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insere configuração inicial do banner da home (vazio por padrão)
INSERT INTO site_settings (key, value)
VALUES ('home_banner', '{"slides": []}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- RLS na tabela de configurações
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Leitura pública
DROP POLICY IF EXISTS "Leitura pública site_settings" ON site_settings;
CREATE POLICY "Leitura pública site_settings"
  ON site_settings FOR SELECT
  TO public
  USING (true);

-- Escrita apenas por admins (via service_role no servidor)
DROP POLICY IF EXISTS "Admins escrevem site_settings" ON site_settings;
CREATE POLICY "Admins escrevem site_settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'role') = 'admin'
    OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );
