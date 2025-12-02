-- Script DIRETO para adicionar a coluna id na tabela SAVe_Usuarios

BEGIN;

-- Adicionar a coluna id se não existir
ALTER TABLE "SAVe_Usuarios" ADD COLUMN IF NOT EXISTS "id" SERIAL PRIMARY KEY;

-- Verificar se a coluna foi adicionada
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'SAVe_Usuarios'
AND column_name = 'id';

COMMIT;

SELECT 'Coluna id adicionada com sucesso!' as resultado;
