-- Table: SAVe_Geral
CREATE TABLE "SAVe_Geral" (
    "ID_Caso" INTEGER PRIMARY KEY,
    "Num_Processo" TEXT,
    "Tipo_Vitima" TEXT,
    "Comarca" TEXT,
    "Data" TEXT,
    "Tipo_Form" TEXT,
    "Anexos_Info" TEXT,
    "Paginas_Visitadas" TEXT,
    "Encerrado" TEXT,
    "Nome" TEXT,
    "Tipo_Crime" TEXT
);

-- Table: SAVe_DadosDeEntrada
CREATE TABLE "SAVe_DadosDeEntrada" (
    "ID_Caso" INTEGER PRIMARY KEY,
    "Data" TEXT,
    "Comarca_origem" TEXT,
    "N_procedimento_MPE" TEXT,
    "Quem_encaminha" TEXT,
    "PE_nome" TEXT,
    "PE_telefone" TEXT,
    "PE_email" TEXT,
    "PE_cargo" TEXT,
    "Classificacao_crime" TEXT,
    "Classificacao_vitima" TEXT,
    "Vitimizacao" TEXT,
    "Crime_relacionado" TEXT,
    "Observacao" TEXT,
    "Atendimento_Especial" TEXT,
    "Vit_Terciaria_Origem" TEXT,
    "Precisa_Atendimento_Esp" TEXT,
    "Crime_relacionado_especifico" TEXT,
    "Possui_Relacionado" TEXT
);

-- Table: SAVe_Identificacao
CREATE TABLE "SAVe_Identificacao" (
    "ID_Caso" INTEGER PRIMARY KEY,
    "Nome_RC" TEXT,
    "Data_nascimento" TEXT,
    "Idade" TEXT,
    "Nome_social_ancestral" TEXT,
    "Filiacao_1" TEXT,
    "Filiacao_2" TEXT,
    "Como_querser_chamada" TEXT,
    "Naturalidade" TEXT,
    "Nacionalidade" TEXT,
    "DC_situacao" TEXT,
    "DC_CPF" TEXT,
    "DC_RG" TEXT,
    "DC_CTPS" TEXT,
    "CC_Nome" TEXT,
    "CC_telefoneDDD" TEXT,
    "CC_vinculo" TEXT,
    "PPS_Sexo" TEXT,
    "PPS_idgenero" TEXT,
    "PPS_orientacao_sexual" TEXT,
    "PPS_Raca_cor_etnia" TEXT,
    "PPS_religiao" TEXT,
    "PPS_estado_civil" TEXT
);

-- Table: SAVe_Identificacao_telefone
CREATE TABLE "SAVe_Identificacao_telefone" (
    "ID" SERIAL PRIMARY KEY,
    "ID_Caso" INTEGER,
    "Atualizado" TIMESTAMP,
    "TelefoneDDD" TEXT
);

-- Table: SAVe_Identificacao_email
CREATE TABLE "SAVe_Identificacao_email" (
    "ID" SERIAL PRIMARY KEY,
    "ID_Caso" INTEGER,
    "Atualizado" TIMESTAMP,
    "Email" TEXT
);

-- Table: SAVe_Identificacao_endereco
CREATE TABLE "SAVe_Identificacao_endereco" (
    "ID" SERIAL PRIMARY KEY,
    "ID_Caso" INTEGER,
    "Endereco" TEXT,
    "Numero" TEXT,
    "Complemento" TEXT,
    "Bairro" TEXT,
    "Cidade" TEXT,
    "UF" TEXT,
    "CEP" TEXT,
    "Moradia_Situacao" TEXT
);

