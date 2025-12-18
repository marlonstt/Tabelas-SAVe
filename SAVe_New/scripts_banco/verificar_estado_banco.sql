-- Verificar todas as tabelas do banco de dados
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Verificar especificamente as tabelas que foram renomeadas
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
AND (
    tablename LIKE '%usuarios%' OR 
    tablename LIKE '%ensino%' OR
    tablename LIKE '%renda%'
)
ORDER BY tablename;

-- Verificar estrutura da tabela SAVe_Ensino_Trab_Renda
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'SAVe_Ensino_Trab_Renda'
ORDER BY ordinal_position;

-- Verificar estrutura da tabela SAVe_Usuarios
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'SAVe_Usuarios'
ORDER BY ordinal_position;

-- Verificar se existem tabelas duplicadas minúsculas
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename ~ '^[a-z_]+$'
ORDER BY tablename;
