package models

import (
	"time"
)

type SAVe_Geral struct {
	ID_Caso           int    `gorm:"primaryKey;column:\"ID_Caso\"" json:"ID_Caso"`
	Num_Processo      string `gorm:"column:\"Num_Processo\"" json:"Num_Processo"`
	Tipo_Vitima       string `gorm:"column:\"Tipo_Vitima\"" json:"Tipo_Vitima"`
	Comarca           string `gorm:"column:\"Comarca\"" json:"Comarca"`
	Data              string `gorm:"column:\"Data\"" json:"Data"`
	Tipo_Form         string `gorm:"column:\"Tipo_Form\"" json:"Tipo_Form"`
	Anexos_Info       string `gorm:"column:\"Anexos_Info\"" json:"Anexos_Info"`
	Paginas_Visitadas string `gorm:"column:\"Paginas_Visitadas\"" json:"Paginas_Visitadas"`
	Encerrado         string `gorm:"column:\"Encerrado\"" json:"Encerrado"`
	Nome              string `gorm:"column:\"Nome\"" json:"Nome"`
	Tipo_Crime        string `gorm:"column:\"Tipo_Crime\"" json:"Tipo_Crime"`
}

func (SAVe_Geral) TableName() string {
	return "\"SAVe_Geral\""
}

type SAVe_DadosDeEntrada struct {
	ID_Caso                      int    `gorm:"primaryKey;column:\"ID_Caso\"" json:"ID_Caso"`
	Data                         string `gorm:"column:\"Data\"" json:"Data"`
	Comarca_origem               string `gorm:"column:\"Comarca_origem\"" json:"Comarca_origem"`
	N_procedimento_MPE           string `gorm:"column:\"N_procedimento_MPE\"" json:"N_procedimento_MPE"`
	Quem_encaminha               string `gorm:"column:\"Quem_encaminha\"" json:"Quem_encaminha"`
	PE_nome                      string `gorm:"column:\"PE_nome\"" json:"PE_nome"`
	PE_telefone                  string `gorm:"column:\"PE_telefone\"" json:"PE_telefone"`
	PE_email                     string `gorm:"column:\"PE_email\"" json:"PE_email"`
	PE_cargo                     string `gorm:"column:\"PE_cargo\"" json:"PE_cargo"`
	Classificacao_crime          string `gorm:"column:\"Classificacao_crime\"" json:"Classificacao_crime"`
	Classificacao_vitima         string `gorm:"column:\"Classificacao_vitima\"" json:"Classificacao_vitima"`
	Vitimizacao                  string `gorm:"column:\"Vitimizacao\"" json:"Vitimizacao"`
	Crime_relacionado            string `gorm:"column:\"Crime_relacionado\"" json:"Crime_relacionado"`
	Observacao                   string `gorm:"column:\"Observacao\"" json:"Observacao"`
	Atendimento_Especial         string `gorm:"column:\"Atendimento_Especial\"" json:"Atendimento_Especial"`
	Vit_Terciaria_Origem         string `gorm:"column:\"Vit_Terciaria_Origem\"" json:"Vit_Terciaria_Origem"`
	Precisa_Atendimento_Esp      string `gorm:"column:\"Precisa_Atendimento_Esp\"" json:"Precisa_Atendimento_Esp"`
	Crime_relacionado_especifico string `gorm:"column:\"Crime_relacionado_especifico\"" json:"Crime_relacionado_especifico"`
	Possui_Relacionado           string `gorm:"column:\"Possui_Relacionado\"" json:"Possui_Relacionado"`
}

func (SAVe_DadosDeEntrada) TableName() string {
	return "\"SAVe_DadosDeEntrada\""
}

