-- Rename all tables to lowercase without quotes
-- This fixes the Prisma case-sensitivity issue

ALTER TABLE IF EXISTS "SAVe_Geral" RENAME TO save_geral;
ALTER TABLE IF EXISTS "SAVe_DadosDeEntrada" RENAME TO save_dadosdeentrada;
ALTER TABLE IF EXISTS "SAVe_Situacao_Juridica_Incluir_processo" RENAME TO save_situacao_juridica_incluir_processo;
ALTER TABLE IF EXISTS "SAVe_Identificacao" RENAME TO save_identificacao;
ALTER TABLE IF EXISTS "SAVe_Identificacao_email" RENAME TO save_identificacao_email;
ALTER TABLE IF EXISTS "SAVe_Identificacao_telefone" RENAME TO save_identificacao_telefone;
ALTER TABLE IF EXISTS "SAVe_Identificacao_endereco" RENAME TO save_identificacao_endereco;
ALTER TABLE IF EXISTS "SAVe_protecao_seguranca_ameacadores" RENAME TO save_protecao_seguranca_ameacadores;
ALTER TABLE IF EXISTS "SAVe_protecao_seguranca_adolescente" RENAME TO save_protecao_seguranca_adolescente;
ALTER TABLE IF EXISTS "SAVe_protecao_seguranca" RENAME TO save_protecao_seguranca;
ALTER TABLE IF EXISTS "SAVe_Encerramento" RENAME TO save_encerramento;
ALTER TABLE IF EXISTS "SAVe_Vitimizacao" RENAME TO save_vitimizacao;
ALTER TABLE IF EXISTS "SAVe_Perfil_Agressor_Endereco" RENAME TO save_perfil_agressor_endereco;
ALTER TABLE IF EXISTS "SAVe_Perfil_Agressor" RENAME TO save_perfil_agressor;
ALTER TABLE IF EXISTS "SAVe_Vinculos" RENAME TO save_vinculos;
ALTER TABLE IF EXISTS "SAVe_Situacao_Juridica" RENAME TO save_situacao_juridica;
ALTER TABLE IF EXISTS "SAVe_Situacao_Juridica2" RENAME TO save_situacao_juridica2;
ALTER TABLE IF EXISTS "SAVe_Saude" RENAME TO save_saude;
ALTER TABLE IF EXISTS "SAVe_Sintese_Analitica" RENAME TO save_sintese_analitica;
ALTER TABLE IF EXISTS "SAVe_Habitacao_territorio" RENAME TO save_habitacao_territorio;
ALTER TABLE IF EXISTS "SAVe_Assistencia" RENAME TO save_assistencia;
ALTER TABLE IF EXISTS "SAVe_Ensino-trab-renda" RENAME TO save_ensino_trab_renda;
ALTER TABLE IF EXISTS "SAVe_Vinculos_Apoio" RENAME TO save_vinculos_apoio;
ALTER TABLE IF EXISTS "SAVe_Casos_Vinculados" RENAME TO save_casos_vinculados;
ALTER TABLE IF EXISTS "SAVe_Responsaveis" RENAME TO save_responsaveis;
ALTER TABLE IF EXISTS "SAVe_Acompanhamentos" RENAME TO save_acompanhamentos;
ALTER TABLE IF EXISTS "SAVe_Usuarios" RENAME TO save_usuarios;
ALTER TABLE IF EXISTS "SAVe_Logs_Acesso" RENAME TO save_logs_acesso;

SELECT 'All tables renamed to lowercase!' as status;
