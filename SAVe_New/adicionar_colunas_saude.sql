-- Script completo para adicionar TODAS as colunas faltantes na tabela SAVe_Saude
-- Execute este script no pgAdmin

BEGIN;

-- Adicionar todas as colunas faltantes
ALTER TABLE "SAVe_Saude" ADD COLUMN IF NOT EXISTS "RS_Contato_telefone" TEXT;
ALTER TABLE "SAVe_Saude" ADD COLUMN IF NOT EXISTS "RS_Contato_email" TEXT;
ALTER TABLE "SAVe_Saude" ADD COLUMN IF NOT EXISTS "IV_Houve_Impacto_Saude" TEXT;
ALTER TABLE "SAVe_Saude" ADD COLUMN IF NOT EXISTS "IV_Lesoes_Nao_Fatais" BOOLEAN;
ALTER TABLE "SAVe_Saude" ADD COLUMN IF NOT EXISTS "IV_Defic_vitimizacao" TEXT;
ALTER TABLE "SAVe_Saude" ADD COLUMN IF NOT EXISTS "IV_Defic_vitimizacao_tipo" TEXT;
ALTER TABLE "SAVe_Saude" ADD COLUMN IF NOT EXISTS "IV_Problemas_De_Saude" BOOLEAN;
ALTER TABLE "SAVe_Saude" ADD COLUMN IF NOT EXISTS "IV_Comp_Cogn_Comport" BOOLEAN;
ALTER TABLE "SAVe_Saude" ADD COLUMN IF NOT EXISTS "IV_Comp_Cogn_Comport_tipo" TEXT;
ALTER TABLE "SAVe_Saude" ADD COLUMN IF NOT EXISTS "IV_Outro" BOOLEAN;
ALTER TABLE "SAVe_Saude" ADD COLUMN IF NOT EXISTS "IV_Outro_espec" TEXT;
ALTER TABLE "SAVe_Saude" ADD COLUMN IF NOT EXISTS "IV_Impacto_Saude_Mental_tipos" TEXT;
ALTER TABLE "SAVe_Saude" ADD COLUMN IF NOT EXISTS "IV_ISTOutros_esp" TEXT;

-- Verificar se as colunas foram adicionadas
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'SAVe_Saude' 
AND column_name LIKE 'IV_%' OR column_name LIKE 'RS_Contato%'
ORDER BY column_name;

COMMIT;

SELECT 'Todas as colunas foram adicionadas com sucesso!' as resultado;
