-- Script para remover tabelas duplicadas (minúsculas)
-- ATENÇÃO: Execute o script verificar_tabelas_duplicadas.sql ANTES de executar este!
-- Certifique-se de que as tabelas minúsculas estão vazias ou têm dados duplicados

-- Remover tabelas minúsculas que foram criadas por engano
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

-- Verificar se restaram apenas as tabelas corretas
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
