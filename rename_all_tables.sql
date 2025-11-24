-- rename_all_tables.sql
-- Executar uma única vez após criar o banco e antes de iniciar a aplicação.

-- Usuários (já está em minúsculas)
-- ALTER TABLE "SAVe_Usuarios" RENAME TO save_usuarios;  -- já foi feito

ALTER TABLE "SAVe_Geral"                         RENAME TO save_geral;
ALTER TABLE "SAVe_DadosDeEntrada"                RENAME TO save_dadosdeentrada;
ALTER TABLE "SAVe_Situacao_Juridica_Incluir_processo" RENAME TO save_situacao_juridica_incluir_processo;
ALTER TABLE "SAVe_Identificacao"                 RENAME TO save_identificacao;
ALTER TABLE "SAVe_Identificacao_email"           RENAME TO save_identificacao_email;
ALTER TABLE "SAVe_Identificacao_telefone"        RENAME TO save_identificacao_telefone;
ALTER TABLE "SAVe_Identificacao_endereco"        RENAME TO save_identificacao_endereco;
ALTER TABLE "SAVe_protecao_seguranca_ameacadores" RENAME TO save_protecao_seguranca_ameacadores;
ALTER TABLE "SAVe_protecao_seguranca_adolescente" RENAME TO save_protecao_seguranca_adolescente;
ALTER TABLE "SAVe_protecao_seguranca"            RENAME TO save_protecao_seguranca;
ALTER TABLE "SAVe_Encerramento"                  RENAME TO save_encerramento;
ALTER TABLE "SAVe_Vitimizacao"                   RENAME TO save_vitimizacao;
ALTER TABLE "SAVe_Situacao_Juridica"             RENAME TO save_situacao_juridica;
ALTER TABLE "SAVe_Situacao_Juridica2"            RENAME TO save_situacao_juridica2;
ALTER TABLE "SAVe_Saude"                         RENAME TO save_saude;
ALTER TABLE "SAVe_Sintese_Analitica"              RENAME TO save_sintese_analitica;
ALTER TABLE "SAVe_Habitacao_territorio"          RENAME TO save_habitacao_territorio;
ALTER TABLE "SAVe_Assistencia"                   RENAME TO save_assistencia;
ALTER TABLE "SAVe_Ensino-trab-renda"             RENAME TO save_ensino_trab_renda;
ALTER TABLE "SAVe_Vinculos_Apoio"                RENAME TO save_vinculos_apoio;
ALTER TABLE "SAVe_Casos_Vinculados"              RENAME TO save_casos_vinculados;
ALTER TABLE "SAVe_Responsaveis"                  RENAME TO save_responsaveis;
ALTER TABLE "SAVe_Acompanhamentos"               RENAME TO save_acompanhamentos;
-- Adicione outras tabelas aqui se necessário
COMMIT;