type SAVe_Identificacao struct {
	ID_Caso               int        `gorm:"primaryKey;column:\"ID_Caso\"" json:"ID_Caso"`
	Nome_RC               string     `gorm:"column:\"Nome_RC\"" json:"Nome_RC"`
	Data_nascimento       *time.Time `gorm:"column:\"Data_nascimento\"" json:"Data_nascimento"`
	Idade                 string     `gorm:"column:\"Idade\"" json:"Idade"`
	Nome_social_ancestral string     `gorm:"column:\"Nome_social_ancestral\"" json:"Nome_social_ancestral"`
	Filiacao_1            string     `gorm:"column:\"Filiacao_1\"" json:"Filiacao_1"`
	Filiacao_2            string     `gorm:"column:\"Filiacao_2\"" json:"Filiacao_2"`
	Como_querser_chamada  string     `gorm:"column:\"Como_querser_chamada\"" json:"Como_querser_chamada"`
	Naturalidade          string     `gorm:"column:\"Naturalidade\"" json:"Naturalidade"`
	Nacionalidade         string     `gorm:"column:\"Nacionalidade\"" json:"Nacionalidade"`
	DC_situacao           string     `gorm:"column:\"DC_situacao\"" json:"DC_situacao"`
	DC_CPF                string     `gorm:"column:\"DC_CPF\"" json:"DC_CPF"`
	DC_RG                 string     `gorm:"column:\"DC_RG\"" json:"DC_RG"`
	DC_CTPS               string     `gorm:"column:\"DC_CTPS\"" json:"DC_CTPS"`
	CC_Nome               string     `gorm:"column:\"CC_Nome\"" json:"CC_Nome"`
	CC_telefoneDDD        string     `gorm:"column:\"CC_telefoneDDD\"" json:"CC_telefoneDDD"`
	CC_vinculo            string     `gorm:"column:\"CC_vinculo\"" json:"CC_vinculo"`
	PPS_Sexo              string     `gorm:"column:\"PPS_Sexo\"" json:"PPS_Sexo"`
	PPS_idgenero          string     `gorm:"column:\"PPS_idgenero\"" json:"PPS_idgenero"`
	PPS_orientacao_sexual string     `gorm:"column:\"PPS_orientacao_sexual\"" json:"PPS_orientacao_sexual"`
	PPS_Raca_cor_etnia    string     `gorm:"column:\"PPS_Raca_cor_etnia\"" json:"PPS_Raca_cor_etnia"`
	PPS_religiao          string     `gorm:"column:\"PPS_religiao\"" json:"PPS_religiao"`
	PPS_estado_civil      string     `gorm:"column:\"PPS_estado_civil\"" json:"PPS_estado_civil"`
}

func (SAVe_Identificacao) TableName() string {
	return "\"SAVe_Identificacao\""
}

type SAVe_Identificacao_telefone struct {
	ID          int        `gorm:"primaryKey;autoIncrement;column:\"ID\"" json:"ID"`
	ID_Caso     int        `gorm:"column:\"ID_Caso\"" json:"ID_Caso"`
	Atualizado  *time.Time `gorm:"column:\"Atualizado\"" json:"Atualizado"`
	TelefoneDDD string     `gorm:"column:\"TelefoneDDD\"" json:"TelefoneDDD"`
}

func (SAVe_Identificacao_telefone) TableName() string {
	return "\"SAVe_Identificacao_telefone\""
}

type SAVe_Identificacao_email struct {
	ID         int        `gorm:"primaryKey;autoIncrement;column:\"ID\"" json:"ID"`
	ID_Caso    int        `gorm:"column:\"ID_Caso\"" json:"ID_Caso"`
	Atualizado *time.Time `gorm:"column:\"Atualizado\"" json:"Atualizado"`
	Email      string     `gorm:"column:\"Email\"" json:"Email"`
}

func (SAVe_Identificacao_email) TableName() string {
	return "\"SAVe_Identificacao_email\""
}

type SAVe_Identificacao_endereco struct {
	ID               int    `gorm:"primaryKey;autoIncrement;column:\"ID\"" json:"ID"`
	ID_Caso          int    `gorm:"column:\"ID_Caso\"" json:"ID_Caso"`
	Endereco         string `gorm:"column:\"Endereco\"" json:"Endereco"`
	Numero           string `gorm:"column:\"Numero\"" json:"Numero"`
	Complemento      string `gorm:"column:\"Complemento\"" json:"Complemento"`
	Bairro           string `gorm:"column:\"Bairro\"" json:"Bairro"`
	Cidade           string `gorm:"column:\"Cidade\"" json:"Cidade"`
	UF               string `gorm:"column:\"UF\"" json:"UF"`
	CEP              string `gorm:"column:\"CEP\"" json:"CEP"`
	Moradia_Situacao string `gorm:"column:\"Moradia_Situacao\"" json:"Moradia_Situacao"`
}

func (SAVe_Identificacao_endereco) TableName() string {
	return "\"SAVe_Identificacao_endereco\""
}

