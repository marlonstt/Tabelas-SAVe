-- Script para corrigir a tabela SAVe_Usuarios

BEGIN;

-- Verificar se a coluna "id" existe
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'SAVe_Usuarios' 
AND column_name = 'id';

-- Se a tabela não existir, criar
CREATE TABLE IF NOT EXISTS "SAVe_Usuarios" (
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

-- Verificar a estrutura da tabela
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'SAVe_Usuarios'
ORDER BY ordinal_position;

COMMIT;

SELECT 'Tabela SAVe_Usuarios verificada/criada com sucesso!' as resultado;
