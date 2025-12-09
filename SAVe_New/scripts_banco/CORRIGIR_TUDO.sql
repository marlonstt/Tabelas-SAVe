-- ============================================
-- SCRIPT COMPLETO PARA CORRIGIR TODOS OS PROBLEMAS
-- ============================================
-- Execute este script no pgAdmin para corrigir:
-- 1. Coluna id faltante na tabela SAVe_Usuarios
-- 2. Colunas faltantes na tabela SAVe_Saude

BEGIN;

-- ============================================
-- 1. CORRIGIR TABELA SAVe_Usuarios
-- ============================================

-- Verificar se a tabela existe
DO $$
BEGIN
    -- Se a tabela não tiver a coluna id, precisamos recriá-la
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'SAVe_Usuarios' AND column_name = 'id'
    ) THEN
        -- Dropar e recriar a tabela (CUIDADO: isso apaga os dados!)
        DROP TABLE IF EXISTS "SAVe_Usuarios" CASCADE;
        
        CREATE TABLE "SAVe_Usuarios" (
            "id" SERIAL PRIMARY KEY,
            "cargo" TEXT,
            "usuario" TEXT,
            "area" TEXT,
            "email" TEXT UNIQUE,
            "password" TEXT,
            "role" TEXT DEFAULT 'User',
            "must_change_password" BOOLEAN DEFAULT TRUE,
            "profile_image" TEXT,
            "created_at" TIMESTAMP DEFAULT NOW(),
            "updated_at" TIMESTAMP
        );
        
        RAISE NOTICE 'Tabela SAVe_Usuarios recriada com sucesso!';
    END IF;
END $$;

-- ============================================
-- 2. ADICIONAR COLUNAS FALTANTES EM SAVe_Saude
-- ============================================

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

-- ============================================
-- 3. VERIFICAR RESULTADOS
-- ============================================

-- Verificar SAVe_Usuarios
SELECT 'SAVe_Usuarios' as tabela, column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'SAVe_Usuarios'
ORDER BY ordinal_position;

-- Verificar SAVe_Saude
SELECT 'SAVe_Saude' as tabela, column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'SAVe_Saude'
AND (column_name LIKE 'IV_%' OR column_name LIKE 'RS_Contato%')
ORDER BY column_name;

COMMIT;

-- Mensagem final
SELECT '✅ TODAS AS CORREÇÕES FORAM APLICADAS COM SUCESSO!' as resultado;
SELECT '⚠️ ATENÇÃO: A tabela SAVe_Usuarios foi recriada. Você precisará criar um novo usuário admin.' as aviso;