type SAVe_Usuarios struct {
	ID                 int       `gorm:"primaryKey;autoIncrement;column:id" json:"id"`
	Cargo              string    `gorm:"column:cargo" json:"cargo"`
	Usuario            string    `gorm:"column:usuario" json:"usuario"`
	Area               string    `gorm:"column:area" json:"area"`
	Email              string    `gorm:"unique;column:email" json:"email"`
	Password           string    `gorm:"column:password" json:"-"`
	Role               string    `gorm:"default:User;column:role" json:"role"`
	MustChangePassword bool      `gorm:"default:true;column:must_change_password" json:"must_change_password"`
	ProfileImage       string    `gorm:"column:profile_image" json:"profile_image"`
	CreatedAt          time.Time `gorm:"default:now();column:created_at" json:"created_at"`
	UpdatedAt          time.Time `gorm:"column:updated_at" json:"updated_at"`
}

func (SAVe_Usuarios) TableName() string {
	return "save_usuarios"
}

// Add other structs as needed...

type SAVe_Encerramento struct {
	ID_Caso            int    `gorm:"primaryKey;column:\"ID_Caso\"" json:"ID_Caso"`
	Observacao         string `gorm:"column:\"Observacao\"" json:"Observacao"`
	Data               string `gorm:"column:\"Data\"" json:"Data_Encerramento"`
	Forma_Encerramento string `gorm:"column:\"Forma_Encerramento_Caso\"" json:"Forma_Encerramento"`
	Especifique_Outros string `gorm:"column:\"Especifique_Outros\"" json:"Especifique_Outros"`
}

func (SAVe_Encerramento) TableName() string {
	return "\"SAVe_Encerramento\""
}

type SAVe_Casos_Vinculados struct {
	ID_Caso            int    `gorm:"primaryKey;column:\"ID_Caso\"" json:"ID_Caso"`
	Casos_Relacionados string `gorm:"column:\"Casos_Relacionados\"" json:"Casos_Relacionados"`
}

func (SAVe_Casos_Vinculados) TableName() string {
	return "\"SAVe_Casos_Vinculados\""
}

