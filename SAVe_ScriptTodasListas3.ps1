# ===================================================================
# Script para Criação de MÚLTIPLAS Listas no SharePoint
# ===================================================================

# --- PARÂMETROS ---
# ATENÇÃO: Altere a URL para o seu site do SharePoint de destino.
# Exemplo: "https://suaempresa.sharepoint.com/sites/seu-site"
$SiteURL = "https://mpmg-my.sharepoint.com/personal/msgsilva_estagio_mpmg_mp_br"

# ===============================================
# INÍCIO DO SCRIPT AUTOMÁTICO DE CRIAÇÃO DE LISTAS
# ===============================================
Write-Host "Conectando ao SharePoint..." -ForegroundColor Cyan
Connect-PnPOnline -Url $SiteURL -Interactive
Write-Host "Conexão estabelecida com sucesso!" -ForegroundColor Green



# --- DEFINIÇÃO DAS LISTAS E SUAS COLUNAS ---
# Array contendo a configuração de todas as listas a serem criadas para o SAVe_CasaLilian.
$ListConfigurations = @(

    
    # === LISTA 01 ===
[PSCustomObject]@{
        Title   = "SAVe_Geral"
        Url     = "Listas/SAVe_Geral"
        Columns = @(
            [PSCustomObject]@{ DisplayName="ID_Caso"; InternalName="ID_Caso"; Type="Number" },
            [PSCustomObject]@{ DisplayName="Num_Processo"; InternalName="Num_Processo"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Tipo_Vitima"; InternalName="Tipo_Vitima"; Type="Note" },
            [PSCustomObject]@{ DisplayName="Comarca"; InternalName="Comarca"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Data"; InternalName="Data"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Tipo_Form"; InternalName="Tipo_Form"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Anexos_Info"; InternalName="Anexos_Info"; Type="Note" },
            [PSCustomObject]@{ DisplayName="Paginas_Visitadas"; InternalName="Paginas_Visitadas"; Type="Note" },
            [PSCustomObject]@{ DisplayName="Encerrado"; InternalName="Encerrado"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Nome"; InternalName="Nome"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Tipo_Crime"; InternalName="Tipo_Crime"; Type="Note" }
        )
    },
    
    # === LISTA 02 ===
[PSCustomObject]@{
        Title   = "SAVe_DadosDeEntrada"
        Url     = "Listas/SAVe_DadosDeEntrada"
        Columns = @(
            [PSCustomObject]@{ DisplayName="Data"; InternalName="Data"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Comarca_origem"; InternalName="Comarca_origem"; Type="Text" },
            [PSCustomObject]@{ DisplayName="N_procedimento_MPE"; InternalName="N_procedimento_MPE"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Quem_encaminha"; InternalName="Quem_encaminha"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PE_nome"; InternalName="PE_nome"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PE_telefone"; InternalName="PE_telefone"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PE_email"; InternalName="PE_email"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PE_cargo"; InternalName="PE_cargo"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Classificacao_crime"; InternalName="Classificacao_crime"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Classificacao_vitima"; InternalName="Classificacao_vitima"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Vitimizacao"; InternalName="Vitimizacao"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Crime_relacionado"; InternalName="Crime_relacionado"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Observacao"; InternalName="Observacao"; Type="Note" },
            [PSCustomObject]@{ DisplayName="ID_Caso"; InternalName="ID_Caso"; Type="Number" },
            [PSCustomObject]@{ DisplayName="Atendimento_Especial"; InternalName="Atendimento_Especial"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Vit_Terciaria_Origem"; InternalName="Vit_Terciaria_Origem"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Precisa_Atendimento_Esp"; InternalName="Precisa_Atendimento_Esp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Crime_relacionado_especifico"; InternalName="Crime_relacionado_especifico"; Type="Note" },
            [PSCustomObject]@{ DisplayName="Possui_Relacionado"; InternalName="Possui_Relacionado"; Type="Text" }
        )
    },
    
    # === LISTA 03 ===
[PSCustomObject]@{
        Title   = "SAVe_Situacao_Juridica_Incluir_processo"
        Url     = "Listas/SAVe_Situacao_Juridica_Incluir_processo"
        Columns = @(
            [PSCustomObject]@{ DisplayName="ID_Caso"; InternalName="ID_Caso"; Type="Number" },
            [PSCustomObject]@{ DisplayName="SJIP_Numero"; InternalName="SJIP_Numero"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJIP_Classe_Tipo"; InternalName="SJIP_Classe_Tipo"; Type="Text" }
        )
    },
    
    # === LISTA 04 ===
[PSCustomObject]@{
        Title   = "SAVe_Identificacao"
        Url     = "Listas/SAVe_Identificacao"
        Columns = @(
            [PSCustomObject]@{ DisplayName="Nome_RC"; InternalName="Nome_RC"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Data_nascimento"; InternalName="Data_nascimento"; Type="DateTime"; Options=@{DisplayFormat="DateOnly"} },
            [PSCustomObject]@{ DisplayName="Idade"; InternalName="Idade"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Nome_social_ancestral"; InternalName="Nome_social_ancestral"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Filiacao_1"; InternalName="Filiacao_1"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Filiacao_2"; InternalName="Filiacao_2"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Como_querser_chamada"; InternalName="Como_querser_chamada"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Naturalidade"; InternalName="Naturalidade"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Nacionalidade"; InternalName="Nacionalidade"; Type="Text" },
            [PSCustomObject]@{ DisplayName="DC_situacao"; InternalName="DC_situacao"; Type="Text" },
            [PSCustomObject]@{ DisplayName="DC_CPF"; InternalName="DC_CPF"; Type="Text" },
            [PSCustomObject]@{ DisplayName="DC_RG"; InternalName="DC_RG"; Type="Text" },
            [PSCustomObject]@{ DisplayName="DC_CTPS"; InternalName="DC_CTPS"; Type="Text" },
            [PSCustomObject]@{ DisplayName="CC_Nome"; InternalName="CC_Nome"; Type="Text" },
            [PSCustomObject]@{ DisplayName="CC_telefoneDDD"; InternalName="CC_telefoneDDD"; Type="Text" },
            [PSCustomObject]@{ DisplayName="CC_vinculo"; InternalName="CC_vinculo"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PPS_Sexo"; InternalName="PPS_Sexo"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PPS_idgenero"; InternalName="PPS_idgenero"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PPS_orientacao_sexual"; InternalName="PPS_orientacao_sexual"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PPS_Raca_cor_etnia"; InternalName="PPS_Raca_cor_etnia"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PPS_religiao"; InternalName="PPS_religiao"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PPS_estado_civil"; InternalName="PPS_estado_civil"; Type="Text" },
            [PSCustomObject]@{ DisplayName="ID_Caso"; InternalName="ID_Caso"; Type="Number" }
        )
    },
    
    # === LISTA 05 ===
[PSCustomObject]@{
        Title   = "SAVe_Identificacao_email"
        Url     = "Listas/SAVe_Identificacao_email"
        Columns = @(
            [PSCustomObject]@{ DisplayName="ID_Caso"; InternalName="ID_Caso"; Type="Number" },
            [PSCustomObject]@{ DisplayName="Atualizado"; InternalName="Atualizado"; Type="DateTime"; Options=@{DisplayFormat="DateOnly"} },
            [PSCustomObject]@{ DisplayName="E-mail"; InternalName="Email"; Type="Text" }
        )
    },
    
    # === LISTA 06 ===
[PSCustomObject]@{
        Title   = "SAVe_Identificacao_telefone"
        Url     = "Listas/SAVe_Identificacao_telefone"
        Columns = @(
            [PSCustomObject]@{ DisplayName="Atualizado"; InternalName="Atualizado"; Type="DateTime"; Options=@{DisplayFormat="DateOnly"} },
            [PSCustomObject]@{ DisplayName="TelefoneDDD"; InternalName="TelefoneDDD"; Type="Text" },
            [PSCustomObject]@{ DisplayName="ID_Caso"; InternalName="ID_Caso"; Type="Number" }
        )
    },
    
    # === LISTA 07 ===
[PSCustomObject]@{
        Title   = "SAVe_Identificacao_endereco"
        Url     = "Listas/SAVe_Identificacao_endereco"
        Columns = @(
            [PSCustomObject]@{ DisplayName="Endereco"; InternalName="Endereco"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Numero"; InternalName="Numero"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Complemento"; InternalName="Complemento"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Bairro"; InternalName="Bairro"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Cidade"; InternalName="Cidade"; Type="Text" },
            [PSCustomObject]@{ DisplayName="UF"; InternalName="UF"; Type="Text" },
            [PSCustomObject]@{ DisplayName="CEP"; InternalName="CEP"; Type="Text" },
            [PSCustomObject]@{ DisplayName="ID_Caso"; InternalName="ID_Caso"; Type="Number" },
            [PSCustomObject]@{ DisplayName="Moradia_Situacao"; InternalName="Moradia_Situacao"; Type="Text" }
        )
    },
    
    # === LISTA 08 ===
[PSCustomObject]@{
        Title   = "SAVe_protecao_seguranca_ameacadores"
        Url     = "Listas/SAVe_protecao_seguranca_ameacadores"
        Columns = @(
            [PSCustomObject]@{ DisplayName="ID_Caso"; InternalName="ID_Caso"; Type="Number" },
            [PSCustomObject]@{ DisplayName="PSA_Nome_Ameacadores"; InternalName="PSA_Nome_Ameacadores"; Type="Text" }
        )
    },
    
    # === LISTA 09 ===
[PSCustomObject]@{
        Title   = "SAVe_protecao_seguranca_adolescente"
        Url     = "Listas/SAVe_protecao_seguranca_adolescente"
        Columns = @(
            [PSCustomObject]@{ DisplayName="ID_Caso"; InternalName="ID_Caso"; Type="Number" },
            [PSCustomObject]@{ DisplayName="PS_ADOLESCENTE_Idade"; InternalName="PS_ADOLESCENTE_Idade"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_ADOLESCENTE_Nome"; InternalName="PS_ADOLESCENTE_Nome"; Type="Text" }
        )
    },
    
    # === LISTA 10 ===
[PSCustomObject]@{
        Title   = "SAVe_protecao_seguranca"
        Url     = "Listas/SAVe_protecao_seguranca"
        Columns = @(
            [PSCustomObject]@{ DisplayName="ID_Caso"; InternalName="ID_Caso"; Type="Number" },
            [PSCustomObject]@{ DisplayName="PS_Natureza_Ameaca"; InternalName="PS_Natureza_Ameaca"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Natureza_Ameaca_Especif"; InternalName="PS_Natureza_Ameaca_Especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Como_Ameaca"; InternalName="PS_Como_Ameaca"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Tempo_Ameaca"; InternalName="PS_Tempo_Ameaca"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Ameaca_Autor_Vitim"; InternalName="PS_Ameaca_Autor_Vitim"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Ameaca_Conhece"; InternalName="PS_Ameaca_Conhece"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Ameaca_Mais_Autor"; InternalName="PS_Ameaca_Mais_Autor"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Tipo_Relacao"; InternalName="PS_Tipo_Relacao"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Tipo_Relacao_Especif"; InternalName="PS_Tipo_Relacao_Especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Reside_Com_Autor"; InternalName="PS_Reside_Com_Autor"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Relacao_Poder"; InternalName="PS_Relacao_Poder"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Relacao_Poder_Especif"; InternalName="PS_Relacao_Poder_Especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Ameacas_Anteriores"; InternalName="PS_Ameacas_Anteriores"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Ameacas_Anteriores_Especif"; InternalName="PS_Ameacas_Anteriores_Especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Ameaca_Agente_Publico"; InternalName="PS_Ameaca_Agente_Publico"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Ameaca_Agente_Instituicao"; InternalName="PS_Ameaca_Agente_Instituicao"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Ameaca_Agente_Instituicao_Especif"; InternalName="PS_Ameaca_Agente_Instituicao_Especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Ameaca_Org_Criminosa"; InternalName="PS_Ameaca_Org_Criminosa"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Ameaca_Org_Criminosa_Especif"; InternalName="PS_Ameaca_Org_Criminosa_Especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Regiao_Abrangencia_Ameaca"; InternalName="PS_Regiao_Abrangencia_Ameaca"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Ameaca_Meios_Concretizar"; InternalName="PS_Ameaca_Meios_Concretizar"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Ameaca_Meios_Concretizar_Especif"; InternalName="PS_Ameaca_Meios_Concretizar_Especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Sendo_Perseguido"; InternalName="PS_Sendo_Perseguido"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Perseguido_Descr"; InternalName="PS_Perseguido_Descr"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Autor_Acesso_Armas"; InternalName="PS_Autor_Acesso_Armas"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Acesso_Armas_Descr"; InternalName="PS_Acesso_Armas_Descr"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Violencia_Pos_Ameaca"; InternalName="PS_Violencia_Pos_Ameaca"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Violencia_Pos_Ameaca_Descr"; InternalName="PS_Violencia_Pos_Ameaca_Descr"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Ameaca_Repercussoes_Soc"; InternalName="PS_Ameaca_Repercussoes_Soc"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Repercussoes_Soc_Descr"; InternalName="PS_Repercussoes_Soc_Descr"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Ameaca_Extensao_Familia"; InternalName="PS_Ameaca_Extensao_Familia"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Extensao_Familia_Descr"; InternalName="PS_Extensao_Familia_Descr"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Ameaca_Crianca_Adolescente"; InternalName="PS_Ameaca_Crianca_Adolescente"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Liberdade_Limitada"; InternalName="PS_Liberdade_Limitada"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Liberdade_Limitada_Descr"; InternalName="PS_Liberdade_Limitada_Descr"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Impactos_Emocionais_Psic"; InternalName="PS_Impactos_Emocionais_Psic"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Impactos_Emocionais_Psic_Descr"; InternalName="PS_Impactos_Emocionais_Psic_Descr"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Impactos_Financeiros"; InternalName="PS_Impactos_Financeiros"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Impactos_Financeiros_Descr"; InternalName="PS_Impactos_Financeiros_Descr"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Nao_Sente_Segura_Mudar"; InternalName="PS_Nao_Sente_Segura_Mudar"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Nao_Sente_Segura_Mudar_Descr"; InternalName="PS_Nao_Sente_Segura_Mudar_Descr"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Possui_Rede_Apoio_Fam"; InternalName="PS_Possui_Rede_Apoio_Fam"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Rede_Apoio_Fam_Descr"; InternalName="PS_Rede_Apoio_Fam_Descr"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Possui_Rede_Comunitaria"; InternalName="PS_Possui_Rede_Comunitaria"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Rede_Comunitaria_Descr"; InternalName="PS_Rede_Comunitaria_Descr"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Possui_Equip_Seguranca"; InternalName="PS_Possui_Equip_Seguranca"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Equip_Seguranca_Descr"; InternalName="PS_Equip_Seguranca_Descr"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Possivel_Deslocamento_Seguro"; InternalName="PS_Possivel_Deslocamento_Seguro"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Deslocamento_Seguro_Descr"; InternalName="PS_Deslocamento_Seguro_Descr"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Servicos_Prot_Social"; InternalName="PS_Servicos_Prot_Social"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Servicos_Prot_Social_Especif"; InternalName="PS_Servicos_Prot_Social_Especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Servicos_Acolhimento_Emerg"; InternalName="PS_Servicos_Acolhimento_Emerg"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Servicos_Acolhimento_Especif"; InternalName="PS_Servicos_Acolhimento_Especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Programas_Protecao"; InternalName="PS_Programas_Protecao"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Programas_Protecao_Especif"; InternalName="PS_Programas_Protecao_Especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Vitima_Capaz_Ingressar_Prog"; InternalName="PS_Vitima_Capaz_Ingressar_Prog"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Providencia_Realizada"; InternalName="PS_Providencia_Realizada"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Providencia_Realizada_Descr"; InternalName="PS_Providencia_Realizada_Descr"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Vitima_Violencia_Domestica"; InternalName="PS_Vitima_Violencia_Domestica"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Vitima_Crime_Odio"; InternalName="PS_Vitima_Crime_Odio"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Rede_Aplicou_Protocolo_FF"; InternalName="PS_Rede_Aplicou_Protocolo_FF"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Rede_Aplicou_Protocolo_Roger"; InternalName="PS_Rede_Aplicou_Protocolo_Roger"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Deseja_Aplicar_FONAR"; InternalName="PS_Deseja_Aplicar_FONAR"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PS_Situacao_ameaca_relat"; InternalName="PS_Situacao_ameaca_relat"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Nomes_Ameacadores"; InternalName="Nomes_Ameacadores"; Type="Text" }
        )
    },
    
    # === LISTA 11 ===
[PSCustomObject]@{
        Title   = "SAVe_Encerramento"
        Url     = "Listas/SAVe_Encerramento"
        Columns = @(
            [PSCustomObject]@{ DisplayName="Observacao"; InternalName="Observacao"; Type="Note" },
            [PSCustomObject]@{ DisplayName="Data"; InternalName="Data"; Type="DateTime"; Options=@{DisplayFormat="DateOnly"} },
            [PSCustomObject]@{ DisplayName="Forma_Encerramento_Caso"; InternalName="Forma_Encerramento_Caso"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Especifique_Outros"; InternalName="Especifique_Outros"; Type="Text" },
            [PSCustomObject]@{ DisplayName="ID_Caso"; InternalName="ID_Caso"; Type="Number" }
        )
    },
    
    # === LISTA 12 ===
[PSCustomObject]@{
        Title   = "SAVe_Vitimizacao"
        Url     = "Listas/SAVe_Vitimizacao"
        Columns = @(
            [PSCustomObject]@{ DisplayName="ID_Caso"; InternalName="ID_Caso"; Type="Number" },
            [PSCustomObject]@{ DisplayName="VST_Dep_repet_reviti"; InternalName="VST_Dep_repet_reviti"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VST_Espec_Dep_repet_reviti"; InternalName="VST_Espec_Dep_repet_reviti"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VST_Falta_atend_esp"; InternalName="VST_Falta_atend_esp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VST_Espec_Falta_atend_esp"; InternalName="VST_Espec_Falta_atend_esp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VST_Falta_info"; InternalName="VST_Falta_info"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VST_Espec_Falta_info"; InternalName="VST_Espec_Falta_info"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VST_Demora_sist_just"; InternalName="VST_Demora_sist_just"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VST_Espec_Demora_sist_just"; InternalName="VST_Espec_Demora_sist_just"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VST_Expos_vitima"; InternalName="VST_Expos_vitima"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VST_Espec_Expos_vitima"; InternalName="VST_Espec_Expos_vitima"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VST_Neg_part_proc"; InternalName="VST_Neg_part_proc"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VST_Espec_Neg_part_proc"; InternalName="VST_Espec_Neg_part_proc"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VST_Neg_apres_prova"; InternalName="VST_Neg_apres_prova"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VST_Espec_Neg_apres_prova"; InternalName="VST_Espec_Neg_apres_prova"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VST_Neg_acesso_dir"; InternalName="VST_Neg_acesso_dir"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VST_Espec_Neg_acesso_dir"; InternalName="VST_Espec_Neg_acesso_dir"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VST_Desresp_sigilo"; InternalName="VST_Desresp_sigilo"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VST_Espec_Desresp_sigilo"; InternalName="VST_Espec_Desresp_sigilo"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VST_Desresp_nome_soc"; InternalName="VST_Desresp_nome_soc"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VST_Espec_Desresp_nome_soc"; InternalName="VST_Espec_Desresp_nome_soc"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VST_Outras_vit"; InternalName="VST_Outras_vit"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VST_Espec_Outras_vit"; InternalName="VST_Espec_Outras_vit"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VT_Culpa_vit"; InternalName="VT_Culpa_vit"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VT_Espec_Culpa_vit"; InternalName="VT_Espec_Culpa_vit"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VT_Estig_social"; InternalName="VT_Estig_social"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VT_Espec_Estig_social"; InternalName="VT_Espec_Estig_social"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VT_Falta_Poli_publicas"; InternalName="VT_Falta_Poli_publicas"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VT_Espec_Falta_Poli_publicas"; InternalName="VT_Espec_Falta_Poli_publicas"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VT_Explo_midiatica"; InternalName="VT_Explo_midiatica"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VT_Espec_Explo_midiatica"; InternalName="VT_Espec_Explo_midiatica"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VT_Outras_vit"; InternalName="VT_Outras_vit"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VT_Espec_Outras_vit"; InternalName="VT_Espec_Outras_vit"; Type="Text" }
        )
    },
    
    # === LISTA 13 ===
[PSCustomObject]@{
        Title   = "SAVe_Perfil_Agressor_Endereco"
        Url     = "Listas/SAVe_Perfil_Agressor_Endereco"
        Columns = @(
            [PSCustomObject]@{ DisplayName="ID_Caso"; InternalName="ID_Caso"; Type="Number" },
            [PSCustomObject]@{ DisplayName="PAE_Situacao_Moradia"; InternalName="PAE_Situacao_Moradia"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PAE_Endereco"; InternalName="PAE_Endereco"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PAE_Numero"; InternalName="PAE_Numero"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PAE_Complemento"; InternalName="PAE_Complemento"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PAE_Bairro"; InternalName="PAE_Bairro"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PAE_Cidade"; InternalName="PAE_Cidade"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PAE_UF"; InternalName="PAE_UF"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PAE_CEP"; InternalName="PAE_CEP"; Type="Text" },
            [PSCustomObject]@{ DisplayName="ID_Perfil_Agressor"; InternalName="ID_Perfil_Agressor"; Type="Number" }
        )
    },
    
    # === LISTA 14 ===
[PSCustomObject]@{
        Title   = "SAVe_Perfil_Agressor"
        Url     = "Listas/SAVe_Perfil_Agressor"
        Columns = @(
            [PSCustomObject]@{ DisplayName="ID_Caso"; InternalName="ID_Caso"; Type="Number" },
            [PSCustomObject]@{ DisplayName="PA_Tipo_Agressor"; InternalName="PA_Tipo_Agressor"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PA_Razao_Social"; InternalName="PA_Razao_Social"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PA_CNPJ"; InternalName="PA_CNPJ"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PA_Vitima_Multiplos_Agress"; InternalName="PA_Vitima_Multiplos_Agress"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PA_Endereco_Juridica"; InternalName="PA_Endereco_Juridica"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PA_Nome_Civil"; InternalName="PA_Nome_Civil"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PA_Nome_Social_Ancestral"; InternalName="PA_Nome_Social_Ancestral"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PA_Filiacao_Pai"; InternalName="PA_Filiacao_Pai"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PA_Data_Nascimento"; InternalName="PA_Data_Nascimento"; Type="DateTime"; Options=@{DisplayFormat="DateOnly"} },
            [PSCustomObject]@{ DisplayName="PA_Idade"; InternalName="PA_Idade"; Type="Number" },
            [PSCustomObject]@{ DisplayName="PA_Apelido"; InternalName="PA_Apelido"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PA_Naturalidade"; InternalName="PA_Naturalidade"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PA_Nacionalidade"; InternalName="PA_Nacionalidade"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PA_Doc_Situacao"; InternalName="PA_Doc_Situacao"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PA_Doc_CPF"; InternalName="PA_Doc_CPF"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PA_Doc_RG"; InternalName="PA_Doc_RG"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PA_PPS_Sexo"; InternalName="PA_PPS_Sexo"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PA_PPS_Identidade_Genero"; InternalName="PA_PPS_Identidade_Genero"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PA_PPS_Identidade_Sexual"; InternalName="PA_PPS_Identidade_Sexual"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PA_PPS_Raca_Cor_Etnia"; InternalName="PA_PPS_Raca_Cor_Etnia"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PA_PPS_Religiao"; InternalName="PA_PPS_Religiao"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PA_PPS_Estado_Civil"; InternalName="PA_PPS_Estado_Civil"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PA_Filiacao_Mae"; InternalName="PA_Filiacao_Mae"; Type="Text" }
        )
    },
    
    # === LISTA 15 ===
[PSCustomObject]@{
        Title   = "SAVe_Vinculos"
        Url     = "Listas/SAVe_Vinculos"
        Columns = @(
            [PSCustomObject]@{ DisplayName="ID_Caso"; InternalName="ID_Caso"; Type="Number" },
            [PSCustomObject]@{ DisplayName="Qtd_Pessoas_Fam"; InternalName="Qtd_Pessoas_Fam"; Type="Number" },
            [PSCustomObject]@{ DisplayName="Qtd_Filhos_Ent"; InternalName="Qtd_Filhos_Ent"; Type="Number" },
            [PSCustomObject]@{ DisplayName="Num_Filhos_Dep"; InternalName="Num_Filhos_Dep"; Type="Number" },
            [PSCustomObject]@{ DisplayName="Num_Enteados_Dep"; InternalName="Num_Enteados_Dep"; Type="Number" },
            [PSCustomObject]@{ DisplayName="Renda_Total_Conv"; InternalName="Renda_Total_Conv"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Alt_Fam_Com_Vitim"; InternalName="Alt_Fam_Com_Vitim"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Alt_Fam_Com_Vitim_Descr"; InternalName="Alt_Fam_Com_Vitim_Descr"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Vulnerab_Vinculos_Fam"; InternalName="Vulnerab_Vinculos_Fam"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Vulnerab_Vinculos_Fam_Descr"; InternalName="Vulnerab_Vinculos_Fam_Descr"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Vulnerab_Vitim_Sec_Ter"; InternalName="Vulnerab_Vitim_Sec_Ter"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Tipo_Vitim"; InternalName="Tipo_Vitim"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Tipo_Vitim_Descr"; InternalName="Tipo_Vitim_Descr"; Type="Text" }
        )
    },
    
    # === LISTA 16 ===
[PSCustomObject]@{
        Title   = "SAVe_Situacao_Juridica"
        Url     = "Listas/SAVe_Situacao_Juridica"
        Columns = @(
            [PSCustomObject]@{ DisplayName="ID_Caso"; InternalName="ID_Caso"; Type="Number" },
            [PSCustomObject]@{ DisplayName="SJ_Autor_Maior_18"; InternalName="SJ_Autor_Maior_18"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_REDS"; InternalName="SJ_REDS"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_REDS_Classe_Tipo"; InternalName="SJ_REDS_Classe_Tipo"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_IP_PCNet"; InternalName="SJ_IP_PCNet"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_IP_PCNet_Classe_Tipo"; InternalName="SJ_IP_PCNet_Classe_Tipo"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Auto_Judicial"; InternalName="SJ_Auto_Judicial"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Auto_Judicial_Classe_Tipo"; InternalName="SJ_Auto_Judicial_Classe_Tipo"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Num_MPMG"; InternalName="SJ_Num_MPMG"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Outros_Processos"; InternalName="SJ_Outros_Processos"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Obs_Documentacao"; InternalName="SJ_Obs_Documentacao"; Type="Note" },
            [PSCustomObject]@{ DisplayName="SJ_Medidas_Prot_Cautelar"; InternalName="SJ_Medidas_Prot_Cautelar"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Num_Processo"; InternalName="SJ_Num_Processo"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Compartilhado_Rede"; InternalName="SJ_Compartilhado_Rede"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Relato_Descumprimento"; InternalName="SJ_Relato_Descumprimento"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Descumprimento_Especif"; InternalName="SJ_Descumprimento_Especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Vitima_Intimada"; InternalName="SJ_Vitima_Intimada"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Agressor_Intimado"; InternalName="SJ_Agressor_Intimado"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Orgao_Julgador"; InternalName="SJ_Orgao_Julgador"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Juiz"; InternalName="SJ_Juiz"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Contato_Juiz"; InternalName="SJ_Contato_Juiz"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Promotoria"; InternalName="SJ_Promotoria"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Promotor"; InternalName="SJ_Promotor"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Contato_Promotor"; InternalName="SJ_Contato_Promotor"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Delegacia"; InternalName="SJ_Delegacia"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Delegado"; InternalName="SJ_Delegado"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Contato_Delegado"; InternalName="SJ_Contato_Delegado"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Servidor_Referencia"; InternalName="SJ_Servidor_Referencia"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Data_Fatos"; InternalName="SJ_Data_Fatos"; Type="DateTime"; Options=@{DisplayFormat="DateOnly"} },
            [PSCustomObject]@{ DisplayName="SJ_Tipo_Penal_Fatos"; InternalName="SJ_Tipo_Penal_Fatos"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Data_Autuacao_IP"; InternalName="SJ_Data_Autuacao_IP"; Type="DateTime"; Options=@{DisplayFormat="DateOnly"} },
            [PSCustomObject]@{ DisplayName="SJ_Tipo_Penal_Autuacao_IP"; InternalName="SJ_Tipo_Penal_Autuacao_IP"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Data_Conclusao_IP"; InternalName="SJ_Data_Conclusao_IP"; Type="DateTime"; Options=@{DisplayFormat="DateOnly"} },
            [PSCustomObject]@{ DisplayName="SJ_Tipo_Penal_Conclusao_IP"; InternalName="SJ_Tipo_Penal_Conclusao_IP"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Data_Denuncia_Repres"; InternalName="SJ_Data_Denuncia_Repres"; Type="DateTime"; Options=@{DisplayFormat="DateOnly"} },
            [PSCustomObject]@{ DisplayName="SJ_Tipo_Penal_Denuncia_Repres"; InternalName="SJ_Tipo_Penal_Denuncia_Repres"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Data_Audiencia"; InternalName="SJ_Data_Audiencia"; Type="DateTime"; Options=@{DisplayFormat="DateOnly"} },
            [PSCustomObject]@{ DisplayName="SJ_Tipo_Penal_Audiencia"; InternalName="SJ_Tipo_Penal_Audiencia"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Data_Sentenca"; InternalName="SJ_Data_Sentenca"; Type="DateTime"; Options=@{DisplayFormat="DateOnly"} },
            [PSCustomObject]@{ DisplayName="SJ_Tipo_Penal_Sentenca"; InternalName="SJ_Tipo_Penal_Sentenca"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Data_Transito_Julgado"; InternalName="SJ_Data_Transito_Julgado"; Type="DateTime"; Options=@{DisplayFormat="DateOnly"} },
            [PSCustomObject]@{ DisplayName="SJ_Tipo_Penal_Transito_Julgado"; InternalName="SJ_Tipo_Penal_Transito_Julgado"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Hora_Crime"; InternalName="SJ_Hora_Crime"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Dia_Semana"; InternalName="SJ_Dia_Semana"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Local_Crime"; InternalName="SJ_Local_Crime"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Local_Crime_Especif"; InternalName="SJ_Local_Crime_Especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Obs_Crime"; InternalName="SJ_Obs_Crime"; Type="Note" },
            [PSCustomObject]@{ DisplayName="SJ_Transito_Julgado_Penal_Tipo"; InternalName="SJ_Transito_Julgado_Penal_Tipo"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Fase_Persecucao_Penal"; InternalName="SJ_Fase_Persecucao_Penal"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Fase_Judicial_Especif"; InternalName="SJ_Fase_Judicial_Especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Status_Juridico_Autor"; InternalName="SJ_Status_Juridico_Autor"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Agressor_Ja_Preso"; InternalName="SJ_Agressor_Ja_Preso"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Prisao_Data"; InternalName="SJ_Prisao_Data"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Prisao_Num_Procedimento"; InternalName="SJ_Prisao_Num_Procedimento"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Prisao_Infracao"; InternalName="SJ_Prisao_Infracao"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Prisao_Infracao_Num_Procedimento"; InternalName="SJ_Prisao_Infracao_Num_Procedimento"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Autor_Investigado_Outro_Proc"; InternalName="SJ_Autor_Investigado_Outro_Proc"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Infracao_Criminal_Outro_Proc"; InternalName="SJ_Infracao_Criminal_Outro_Proc"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Num_Procedimento_Outro_Proc"; InternalName="SJ_Num_Procedimento_Outro_Proc"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ_Num_MPMG_Tipo"; InternalName="SJ_Num_MPMG_Tipo"; Type="Text" }
        )
    },
    
    # === LISTA 17 ===
[PSCustomObject]@{
        Title   = "SAVe_Situacao_Juridica2"
        Url     = "Listas/SAVe_Situacao_Juridica2"
        Columns = @(
            [PSCustomObject]@{ DisplayName="ID_Caso"; InternalName="ID_Caso"; Type="Number" },
            [PSCustomObject]@{ DisplayName="SJ2_Resultado_Julgamento"; InternalName="SJ2_Resultado_Julgamento"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Tempo_Pena"; InternalName="SJ2_Tempo_Pena"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Inicio_Cumprimento"; InternalName="SJ2_Inicio_Cumprimento"; Type="DateTime"; Options=@{DisplayFormat="DateOnly"} },
            [PSCustomObject]@{ DisplayName="SJ2_Regime"; InternalName="SJ2_Regime"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Apuracao_Investigacao"; InternalName="SJ2_Apuracao_Investigacao"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Apuracao_Invest_Especif"; InternalName="SJ2_Apuracao_Invest_Especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Pedido_Reparacao_Denuncia"; InternalName="SJ2_Pedido_Reparacao_Denuncia"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Tipo_Danos"; InternalName="SJ2_Tipo_Danos"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Tipo_Danos_Especif"; InternalName="SJ2_Tipo_Danos_Especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Condenacao_Reparacao"; InternalName="SJ2_Condenacao_Reparacao"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Condenacao_Repar_Especif"; InternalName="SJ2_Condenacao_Repar_Especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Info_Participacao_Especif"; InternalName="SJ2_Demanda_Info_Participacao_Especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Info_Participacao_Especif2"; InternalName="SJ2_Demanda_Info_Participacao_Especif2"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Memoria_Verdade_Especif"; InternalName="SJ2_Demanda_Memoria_Verdade_Especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Memoria_Verdade_Especif2"; InternalName="SJ2_Demanda_Memoria_Verdade_Especif2"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Justica_Diligencia_Especif"; InternalName="SJ2_Demanda_Justica_Diligencia_Especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Justica_Diligencia_Especif2"; InternalName="SJ2_Demanda_Justica_Diligencia_Especif2"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Apoio_Assistencia_Especif"; InternalName="SJ2_Demanda_Apoio_Assistencia_Especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Apoio_Assistencia_Especif2"; InternalName="SJ2_Demanda_Apoio_Assistencia_Especif2"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Seguranca_Especif"; InternalName="SJ2_Demanda_Seguranca_Especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Seguranca_Especif2"; InternalName="SJ2_Demanda_Seguranca_Especif2"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Protecao_Nao_Revitimizacao_Especif"; InternalName="SJ2_Demanda_Protecao_Nao_Revitimizacao_Especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Protecao_Nao_Revitimizacao_Especif2"; InternalName="SJ2_Demanda_Protecao_Nao_Revitimizacao_Especif2"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Protecao_Psicologica"; InternalName="SJ2_Demanda_Protecao_Psicologica"; Type="Boolean" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Protecao_Psicologica_Especif"; InternalName="SJ2_Demanda_Protecao_Psicologica_Especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Protecao_Psicologica_Especif2"; InternalName="SJ2_Demanda_Protecao_Psicologica_Especif2"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Protecao_Documental_Especif"; InternalName="SJ2_Demanda_Protecao_Documental_Especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Protecao_Documental_Especif2"; InternalName="SJ2_Demanda_Protecao_Documental_Especif2"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Compensacao_Reparacao_Especif"; InternalName="SJ2_Demanda_Compensacao_Reparacao_Especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Compensacao_Reparacao_Especif2"; InternalName="SJ2_Demanda_Compensacao_Reparacao_Especif2"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Tratamento_Digno_Especif"; InternalName="SJ2_Demanda_Tratamento_Digno_Especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Info_Participacao"; InternalName="SJ2_Demanda_Info_Participacao"; Type="Boolean" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Memoria_Verdade"; InternalName="SJ2_Demanda_Memoria_Verdade"; Type="Boolean" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Justica_Diligencia"; InternalName="SJ2_Demanda_Justica_Diligencia"; Type="Boolean" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Apoio_Assistencia"; InternalName="SJ2_Demanda_Apoio_Assistencia"; Type="Boolean" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Seguranca"; InternalName="SJ2_Demanda_Seguranca"; Type="Boolean" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Protecao_Nao_Revitimizacao"; InternalName="SJ2_Demanda_Protecao_Nao_Revitimizacao"; Type="Boolean" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Protecao_Documental"; InternalName="SJ2_Demanda_Protecao_Documental"; Type="Boolean" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Compensacao_Reparacao"; InternalName="SJ2_Demanda_Compensacao_Reparacao"; Type="Boolean" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Tratamento_Digno"; InternalName="SJ2_Demanda_Tratamento_Digno"; Type="Boolean" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Compensacao_Reparacao_Especif_OutraForma"; InternalName="SJ2_Demanda_Compensacao_Reparacao_Especif_OutraForma"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Tratamento_Digno_OutraForma"; InternalName="SJ2_Demanda_Tratamento_Digno_OutraForma"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Protecao_Nao_Revitimizacao_MedidasCautelares_Especif"; InternalName="SJ2_Demanda_Protecao_Nao_Revitimizacao_MedidasCautelares_Especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SJ2_Demanda_Protecao_Nao_Revitimizacao_MedidasCautelares_Especif2"; InternalName="SJ2_Demanda_Protecao_Nao_Revitimizacao_MedidasCautelares_Especif2"; Type="Text" }
        )
    },
    
    # === LISTA 18 ===
[PSCustomObject]@{
        Title   = "SAVe_Saude"
        Url     = "Listas/SAVe_Saude"
        Columns = @(
            [PSCustomObject]@{ DisplayName="HS_Pessoa_deficiencia"; InternalName="HS_Pessoa_deficiencia"; Type="Text" },
            [PSCustomObject]@{ DisplayName="HS_Pessoa_deficiencia_tipo"; InternalName="HS_Pessoa_deficiencia_tipo"; Type="Text" },
            [PSCustomObject]@{ DisplayName="HS_Condicao_saude"; InternalName="HS_Condicao_saude"; Type="Text" },
            [PSCustomObject]@{ DisplayName="HS_Condicao_saude_acompanhamento"; InternalName="HS_Condicao_saude_acompanhamento"; Type="Text" },
            [PSCustomObject]@{ DisplayName="HS_Condicao_saude_tipo"; InternalName="HS_Condicao_saude_tipo"; Type="Text" },
            [PSCustomObject]@{ DisplayName="HS_Cond_saude_nao_perma"; InternalName="HS_Cond_saude_nao_perma"; Type="Text" },
            [PSCustomObject]@{ DisplayName="HS_Cond_saude_nao_perma_acomp"; InternalName="HS_Cond_saude_nao_perma_acomp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="HS_Cond_saude_nao_perma_desc"; InternalName="HS_Cond_saude_nao_perma_desc"; Type="Text" },
            [PSCustomObject]@{ DisplayName="HS_Aux_saude"; InternalName="HS_Aux_saude"; Type="Text" },
            [PSCustomObject]@{ DisplayName="HS_Vitim_sexual_acomp"; InternalName="HS_Vitim_sexual_acomp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="HS_Vitim_sexual_desc"; InternalName="HS_Vitim_sexual_desc"; Type="Text" },
            [PSCustomObject]@{ DisplayName="HS_Medic_continua"; InternalName="HS_Medic_continua"; Type="Text" },
            [PSCustomObject]@{ DisplayName="HS_Medic_continua_desc"; InternalName="HS_Medic_continua_desc"; Type="Text" },
            [PSCustomObject]@{ DisplayName="HS_Medic_psiq"; InternalName="HS_Medic_psiq"; Type="Text" },
            [PSCustomObject]@{ DisplayName="HS_Medic_psiq_desc"; InternalName="HS_Medic_psiq_desc"; Type="Text" },
            [PSCustomObject]@{ DisplayName="FR_Alcool"; InternalName="FR_Alcool"; Type="Text" },
            [PSCustomObject]@{ DisplayName="FR_Alcool_freq"; InternalName="FR_Alcool_freq"; Type="Text" },
            [PSCustomObject]@{ DisplayName="FR_Cigarro"; InternalName="FR_Cigarro"; Type="Text" },
            [PSCustomObject]@{ DisplayName="FR_Cigarro_freq"; InternalName="FR_Cigarro_freq"; Type="Text" },
            [PSCustomObject]@{ DisplayName="FR_Subst_psicoativas"; InternalName="FR_Subst_psicoativas"; Type="Text" },
            [PSCustomObject]@{ DisplayName="FR_Subst_psicoativas_freq"; InternalName="FR_Subst_psicoativas_freq"; Type="Text" },
            [PSCustomObject]@{ DisplayName="FR_Apoio"; InternalName="FR_Apoio"; Type="Text" },
            [PSCustomObject]@{ DisplayName="FR_Apoio_desc"; InternalName="FR_Apoio_desc"; Type="Text" },
            [PSCustomObject]@{ DisplayName="RS_Acomp_publica"; InternalName="RS_Acomp_publica"; Type="Text" },
            [PSCustomObject]@{ DisplayName="RS_Acomp_publica_tipo"; InternalName="RS_Acomp_publica_tipo"; Type="Text" },
            [PSCustomObject]@{ DisplayName="RS_Acomp_RAPS"; InternalName="RS_Acomp_RAPS"; Type="Text" },
            [PSCustomObject]@{ DisplayName="RS_Acomp_RAPS_centro"; InternalName="RS_Acomp_RAPS_centro"; Type="Text" },
            [PSCustomObject]@{ DisplayName="RS_Acomp_RAPS_especif"; InternalName="RS_Acomp_RAPS_especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="RS_Plano_saude"; InternalName="RS_Plano_saude"; Type="Text" },
            [PSCustomObject]@{ DisplayName="RS_Plano_saude_especif"; InternalName="RS_Plano_saude_especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="RS_Contato_nome"; InternalName="RS_Contato_nome"; Type="Text" },
            [PSCustomObject]@{ DisplayName="RS_Contato_tel"; InternalName="RS_Contato_tel"; Type="Text" },
            [PSCustomObject]@{ DisplayName="RS_Contato_email"; InternalName="RS_Contato_email"; Type="Text" },
            [PSCustomObject]@{ DisplayName="RFC_Familia_Vulnerab"; InternalName="RFC_Familia_Vulnerab"; Type="Text" },
            [PSCustomObject]@{ DisplayName="RFC_Vulnerab_especif"; InternalName="RFC_Vulnerab_especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="IV_Vitim_Impacto_Psic"; InternalName="IV_Vitim_Impacto_Psic"; Type="Text" },
            [PSCustomObject]@{ DisplayName="IV_Vitim_Especif"; InternalName="IV_Vitim_Especif"; Type="Text" },
            [PSCustomObject]@{ DisplayName="IV_Houve_Impacto_Saude"; InternalName="IV_Houve_Impacto_Saude"; Type="Text" },
            [PSCustomObject]@{ DisplayName="IV_Defic_vitimizacao"; InternalName="IV_Defic_vitimizacao"; Type="Text" },
            [PSCustomObject]@{ DisplayName="IV_Defic_vitimizacao_tipo"; InternalName="IV_Defic_vitimizacao_tipo"; Type="Text" },
            [PSCustomObject]@{ DisplayName="IV_Comp_Cogn_Comport"; InternalName="IV_Comp_Cogn_Comport"; Type="Text" },
            [PSCustomObject]@{ DisplayName="IV_Comp_Cogn_Comport_tipo"; InternalName="IV_Comp_Cogn_Comport_tipo"; Type="Text" },
            [PSCustomObject]@{ DisplayName="IV_Outro"; InternalName="IV_Outro"; Type="Text" },
            [PSCustomObject]@{ DisplayName="IV_Outro_espec"; InternalName="IV_Outro_espec"; Type="Text" },
            [PSCustomObject]@{ DisplayName="ID_Caso"; InternalName="ID_Caso"; Type="Number" },
            [PSCustomObject]@{ DisplayName="HS_Aux_saude_acomp"; InternalName="HS_Aux_saude_acomp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="HS_Aux_saude_desc"; InternalName="HS_Aux_saude_desc"; Type="Text" },
            [PSCustomObject]@{ DisplayName="HS_Vitim_sexual"; InternalName="HS_Vitim_sexual"; Type="Text" },
            [PSCustomObject]@{ DisplayName="IV_Lesoes_Nao_Fatais"; InternalName="IV_Lesoes_Nao_Fatais"; Type="Text" },
            [PSCustomObject]@{ DisplayName="IV_Problemas_De_Saude"; InternalName="IV_Problemas_De_Saude"; Type="Text" },
            [PSCustomObject]@{ DisplayName="IV_ISTOutros_esp"; InternalName="IV_ISTOutros_esp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="IV_Impacto_Saude_Mental_tipos"; InternalName="IV_Impacto_Saude_Mental_tipos"; Type="Note" }
        )
    },
    
    # === LISTA 19 ===
[PSCustomObject]@{
        Title   = "SAVe_Sintese_Analitica"
        Url     = "Listas/SAVe_Sintese_Analitica"
        Columns = @(
		[PSCustomObject]@{ DisplayName="ID_Caso"; InternalName="ID_Caso"; Type="Number" },
		[PSCustomObject]@{ DisplayName="UnidadeAnalitica"; InternalName="UnidadeAnalitica"; Type="Text" },
		[PSCustomObject]@{ DisplayName="AvaliacaoDeRiscos"; InternalName="AvaliacaoDeRiscos"; Type="Text" },
		[PSCustomObject]@{ DisplayName="PlanoDePrevencao"; InternalName="PlanoDePrevencao"; Type="Note" },
		[PSCustomObject]@{ DisplayName="DataVencimento"; InternalName="DataVencimento"; Type="DateTime"; Options=@{DisplayFormat="DateOnly"} },
		[PSCustomObject]@{ DisplayName="Cor"; InternalName="Cor"; Type="Text" }
	)
    },
    
    # === LISTA 20 ===
[PSCustomObject]@{
        Title   = "SAVe_Habitacao_territorio"
        Url     = "Listas/SAVe_Habitacao_territorio"
        Columns = @(
            [PSCustomObject]@{ DisplayName="ID_Caso"; InternalName="ID_Caso"; Type="Number" },
            [PSCustomObject]@{ DisplayName="Moradia_regular_esp"; InternalName="Moradia_regular_esp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Moradia_Irregular_esp"; InternalName="Moradia_Irregular_esp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Moradia_Emergencial_esp"; InternalName="Moradia_Emergencial_esp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Territorio"; InternalName="Territorio"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Comunidade_tradicional"; InternalName="Comunidade_tradicional"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Comunidade_tradicional_esp"; InternalName="Comunidade_tradicional_esp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="titulado_Incra"; InternalName="titulado_Incra"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Reconhecido_funai"; InternalName="Reconhecido_funai"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Reconhecido_fund_palmares"; InternalName="Reconhecido_fund_palmares"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Reconhecido_orgao_publico"; InternalName="Reconhecido_orgao_publico"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Estrutura_Mat_predominante"; InternalName="Estrutura_Mat_predominante"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Estrutura_Insta_eletricas_hidraulica"; InternalName="Estrutura_Insta_eletricas_hidraulica"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Estrutura_Risco_geologico"; InternalName="Estrutura_Risco_geologico"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Estrutura_paredes_revesti"; InternalName="Estrutura_paredes_revesti"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Estrutura_Acesso_internet"; InternalName="Estrutura_Acesso_internet"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Estrutura_danos_eventos_naturais"; InternalName="Estrutura_danos_eventos_naturais"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Estrutura_Mat_predominante_esp"; InternalName="Estrutura_Mat_predominante_esp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Estrutura_Insta_eletricas_hidraulica_esp"; InternalName="Estrutura_Insta_eletricas_hidraulica_esp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Estrutura_Risco_geologico_esp"; InternalName="Estrutura_Risco_geologico_esp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Estrutura_Acesso_internet_esp"; InternalName="Estrutura_Acesso_internet_esp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Estrutura_danos_eventos_naturais_esp"; InternalName="Estrutura_danos_eventos_naturais_esp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Fatores_risco_ambiental_infra_esp"; InternalName="Fatores_risco_ambiental_infra_esp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Conflitos_Urbanos_Criminalidade_esp"; InternalName="Conflitos_Urbanos_Criminalidade_esp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Conflitos_fundiarios_Agrarios_esp"; InternalName="Conflitos_fundiarios_Agrarios_esp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Fatores_risco_outros_esp"; InternalName="Fatores_risco_outros_esp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="RV_Mudanca_domicilio"; InternalName="RV_Mudanca_domicilio"; Type="Text" },
            [PSCustomObject]@{ DisplayName="RV_Mudanca_domicilio_esp"; InternalName="RV_Mudanca_domicilio_esp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Moradia_regular"; InternalName="Moradia_regular"; Type="Boolean" },
            [PSCustomObject]@{ DisplayName="Moradia_Irregular"; InternalName="Moradia_Irregular"; Type="Boolean" },
            [PSCustomObject]@{ DisplayName="Moradia_Emergencial"; InternalName="Moradia_Emergencial"; Type="Boolean" },
            [PSCustomObject]@{ DisplayName="Fatores_risco_ambiental_infra"; InternalName="Fatores_risco_ambiental_infra"; Type="Boolean" },
            [PSCustomObject]@{ DisplayName="Conflitos_Urbanos_Criminalidade"; InternalName="Conflitos_Urbanos_Criminalidade"; Type="Boolean" },
            [PSCustomObject]@{ DisplayName="Conflitos_fundiarios_Agrarios"; InternalName="Conflitos_fundiarios_Agrarios"; Type="Boolean" },
            [PSCustomObject]@{ DisplayName="Fatores_risco_outros"; InternalName="Fatores_risco_outros"; Type="Boolean" },
            [PSCustomObject]@{ DisplayName="Tempo_Situacao_Rua"; InternalName="Tempo_Situacao_Rua"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Sit_Rua_Risco_Violencia"; InternalName="Sit_Rua_Risco_Violencia"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Tem_Contato_Familiar"; InternalName="Tem_Contato_Familiar"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Frequenta_Instituicao_Acolhimento"; InternalName="Frequenta_Instituicao_Acolhimento"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Especifique_Instituicao_Acolhimento"; InternalName="Especifique_Instituicao_Acolhimento"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Expectativas_Futuro"; InternalName="Expectativas_Futuro"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Nomes_Vinculos_Afetivos"; InternalName="Nomes_Vinculos_Afetivos"; Type="Text" }
        )
    },
    
    # === LISTA 21 ===
[PSCustomObject]@{
        Title   = "SAVe_Assistencia"
        Url     = "Listas/SAVe_Assistencia"
        Columns = @(
            [PSCustomObject]@{ DisplayName="ID_Caso"; InternalName="ID_Caso"; Type="Number" },
            [PSCustomObject]@{ DisplayName="Cad_unico"; InternalName="Cad_unico"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Status_cad_unico"; InternalName="Status_cad_unico"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SPSB_Acesso_cras"; InternalName="SPSB_Acesso_cras"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SPSB_Contato_cras_nome"; InternalName="SPSB_Contato_cras_nome"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SPSB_Contato_cras_tel"; InternalName="SPSB_Contato_cras_tel"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SPSB_Contato_cras_email"; InternalName="SPSB_Contato_cras_email"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SPSB_Nome_servico"; InternalName="SPSB_Nome_servico"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SPSB_Endereco_servico"; InternalName="SPSB_Endereco_servico"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SPSB_Servicos_acessados"; InternalName="SPSB_Servicos_acessados"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SPSEMC_Acesso_creas"; InternalName="SPSEMC_Acesso_creas"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SPSEMC_Contato_creas_nome"; InternalName="SPSEMC_Contato_creas_nome"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SPSEMC_Contato_creas_tel"; InternalName="SPSEMC_Contato_creas_tel"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SPSEMC_Contato_creas_email"; InternalName="SPSEMC_Contato_creas_email"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SPSEMC_Nome_servico"; InternalName="SPSEMC_Nome_servico"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SPSEMC_Endereco_servico"; InternalName="SPSEMC_Endereco_servico"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SPSEMC_Servicos_acessados"; InternalName="SPSEMC_Servicos_acessados"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SPSEAC_Inserido_acolhimentoInst"; InternalName="SPSEAC_Inserido_acolhimentoInst"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SPSEAC_Inserido_acolhimentorep"; InternalName="SPSEAC_Inserido_acolhimentorep"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SPSEAC_acolhimentorep_desc"; InternalName="SPSEAC_acolhimentorep_desc"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SPSEAC_Modalidade_acolhimentoInst"; InternalName="SPSEAC_Modalidade_acolhimentoInst"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SPSEAC_Inserido_familia"; InternalName="SPSEAC_Inserido_familia"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SPSEAC_nome_familia"; InternalName="SPSEAC_nome_familia"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SPSEAC_Inserido_calamidade"; InternalName="SPSEAC_Inserido_calamidade"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SPSEAC_desc_calamidade"; InternalName="SPSEAC_desc_calamidade"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SPSEAC_tec_ref_nome"; InternalName="SPSEAC_tec_ref_nome"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SPSEAC_tec_ref_tel"; InternalName="SPSEAC_tec_ref_tel"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SPSEAC_tec_ref_email"; InternalName="SPSEAC_tec_ref_email"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SPSEAC_nome_servico"; InternalName="SPSEAC_nome_servico"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SPSEAC_endereco_servico"; InternalName="SPSEAC_endereco_servico"; Type="Text" },
            [PSCustomObject]@{ DisplayName="BSA_recebe_beneficios"; InternalName="BSA_recebe_beneficios"; Type="Text" },
            [PSCustomObject]@{ DisplayName="BSA_Tipo_beneficio"; InternalName="BSA_Tipo_beneficio"; Type="Text" },
            [PSCustomObject]@{ DisplayName="BSA_transf_renda_inf"; InternalName="BSA_transf_renda_inf"; Type="Text" },
            [PSCustomObject]@{ DisplayName="BSA_transf_renda_esp"; InternalName="BSA_transf_renda_esp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="BSA_Ben_trab_inf"; InternalName="BSA_Ben_trab_inf"; Type="Text" },
            [PSCustomObject]@{ DisplayName="BSA_Ben_trab_esp"; InternalName="BSA_Ben_trab_esp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="BSA_Ben_hab_inf"; InternalName="BSA_Ben_hab_inf"; Type="Text" },
            [PSCustomObject]@{ DisplayName="BSA_Ben_hab_esp"; InternalName="BSA_Ben_hab_esp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="BSA_Ben_as_inf"; InternalName="BSA_Ben_as_inf"; Type="Text" },
            [PSCustomObject]@{ DisplayName="BSA_Ben_as_esp"; InternalName="BSA_Ben_as_esp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="BSA_Ben_educ_inf"; InternalName="BSA_Ben_educ_inf"; Type="Text" },
            [PSCustomObject]@{ DisplayName="BSA_Ben_educ_esp"; InternalName="BSA_Ben_educ_esp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="BSA_Ben_atr_inf"; InternalName="BSA_Ben_atr_inf"; Type="Text" },
            [PSCustomObject]@{ DisplayName="BSA_Ben_atr_esp"; InternalName="BSA_Ben_atr_esp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="BSA_Ben_pdi_inf"; InternalName="BSA_Ben_pdi_inf"; Type="Text" },
            [PSCustomObject]@{ DisplayName="BSA_Ben_pdi_esp"; InternalName="BSA_Ben_pdi_esp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="BSA_Ben_emer_inf"; InternalName="BSA_Ben_emer_inf"; Type="Text" },
            [PSCustomObject]@{ DisplayName="BSA_Ben_emer_esp"; InternalName="BSA_Ben_emer_esp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="BSA_outras_formas"; InternalName="BSA_outras_formas"; Type="Text" },
            [PSCustomObject]@{ DisplayName="BSA_direito_beneficios"; InternalName="BSA_direito_beneficios"; Type="Text" },
            [PSCustomObject]@{ DisplayName="BSA_direito_beneficios_esp"; InternalName="BSA_direito_beneficios_esp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="BSA_seg_alimentar"; InternalName="BSA_seg_alimentar"; Type="Text" },
            [PSCustomObject]@{ DisplayName="BSA_demandas_assist"; InternalName="BSA_demandas_assist"; Type="Text" },
            [PSCustomObject]@{ DisplayName="BSA_demandas_assist_desc"; InternalName="BSA_demandas_assist_desc"; Type="Text" },
            [PSCustomObject]@{ DisplayName="BSA_tec_ref_nome"; InternalName="BSA_tec_ref_nome"; Type="Text" },
            [PSCustomObject]@{ DisplayName="BSA_tec_ref_tel"; InternalName="BSA_tec_ref_tel"; Type="Text" },
            [PSCustomObject]@{ DisplayName="BSA_tec_ref_email"; InternalName="BSA_tec_ref_email"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SPSB_Servicos_acessados_esp"; InternalName="SPSB_Servicos_acessados_esp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="SPSEMC_Servicos_acessados_esp"; InternalName="SPSEMC_Servicos_acessados_esp"; Type="Text" }
        )
    },
    
    # === LISTA 22 === 
[PSCustomObject]@{
        Title   = "SAVe_Ensino-trab-renda"
        Url     = "Listas/SAVe_Ensino-trab-renda"
        Columns = @(
            [PSCustomObject]@{ DisplayName="ID_Caso"; InternalName="ID_Caso"; Type="Number" },
            [PSCustomObject]@{ DisplayName="Grau_escolaridade"; InternalName="Grau_escolaridade"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Estuda_atualmente"; InternalName="Estuda_atualmente"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Tipo_instituicao"; InternalName="Tipo_instituicao"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Nome_instituicao"; InternalName="Nome_instituicao"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Retorno_estudos"; InternalName="Retorno_estudos"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Situacao_trabalho"; InternalName="Situacao_trabalho"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Esta_Afastado"; InternalName="Esta_Afastado"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Motivo_afastamento"; InternalName="Motivo_afastamento"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Valor_renda"; InternalName="Valor_renda"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Valor_renda_esp"; InternalName="Valor_renda_esp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="TR_Prejuizo_trabalho"; InternalName="TR_Prejuizo_trabalho"; Type="Text" },
            [PSCustomObject]@{ DisplayName="TR_tipo_prejuizo"; InternalName="TR_tipo_prejuizo"; Type="Text" },
            [PSCustomObject]@{ DisplayName="TR_descricao_prejuizo"; InternalName="TR_descricao_prejuizo"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PT_prejuizo_patrimonio"; InternalName="PT_prejuizo_patrimonio"; Type="Text" },
            [PSCustomObject]@{ DisplayName="PT_Descricao_pp"; InternalName="PT_Descricao_pp"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VE_prejuizo_escolar"; InternalName="VE_prejuizo_escolar"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VE_tipo_PE"; InternalName="VE_tipo_PE"; Type="Text" },
            [PSCustomObject]@{ DisplayName="VE_descricao_pe"; InternalName="VE_descricao_pe"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Desc_demanda_educacional"; InternalName="Desc_demanda_educacional"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Desc_demanda_trabalhista"; InternalName="Desc_demanda_trabalhista"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Motivo_Afastamento_Detalhado"; InternalName="Motivo_Afastamento_Detalhado"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Demanda_educacional"; InternalName="Demanda_educacional"; Type="Boolean" },
            [PSCustomObject]@{ DisplayName="Demanda_trabalhista"; InternalName="Demanda_trabalhista"; Type="Boolean" }
        )
    },
    
    # === LISTA 23 ===
[PSCustomObject]@{
        Title   = "SAVe_Vinculos_Apoio"
        Url     = "Listas/SAVe_Vinculos_Apoio"
        Columns = @(
            [PSCustomObject]@{ DisplayName="ID_Caso"; InternalName="ID_Caso"; Type="Number" },
            [PSCustomObject]@{ DisplayName="AVF_Grau_Parentesco"; InternalName="AVF_Grau_Parentesco"; Type="Text" },
            [PSCustomObject]@{ DisplayName="AVF_Nome"; InternalName="AVF_Nome"; Type="Text" },
            [PSCustomObject]@{ DisplayName="AVF_Data_Nasc"; InternalName="AVF_Data_Nasc"; Type="DateTime"; Options=@{DisplayFormat="DateOnly"} },
            [PSCustomObject]@{ DisplayName="AVF_Idade"; InternalName="AVF_Idade"; Type="Number" },
            [PSCustomObject]@{ DisplayName="AVF_Escolaridade"; InternalName="AVF_Escolaridade"; Type="Text" },
            [PSCustomObject]@{ DisplayName="AVF_Ocupacao"; InternalName="AVF_Ocupacao"; Type="Text" },
            [PSCustomObject]@{ DisplayName="AVF_Renda"; InternalName="AVF_Renda"; Type="Text" },
            [PSCustomObject]@{ DisplayName="AVF_Alt_Vinculo_Pos_Violencia"; InternalName="AVF_Alt_Vinculo_Pos_Violencia"; Type="Text" },
            [PSCustomObject]@{ DisplayName="AVF_Presenciou_Violencia"; InternalName="AVF_Presenciou_Violencia"; Type="Boolean" },
            [PSCustomObject]@{ DisplayName="AVF_Mora_Com_Vitima"; InternalName="AVF_Mora_Com_Vitima"; Type="Boolean" },
            [PSCustomObject]@{ DisplayName="AVF_Conhecimento_Fato"; InternalName="AVF_Conhecimento_Fato"; Type="Boolean" },
            [PSCustomObject]@{ DisplayName="AVF_Rede_Apoio"; InternalName="AVF_Rede_Apoio"; Type="Boolean" }
        )
    },
    
    # === LISTA 24 ===
[PSCustomObject]@{
        Title   = "SAVe_Casos_Vinculados"
        Url     = "Listas/SAVe_Casos_Vinculados"
        Columns = @(
            [PSCustomObject]@{ DisplayName="ID_Caso"; InternalName="ID_Caso"; Type="Number" },
            [PSCustomObject]@{ DisplayName="Casos_Relacionados"; InternalName="Casos_Relacionados"; Type="Note" }
        )
    },
    # A lista SAVe_Responsaveis DEVE ser criada ANTES de SAVe_Acompanhamentos
    
    # === LISTA 25 ===
[PSCustomObject]@{
        Title   = "SAVe_Responsaveis"
        Url     = "Listas/SAVe_Responsaveis"
        Columns = @(
            [PSCustomObject]@{ DisplayName="Cargo"; InternalName="Cargo"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Area"; InternalName="Area"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Nome"; InternalName="Nome"; Type="Text" }
        )
    },
    
    # === LISTA 26 ===
[PSCustomObject]@{
        Title   = "SAVe_Acompanhamentos"
        Url     = "Listas/SAVe_Acompanhamentos"
        Columns = @(
            [PSCustomObject]@{ DisplayName="ID_Caso"; InternalName="ID_Caso"; Type="Number" },
            [PSCustomObject]@{ DisplayName="Tipo_Atendimento"; InternalName="Tipo_Atendimento"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Sintese"; InternalName="Sintese"; Type="Note" },
            [PSCustomObject]@{ DisplayName="Encaminhamento"; InternalName="Encaminhamento"; Type="Note" },
            [PSCustomObject]@{ DisplayName="Encaminhamento_Rede"; InternalName="Encaminhamento_Rede"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Especifique_Encaminhamento"; InternalName="Especifique_Encaminhamento"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Data"; InternalName="Data"; Type="DateTime"; Options=@{DisplayFormat="DateTime"} },
            [PSCustomObject]@{ DisplayName="Responsaveis"; InternalName="Responsaveis"; Type="Lookup"; Options=@{LookupList="SAVe_Responsaveis"; LookupField="Nome"; AllowMultipleValues = $true} }
        )
    },
    
    # === LISTA 27 ===
[PSCustomObject]@{
        Title   = "SAVe_Usuarios"
        Url     = "Listas/SAVe_Usuarios"
        Columns = @(
            [PSCustomObject]@{ DisplayName="Cargo"; InternalName="Cargo"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Usuario"; InternalName="Usuario"; Type="User" }
        )
    },
    
    # === LISTA 28 ===
[PSCustomObject]@{
        Title   = "SAVe_Logs_Acesso"
        Url     = "Listas/SAVe_Logs_Acesso"
        Columns = @(
            [PSCustomObject]@{ DisplayName="email"; InternalName="email"; Type="Text" },
            [PSCustomObject]@{ DisplayName="Tema"; InternalName="Tema"; Type="Note" }
        )
    }
)


# --- INÍCIO DO SCRIPT DE EXECUÇÃO ---
try {
    # 1. Conexão com o site
    Write-Host "Conectando ao site: $SiteURL" -ForegroundColor Cyan
    #Connect-PnPOnline -Url $SiteURL -Interactive
    Connect-PnPOnline -Url $SiteURL -UseWebLogin

    # 2. Laço de repetição para criar cada lista definida acima
    foreach ($listConfig in $ListConfigurations) {
        $ListName = $listConfig.Title
        
        Write-Host "--------------------------------------------------------"
        Write-Host "Processando a lista: $ListName" -ForegroundColor White
        
        # Verifica se a lista já existe
        $listExists = Get-PnPList -Identity $ListName -ErrorAction SilentlyContinue
        if ($listExists) {
            Write-Host "A lista '$ListName' já existe neste site. Pulando..." -ForegroundColor Yellow
        }
        else {
            # 3. Cria a lista base
            Write-Host "Criando a lista '$ListName'..." -ForegroundColor Green
            New-PnPList -Title $ListName -Url $listConfig.Url -Template GenericList

	    Write-Host "  -> Configurando a coluna 'Título' como opcional..."
	    Set-PnPField -List $ListName -Identity "Title" -Values @{Required = $false}

            # 4. Laço de repetição para adicionar as colunas desta lista
if ($listConfig.Columns.Count -gt 0) {
    Write-Host "Adicionando colunas para a lista '$ListName'..." -ForegroundColor Green
    
    foreach ($column in $listConfig.Columns) {
        Write-Host "  -> Adicionando coluna: $($column.DisplayName)"
        
        # --- LÓGICA CORRIGIDA E FINAL ---

        # Verifica se a coluna é do tipo Lookup
        if ($column.Type -eq "Lookup" -and $column.PSObject.Properties.Name -contains 'Options') {
            
            # Busca a lista de destino para obter seu ID (GUID)
            $lookupList = Get-PnPList -Identity $column.Options.LookupList
            $internalName = $column.InternalName -replace '[^a-zA-Z0-9_]', ''
            $schemaXml = ""

            # CASO 1: É uma coluna de Pesquisa com MÚLTIPLAS seleções
            if ($column.Options.AllowMultipleValues -eq $true) {
                Write-Host "     (Tipo: Lookup com Múltipla Seleção)" -ForegroundColor Yellow
                # Monta o SchemaXml. Note o Type="LookupMulti" e Mult="TRUE"
                $schemaXml = '<Field Type="LookupMulti" DisplayName="' + $column.DisplayName + '" Name="' + $internalName + '" List="{' + $lookupList.Id + '}" ShowField="' + $column.Options.LookupField + '" Mult="TRUE" Required="FALSE" />'
            }
            # CASO 2: É uma coluna de Pesquisa com seleção ÚNICA
            else {
                Write-Host "     (Tipo: Lookup com Seleção Única)" -ForegroundColor Yellow
                # Monta o SchemaXml com Type="Lookup"
                $schemaXml = '<Field Type="Lookup" DisplayName="' + $column.DisplayName + '" Name="' + $internalName + '" List="{' + $lookupList.Id + '}" ShowField="' + $column.Options.LookupField + '" Required="FALSE" />'
            }
            
            # Adiciona o campo usando o comando para XML
            Add-PnPFieldFromXml -List $ListName -FieldXml $schemaXml
        }
        # CASO 3: Todos os outros tipos de coluna (Text, Note, Number, etc.)
        else {
            # Constrói os parâmetros para o comando Add-PnPField dinamicamente
            $fieldParams = @{
                List             = $ListName
                DisplayName      = $column.DisplayName
                InternalName     = $column.InternalName -replace '[^a-zA-Z0-9_]', ''
                Type             = $column.Type
                AddToDefaultView = $true
            }
            if ($column.PSObject.Properties.Name -contains 'Choices') { $fieldParams.Add("Choices", $column.Choices) }
            if ($column.PSObject.Properties.Name -contains 'DefaultValue') { $fieldParams.Add("DefaultValue", $column.DefaultValue) }
            if ($column.PSObject.Properties.Name -contains 'Required' -and $column.Required) { $fieldParams.Add("Required", $true) }

            # Executa o comando normal para todos os outros tipos de campo
            Add-PnPField @fieldParams
        }
    }
}
            Write-Host "Lista '$ListName' e suas colunas foram criadas com sucesso!" -ForegroundColor Green
        }
    }
}
catch {
    # Captura qualquer erro que possa ocorrer durante o processo
    Write-Host "Ocorreu um erro: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    # 5. Desconecta a sessão
    Write-Host "--------------------------------------------------------"
    Write-Host "Desconectando a sessão do SharePoint." -ForegroundColor Cyan
    Disconnect-PnPOnline
}

# ===============================================
# FINALIZAÇÃO
# ===============================================
Write-Host "Desconectando do SharePoint..." -ForegroundColor Cyan
Disconnect-PnPOnline
Write-Host "Sessão encerrada com sucesso!" -ForegroundColor Green