-- Table: SAVe_Usuarios
CREATE TABLE "SAVe_Usuarios" (
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

-- Table: SAVe_Encerramento
CREATE TABLE "SAVe_Encerramento" (
    "ID_Caso" INTEGER PRIMARY KEY,
    "Observacao" TEXT,
    "Data" TEXT,
    "Forma_Encerramento_Caso" TEXT,
    "Especifique_Outros" TEXT,
    "Encaminhamento_Pos_Alta" TEXT
);

-- Table: SAVe_Casos_Vinculados
CREATE TABLE "SAVe_Casos_Vinculados" (
    "ID_Caso" INTEGER PRIMARY KEY,
    "Casos_Relacionados" TEXT
);

-- Table: SAVe_Situacao_Juridica
CREATE TABLE "SAVe_Situacao_Juridica" (
    "ID_Caso" INTEGER PRIMARY KEY,
    "SJ_IP_PCNet" TEXT,
    "SJ_Auto_Judicial" TEXT,
    "SJ_Num_MPMG" TEXT,
    "SJ_IP_PCNet_Classe_Tipo" TEXT,
    "SJ_Auto_Judicial_Classe_Tipo" TEXT,
    "SJ_Num_MPMG_Tipo" TEXT,
    "SJ_REDS_Classe_Tipo" TEXT,
    "SJ_Obs_Documentacao" TEXT,
    "SJ_Medidas_Prot_Cautelar" TEXT,
    "SJ_REDS" TEXT,
    "SJ_Num_Processo" TEXT,
    "SJ_Vitima_Intimada" TEXT,
    "SJ_Agressor_Intimado" TEXT,
    "SJ_Compartilhado_Rede" TEXT,
    "SJ_Relato_Descumprimento" TEXT,
    "SJ_Descumprimento_Especif" TEXT,
    "SJ_Autor_Maior_18" TEXT,
    "SJ_Promotoria" TEXT,
    "SJ_Delegacia" TEXT,
    "SJ_Servidor_Referencia" TEXT,
    "SJ_Promotor" TEXT,
    "SJ_Delegado" TEXT,
    "SJ_Juiz" TEXT,
    "SJ_Orgao_Julgador" TEXT,
    "SJ_Contato_Promotor" TEXT,
    "SJ_Contato_Delegado" TEXT,
    "SJ_Contato_Juiz" TEXT,
    "SJ_Tipo_Penal_Fatos" TEXT,
    "SJ_Tipo_Penal_Autuacao_IP" TEXT,
    "SJ_Tipo_Penal_Conclusao_IP" TEXT,
    "SJ_Tipo_Penal_Denuncia_Repres" TEXT,
    "SJ_Tipo_Penal_Audiencia" TEXT,
    "SJ_Tipo_Penal_Sentenca" TEXT,
    "SJ_Tipo_Penal_Transito_Julgado" TEXT,
    "SJ_Data_Fatos" TEXT,
    "SJ_Data_Autuacao_IP" TEXT,
    "SJ_Data_Conclusao_IP" TEXT,
    "SJ_Data_Denuncia_Repres" TEXT,
    "SJ_Data_Audiencia" TEXT,
    "SJ_Data_Sentenca" TEXT,
    "SJ_Data_Transito_Julgado" TEXT,
    "SJ_Hora_Crime" TEXT,
    "SJ_Dia_Semana" TEXT,
    "SJ_Local_Crime" TEXT,
    "SJ_Local_Crime_Especif" TEXT,
    "SJ_Obs_Crime" TEXT,
    "SJ_Fase_Persecucao_Penal" TEXT,
    "SJ_Fase_Judicial_Especif" TEXT,
    "SJ_Status_Juridico_Autor" TEXT
);

-- Table: SAVe_Situacao_Juridica2
CREATE TABLE "SAVe_Situacao_Juridica2" (
    "ID_Caso" INTEGER PRIMARY KEY,
    "SJ2_Resultado_Julgamento" TEXT,
    "SJ2_Tempo_Pena" TEXT,
    "SJ2_Inicio_Cumprimento" TEXT,
    "SJ2_Regime" TEXT,
    "SJ2_Apuracao_Investigacao" TEXT,
    "SJ2_Apuracao_Invest_Especif" TEXT,
    "SJ2_Pedido_Reparacao_Denuncia" TEXT,
    "SJ2_Tipo_Danos" TEXT,
    "SJ2_Tipo_Danos_Especif" TEXT,
    "SJ2_Condenacao_Reparacao" TEXT,
    "SJ2_Condenacao_Repar_Especif" TEXT,
    "SJ2_Demanda_Info_Participacao" BOOLEAN,
    "SJ2_Demanda_Info_Participacao_Especif" TEXT,
    "SJ2_Demanda_Info_Participacao_Especif2" TEXT,
    "SJ2_Demanda_Memoria_Verdade" BOOLEAN,
    "SJ2_Demanda_Memoria_Verdade_Especif" TEXT,
    "SJ2_Demanda_Memoria_Verdade_Especif2" TEXT,
    "SJ2_Demanda_Justica_Diligencia" BOOLEAN,
    "SJ2_Demanda_Justica_Diligencia_Especif" TEXT,
    "SJ2_Demanda_Justica_Diligencia_Especif2" TEXT,
    "SJ2_Demanda_Apoio_Assistencia" BOOLEAN,
    "SJ2_Demanda_Apoio_Assistencia_Especif" TEXT,
    "SJ2_Demanda_Apoio_Assistencia_Especif2" TEXT,
    "SJ2_Demanda_Seguranca" BOOLEAN,
    "SJ2_Demanda_Seguranca_Especif" TEXT,
    "SJ2_Demanda_Seguranca_Especif2" TEXT,
    "SJ2_Demanda_Protecao_Nao_Revitimizacao" BOOLEAN,
    "SJ2_Demanda_Protecao_Nao_Revitimizacao_Especif" TEXT,
    "SJ2_Demanda_Protecao_Nao_Revitimizacao_Especif2" TEXT,
    "SJ2_Prot_Nao_Revit_Med_Caut_Especif" TEXT,
    "SJ2_Prot_Nao_Revit_Med_Caut_Especif2" TEXT,
    "SJ2_Demanda_Protecao_Psicologica" BOOLEAN,
    "SJ2_Demanda_Protecao_Psicologica_Especif" TEXT,
    "SJ2_Demanda_Protecao_Psicologica_Especif2" TEXT,
    "SJ2_Demanda_Protecao_Documental" BOOLEAN,
    "SJ2_Demanda_Protecao_Documental_Especif" TEXT,
    "SJ2_Demanda_Protecao_Documental_Especif2" TEXT,
    "SJ2_Demanda_Compensacao_Reparacao" BOOLEAN,
    "SJ2_Demanda_Compensacao_Reparacao_Especif" TEXT,
    "SJ2_Demanda_Compensacao_Reparacao_Especif2" TEXT,
    "SJ2_Demanda_Compensacao_Reparacao_Especif_OutraForma" TEXT,
    "SJ2_Demanda_Tratamento_Digno" BOOLEAN,
    "SJ2_Demanda_Tratamento_Digno_Especif" TEXT,
    "SJ2_Demanda_Tratamento_Digno_OutraForma" TEXT
);

-- Table: SAVe_Situacao_Juridica_Incluir_processo
CREATE TABLE "SAVe_Situacao_Juridica_Incluir_processo" (
    "ID" SERIAL PRIMARY KEY,
    "ID_Caso" INTEGER,
    "SJIP_Numero" TEXT,
    "SJIP_Classe_Tipo" TEXT
);

-- Table: SAVe_Saude
CREATE TABLE "SAVe_Saude" (
    "ID_Caso" INTEGER PRIMARY KEY,
    "HS_Pessoa_deficiencia" TEXT,
    "HS_Pessoa_deficiencia_tipo" TEXT,
    "HS_Condicao_saude" TEXT,
    "HS_Condicao_saude_acompanhamento" TEXT,
    "HS_Condicao_saude_tipo" TEXT,
    "HS_Cond_saude_nao_perma" TEXT,
    "HS_Cond_saude_nao_perma_acomp" TEXT,
    "HS_Cond_saude_nao_perma_desc" TEXT,
    "HS_Aux_saude" TEXT,
    "HS_Aux_saude_acomp" TEXT,
    "HS_Aux_saude_desc" TEXT,
    "HS_Vitim_sexual" TEXT,
    "HS_Vitim_sexual_acomp" TEXT,
    "HS_Vitim_sexual_desc" TEXT,
    "HS_Medic_continua" TEXT,
    "HS_Medic_continua_desc" TEXT,
    "HS_Medic_psiq" TEXT,
    "HS_Medic_psiq_desc" TEXT,
    "FR_Alcool" TEXT,
    "FR_Alcool_freq" TEXT,
    "FR_Cigarro" TEXT,
    "FR_Cigarro_freq" TEXT,
    "FR_Subst_psicoativas" TEXT,
    "FR_Subst_psicoativas_freq" TEXT,
    "FR_Apoio" TEXT,
    "FR_Apoio_desc" TEXT,
    "RS_Acomp_publica" TEXT,
    "RS_Acomp_publica_tipo" TEXT,
    "RS_Acomp_RAPS" TEXT,
    "RS_Acomp_RAPS_centro" TEXT,
    "RS_Acomp_RAPS_especif" TEXT,
    "RS_Plano_saude" TEXT,
    "RS_Plano_saude_especif" TEXT,
    "RS_Contato_nome" TEXT,
    "RS_Contato_telefone" TEXT,
    "RS_Contato_email" TEXT,
    "RFC_Familia_Vulnerab" TEXT,
    "RFC_Vulnerab_especif" TEXT,
    "IV_Houve_Impacto_Saude" TEXT,
    "IV_Lesoes_Nao_Fatais" BOOLEAN,
    "IV_Defic_vitimizacao" TEXT,
    "IV_Defic_vitimizacao_tipo" TEXT,
    "IV_Problemas_De_Saude" BOOLEAN,
    "IV_Comp_Cogn_Comport" BOOLEAN,
    "IV_Comp_Cogn_Comport_tipo" TEXT,
    "IV_Outro" BOOLEAN,
    "IV_Outro_espec" TEXT,
    "IV_Impacto_Saude_Mental_tipos" TEXT,
    "IV_ISTOutros_esp" TEXT
);

-- Table: SAVe_Habitacao_territorio
CREATE TABLE "SAVe_Habitacao_territorio" (
    "ID_Caso" INTEGER PRIMARY KEY,
    "Moradia_regular" BOOLEAN,
    "Moradia_regular_esp" TEXT,
    "Moradia_Irregular" BOOLEAN,
    "Moradia_Irregular_esp" TEXT,
    "Moradia_Emergencial" BOOLEAN,
    "Moradia_Emergencial_esp" TEXT,
    "Territorio" TEXT,
    "Comunidade_tradicional" TEXT,
    "Comunidade_tradicional_esp" TEXT,
    "Reconhecido_fund_palmares" TEXT,
    "Reconhecido_orgao_publico" TEXT,
    "Reconhecido_funai" TEXT,
    "Titulado_Incra" TEXT,
    "Estrutura_Mat_predominante" TEXT,
    "Estrutura_Mat_predominante_esp" TEXT,
    "Estrutura_Insta_eletricas_hidraulica" TEXT,
    "Estrutura_Insta_eletricas_hidraulica_esp" TEXT,
    "Estrutura_paredes_revesti" TEXT,
    "Estrutura_danos_eventos_naturais" TEXT,
    "Estrutura_danos_eventos_naturais_esp" TEXT,
    "Estrutura_Risco_geologico" TEXT,
    "Estrutura_Risco_geologico_esp" TEXT,
    "Estrutura_Acesso_internet" TEXT,
    "Estrutura_Acesso_internet_esp" TEXT,
    "Fatores_risco_ambiental_infra" BOOLEAN,
    "Fatores_risco_ambiental_infra_esp" TEXT,
    "Conflitos_Urbanos_Criminalidade" BOOLEAN,
    "Conflitos_Urbanos_Criminalidade_esp" TEXT,
    "Conflitos_fundiarios_Agrarios" BOOLEAN,
    "Conflitos_fundiarios_Agrarios_esp" TEXT,
    "Fatores_risco_outros" BOOLEAN,
    "Fatores_risco_outros_esp" TEXT,
    "RV_Mudanca_domicilio" TEXT,
    "RV_Mudanca_domicilio_esp" TEXT
);

-- Table: SAVe_Assistencia
CREATE TABLE "SAVe_Assistencia" (
    "ID" SERIAL PRIMARY KEY,
    "ID_Caso" INTEGER,
    "Cad_unico" TEXT,
    "Status_cad_unico" TEXT,
    "SPSB_Acesso_cras" TEXT,
    "SPSB_Servicos_acessados" TEXT,
    "SPSB_Servicos_acessados_esp" TEXT,
    "SPSB_Contato_cras_nome" TEXT,
    "SPSB_Contato_cras_tel" TEXT,
    "SPSB_Contato_cras_email" TEXT,
    "SPSB_Nome_servico" TEXT,
    "SPSB_Endereco_servico" TEXT,
    "SPSEMC_Acesso_creas" TEXT,
    "SPSEMC_Servicos_acessados" TEXT,
    "SPSEMC_Servicos_acessados_esp" TEXT,
    "SPSEMC_Contato_creas_nome" TEXT,
    "SPSEMC_Contato_creas_tel" TEXT,
    "SPSEMC_Contato_creas_email" TEXT,
    "SPSEMC_Nome_servico" TEXT,
    "SPSEMC_Endereco_servico" TEXT,
    "SPSEAC_Inserido_acolhimentoInst" TEXT,
    "SPSEAC_Modalidade_acolhimentoInst" TEXT,
    "SPSEAC_Inserido_acolhimentorep" TEXT,
    "SPSEAC_acolhimentorep_desc" TEXT,
    "SPSEAC_Inserido_familia" TEXT,
    "SPSEAC_nome_familia" TEXT,
    "SPSEAC_Inserido_calamidade" TEXT,
    "SPSEAC_desc_calamidade" TEXT,
    "SPSEAC_tec_ref_nome" TEXT,
    "SPSEAC_tec_ref_tel" TEXT,
    "SPSEAC_tec_ref_email" TEXT,
    "SPSEAC_nome_servico" TEXT,
    "SPSEAC_endereco_servico" TEXT,
    "BSA_recebe_beneficios" TEXT,
    "BSA_Tipo_beneficio" TEXT,
    "BSA_transf_renda_inf" TEXT,
    "BSA_Ben_trab_inf" TEXT,
    "BSA_Ben_hab_inf" TEXT,
    "BSA_Ben_as_inf" TEXT,
    "BSA_Ben_educ_inf" TEXT,
    "BSA_Ben_atr_inf" TEXT,
    "BSA_Ben_pdi_inf" TEXT,
    "BSA_Ben_emer_inf" TEXT,
    "BSA_transf_renda_esp" TEXT,
    "BSA_Ben_trab_esp" TEXT,
    "BSA_Ben_hab_esp" TEXT,
    "BSA_Ben_as_esp" TEXT,
    "BSA_Ben_educ_esp" TEXT,
    "BSA_Ben_atr_esp" TEXT,
    "BSA_Ben_pdi_esp" TEXT,
    "BSA_Ben_emer_esp" TEXT,
    "BSA_outras_formas" TEXT,
    "BSA_direito_beneficios" TEXT,
    "BSA_direito_beneficios_esp" TEXT,
    "BSA_demandas_assist" TEXT,
    "BSA_demandas_assist_desc" TEXT,
    "BSA_tec_ref_nome" TEXT,
    "BSA_tec_ref_tel" TEXT,
    "BSA_tec_ref_email" TEXT,
    "BSA_seg_alimentar" TEXT,
    "created_at" TIMESTAMP,
    "updated_at" TIMESTAMP
);

-- Table: SAVe_Ensino_Trab_Renda
CREATE TABLE "SAVe_Ensino_Trab_Renda" (
    "ID_Caso" INTEGER PRIMARY KEY,
    "Grau_escolaridade" TEXT,
    "Estuda_atualmente" TEXT,
    "Nome_instituicao" TEXT,
    "Tipo_instituicao" TEXT,
    "Retorno_estudos" TEXT,
    "Situacao_trabalho" TEXT,
    "Profissao" TEXT,
    "Valor_renda" TEXT,
    "Valor_renda_esp" TEXT,
    "TR_Prejuizo_trabalho" TEXT,
    "TR_tipo_prejuizo" TEXT,
    "TR_descricao_prejuizo" TEXT,
    "PT_prejuizo_patrimonio" TEXT,
    "PT_Descricao_pp" TEXT,
    "VE_prejuizo_escolar" TEXT,
    "VE_tipo_PE" TEXT,
    "VE_descricao_pe" TEXT,
    "Demanda_educacional" BOOLEAN,
    "Desc_demanda_educacional" TEXT,
    "Demanda_trabalhista" BOOLEAN,
    "Desc_demanda_trabalhista" TEXT,
    "Esta_Afastado" TEXT,
    "Motivo_afastamento" TEXT,
    "Motivo_Afastamento_Detalhado" TEXT,
    "created_at" TIMESTAMP,
    "updated_at" TIMESTAMP
);

-- Table: SAVe_Vinculos
CREATE TABLE "SAVe_Vinculos" (
    "ID_Caso" INTEGER PRIMARY KEY,
    "Qtd_Pessoas_Fam" INTEGER,
    "Qtd_Filhos_Ent" INTEGER,
    "Num_Filhos_Dep" INTEGER,
    "Num_Enteados_Dep" INTEGER,
    "Renda_Total_Conv" NUMERIC,
    "Alt_Fam_Com_Vitim" TEXT,
    "Alt_Fam_Com_Vitim_Descr" TEXT,
    "Vulnerab_Vinculos_Fam" TEXT,
    "Vulnerab_Vinculos_Fam_Descr" TEXT,
    "Vulnerab_Vitim_Sec_Ter" TEXT,
    "Tipo_Vitim" TEXT,
    "Tipo_Vitim_Descr" TEXT,
    "created_at" TIMESTAMP,
    "updated_at" TIMESTAMP
);

-- Table: SAVe_Vinculos_Apoio
CREATE TABLE "SAVe_Vinculos_Apoio" (
    "ID" SERIAL PRIMARY KEY,
    "ID_Caso" INTEGER,
    "AVF_Grau_Parentesco" TEXT,
    "AVF_Nome" TEXT,
    "AVF_Data_Nasc" TEXT,
    "AVF_Escolaridade" TEXT,
    "AVF_Ocupacao" TEXT,
    "AVF_Renda" TEXT,
    "AVF_Mora_Com_Vitima" BOOLEAN,
    "AVF_Presenciou_Violencia" BOOLEAN,
    "AVF_Conhecimento_Fato" BOOLEAN,
    "AVF_Alt_Vinculo_Pos_Violencia" TEXT,
    "AVF_Rede_Apoio" BOOLEAN,
    "created_at" TIMESTAMP,
    "updated_at" TIMESTAMP
);

-- Table: SAVe_protecao_seguranca
CREATE TABLE "SAVe_protecao_seguranca" (
    "ID_Caso" INTEGER PRIMARY KEY,
    "PS_Natureza_Ameaca" TEXT,
    "PS_Natureza_Ameaca_Especif" TEXT,
    "PS_Como_Ameaca" TEXT,
    "PS_Tempo_Ameaca" TEXT,
    "PS_Ameaca_Autor_Vitim" TEXT,
    "PS_Ameaca_Conhece" TEXT,
    "PS_Ameaca_Mais_Autor" TEXT,
    "PS_Tipo_Relacao" TEXT,
    "PS_Tipo_Relacao_Especif" TEXT,
    "PS_Reside_Com_Autor" TEXT,
    "PS_Relacao_Poder" TEXT,
    "PS_Relacao_Poder_Especif" TEXT,
    "PS_Ameacas_Anteriores" TEXT,
    "PS_Ameacas_Anteriores_Especif" TEXT,
    "PS_Ameaca_Agente_Publico" TEXT,
    "PS_Ameaca_Agente_Instituicao" TEXT,
    "PS_Ameaca_Agente_Instituicao_Especif" TEXT,
    "PS_Ameaca_Org_Criminosa" TEXT,
    "PS_Ameaca_Org_Criminosa_Especif" TEXT,
    "PS_Regiao_Abrangencia_Ameaca" TEXT,
    "PS_Ameaca_Meios_Concretizar" TEXT,
    "PS_Ameaca_Meios_Concretizar_Especif" TEXT,
    "PS_Sendo_Perseguido" TEXT,
    "PS_Perseguido_Descr" TEXT,
    "PS_Autor_Acesso_Armas" TEXT,
    "PS_Acesso_Armas_Descr" TEXT,
    "PS_Violencia_Pos_Ameaca" TEXT,
    "PS_Violencia_Pos_Ameaca_Descr" TEXT,
    "PS_Ameaca_Repercussoes_Soc" TEXT,
    "PS_Repercussoes_Soc_Descr" TEXT,
    "PS_Ameaca_Extensao_Familia" TEXT,
    "PS_Extensao_Familia_Descr" TEXT,
    "PS_Ameaca_Crianca_Adolescente" TEXT,
    "PS_Liberdade_Limitada" TEXT,
    "PS_Liberdade_Limitada_Descr" TEXT,
    "PS_Impactos_Emocionais_Psic" TEXT,
    "PS_Impactos_Emocionais_Psic_Descr" TEXT,
    "PS_Impactos_Financeiros" TEXT,
    "PS_Impactos_Financeiros_Descr" TEXT,
    "PS_Nao_Sente_Segura_Mudar" TEXT,
    "PS_Nao_Sente_Segura_Mudar_Descr" TEXT,
    "PS_Possui_Rede_Apoio_Fam" TEXT,
    "PS_Rede_Apoio_Fam_Descr" TEXT,
    "PS_Possui_Rede_Comunitaria" TEXT,
    "PS_Rede_Comunitaria_Descr" TEXT,
    "PS_Possui_Equip_Seguranca" TEXT,
    "PS_Equip_Seguranca_Descr" TEXT,
    "PS_Possivel_Deslocamento_Seguro" TEXT,
    "PS_Deslocamento_Seguro_Descr" TEXT,
    "PS_Servicos_Prot_Social" TEXT,
    "PS_Servicos_Prot_Social_Especif" TEXT,
    "PS_Servicos_Acolhimento_Emerg" TEXT,
    "PS_Servicos_Acolhimento_Especif" TEXT,
    "PS_Programas_Protecao" TEXT,
    "PS_Programas_Protecao_Especif" TEXT,
    "PS_Vitima_Capaz_Ingressar_Prog" TEXT,
    "PS_Providencia_Realizada" TEXT,
    "PS_Providencia_Realizada_Descr" TEXT,
    "PS_Vitima_Violencia_Domestica" TEXT,
    "PS_Vitima_Crime_Odio" TEXT,
    "PS_Rede_Aplicou_Protocolo_FF" TEXT,
    "PS_Rede_Aplicou_Protocolo_Roger" TEXT,
    "PS_Deseja_Aplicar_FONAR" TEXT,
    "PS_Situacao_ameaca_relat" TEXT,
    "Nomes_Ameacadores" TEXT
);

-- Table: SAVe_protecao_seguranca_ameacadores
CREATE TABLE "SAVe_protecao_seguranca_ameacadores" (
    "ID" SERIAL PRIMARY KEY,
    "ID_Caso" INTEGER,
    "PSA_Nome_Ameacadores" TEXT
);

-- Table: SAVe_protecao_seguranca_adolescente
CREATE TABLE "SAVe_protecao_seguranca_adolescente" (
    "ID" SERIAL PRIMARY KEY,
    "ID_Caso" INTEGER,
    "PS_ADOLESCENTE_Idade" TEXT,
    "PS_ADOLESCENTE_Nome" TEXT
);

-- Table: SAVe_Acompanhamentos
CREATE TABLE "SAVe_Acompanhamentos" (
    "ID" SERIAL PRIMARY KEY,
    "ID_Caso" INTEGER,
    "Data" TEXT,
    "Tipo_Atendimento" TEXT,
    "Sintese" TEXT,
    "Encaminhamento" TEXT,
    "Responsaveis" TEXT
);

-- Table: SAVe_Vitimizacao
CREATE TABLE "SAVe_Vitimizacao" (
    "ID_Caso" INTEGER PRIMARY KEY,
    "VST_Dep_repet_reviti" TEXT,
    "VST_Espec_Dep_repet_reviti" TEXT,
    "VST_Falta_atend_esp" TEXT,
    "VST_Espec_Falta_atend_esp" TEXT,
    "VST_Falta_info" TEXT,
    "VST_Espec_Falta_info" TEXT,
    "VST_Demora_sist_just" TEXT,
    "VST_Espec_Demora_sist_just" TEXT,
    "VST_Expos_vitima" TEXT,
    "VST_Espec_Expos_vitima" TEXT,
    "VST_Neg_part_proc" TEXT,
    "VST_Espec_Neg_part_proc" TEXT,
    "VST_Neg_apres_prova" TEXT,
    "VST_Espec_Neg_apres_prova" TEXT,
    "VST_Neg_acesso_dir" TEXT,
    "VST_Espec_Neg_acesso_dir" TEXT,
    "VST_Desresp_sigilo" TEXT,
    "VST_Espec_Desresp_sigilo" TEXT,
    "VST_Desresp_nome_soc" TEXT,
    "VST_Espec_Desresp_nome_soc" TEXT,
    "VST_Outras_vit" TEXT,
    "VST_Espec_Outras_vit" TEXT,
    "VT_Culpa_vit" TEXT,
    "VT_Espec_Culpa_vit" TEXT,
    "VT_Estig_social" TEXT,
    "VT_Espec_Estig_social" TEXT,
    "VT_Falta_Poli_publicas" TEXT,
    "VT_Espec_Falta_Poli_publicas" TEXT,
    "VT_Explo_midiatica" TEXT,
    "VT_Espec_Explo_midiatica" TEXT,
    "VT_Outras_vit" TEXT,
    "VT_Espec_Outras_vit" TEXT
);

-- Table: SAVe_Agressor (REMOVED - Superseded by SAVe_Perfil_Agressor)
-- CREATE TABLE "SAVe_Agressor" (
--     "ID" SERIAL PRIMARY KEY,
--     "ID_Caso" INTEGER,
--     "Tipo" TEXT,
--     "Nome" TEXT,
--     "Apelido" TEXT,
--     "Idade" INTEGER,
--     "Sexo" TEXT,
--     "Raca" TEXT,
--     "Relacao" TEXT,
--     "Ocupacao" TEXT,
--     "Renda" TEXT,
--     "Escolaridade" TEXT,
--     "Endereco" TEXT,
--     "Antecedentes" TEXT,
--     "Uso_Drogas" TEXT,
--     "Porte_Arma" TEXT
-- );

-- Table: SAVe_Perfil_Agressor
CREATE TABLE "SAVe_Perfil_Agressor" (
    "ID" SERIAL PRIMARY KEY,
    "ID_Caso" INTEGER,
    "PA_Nome_Civil" TEXT,
    "PA_Nome_Social_Ancestral" TEXT,
    "PA_Apelido" TEXT,
    "PA_Data_Nascimento" TEXT,
    "PA_Idade" INTEGER,
    "PA_Filiacao_Mae" TEXT,
    "PA_Filiacao_Pai" TEXT,
    "PA_Nacionalidade" TEXT,
    "PA_Naturalidade" TEXT,
    "PA_Doc_CPF" TEXT,
    "PA_Doc_RG" TEXT,
    "PA_Doc_Situacao" TEXT,
    "PA_PPS_Sexo" TEXT,
    "PA_PPS_Identidade_Sexual" TEXT,
    "PA_PPS_Identidade_Genero" TEXT,
    "PA_PPS_Raca_Cor_Etnia" TEXT,
    "PA_PPS_Estado_Civil" TEXT,
    "PA_PPS_Religiao" TEXT,
    "PA_Tipo_Agressor" TEXT,
    "PA_CNPJ" TEXT,
    "PA_Razao_Social" TEXT,
    "PA_Endereco_Juridica" TEXT,
    "PA_Vitima_Multiplos_Agress" TEXT,
    "Modificado" TIMESTAMP
);

-- Table: SAVe_Perfil_Agressor_Endereco
CREATE TABLE "SAVe_Perfil_Agressor_Endereco" (
    "ID" SERIAL PRIMARY KEY,
    "ID_Caso" INTEGER,
    "ID_Perfil_Agressor" INTEGER,
    "PAE_Endereco" TEXT,
    "PAE_Numero" TEXT,
    "PAE_Complemento" TEXT,
    "PAE_Bairro" TEXT,
    "PAE_Cidade" TEXT,
    "PAE_UF" TEXT,
    "PAE_CEP" TEXT,
    "PAE_Situacao_Moradia" TEXT,
    "Modificado" TIMESTAMP
);

-- Table: SAVe_SinteseAnalitica
CREATE TABLE "SAVe_SinteseAnalitica" (
    "ID_Caso" INTEGER PRIMARY KEY,
    "Unidade_Analitica" TEXT,
    "Avaliacao_Riscos" TEXT,
    "Plano_Prevencao" TEXT,
    "Data_Vencimento" TEXT,
    "Cor_Risco" TEXT
);

-- Table: SAVe_Sintese_Analitica
CREATE TABLE "SAVe_Sintese_Analitica" (
    "ID" SERIAL PRIMARY KEY,
    "ID_Caso" INTEGER,
    "UnidadeAnalitica" TEXT,
    "AvaliacaoDeRiscos" TEXT,
    "PlanoDePrevencao" TEXT,
    "DataVencimento" TEXT,
    "Cor" TEXT
);


-- Table: SAVe_Responsaveis
CREATE TABLE "SAVe_Responsaveis" (
    "ID" SERIAL PRIMARY KEY,
    "Nome" TEXT,
    "Cargo" TEXT,
    "Area" TEXT
);
