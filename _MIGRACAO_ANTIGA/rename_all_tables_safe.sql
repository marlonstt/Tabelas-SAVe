-- rename_all_tables_safe.sql
-- Executa renomeações de forma segura, ignorando tabelas que já foram renomeadas ou não existam.

DO $$ BEGIN
    EXECUTE 'ALTER TABLE "SAVe_Geral" RENAME TO save_geral';
EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN EXECUTE 'ALTER TABLE "SAVe_DadosDeEntrada" RENAME TO save_dadosdeentrada'; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN EXECUTE 'ALTER TABLE "SAVe_Situacao_Juridica_Incluir_processo" RENAME TO save_situacao_juridica_incluir_processo'; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN EXECUTE 'ALTER TABLE "SAVe_Identificacao" RENAME TO save_identificacao'; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN EXECUTE 'ALTER TABLE "SAVe_Identificacao_email" RENAME TO save_identificacao_email'; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN EXECUTE 'ALTER TABLE "SAVe_Identificacao_telefone" RENAME TO save_identificacao_telefone'; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN EXECUTE 'ALTER TABLE "SAVe_Identificacao_endereco" RENAME TO save_identificacao_endereco'; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN EXECUTE 'ALTER TABLE "SAVe_protecao_seguranca_ameacadores" RENAME TO save_protecao_seguranca_ameacadores'; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN EXECUTE 'ALTER TABLE "SAVe_protecao_seguranca_adolescente" RENAME TO save_protecao_seguranca_adolescente'; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN EXECUTE 'ALTER TABLE "SAVe_protecao_seguranca" RENAME TO save_protecao_seguranca'; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN EXECUTE 'ALTER TABLE "SAVe_Encerramento" RENAME TO save_encerramento'; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN EXECUTE 'ALTER TABLE "SAVe_Vitimizacao" RENAME TO save_vitimizacao'; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN EXECUTE 'ALTER TABLE "SAVe_Situacao_Juridica" RENAME TO save_situacao_juridica'; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN EXECUTE 'ALTER TABLE "SAVe_Situacao_Juridica2" RENAME TO save_situacao_juridica2'; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN EXECUTE 'ALTER TABLE "SAVe_Saude" RENAME TO save_saude'; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN EXECUTE 'ALTER TABLE "SAVe_Sintese_Analitica" RENAME TO save_sintese_analitica'; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN EXECUTE 'ALTER TABLE "SAVe_Habitacao_territorio" RENAME TO save_habitacao_territorio'; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN EXECUTE 'ALTER TABLE "SAVe_Assistencia" RENAME TO save_assistencia'; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN EXECUTE 'ALTER TABLE "SAVe_Ensino-trab-renda" RENAME TO save_ensino_trab_renda'; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN EXECUTE 'ALTER TABLE "SAVe_Vinculos_Apoio" RENAME TO save_vinculos_apoio'; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN EXECUTE 'ALTER TABLE "SAVe_Casos_Vinculados" RENAME TO save_casos_vinculados'; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN EXECUTE 'ALTER TABLE "SAVe_Responsaveis" RENAME TO save_responsaveis'; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN EXECUTE 'ALTER TABLE "SAVe_Acompanhamentos" RENAME TO save_acompanhamentos'; EXCEPTION WHEN undefined_table THEN NULL; END $$;
-- Adicione mais blocos caso existam outras tabelas.