type SAVe_Situacao_Juridica struct {
	ID_Caso                        int    `gorm:"primaryKey;column:\"ID_Caso\"" json:"ID_Caso"`
	SJ_IP_PCNet                    string `gorm:"column:\"SJ_IP_PCNet\"" json:"SJ_IP_PCNet"`
	SJ_Auto_Judicial               string `gorm:"column:\"SJ_Auto_Judicial\"" json:"SJ_Auto_Judicial"`
	SJ_Num_MPMG                    string `gorm:"column:\"SJ_Num_MPMG\"" json:"SJ_Num_MPMG"`
	SJ_IP_PCNet_Classe_Tipo        string `gorm:"column:\"SJ_IP_PCNet_Classe_Tipo\"" json:"SJ_IP_PCNet_Classe_Tipo"`
	SJ_Auto_Judicial_Classe_Tipo   string `gorm:"column:\"SJ_Auto_Judicial_Classe_Tipo\"" json:"SJ_Auto_Judicial_Classe_Tipo"`
	SJ_Num_MPMG_Tipo               string `gorm:"column:\"SJ_Num_MPMG_Tipo\"" json:"SJ_Num_MPMG_Tipo"`
	SJ_REDS_Classe_Tipo            string `gorm:"column:\"SJ_REDS_Classe_Tipo\"" json:"SJ_REDS_Classe_Tipo"`
	SJ_Obs_Documentacao            string `gorm:"column:\"SJ_Obs_Documentacao\"" json:"SJ_Obs_Documentacao"`
	SJ_Medidas_Prot_Cautelar       string `gorm:"column:\"SJ_Medidas_Prot_Cautelar\"" json:"SJ_Medidas_Prot_Cautelar"`
	SJ_REDS                        string `gorm:"column:\"SJ_REDS\"" json:"SJ_REDS"`
	SJ_Num_Processo                string `gorm:"column:\"SJ_Num_Processo\"" json:"SJ_Num_Processo"`
	SJ_Vitima_Intimada             string `gorm:"column:\"SJ_Vitima_Intimada\"" json:"SJ_Vitima_Intimada"`
	SJ_Agressor_Intimado           string `gorm:"column:\"SJ_Agressor_Intimado\"" json:"SJ_Agressor_Intimado"`
	SJ_Compartilhado_Rede          string `gorm:"column:\"SJ_Compartilhado_Rede\"" json:"SJ_Compartilhado_Rede"`
	SJ_Relato_Descumprimento       string `gorm:"column:\"SJ_Relato_Descumprimento\"" json:"SJ_Relato_Descumprimento"`
	SJ_Descumprimento_Especif      string `gorm:"column:\"SJ_Descumprimento_Especif\"" json:"SJ_Descumprimento_Especif"`
	SJ_Autor_Maior_18              string `gorm:"column:\"SJ_Autor_Maior_18\"" json:"SJ_Autor_Maior_18"`
	SJ_Promotoria                  string `gorm:"column:\"SJ_Promotoria\"" json:"SJ_Promotoria"`
	SJ_Delegacia                   string `gorm:"column:\"SJ_Delegacia\"" json:"SJ_Delegacia"`
	SJ_Servidor_Referencia         string `gorm:"column:\"SJ_Servidor_Referencia\"" json:"SJ_Servidor_Referencia"`
	SJ_Promotor                    string `gorm:"column:\"SJ_Promotor\"" json:"SJ_Promotor"`
	SJ_Delegado                    string `gorm:"column:\"SJ_Delegado\"" json:"SJ_Delegado"`
	SJ_Juiz                        string `gorm:"column:\"SJ_Juiz\"" json:"SJ_Juiz"`
	SJ_Orgao_Julgador              string `gorm:"column:\"SJ_Orgao_Julgador\"" json:"SJ_Orgao_Julgador"`
	SJ_Contato_Promotor            string `gorm:"column:\"SJ_Contato_Promotor\"" json:"SJ_Contato_Promotor"`
	SJ_Contato_Delegado            string `gorm:"column:\"SJ_Contato_Delegado\"" json:"SJ_Contato_Delegado"`
	SJ_Contato_Juiz                string `gorm:"column:\"SJ_Contato_Juiz\"" json:"SJ_Contato_Juiz"`
	SJ_Tipo_Penal_Fatos            string `gorm:"column:\"SJ_Tipo_Penal_Fatos\"" json:"SJ_Tipo_Penal_Fatos"`
	SJ_Tipo_Penal_Autuacao_IP      string `gorm:"column:\"SJ_Tipo_Penal_Autuacao_IP\"" json:"SJ_Tipo_Penal_Autuacao_IP"`
	SJ_Tipo_Penal_Conclusao_IP     string `gorm:"column:\"SJ_Tipo_Penal_Conclusao_IP\"" json:"SJ_Tipo_Penal_Conclusao_IP"`
	SJ_Tipo_Penal_Denuncia_Repres  string `gorm:"column:\"SJ_Tipo_Penal_Denuncia_Repres\"" json:"SJ_Tipo_Penal_Denuncia_Repres"`
	SJ_Tipo_Penal_Audiencia        string `gorm:"column:\"SJ_Tipo_Penal_Audiencia\"" json:"SJ_Tipo_Penal_Audiencia"`
	SJ_Tipo_Penal_Sentenca         string `gorm:"column:\"SJ_Tipo_Penal_Sentenca\"" json:"SJ_Tipo_Penal_Sentenca"`
	SJ_Tipo_Penal_Transito_Julgado string `gorm:"column:\"SJ_Tipo_Penal_Transito_Julgado\"" json:"SJ_Tipo_Penal_Transito_Julgado"`
	SJ_Data_Fatos                  string `gorm:"column:\"SJ_Data_Fatos\"" json:"SJ_Data_Fatos"`
	SJ_Data_Autuacao_IP            string `gorm:"column:\"SJ_Data_Autuacao_IP\"" json:"SJ_Data_Autuacao_IP"`
	SJ_Data_Conclusao_IP           string `gorm:"column:\"SJ_Data_Conclusao_IP\"" json:"SJ_Data_Conclusao_IP"`
	SJ_Data_Denuncia_Repres        string `gorm:"column:\"SJ_Data_Denuncia_Repres\"" json:"SJ_Data_Denuncia_Repres"`
	SJ_Data_Audiencia              string `gorm:"column:\"SJ_Data_Audiencia\"" json:"SJ_Data_Audiencia"`
	SJ_Data_Sentenca               string `gorm:"column:\"SJ_Data_Sentenca\"" json:"SJ_Data_Sentenca"`
	SJ_Data_Transito_Julgado       string `gorm:"column:\"SJ_Data_Transito_Julgado\"" json:"SJ_Data_Transito_Julgado"`
}

