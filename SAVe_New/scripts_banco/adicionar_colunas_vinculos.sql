-- Script para adicionar colunas faltantes em SAVe_Vinculos

BEGIN;

-- Adicionar colunas created_at e updated_at se não existirem
ALTER TABLE "SAVe_Vinculos" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP;
ALTER TABLE "SAVe_Vinculos" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP;

-- Verificar se as colunas foram adicionadas
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'SAVe_Vinculos'
AND column_name IN ('created_at', 'updated_at')
ORDER BY column_name;

COMMIT;

SELECT '✅ Colunas adicionadas em SAVe_Vinculos!' as resultado;
