-- ============================================
-- PASSO 3: REMOVER TABELAS DUPLICADAS
-- ============================================
-- Execute este script SOMENTE DEPOIS de:
-- 1. Executar 1_renomear_tabelas.sql
-- 2. Executar 2_verificar_duplicadas.sql
-- 3. Confirmar que as tabelas minúsculas estão vazias ou duplicadas

-- ATENÇÃO: Este script remove tabelas permanentemente!
-- Faça backup antes de executar!

BEGIN;

-- Remover tabelas minúsculas duplicadas (se existirem)
DROP TABLE IF EXISTS save_habitacao_territorio CASCADE;
DROP TABLE IF EXISTS save_acompanhamentos CASCADE;
DROP TABLE IF EXISTS save_agressor CASCADE;
DROP TABLE IF EXISTS save_assistencia CASCADE;
DROP TABLE IF EXISTS save_casos_vinculados CASCADE;
DROP TABLE IF EXISTS save_dadosdeentrada CASCADE;
DROP TABLE IF EXISTS save_encerramento CASCADE;
DROP TABLE IF EXISTS save_geral CASCADE;
DROP TABLE IF EXISTS save_identificacao CASCADE;
DROP TABLE IF EXISTS save_identificacao_email CASCADE;
DROP TABLE IF EXISTS save_identificacao_endereco CASCADE;
DROP TABLE IF EXISTS save_identificacao_telefone CASCADE;
DROP TABLE IF EXISTS save_protecao_seguranca CASCADE;
DROP TABLE IF EXISTS save_protecao_seguranca_ameacadores CASCADE;
DROP TABLE IF EXISTS save_protecao_seguranca_adolescente CASCADE;
DROP TABLE IF EXISTS save_saude CASCADE;
DROP TABLE IF EXISTS save_sinteseanalitica CASCADE;
DROP TABLE IF EXISTS save_situacao_juridica CASCADE;
DROP TABLE IF EXISTS save_situacao_juridica2 CASCADE;
DROP TABLE IF EXISTS save_situacao_juridica_incluir_processo CASCADE;
DROP TABLE IF EXISTS save_vinculos CASCADE;
DROP TABLE IF EXISTS save_vinculos_apoio CASCADE;
DROP TABLE IF EXISTS save_vitimizacao CASCADE;

-- Verificar tabelas restantes (devem ser apenas as com padrão SAVe_)
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Se tudo estiver correto, confirme a transação
COMMIT;

-- Se algo estiver errado, execute: ROLLBACK;