func (SAVe_Situacao_Juridica) TableName() string {
	return "\"SAVe_Situacao_Juridica\""
}

type SAVe_Situacao_Juridica2 struct {
	ID_Caso int `gorm:"primaryKey;column:\"ID_Caso\"" json:"ID_Caso"`
}

func (SAVe_Situacao_Juridica2) TableName() string {
	return "\"SAVe_Situacao_Juridica2\""
}

type SAVe_Situacao_Juridica_Incluir_processo struct {
	ID               int    `gorm:"primaryKey;autoIncrement;column:\"ID\"" json:"ID"`
	ID_Caso          int    `gorm:"column:\"ID_Caso\"" json:"ID_Caso"`
	SJIP_Numero      string `gorm:"column:\"SJIP_Numero\"" json:"SJIP_Numero"`
	SJIP_Classe_Tipo string `gorm:"column:\"SJIP_Classe_Tipo\"" json:"SJIP_Classe_Tipo"`
}

func (SAVe_Situacao_Juridica_Incluir_processo) TableName() string {
	return "\"SAVe_Situacao_Juridica_Incluir_processo\""
}

type SAVe_Saude struct {
	ID_Caso                          int    `gorm:"primaryKey;column:\"ID_Caso\"" json:"ID_Caso"`
	HS_Pessoa_deficiencia            string `gorm:"column:\"HS_Pessoa_deficiencia\"" json:"HS_Pessoa_deficiencia"`
	HS_Pessoa_deficiencia_tipo       string `gorm:"column:\"HS_Pessoa_deficiencia_tipo\"" json:"HS_Pessoa_deficiencia_tipo"`
	HS_Condicao_saude                string `gorm:"column:\"HS_Condicao_saude\"" json:"HS_Condicao_saude"`
	HS_Condicao_saude_acompanhamento string `gorm:"column:\"HS_Condicao_saude_acompanhamento\"" json:"HS_Condicao_saude_acompanhamento"`
	HS_Condicao_saude_tipo           string `gorm:"column:\"HS_Condicao_saude_tipo\"" json:"HS_Condicao_saude_tipo"`
	HS_Cond_saude_nao_perma          string `gorm:"column:\"HS_Cond_saude_nao_perma\"" json:"HS_Cond_saude_nao_perma"`
	HS_Cond_saude_nao_perma_acomp    string `gorm:"column:\"HS_Cond_saude_nao_perma_acomp\"" json:"HS_Cond_saude_nao_perma_acomp"`
	HS_Cond_saude_nao_perma_desc     string `gorm:"column:\"HS_Cond_saude_nao_perma_desc\"" json:"HS_Cond_saude_nao_perma_desc"`
	HS_Aux_saude                     string `gorm:"column:\"HS_Aux_saude\"" json:"HS_Aux_saude"`
	HS_Aux_saude_acomp               string `gorm:"column:\"HS_Aux_saude_acomp\"" json:"HS_Aux_saude_acomp"`
	HS_Aux_saude_desc                string `gorm:"column:\"HS_Aux_saude_desc\"" json:"HS_Aux_saude_desc"`
	HS_Vitim_sexual                  string `gorm:"column:\"HS_Vitim_sexual\"" json:"HS_Vitim_sexual"`
	HS_Vitim_sexual_acomp            string `gorm:"column:\"HS_Vitim_sexual_acomp\"" json:"HS_Vitim_sexual_acomp"`
	HS_Vitim_sexual_desc             string `gorm:"column:\"HS_Vitim_sexual_desc\"" json:"HS_Vitim_sexual_desc"`
	HS_Medic_continua                string `gorm:"column:\"HS_Medic_continua\"" json:"HS_Medic_continua"`
	HS_Medic_continua_desc           string `gorm:"column:\"HS_Medic_continua_desc\"" json:"HS_Medic_continua_desc"`
	HS_Medic_psiq                    string `gorm:"column:\"HS_Medic_psiq\"" json:"HS_Medic_psiq"`
	HS_Medic_psiq_desc               string `gorm:"column:\"HS_Medic_psiq_desc\"" json:"HS_Medic_psiq_desc"`
	FR_Alcool                        string `gorm:"column:\"FR_Alcool\"" json:"FR_Alcool"`
	FR_Alcool_freq                   string `gorm:"column:\"FR_Alcool_freq\"" json:"FR_Alcool_freq"`
	FR_Cigarro                       string `gorm:"column:\"FR_Cigarro\"" json:"FR_Cigarro"`
	FR_Cigarro_freq                  string `gorm:"column:\"FR_Cigarro_freq\"" json:"FR_Cigarro_freq"`
	FR_Subst_psicoativas             string `gorm:"column:\"FR_Subst_psicoativas\"" json:"FR_Subst_psicoativas"`
	FR_Subst_psicoativas_freq        string `gorm:"column:\"FR_Subst_psicoativas_freq\"" json:"FR_Subst_psicoativas_freq"`
	FR_Apoio                         string `gorm:"column:\"FR_Apoio\"" json:"FR_Apoio"`
	FR_Apoio_desc                    string `gorm:"column:\"FR_Apoio_desc\"" json:"FR_Apoio_desc"`
	RS_Acomp_publica                 string `gorm:"column:\"RS_Acomp_publica\"" json:"RS_Acomp_publica"`
	RS_Acomp_publica_tipo            string `gorm:"column:\"RS_Acomp_publica_tipo\"" json:"RS_Acomp_publica_tipo"`
	RS_Acomp_RAPS                    string `gorm:"column:\"RS_Acomp_RAPS\"" json:"RS_Acomp_RAPS"`
	RS_Acomp_RAPS_centro             string `gorm:"column:\"RS_Acomp_RAPS_centro\"" json:"RS_Acomp_RAPS_centro"`
	RS_Acomp_RAPS_especif            string `gorm:"column:\"RS_Acomp_RAPS_especif\"" json:"RS_Acomp_RAPS_especif"`
	RS_Plano_saude                   string `gorm:"column:\"RS_Plano_saude\"" json:"RS_Plano_saude"`
	RS_Plano_saude_especif           string `gorm:"column:\"RS_Plano_saude_especif\"" json:"RS_Plano_saude_especif"`
	RS_Contato_nome                  string `gorm:"column:\"RS_Contato_nome\"" json:"RS_Contato_nome"`
	RS_Contato_telefone              string `gorm:"column:\"RS_Contato_telefone\"" json:"RS_Contato_telefone"`
	RS_Contato_email                 string `gorm:"column:\"RS_Contato_email\"" json:"RS_Contato_email"`
	IV_Houve_Impacto_Saude           string `gorm:"column:\"IV_Houve_Impacto_Saude\"" json:"IV_Houve_Impacto_Saude"`
	IV_Lesoes_Nao_Fatais             bool   `gorm:"column:\"IV_Lesoes_Nao_Fatais\"" json:"IV_Lesoes_Nao_Fatais"`
	IV_Defic_vitimizacao             string `gorm:"column:\"IV_Defic_vitimizacao\"" json:"IV_Defic_vitimizacao"`
	IV_Defic_vitimizacao_tipo        string `gorm:"column:\"IV_Defic_vitimizacao_tipo\"" json:"IV_Defic_vitimizacao_tipo"`
	IV_Problemas_De_Saude            bool   `gorm:"column:\"IV_Problemas_De_Saude\"" json:"IV_Problemas_De_Saude"`
	IV_Comp_Cogn_Comport             bool   `gorm:"column:\"IV_Comp_Cogn_Comport\"" json:"IV_Comp_Cogn_Comport"`
	IV_Comp_Cogn_Comport_tipo        string `gorm:"column:\"IV_Comp_Cogn_Comport_tipo\"" json:"IV_Comp_Cogn_Comport_tipo"`
	IV_Outro                         bool   `gorm:"column:\"IV_Outro\"" json:"IV_Outro"`
	IV_Outro_espec                   string `gorm:"column:\"IV_Outro_espec\"" json:"IV_Outro_espec"`
	IV_Impacto_Saude_Mental_tipos    string `gorm:"column:\"IV_Impacto_Saude_Mental_tipos\"" json:"IV_Impacto_Saude_Mental_tipos"`
	IV_ISTOutros_esp                 string `gorm:"column:\"IV_ISTOutros_esp\"" json:"IV_ISTOutros_esp"`
}

func (SAVe_Saude) TableName() string {
	return "\"SAVe_Saude\""
}
