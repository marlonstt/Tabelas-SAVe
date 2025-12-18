-- ============================================
-- PASSO 2: VERIFICAR TABELAS DUPLICADAS
-- ============================================
-- Execute este script para verificar quais tabelas duplicadas existem
-- e quantos registros cada uma tem

-- Listar TODAS as tabelas do banco
SELECT tablename, 
       CASE 
           WHEN tablename ~ '^[a-z_]+$' THEN 'minúscula (remover)'
           WHEN tablename ~ '^"?SAVe_' THEN 'padrão SAVe_ (manter)'
           ELSE 'outro'
       END as tipo
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tipo, tablename;

-- Verificar se existem tabelas minúsculas duplicadas
-- (estas devem ser removidas)
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename ~ '^[a-z_]+$'
AND tablename NOT IN ('save_usuarios', 'save_ensino_trab_renda')
ORDER BY tablename;
