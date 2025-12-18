-- Script para verificar tabelas duplicadas antes de remover

-- 1. Listar todas as tabelas
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- 2. Verificar se as tabelas minúsculas têm dados
SELECT 'save_habitacao_territorio' as tabela, COUNT(*) as registros FROM save_habitacao_territorio
UNION ALL
SELECT 'save_ensino_trab_renda', COUNT(*) FROM save_ensino_trab_renda
UNION ALL
SELECT 'save_usuarios', COUNT(*) FROM save_usuarios
UNION ALL
SELECT 'save_acompanhamentos', COUNT(*) FROM save_acompanhamentos;

-- 3. Comparar com as tabelas com aspas
SELECT '"SAVe_Habitacao_territorio"' as tabela, COUNT(*) as registros FROM "SAVe_Habitacao_territorio"
UNION ALL
SELECT '"save_ensino_trab_renda"', COUNT(*) FROM "save_ensino_trab_renda"
UNION ALL
SELECT '"save_usuarios"', COUNT(*) FROM "save_usuarios"
UNION ALL
SELECT '"SAVe_Acompanhamentos"', COUNT(*) FROM "SAVe_Acompanhamentos";
