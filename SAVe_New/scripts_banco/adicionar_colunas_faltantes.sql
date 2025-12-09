-- Script para adicionar colunas faltantes nas tabelas existentes
-- Execute este script em vez do tables.sql completo

BEGIN;

-- Adicionar colunas faltantes na tabela SAVe_Saude
ALTER TABLE "SAVe_Saude" ADD COLUMN IF NOT EXISTS "RS_Contato_telefone" TEXT;
ALTER TABLE "SAVe_Saude" ADD COLUMN IF NOT EXISTS "RS_Contato_email" TEXT;

-- Verificar se a coluna foi adicionada
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'SAVe_Saude' 
AND column_name IN ('RS_Contato_telefone', 'RS_Contato_email')
ORDER BY column_name;

COMMIT;

-- Mensagem de sucesso
SELECT 'Colunas adicionadas com sucesso!' as resultado;
