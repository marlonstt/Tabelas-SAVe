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
	ID_Caso               int    `gorm:"primaryKey;column:\"ID_Caso\"" json:"ID_Caso"`
	Nome_RC               string `gorm:"column:\"Nome_RC\"" json:"Nome_RC"`
	Data_nascimento       string `gorm:"column:\"Data_nascimento\"" json:"Data_nascimento"`
	Idade                 string `gorm:"column:\"Idade\"" json:"Idade"`
	Nome_social_ancestral string `gorm:"column:\"Nome_social_ancestral\"" json:"Nome_social_ancestral"`
	Filiacao_1            string `gorm:"column:\"Filiacao_1\"" json:"Filiacao_1"`
	Filiacao_2            string `gorm:"column:\"Filiacao_2\"" json:"Filiacao_2"`
	Como_querser_chamada  string `gorm:"column:\"Como_querser_chamada\"" json:"Como_querser_chamada"`
	Naturalidade          string `gorm:"column:\"Naturalidade\"" json:"Naturalidade"`
	Nacionalidade         string `gorm:"column:\"Nacionalidade\"" json:"Nacionalidade"`
	DC_situacao           string `gorm:"column:\"DC_situacao\"" json:"DC_situacao"`
	DC_CPF                string `gorm:"column:\"DC_CPF\"" json:"DC_CPF"`
	DC_RG                 string `gorm:"column:\"DC_RG\"" json:"DC_RG"`
	DC_CTPS               string `gorm:"column:\"DC_CTPS\"" json:"DC_CTPS"`
	CC_Nome               string `gorm:"column:\"CC_Nome\"" json:"CC_Nome"`
	CC_telefoneDDD        string `gorm:"column:\"CC_telefoneDDD\"" json:"CC_telefoneDDD"`
	CC_vinculo            string `gorm:"column:\"CC_vinculo\"" json:"CC_vinculo"`
	PPS_Sexo              string `gorm:"column:\"PPS_Sexo\"" json:"PPS_Sexo"`
	PPS_idgenero          string `gorm:"column:\"PPS_idgenero\"" json:"PPS_idgenero"`
	PPS_orientacao_sexual string `gorm:"column:\"PPS_orientacao_sexual\"" json:"PPS_orientacao_sexual"`
	PPS_Raca_cor_etnia    string `gorm:"column:\"PPS_Raca_cor_etnia\"" json:"PPS_Raca_cor_etnia"`
	PPS_religiao          string `gorm:"column:\"PPS_religiao\"" json:"PPS_religiao"`
	PPS_estado_civil      string `gorm:"column:\"PPS_estado_civil\"" json:"PPS_estado_civil"`
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
	return "\"SAVe_Usuarios\""
}

type SAVe_Encerramento struct {
	ID_Caso                 int    `gorm:"primaryKey;column:\"ID_Caso\"" json:"ID_Caso"`
	Observacao              string `gorm:"column:\"Observacao\"" json:"Observacao"`
	Data                    string `gorm:"column:\"Data\"" json:"Data_Encerramento"`
	Forma_Encerramento      string `gorm:"column:\"Forma_Encerramento_Caso\"" json:"Forma_Encerramento"`
	Especifique_Outros      string `gorm:"column:\"Especifique_Outros\"" json:"Especifique_Outros"`
	Encaminhamento_Pos_Alta string `gorm:"column:\"Encaminhamento_Pos_Alta\"" json:"Encaminhamento_Pos_Alta"`
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
	SJ_Hora_Crime                  string `gorm:"column:\"SJ_Hora_Crime\"" json:"SJ_Hora_Crime"`
	SJ_Dia_Semana                  string `gorm:"column:\"SJ_Dia_Semana\"" json:"SJ_Dia_Semana"`
	SJ_Local_Crime                 string `gorm:"column:\"SJ_Local_Crime\"" json:"SJ_Local_Crime"`
	SJ_Local_Crime_Especif         string `gorm:"column:\"SJ_Local_Crime_Especif\"" json:"SJ_Local_Crime_Especif"`
	SJ_Obs_Crime                   string `gorm:"column:\"SJ_Obs_Crime\"" json:"SJ_Obs_Crime"`
	SJ_Fase_Persecucao_Penal       string `gorm:"column:\"SJ_Fase_Persecucao_Penal\"" json:"SJ_Fase_Persecucao_Penal"`
	SJ_Fase_Judicial_Especif       string `gorm:"column:\"SJ_Fase_Judicial_Especif\"" json:"SJ_Fase_Judicial_Especif"`
	SJ_Status_Juridico_Autor       string `gorm:"column:\"SJ_Status_Juridico_Autor\"" json:"SJ_Status_Juridico_Autor"`
}

func (SAVe_Situacao_Juridica) TableName() string {
	return "\"SAVe_Situacao_Juridica\""
}

type SAVe_Situacao_Juridica2 struct {
	ID_Caso                                                           int    `gorm:"primaryKey;column:\"ID_Caso\"" json:"ID_Caso"`
	SJ2_Resultado_Julgamento                                          string `gorm:"column:\"SJ2_Resultado_Julgamento\"" json:"SJ2_Resultado_Julgamento"`
	SJ2_Tempo_Pena                                                    string `gorm:"column:\"SJ2_Tempo_Pena\"" json:"SJ2_Tempo_Pena"`
	SJ2_Inicio_Cumprimento                                            string `gorm:"column:\"SJ2_Inicio_Cumprimento\"" json:"SJ2_Inicio_Cumprimento"`
	SJ2_Regime                                                        string `gorm:"column:\"SJ2_Regime\"" json:"SJ2_Regime"`
	SJ2_Apuracao_Investigacao                                         string `gorm:"column:\"SJ2_Apuracao_Investigacao\"" json:"SJ2_Apuracao_Investigacao"`
	SJ2_Apuracao_Invest_Especif                                       string `gorm:"column:\"SJ2_Apuracao_Invest_Especif\"" json:"SJ2_Apuracao_Invest_Especif"`
	SJ2_Pedido_Reparacao_Denuncia                                     string `gorm:"column:\"SJ2_Pedido_Reparacao_Denuncia\"" json:"SJ2_Pedido_Reparacao_Denuncia"`
	SJ2_Tipo_Danos                                                    string `gorm:"column:\"SJ2_Tipo_Danos\"" json:"SJ2_Tipo_Danos"`
	SJ2_Tipo_Danos_Especif                                            string `gorm:"column:\"SJ2_Tipo_Danos_Especif\"" json:"SJ2_Tipo_Danos_Especif"`
	SJ2_Condenacao_Reparacao                                          string `gorm:"column:\"SJ2_Condenacao_Reparacao\"" json:"SJ2_Condenacao_Reparacao"`
	SJ2_Condenacao_Repar_Especif                                      string `gorm:"column:\"SJ2_Condenacao_Repar_Especif\"" json:"SJ2_Condenacao_Repar_Especif"`
	SJ2_Demanda_Info_Participacao                                     bool   `gorm:"column:\"SJ2_Demanda_Info_Participacao\"" json:"SJ2_Demanda_Info_Participacao"`
	SJ2_Demanda_Info_Participacao_Especif                             string `gorm:"column:\"SJ2_Demanda_Info_Participacao_Especif\"" json:"SJ2_Demanda_Info_Participacao_Especif"`
	SJ2_Demanda_Info_Participacao_Especif2                            string `gorm:"column:\"SJ2_Demanda_Info_Participacao_Especif2\"" json:"SJ2_Demanda_Info_Participacao_Especif2"`
	SJ2_Demanda_Memoria_Verdade                                       bool   `gorm:"column:\"SJ2_Demanda_Memoria_Verdade\"" json:"SJ2_Demanda_Memoria_Verdade"`
	SJ2_Demanda_Memoria_Verdade_Especif                               string `gorm:"column:\"SJ2_Demanda_Memoria_Verdade_Especif\"" json:"SJ2_Demanda_Memoria_Verdade_Especif"`
	SJ2_Demanda_Memoria_Verdade_Especif2                              string `gorm:"column:\"SJ2_Demanda_Memoria_Verdade_Especif2\"" json:"SJ2_Demanda_Memoria_Verdade_Especif2"`
	SJ2_Demanda_Justica_Diligencia                                    bool   `gorm:"column:\"SJ2_Demanda_Justica_Diligencia\"" json:"SJ2_Demanda_Justica_Diligencia"`
	SJ2_Demanda_Justica_Diligencia_Especif                            string `gorm:"column:\"SJ2_Demanda_Justica_Diligencia_Especif\"" json:"SJ2_Demanda_Justica_Diligencia_Especif"`
	SJ2_Demanda_Justica_Diligencia_Especif2                           string `gorm:"column:\"SJ2_Demanda_Justica_Diligencia_Especif2\"" json:"SJ2_Demanda_Justica_Diligencia_Especif2"`
	SJ2_Demanda_Apoio_Assistencia                                     bool   `gorm:"column:\"SJ2_Demanda_Apoio_Assistencia\"" json:"SJ2_Demanda_Apoio_Assistencia"`
	SJ2_Demanda_Apoio_Assistencia_Especif                             string `gorm:"column:\"SJ2_Demanda_Apoio_Assistencia_Especif\"" json:"SJ2_Demanda_Apoio_Assistencia_Especif"`
	SJ2_Demanda_Apoio_Assistencia_Especif2                            string `gorm:"column:\"SJ2_Demanda_Apoio_Assistencia_Especif2\"" json:"SJ2_Demanda_Apoio_Assistencia_Especif2"`
	SJ2_Demanda_Seguranca                                             bool   `gorm:"column:\"SJ2_Demanda_Seguranca\"" json:"SJ2_Demanda_Seguranca"`
	SJ2_Demanda_Seguranca_Especif                                     string `gorm:"column:\"SJ2_Demanda_Seguranca_Especif\"" json:"SJ2_Demanda_Seguranca_Especif"`
	SJ2_Demanda_Seguranca_Especif2                                    string `gorm:"column:\"SJ2_Demanda_Seguranca_Especif2\"" json:"SJ2_Demanda_Seguranca_Especif2"`
	SJ2_Demanda_Protecao_Nao_Revitimizacao                            bool   `gorm:"column:\"SJ2_Demanda_Protecao_Nao_Revitimizacao\"" json:"SJ2_Demanda_Protecao_Nao_Revitimizacao"`
	SJ2_Demanda_Protecao_Nao_Revitimizacao_Especif                    string `gorm:"column:\"SJ2_Demanda_Protecao_Nao_Revitimizacao_Especif\"" json:"SJ2_Demanda_Protecao_Nao_Revitimizacao_Especif"`
	SJ2_Demanda_Protecao_Nao_Revitimizacao_Especif2                   string `gorm:"column:\"SJ2_Demanda_Protecao_Nao_Revitimizacao_Especif2\"" json:"SJ2_Demanda_Protecao_Nao_Revitimizacao_Especif2"`
	SJ2_Demanda_Protecao_Nao_Revitimizacao_MedidasCautelares_Especif  string `gorm:"column:\"SJ2_Prot_Nao_Revit_Med_Caut_Especif\"" json:"SJ2_Demanda_Protecao_Nao_Revitimizacao_MedidasCautelares_Especif"`
	SJ2_Demanda_Protecao_Nao_Revitimizacao_MedidasCautelares_Especif2 string `gorm:"column:\"SJ2_Prot_Nao_Revit_Med_Caut_Especif2\"" json:"SJ2_Demanda_Protecao_Nao_Revitimizacao_MedidasCautelares_Especif2"`
	SJ2_Demanda_Protecao_Psicologica                                  bool   `gorm:"column:\"SJ2_Demanda_Protecao_Psicologica\"" json:"SJ2_Demanda_Protecao_Psicologica"`
	SJ2_Demanda_Protecao_Psicologica_Especif                          string `gorm:"column:\"SJ2_Demanda_Protecao_Psicologica_Especif\"" json:"SJ2_Demanda_Protecao_Psicologica_Especif"`
	SJ2_Demanda_Protecao_Psicologica_Especif2                         string `gorm:"column:\"SJ2_Demanda_Protecao_Psicologica_Especif2\"" json:"SJ2_Demanda_Protecao_Psicologica_Especif2"`
	SJ2_Demanda_Protecao_Documental                                   bool   `gorm:"column:\"SJ2_Demanda_Protecao_Documental\"" json:"SJ2_Demanda_Protecao_Documental"`
	SJ2_Demanda_Protecao_Documental_Especif                           string `gorm:"column:\"SJ2_Demanda_Protecao_Documental_Especif\"" json:"SJ2_Demanda_Protecao_Documental_Especif"`
	SJ2_Demanda_Protecao_Documental_Especif2                          string `gorm:"column:\"SJ2_Demanda_Protecao_Documental_Especif2\"" json:"SJ2_Demanda_Protecao_Documental_Especif2"`
	SJ2_Demanda_Compensacao_Reparacao                                 bool   `gorm:"column:\"SJ2_Demanda_Compensacao_Reparacao\"" json:"SJ2_Demanda_Compensacao_Reparacao"`
	SJ2_Demanda_Compensacao_Reparacao_Especif                         string `gorm:"column:\"SJ2_Demanda_Compensacao_Reparacao_Especif\"" json:"SJ2_Demanda_Compensacao_Reparacao_Especif"`
	SJ2_Demanda_Compensacao_Reparacao_Especif2                        string `gorm:"column:\"SJ2_Demanda_Compensacao_Reparacao_Especif2\"" json:"SJ2_Demanda_Compensacao_Reparacao_Especif2"`
	SJ2_Demanda_Compensacao_Reparacao_Especif_OutraForma              string `gorm:"column:\"SJ2_Demanda_Compensacao_Reparacao_Especif_OutraForma\"" json:"SJ2_Demanda_Compensacao_Reparacao_Especif_OutraForma"`
	SJ2_Demanda_Tratamento_Digno                                      bool   `gorm:"column:\"SJ2_Demanda_Tratamento_Digno\"" json:"SJ2_Demanda_Tratamento_Digno"`
	SJ2_Demanda_Tratamento_Digno_Especif                              string `gorm:"column:\"SJ2_Demanda_Tratamento_Digno_Especif\"" json:"SJ2_Demanda_Tratamento_Digno_Especif"`
	SJ2_Demanda_Tratamento_Digno_OutraForma                           string `gorm:"column:\"SJ2_Demanda_Tratamento_Digno_OutraForma\"" json:"SJ2_Demanda_Tratamento_Digno_OutraForma"`
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
	RFC_Familia_Vulnerab             string `gorm:"column:\"RFC_Familia_Vulnerab\"" json:"RFC_Familia_Vulnerab"`
	RFC_Vulnerab_especif             string `gorm:"column:\"RFC_Vulnerab_especif\"" json:"RFC_Vulnerab_especif"`
}

func (SAVe_Saude) TableName() string {
	return "\"SAVe_Saude\""
}

type SAVe_Habitacao_territorio struct {
	ID_Caso                                  int    `gorm:"primaryKey;column:\"ID_Caso\"" json:"ID_Caso"`
	Moradia_regular                          bool   `gorm:"column:\"Moradia_regular\"" json:"Moradia_regular"`
	Moradia_regular_esp                      string `gorm:"column:\"Moradia_regular_esp\"" json:"Moradia_regular_esp"`
	Moradia_Irregular                        bool   `gorm:"column:\"Moradia_Irregular\"" json:"Moradia_Irregular"`
	Moradia_Irregular_esp                    string `gorm:"column:\"Moradia_Irregular_esp\"" json:"Moradia_Irregular_esp"`
	Moradia_Emergencial                      bool   `gorm:"column:\"Moradia_Emergencial\"" json:"Moradia_Emergencial"`
	Moradia_Emergencial_esp                  string `gorm:"column:\"Moradia_Emergencial_esp\"" json:"Moradia_Emergencial_esp"`
	Territorio                               string `gorm:"column:\"Territorio\"" json:"Territorio"`
	Comunidade_tradicional                   string `gorm:"column:\"Comunidade_tradicional\"" json:"Comunidade_tradicional"`
	Comunidade_tradicional_esp               string `gorm:"column:\"Comunidade_tradicional_esp\"" json:"Comunidade_tradicional_esp"`
	Reconhecido_fund_palmares                string `gorm:"column:\"Reconhecido_fund_palmares\"" json:"Reconhecido_fund_palmares"`
	Reconhecido_orgao_publico                string `gorm:"column:\"Reconhecido_orgao_publico\"" json:"Reconhecido_orgao_publico"`
	Reconhecido_funai                        string `gorm:"column:\"Reconhecido_funai\"" json:"Reconhecido_funai"`
	Titulado_Incra                           string `gorm:"column:\"Titulado_Incra\"" json:"titulado_incra"`
	Estrutura_Mat_predominante               string `gorm:"column:\"Estrutura_Mat_predominante\"" json:"Estrutura_Mat_predominante"`
	Estrutura_Mat_predominante_esp           string `gorm:"column:\"Estrutura_Mat_predominante_esp\"" json:"Estrutura_Mat_predominante_esp"`
	Estrutura_Insta_eletricas_hidraulica     string `gorm:"column:\"Estrutura_Insta_eletricas_hidraulica\"" json:"Estrutura_Insta_eletricas_hidraulica"`
	Estrutura_Insta_eletricas_hidraulica_esp string `gorm:"column:\"Estrutura_Insta_eletricas_hidraulica_esp\"" json:"Estrutura_Insta_eletricas_hidraulica_esp"`
	Estrutura_paredes_revesti                string `gorm:"column:\"Estrutura_paredes_revesti\"" json:"Estrutura_paredes_revesti"`
	Estrutura_danos_eventos_naturais         string `gorm:"column:\"Estrutura_danos_eventos_naturais\"" json:"Estrutura_danos_eventos_naturais"`
	Estrutura_danos_eventos_naturais_esp     string `gorm:"column:\"Estrutura_danos_eventos_naturais_esp\"" json:"Estrutura_danos_eventos_naturais_esp"`
	Estrutura_Risco_geologico                string `gorm:"column:\"Estrutura_Risco_geologico\"" json:"Estrutura_Risco_geologico"`
	Estrutura_Risco_geologico_esp            string `gorm:"column:\"Estrutura_Risco_geologico_esp\"" json:"Estrutura_Risco_geologico_esp"`
	Estrutura_Acesso_internet                string `gorm:"column:\"Estrutura_Acesso_internet\"" json:"Estrutura_Acesso_internet"`
	Estrutura_Acesso_internet_esp            string `gorm:"column:\"Estrutura_Acesso_internet_esp\"" json:"Estrutura_Acesso_internet_esp"`
	Fatores_risco_ambiental_infra            bool   `gorm:"column:\"Fatores_risco_ambiental_infra\"" json:"Fatores_risco_ambiental_infra"`
	Fatores_risco_ambiental_infra_esp        string `gorm:"column:\"Fatores_risco_ambiental_infra_esp\"" json:"Fatores_risco_ambiental_infra_esp"`
	Conflitos_Urbanos_Criminalidade          bool   `gorm:"column:\"Conflitos_Urbanos_Criminalidade\"" json:"Conflitos_Urbanos_Criminalidade"`
	Conflitos_Urbanos_Criminalidade_esp      string `gorm:"column:\"Conflitos_Urbanos_Criminalidade_esp\"" json:"Conflitos_Urbanos_Criminalidade_esp"`
	Conflitos_fundiarios_Agrarios            bool   `gorm:"column:\"Conflitos_fundiarios_Agrarios\"" json:"Conflitos_fundiarios_Agrarios"`
	Conflitos_fundiarios_Agrarios_esp        string `gorm:"column:\"Conflitos_fundiarios_Agrarios_esp\"" json:"Conflitos_fundiarios_Agrarios_esp"`
	Fatores_risco_outros                     bool   `gorm:"column:\"Fatores_risco_outros\"" json:"Fatores_risco_outros"`
	Fatores_risco_outros_esp                 string `gorm:"column:\"Fatores_risco_outros_esp\"" json:"Fatores_risco_outros_esp"`
	RV_Mudanca_domicilio                     string `gorm:"column:\"RV_Mudanca_domicilio\"" json:"RV_Mudanca_domicilio"`
	RV_Mudanca_domicilio_esp                 string `gorm:"column:\"RV_Mudanca_domicilio_esp\"" json:"RV_Mudanca_domicilio_esp"`
}

func (SAVe_Habitacao_territorio) TableName() string {
	return "\"SAVe_Habitacao_territorio\""
}

type SAVe_Assistencia struct {
	ID                                uint      `gorm:"primaryKey" json:"ID"`
	ID_Caso                           uint      `gorm:"column:\"ID_Caso\"" json:"ID_Caso"`
	Cad_unico                         string    `gorm:"column:\"Cad_unico\"" json:"Cad_unico"`
	Status_cad_unico                  string    `gorm:"column:\"Status_cad_unico\"" json:"Status_cad_unico"`
	SPSB_Acesso_cras                  string    `gorm:"column:\"SPSB_Acesso_cras\"" json:"SPSB_Acesso_cras"`
	SPSB_Servicos_acessados           string    `gorm:"column:\"SPSB_Servicos_acessados\"" json:"SPSB_Servicos_acessados"`
	SPSB_Servicos_acessados_esp       string    `gorm:"column:\"SPSB_Servicos_acessados_esp\"" json:"SPSB_Servicos_acessados_esp"`
	SPSB_Contato_cras_nome            string    `gorm:"column:\"SPSB_Contato_cras_nome\"" json:"SPSB_Contato_cras_nome"`
	SPSB_Contato_cras_tel             string    `gorm:"column:\"SPSB_Contato_cras_tel\"" json:"SPSB_Contato_cras_tel"`
	SPSB_Contato_cras_email           string    `gorm:"column:\"SPSB_Contato_cras_email\"" json:"SPSB_Contato_cras_email"`
	SPSB_Nome_servico                 string    `gorm:"column:\"SPSB_Nome_servico\"" json:"SPSB_Nome_servico"`
	SPSB_Endereco_servico             string    `gorm:"column:\"SPSB_Endereco_servico\"" json:"SPSB_Endereco_servico"`
	SPSEMC_Acesso_creas               string    `gorm:"column:\"SPSEMC_Acesso_creas\"" json:"SPSEMC_Acesso_creas"`
	SPSEMC_Servicos_acessados         string    `gorm:"column:\"SPSEMC_Servicos_acessados\"" json:"SPSEMC_Servicos_acessados"`
	SPSEMC_Servicos_acessados_esp     string    `gorm:"column:\"SPSEMC_Servicos_acessados_esp\"" json:"SPSEMC_Servicos_acessados_esp"`
	SPSEMC_Contato_creas_nome         string    `gorm:"column:\"SPSEMC_Contato_creas_nome\"" json:"SPSEMC_Contato_creas_nome"`
	SPSEMC_Contato_creas_tel          string    `gorm:"column:\"SPSEMC_Contato_creas_tel\"" json:"SPSEMC_Contato_creas_tel"`
	SPSEMC_Contato_creas_email        string    `gorm:"column:\"SPSEMC_Contato_creas_email\"" json:"SPSEMC_Contato_creas_email"`
	SPSEMC_Nome_servico               string    `gorm:"column:\"SPSEMC_Nome_servico\"" json:"SPSEMC_Nome_servico"`
	SPSEMC_Endereco_servico           string    `gorm:"column:\"SPSEMC_Endereco_servico\"" json:"SPSEMC_Endereco_servico"`
	SPSEAC_Inserido_acolhimentoInst   string    `gorm:"column:\"SPSEAC_Inserido_acolhimentoInst\"" json:"SPSEAC_Inserido_acolhimentoInst"`
	SPSEAC_Modalidade_acolhimentoInst string    `gorm:"column:\"SPSEAC_Modalidade_acolhimentoInst\"" json:"SPSEAC_Modalidade_acolhimentoInst"`
	SPSEAC_Inserido_acolhimentorep    string    `gorm:"column:\"SPSEAC_Inserido_acolhimentorep\"" json:"SPSEAC_Inserido_acolhimentorep"`
	SPSEAC_acolhimentorep_desc        string    `gorm:"column:\"SPSEAC_acolhimentorep_desc\"" json:"SPSEAC_acolhimentorep_desc"`
	SPSEAC_Inserido_familia           string    `gorm:"column:\"SPSEAC_Inserido_familia\"" json:"SPSEAC_Inserido_familia"`
	SPSEAC_nome_familia               string    `gorm:"column:\"SPSEAC_nome_familia\"" json:"SPSEAC_nome_familia"`
	SPSEAC_Inserido_calamidade        string    `gorm:"column:\"SPSEAC_Inserido_calamidade\"" json:"SPSEAC_Inserido_calamidade"`
	SPSEAC_desc_calamidade            string    `gorm:"column:\"SPSEAC_desc_calamidade\"" json:"SPSEAC_desc_calamidade"`
	SPSEAC_tec_ref_nome               string    `gorm:"column:\"SPSEAC_tec_ref_nome\"" json:"SPSEAC_tec_ref_nome"`
	SPSEAC_tec_ref_tel                string    `gorm:"column:\"SPSEAC_tec_ref_tel\"" json:"SPSEAC_tec_ref_tel"`
	SPSEAC_tec_ref_email              string    `gorm:"column:\"SPSEAC_tec_ref_email\"" json:"SPSEAC_tec_ref_email"`
	SPSEAC_nome_servico               string    `gorm:"column:\"SPSEAC_nome_servico\"" json:"SPSEAC_nome_servico"`
	SPSEAC_endereco_servico           string    `gorm:"column:\"SPSEAC_endereco_servico\"" json:"SPSEAC_endereco_servico"`
	BSA_recebe_beneficios             string    `gorm:"column:\"BSA_recebe_beneficios\"" json:"BSA_recebe_beneficios"`
	BSA_Tipo_beneficio                string    `gorm:"column:\"BSA_Tipo_beneficio\"" json:"BSA_Tipo_beneficio"`
	BSA_transf_renda_inf              string    `gorm:"column:\"BSA_transf_renda_inf\"" json:"BSA_transf_renda_inf"`
	BSA_Ben_trab_inf                  string    `gorm:"column:\"BSA_Ben_trab_inf\"" json:"BSA_Ben_trab_inf"`
	BSA_Ben_hab_inf                   string    `gorm:"column:\"BSA_Ben_hab_inf\"" json:"BSA_Ben_hab_inf"`
	BSA_Ben_as_inf                    string    `gorm:"column:\"BSA_Ben_as_inf\"" json:"BSA_Ben_as_inf"`
	BSA_Ben_educ_inf                  string    `gorm:"column:\"BSA_Ben_educ_inf\"" json:"BSA_Ben_educ_inf"`
	BSA_Ben_atr_inf                   string    `gorm:"column:\"BSA_Ben_atr_inf\"" json:"BSA_Ben_atr_inf"`
	BSA_Ben_pdi_inf                   string    `gorm:"column:\"BSA_Ben_pdi_inf\"" json:"BSA_Ben_pdi_inf"`
	BSA_Ben_emer_inf                  string    `gorm:"column:\"BSA_Ben_emer_inf\"" json:"BSA_Ben_emer_inf"`
	BSA_transf_renda_esp              string    `gorm:"column:\"BSA_transf_renda_esp\"" json:"BSA_transf_renda_esp"`
	BSA_Ben_trab_esp                  string    `gorm:"column:\"BSA_Ben_trab_esp\"" json:"BSA_Ben_trab_esp"`
	BSA_Ben_hab_esp                   string    `gorm:"column:\"BSA_Ben_hab_esp\"" json:"BSA_Ben_hab_esp"`
	BSA_Ben_as_esp                    string    `gorm:"column:\"BSA_Ben_as_esp\"" json:"BSA_Ben_as_esp"`
	BSA_Ben_educ_esp                  string    `gorm:"column:\"BSA_Ben_educ_esp\"" json:"BSA_Ben_educ_esp"`
	BSA_Ben_atr_esp                   string    `gorm:"column:\"BSA_Ben_atr_esp\"" json:"BSA_Ben_atr_esp"`
	BSA_Ben_pdi_esp                   string    `gorm:"column:\"BSA_Ben_pdi_esp\"" json:"BSA_Ben_pdi_esp"`
	BSA_Ben_emer_esp                  string    `gorm:"column:\"BSA_Ben_emer_esp\"" json:"BSA_Ben_emer_esp"`
	BSA_outras_formas                 string    `gorm:"column:\"BSA_outras_formas\"" json:"BSA_outras_formas"`
	BSA_direito_beneficios            string    `gorm:"column:\"BSA_direito_beneficios\"" json:"BSA_direito_beneficios"`
	BSA_direito_beneficios_esp        string    `gorm:"column:\"BSA_direito_beneficios_esp\"" json:"BSA_direito_beneficios_esp"`
	BSA_demandas_assist               string    `gorm:"column:\"BSA_demandas_assist\"" json:"BSA_demandas_assist"`
	BSA_demandas_assist_desc          string    `gorm:"column:\"BSA_demandas_assist_desc\"" json:"BSA_demandas_assist_desc"`
	BSA_tec_ref_nome                  string    `gorm:"column:\"BSA_tec_ref_nome\"" json:"BSA_tec_ref_nome"`
	BSA_tec_ref_tel                   string    `gorm:"column:\"BSA_tec_ref_tel\"" json:"BSA_tec_ref_tel"`
	BSA_tec_ref_email                 string    `gorm:"column:\"BSA_tec_ref_email\"" json:"BSA_tec_ref_email"`
	BSA_seg_alimentar                 string    `gorm:"column:\"BSA_seg_alimentar\"" json:"BSA_seg_alimentar"`
	CreatedAt                         time.Time `json:"created_at"`
	UpdatedAt                         time.Time `json:"updated_at"`
}

func (SAVe_Assistencia) TableName() string {
	return "\"SAVe_Assistencia\""
}

type SAVe_Ensino_trab_renda struct {
	ID_Caso                      uint      `gorm:"primaryKey;column:\"ID_Caso\"" json:"ID_Caso"`
	Grau_escolaridade            string    `gorm:"column:\"Grau_escolaridade\"" json:"Grau_escolaridade"`
	Estuda_atualmente            string    `gorm:"column:\"Estuda_atualmente\"" json:"Estuda_atualmente"`
	Nome_instituicao             string    `gorm:"column:\"Nome_instituicao\"" json:"Nome_instituicao"`
	Tipo_instituicao             string    `gorm:"column:\"Tipo_instituicao\"" json:"Tipo_instituicao"`
	Retorno_estudos              string    `gorm:"column:\"Retorno_estudos\"" json:"Retorno_estudos"`
	Situacao_trabalho            string    `gorm:"column:\"Situacao_trabalho\"" json:"Situacao_trabalho"`
	Profissao                    string    `gorm:"column:\"Profissao\"" json:"Profissao"`
	Valor_renda                  string    `gorm:"column:\"Valor_renda\"" json:"Valor_renda"`
	Valor_renda_esp              string    `gorm:"column:\"Valor_renda_esp\"" json:"Valor_renda_esp"`
	TR_Prejuizo_trabalho         string    `gorm:"column:\"TR_Prejuizo_trabalho\"" json:"TR_Prejuizo_trabalho"`
	TR_tipo_prejuizo             string    `gorm:"column:\"TR_tipo_prejuizo\"" json:"TR_tipo_prejuizo"`
	TR_descricao_prejuizo        string    `gorm:"column:\"TR_descricao_prejuizo\"" json:"TR_descricao_prejuizo"`
	PT_prejuizo_patrimonio       string    `gorm:"column:\"PT_prejuizo_patrimonio\"" json:"PT_prejuizo_patrimonio"`
	PT_Descricao_pp              string    `gorm:"column:\"PT_Descricao_pp\"" json:"PT_Descricao_pp"`
	VE_prejuizo_escolar          string    `gorm:"column:\"VE_prejuizo_escolar\"" json:"VE_prejuizo_escolar"`
	VE_tipo_PE                   string    `gorm:"column:\"VE_tipo_PE\"" json:"VE_tipo_PE"`
	VE_descricao_pe              string    `gorm:"column:\"VE_descricao_pe\"" json:"VE_descricao_pe"`
	Demanda_educacional          bool      `gorm:"column:\"Demanda_educacional\"" json:"Demanda_educacional"`
	Desc_demanda_educacional     string    `gorm:"column:\"Desc_demanda_educacional\"" json:"Desc_demanda_educacional"`
	Demanda_trabalhista          bool      `gorm:"column:\"Demanda_trabalhista\"" json:"Demanda_trabalhista"`
	Desc_demanda_trabalhista     string    `gorm:"column:\"Desc_demanda_trabalhista\"" json:"Desc_demanda_trabalhista"`
	Esta_Afastado                string    `gorm:"column:\"Esta_Afastado\"" json:"Esta_Afastado"`
	Motivo_afastamento           string    `gorm:"column:\"Motivo_afastamento\"" json:"Motivo_afastamento"`
	Motivo_Afastamento_Detalhado string    `gorm:"column:\"Motivo_Afastamento_Detalhado\"" json:"Motivo_Afastamento_Detalhado"`
	CreatedAt                    time.Time `json:"created_at"`
	UpdatedAt                    time.Time `json:"updated_at"`
}

func (SAVe_Ensino_trab_renda) TableName() string {
	return "\"SAVe_Ensino_Trab_Renda\""
}

type SAVe_Vinculos struct {
	ID_Caso                     uint      `gorm:"primaryKey;column:\"ID_Caso\"" json:"ID_Caso"`
	Qtd_Pessoas_Fam             int       `gorm:"column:\"Qtd_Pessoas_Fam\"" json:"Qtd_Pessoas_Fam"`
	Qtd_Filhos_Ent              int       `gorm:"column:\"Qtd_Filhos_Ent\"" json:"Qtd_Filhos_Ent"`
	Num_Filhos_Dep              int       `gorm:"column:\"Num_Filhos_Dep\"" json:"Num_Filhos_Dep"`
	Num_Enteados_Dep            int       `gorm:"column:\"Num_Enteados_Dep\"" json:"Num_Enteados_Dep"`
	Renda_Total_Conv            float64   `gorm:"column:\"Renda_Total_Conv\"" json:"Renda_Total_Conv"`
	Alt_Fam_Com_Vitim           string    `gorm:"column:\"Alt_Fam_Com_Vitim\"" json:"Alt_Fam_Com_Vitim"`
	Alt_Fam_Com_Vitim_Descr     string    `gorm:"column:\"Alt_Fam_Com_Vitim_Descr\"" json:"Alt_Fam_Com_Vitim_Descr"`
	Vulnerab_Vinculos_Fam       string    `gorm:"column:\"Vulnerab_Vinculos_Fam\"" json:"Vulnerab_Vinculos_Fam"`
	Vulnerab_Vinculos_Fam_Descr string    `gorm:"column:\"Vulnerab_Vinculos_Fam_Descr\"" json:"Vulnerab_Vinculos_Fam_Descr"`
	Vulnerab_Vitim_Sec_Ter      string    `gorm:"column:\"Vulnerab_Vitim_Sec_Ter\"" json:"Vulnerab_Vitim_Sec_Ter"`
	Tipo_Vitim                  string    `gorm:"column:\"Tipo_Vitim\"" json:"Tipo_Vitim"`
	Tipo_Vitim_Descr            string    `gorm:"column:\"Tipo_Vitim_Descr\"" json:"Tipo_Vitim_Descr"`
	CreatedAt                   time.Time `json:"created_at"`
	UpdatedAt                   time.Time `json:"updated_at"`
}

func (SAVe_Vinculos) TableName() string {
	return "\"SAVe_Vinculos\""
}

type SAVe_Vinculos_Apoio struct {
	ID                            uint      `gorm:"primaryKey;autoIncrement;column:\"ID\"" json:"ID"`
	ID_Caso                       uint      `gorm:"column:\"ID_Caso\"" json:"ID_Caso"`
	AVF_Grau_Parentesco           string    `gorm:"column:\"AVF_Grau_Parentesco\"" json:"AVF_Grau_Parentesco"`
	AVF_Nome                      string    `gorm:"column:\"AVF_Nome\"" json:"AVF_Nome"`
	AVF_Data_Nasc                 string    `gorm:"column:\"AVF_Data_Nasc\"" json:"AVF_Data_Nasc"`
	AVF_Escolaridade              string    `gorm:"column:\"AVF_Escolaridade\"" json:"AVF_Escolaridade"`
	AVF_Ocupacao                  string    `gorm:"column:\"AVF_Ocupacao\"" json:"AVF_Ocupacao"`
	AVF_Renda                     string    `gorm:"column:\"AVF_Renda\"" json:"AVF_Renda"`
	AVF_Mora_Com_Vitima           bool      `gorm:"column:\"AVF_Mora_Com_Vitima\"" json:"AVF_Mora_Com_Vitima"`
	AVF_Presenciou_Violencia      bool      `gorm:"column:\"AVF_Presenciou_Violencia\"" json:"AVF_Presenciou_Violencia"`
	AVF_Conhecimento_Fato         bool      `gorm:"column:\"AVF_Conhecimento_Fato\"" json:"AVF_Conhecimento_Fato"`
	AVF_Alt_Vinculo_Pos_Violencia string    `gorm:"column:\"AVF_Alt_Vinculo_Pos_Violencia\"" json:"AVF_Alt_Vinculo_Pos_Violencia"`
	AVF_Rede_Apoio                bool      `gorm:"column:\"AVF_Rede_Apoio\"" json:"AVF_Rede_Apoio"`
	CreatedAt                     time.Time `json:"created_at"`
	UpdatedAt                     time.Time `json:"updated_at"`
}

func (SAVe_Vinculos_Apoio) TableName() string {
	return "\"SAVe_Vinculos_Apoio\""
}

type SAVe_protecao_seguranca struct {
	ID_Caso                              int    `gorm:"primaryKey;column:\"ID_Caso\"" json:"ID_Caso"`
	PS_Natureza_Ameaca                   string `gorm:"column:\"PS_Natureza_Ameaca\"" json:"PS_Natureza_Ameaca"`
	PS_Natureza_Ameaca_Especif           string `gorm:"column:\"PS_Natureza_Ameaca_Especif\"" json:"PS_Natureza_Ameaca_Especif"`
	PS_Como_Ameaca                       string `gorm:"column:\"PS_Como_Ameaca\"" json:"PS_Como_Ameaca"`
	PS_Tempo_Ameaca                      string `gorm:"column:\"PS_Tempo_Ameaca\"" json:"PS_Tempo_Ameaca"`
	PS_Ameaca_Autor_Vitim                string `gorm:"column:\"PS_Ameaca_Autor_Vitim\"" json:"PS_Ameaca_Autor_Vitim"`
	PS_Ameaca_Conhece                    string `gorm:"column:\"PS_Ameaca_Conhece\"" json:"PS_Ameaca_Conhece"`
	PS_Ameaca_Mais_Autor                 string `gorm:"column:\"PS_Ameaca_Mais_Autor\"" json:"PS_Ameaca_Mais_Autor"`
	PS_Tipo_Relacao                      string `gorm:"column:\"PS_Tipo_Relacao\"" json:"PS_Tipo_Relacao"`
	PS_Tipo_Relacao_Especif              string `gorm:"column:\"PS_Tipo_Relacao_Especif\"" json:"PS_Tipo_Relacao_Especif"`
	PS_Reside_Com_Autor                  string `gorm:"column:\"PS_Reside_Com_Autor\"" json:"PS_Reside_Com_Autor"`
	PS_Relacao_Poder                     string `gorm:"column:\"PS_Relacao_Poder\"" json:"PS_Relacao_Poder"`
	PS_Relacao_Poder_Especif             string `gorm:"column:\"PS_Relacao_Poder_Especif\"" json:"PS_Relacao_Poder_Especif"`
	PS_Ameacas_Anteriores                string `gorm:"column:\"PS_Ameacas_Anteriores\"" json:"PS_Ameacas_Anteriores"`
	PS_Ameacas_Anteriores_Especif        string `gorm:"column:\"PS_Ameacas_Anteriores_Especif\"" json:"PS_Ameacas_Anteriores_Especif"`
	PS_Ameaca_Agente_Publico             string `gorm:"column:\"PS_Ameaca_Agente_Publico\"" json:"PS_Ameaca_Agente_Publico"`
	PS_Ameaca_Agente_Instituicao         string `gorm:"column:\"PS_Ameaca_Agente_Instituicao\"" json:"PS_Ameaca_Agente_Instituicao"`
	PS_Ameaca_Agente_Instituicao_Especif string `gorm:"column:\"PS_Ameaca_Agente_Instituicao_Especif\"" json:"PS_Ameaca_Agente_Instituicao_Especif"`
	PS_Ameaca_Org_Criminosa              string `gorm:"column:\"PS_Ameaca_Org_Criminosa\"" json:"PS_Ameaca_Org_Criminosa"`
	PS_Ameaca_Org_Criminosa_Especif      string `gorm:"column:\"PS_Ameaca_Org_Criminosa_Especif\"" json:"PS_Ameaca_Org_Criminosa_Especif"`
	PS_Regiao_Abrangencia_Ameaca         string `gorm:"column:\"PS_Regiao_Abrangencia_Ameaca\"" json:"PS_Regiao_Abrangencia_Ameaca"`
	PS_Ameaca_Meios_Concretizar          string `gorm:"column:\"PS_Ameaca_Meios_Concretizar\"" json:"PS_Ameaca_Meios_Concretizar"`
	PS_Ameaca_Meios_Concretizar_Especif  string `gorm:"column:\"PS_Ameaca_Meios_Concretizar_Especif\"" json:"PS_Ameaca_Meios_Concretizar_Especif"`
	PS_Sendo_Perseguido                  string `gorm:"column:\"PS_Sendo_Perseguido\"" json:"PS_Sendo_Perseguido"`
	PS_Perseguido_Descr                  string `gorm:"column:\"PS_Perseguido_Descr\"" json:"PS_Perseguido_Descr"`
	PS_Autor_Acesso_Armas                string `gorm:"column:\"PS_Autor_Acesso_Armas\"" json:"PS_Autor_Acesso_Armas"`
	PS_Acesso_Armas_Descr                string `gorm:"column:\"PS_Acesso_Armas_Descr\"" json:"PS_Acesso_Armas_Descr"`
	PS_Violencia_Pos_Ameaca              string `gorm:"column:\"PS_Violencia_Pos_Ameaca\"" json:"PS_Violencia_Pos_Ameaca"`
	PS_Violencia_Pos_Ameaca_Descr        string `gorm:"column:\"PS_Violencia_Pos_Ameaca_Descr\"" json:"PS_Violencia_Pos_Ameaca_Descr"`
	PS_Ameaca_Repercussoes_Soc           string `gorm:"column:\"PS_Ameaca_Repercussoes_Soc\"" json:"PS_Ameaca_Repercussoes_Soc"`
	PS_Repercussoes_Soc_Descr            string `gorm:"column:\"PS_Repercussoes_Soc_Descr\"" json:"PS_Repercussoes_Soc_Descr"`
	PS_Ameaca_Extensao_Familia           string `gorm:"column:\"PS_Ameaca_Extensao_Familia\"" json:"PS_Ameaca_Extensao_Familia"`
	PS_Extensao_Familia_Descr            string `gorm:"column:\"PS_Extensao_Familia_Descr\"" json:"PS_Extensao_Familia_Descr"`
	PS_Ameaca_Crianca_Adolescente        string `gorm:"column:\"PS_Ameaca_Crianca_Adolescente\"" json:"PS_Ameaca_Crianca_Adolescente"`
	PS_Liberdade_Limitada                string `gorm:"column:\"PS_Liberdade_Limitada\"" json:"PS_Liberdade_Limitada"`
	PS_Liberdade_Limitada_Descr          string `gorm:"column:\"PS_Liberdade_Limitada_Descr\"" json:"PS_Liberdade_Limitada_Descr"`
	PS_Impactos_Emocionais_Psic          string `gorm:"column:\"PS_Impactos_Emocionais_Psic\"" json:"PS_Impactos_Emocionais_Psic"`
	PS_Impactos_Emocionais_Psic_Descr    string `gorm:"column:\"PS_Impactos_Emocionais_Psic_Descr\"" json:"PS_Impactos_Emocionais_Psic_Descr"`
	PS_Impactos_Financeiros              string `gorm:"column:\"PS_Impactos_Financeiros\"" json:"PS_Impactos_Financeiros"`
	PS_Impactos_Financeiros_Descr        string `gorm:"column:\"PS_Impactos_Financeiros_Descr\"" json:"PS_Impactos_Financeiros_Descr"`
	PS_Nao_Sente_Segura_Mudar            string `gorm:"column:\"PS_Nao_Sente_Segura_Mudar\"" json:"PS_Nao_Sente_Segura_Mudar"`
	PS_Nao_Sente_Segura_Mudar_Descr      string `gorm:"column:\"PS_Nao_Sente_Segura_Mudar_Descr\"" json:"PS_Nao_Sente_Segura_Mudar_Descr"`
	PS_Possui_Rede_Apoio_Fam             string `gorm:"column:\"PS_Possui_Rede_Apoio_Fam\"" json:"PS_Possui_Rede_Apoio_Fam"`
	PS_Rede_Apoio_Fam_Descr              string `gorm:"column:\"PS_Rede_Apoio_Fam_Descr\"" json:"PS_Rede_Apoio_Fam_Descr"`
	PS_Possui_Rede_Comunitaria           string `gorm:"column:\"PS_Possui_Rede_Comunitaria\"" json:"PS_Possui_Rede_Comunitaria"`
	PS_Rede_Comunitaria_Descr            string `gorm:"column:\"PS_Rede_Comunitaria_Descr\"" json:"PS_Rede_Comunitaria_Descr"`
	PS_Possui_Equip_Seguranca            string `gorm:"column:\"PS_Possui_Equip_Seguranca\"" json:"PS_Possui_Equip_Seguranca"`
	PS_Equip_Seguranca_Descr             string `gorm:"column:\"PS_Equip_Seguranca_Descr\"" json:"PS_Equip_Seguranca_Descr"`
	PS_Possivel_Deslocamento_Seguro      string `gorm:"column:\"PS_Possivel_Deslocamento_Seguro\"" json:"PS_Possivel_Deslocamento_Seguro"`
	PS_Deslocamento_Seguro_Descr         string `gorm:"column:\"PS_Deslocamento_Seguro_Descr\"" json:"PS_Deslocamento_Seguro_Descr"`
	PS_Servicos_Prot_Social              string `gorm:"column:\"PS_Servicos_Prot_Social\"" json:"PS_Servicos_Prot_Social"`
	PS_Servicos_Prot_Social_Especif      string `gorm:"column:\"PS_Servicos_Prot_Social_Especif\"" json:"PS_Servicos_Prot_Social_Especif"`
	PS_Servicos_Acolhimento_Emerg        string `gorm:"column:\"PS_Servicos_Acolhimento_Emerg\"" json:"PS_Servicos_Acolhimento_Emerg"`
	PS_Servicos_Acolhimento_Especif      string `gorm:"column:\"PS_Servicos_Acolhimento_Especif\"" json:"PS_Servicos_Acolhimento_Especif"`
	PS_Programas_Protecao                string `gorm:"column:\"PS_Programas_Protecao\"" json:"PS_Programas_Protecao"`
	PS_Programas_Protecao_Especif        string `gorm:"column:\"PS_Programas_Protecao_Especif\"" json:"PS_Programas_Protecao_Especif"`
	PS_Vitima_Capaz_Ingressar_Prog       string `gorm:"column:\"PS_Vitima_Capaz_Ingressar_Prog\"" json:"PS_Vitima_Capaz_Ingressar_Prog"`
	PS_Providencia_Realizada             string `gorm:"column:\"PS_Providencia_Realizada\"" json:"PS_Providencia_Realizada"`
	PS_Providencia_Realizada_Descr       string `gorm:"column:\"PS_Providencia_Realizada_Descr\"" json:"PS_Providencia_Realizada_Descr"`
	PS_Vitima_Violencia_Domestica        string `gorm:"column:\"PS_Vitima_Violencia_Domestica\"" json:"PS_Vitima_Violencia_Domestica"`
	PS_Vitima_Crime_Odio                 string `gorm:"column:\"PS_Vitima_Crime_Odio\"" json:"PS_Vitima_Crime_Odio"`
	PS_Rede_Aplicou_Protocolo_FF         string `gorm:"column:\"PS_Rede_Aplicou_Protocolo_FF\"" json:"PS_Rede_Aplicou_Protocolo_FF"`
	PS_Rede_Aplicou_Protocolo_Roger      string `gorm:"column:\"PS_Rede_Aplicou_Protocolo_Roger\"" json:"PS_Rede_Aplicou_Protocolo_Roger"`
	PS_Deseja_Aplicar_FONAR              string `gorm:"column:\"PS_Deseja_Aplicar_FONAR\"" json:"PS_Deseja_Aplicar_FONAR"`
	PS_Situacao_ameaca_relat             string `gorm:"column:\"PS_Situacao_ameaca_relat\"" json:"PS_Situacao_ameaca_relat"`
	Nomes_Ameacadores                    string `gorm:"column:\"Nomes_Ameacadores\"" json:"Nomes_Ameacadores"`
}

func (SAVe_protecao_seguranca) TableName() string {
	return "\"SAVe_protecao_seguranca\""
}

type SAVe_protecao_seguranca_ameacadores struct {
	ID                   int    `gorm:"primaryKey;autoIncrement;column:\"ID\"" json:"ID"`
	ID_Caso              int    `gorm:"column:\"ID_Caso\"" json:"ID_Caso"`
	PSA_Nome_Ameacadores string `gorm:"column:\"PSA_Nome_Ameacadores\"" json:"PSA_Nome_Ameacadores"`
}

func (SAVe_protecao_seguranca_ameacadores) TableName() string {
	return "\"SAVe_protecao_seguranca_ameacadores\""
}

type SAVe_protecao_seguranca_adolescente struct {
	ID                   int    `gorm:"primaryKey;autoIncrement;column:\"ID\"" json:"ID"`
	ID_Caso              int    `gorm:"column:\"ID_Caso\"" json:"ID_Caso"`
	PS_ADOLESCENTE_Idade string `gorm:"column:\"PS_ADOLESCENTE_Idade\"" json:"PS_ADOLESCENTE_Idade"`
	PS_ADOLESCENTE_Nome  string `gorm:"column:\"PS_ADOLESCENTE_Nome\"" json:"PS_ADOLESCENTE_Nome"`
}

func (SAVe_protecao_seguranca_adolescente) TableName() string {
	return "\"SAVe_protecao_seguranca_adolescente\""
}

type SAVe_Acompanhamentos struct {
	ID               uint   `gorm:"primaryKey" json:"ID"`
	ID_Caso          int    `gorm:"column:\"ID_Caso\"" json:"ID_Caso"`
	Data             string `gorm:"column:\"Data\"" json:"Data"`
	Tipo_Atendimento string `gorm:"column:\"Tipo_Atendimento\"" json:"Tipo_Atendimento"`
	Sintese          string `gorm:"column:\"Sintese\"" json:"Sintese"`
	Encaminhamento   string `gorm:"column:\"Encaminhamento\"" json:"Encaminhamento"`
	Responsaveis     string `gorm:"column:\"Responsaveis\"" json:"Responsaveis"`
}

func (SAVe_Acompanhamentos) TableName() string {
	return "\"SAVe_Acompanhamentos\""
}

type SAVe_Vitimizacao struct {
	ID_Caso                    int    `gorm:"primaryKey;column:\"ID_Caso\"" json:"ID_Caso"`
	VST_Dep_repet_reviti       string `gorm:"column:\"VST_Dep_repet_reviti\"" json:"VST_Dep_repet_reviti"`
	VST_Espec_Dep_repet_reviti string `gorm:"column:\"VST_Espec_Dep_repet_reviti\"" json:"VST_Espec_Dep_repet_reviti"`
	VST_Falta_atend_esp        string `gorm:"column:\"VST_Falta_atend_esp\"" json:"VST_Falta_atend_esp"`
	VST_Espec_Falta_atend_esp  string `gorm:"column:\"VST_Espec_Falta_atend_esp\"" json:"VST_Espec_Falta_atend_esp"`
	VST_Falta_info             string `gorm:"column:\"VST_Falta_info\"" json:"VST_Falta_info"`
	VST_Espec_Falta_info       string `gorm:"column:\"VST_Espec_Falta_info\"" json:"VST_Espec_Falta_info"`
	VST_Demora_sist_just       string `gorm:"column:\"VST_Demora_sist_just\"" json:"VST_Demora_sist_just"`
	VST_Espec_Demora_sist_just string `gorm:"column:\"VST_Espec_Demora_sist_just\"" json:"VST_Espec_Demora_sist_just"`
	VST_Expos_vitima           string `gorm:"column:\"VST_Expos_vitima\"" json:"VST_Expos_vitima"`
	VST_Espec_Expos_vitima     string `gorm:"column:\"VST_Espec_Expos_vitima\"" json:"VST_Espec_Expos_vitima"`
	VST_Neg_part_proc          string `gorm:"column:\"VST_Neg_part_proc\"" json:"VST_Neg_part_proc"`
	VST_Espec_Neg_part_proc    string `gorm:"column:\"VST_Espec_Neg_part_proc\"" json:"VST_Espec_Neg_part_proc"`
	VST_Neg_apres_prova        string `gorm:"column:\"VST_Neg_apres_prova\"" json:"VST_Neg_apres_prova"`
	VST_Espec_Neg_apres_prova  string `gorm:"column:\"VST_Espec_Neg_apres_prova\"" json:"VST_Espec_Neg_apres_prova"`
	VST_Neg_acesso_dir         string `gorm:"column:\"VST_Neg_acesso_dir\"" json:"VST_Neg_acesso_dir"`
	VST_Espec_Neg_acesso_dir   string `gorm:"column:\"VST_Espec_Neg_acesso_dir\"" json:"VST_Espec_Neg_acesso_dir"`
	VST_Desresp_sigilo         string `gorm:"column:\"VST_Desresp_sigilo\"" json:"VST_Desresp_sigilo"`
	VST_Espec_Desresp_sigilo   string `gorm:"column:\"VST_Espec_Desresp_sigilo\"" json:"VST_Espec_Desresp_sigilo"`
	VST_Desresp_nome_soc       string `gorm:"column:\"VST_Desresp_nome_soc\"" json:"VST_Desresp_nome_soc"`
	VST_Espec_Desresp_nome_soc string `gorm:"column:\"VST_Espec_Desresp_nome_soc\"" json:"VST_Espec_Desresp_nome_soc"`
	VST_Outras_vit             string `gorm:"column:\"VST_Outras_vit\"" json:"VST_Outras_vit"`
	VST_Espec_Outras_vit       string `gorm:"column:\"VST_Espec_Outras_vit\"" json:"VST_Espec_Outras_vit"`

	// Terciaria fields
	VT_Culpa_vit                 string `gorm:"column:\"VT_Culpa_vit\"" json:"VT_Culpa_vit"`
	VT_Espec_Culpa_vit           string `gorm:"column:\"VT_Espec_Culpa_vit\"" json:"VT_Espec_Culpa_vit"`
	VT_Estig_social              string `gorm:"column:\"VT_Estig_social\"" json:"VT_Estig_social"`
	VT_Espec_Estig_social        string `gorm:"column:\"VT_Espec_Estig_social\"" json:"VT_Espec_Estig_social"`
	VT_Falta_Poli_publicas       string `gorm:"column:\"VT_Falta_Poli_publicas\"" json:"VT_Falta_Poli_publicas"`
	VT_Espec_Falta_Poli_publicas string `gorm:"column:\"VT_Espec_Falta_Poli_publicas\"" json:"VT_Espec_Falta_Poli_publicas"`
	VT_Explo_midiatica           string `gorm:"column:\"VT_Explo_midiatica\"" json:"VT_Explo_midiatica"`
	VT_Espec_Explo_midiatica     string `gorm:"column:\"VT_Espec_Explo_midiatica\"" json:"VT_Espec_Explo_midiatica"`
	VT_Outras_vit                string `gorm:"column:\"VT_Outras_vit\"" json:"VT_Outras_vit"`
	VT_Espec_Outras_vit          string `gorm:"column:\"VT_Espec_Outras_vit\"" json:"VT_Espec_Outras_vit"`
}

func (SAVe_Vitimizacao) TableName() string {
	return "\"SAVe_Vitimizacao\""
}

// SAVe_Agressor model (Legacy - kept for reference if needed, but superseded by SAVe_Perfil_Agressor)
// type SAVe_Agressor struct {
// 	ID           int    `gorm:"primaryKey;autoIncrement;column:\"ID\"" json:"ID"`
// 	ID_Caso      int    `gorm:"column:\"ID_Caso\"" json:"ID_Caso"`
// 	Tipo         string `gorm:"column:\"Tipo\"" json:"Tipo"`
// 	Nome         string `gorm:"column:\"Nome\"" json:"Nome"`
// 	Apelido      string `gorm:"column:\"Apelido\"" json:"Apelido"`
// 	Idade        int    `gorm:"column:\"Idade\"" json:"Idade"`
// 	Sexo         string `gorm:"column:\"Sexo\"" json:"Sexo"`
// 	Raca         string `gorm:"column:\"Raca\"" json:"Raca"`
// 	Relacao      string `gorm:"column:\"Relacao\"" json:"Relacao"`
// 	Ocupacao     string `gorm:"column:\"Ocupacao\"" json:"Ocupacao"`
// 	Renda        string `gorm:"column:\"Renda\"" json:"Renda"`
// 	Escolaridade string `gorm:"column:\"Escolaridade\"" json:"Escolaridade"`
// 	Endereco     string `gorm:"column:\"Endereco\"" json:"Endereco"`
// 	Antecedentes string `gorm:"column:\"Antecedentes\"" json:"Antecedentes"`
// 	Uso_Drogas   string `gorm:"column:\"Uso_Drogas\"" json:"Uso_Drogas"`
// 	Porte_Arma   string `gorm:"column:\"Porte_Arma\"" json:"Porte_Arma"`
// }

// func (SAVe_Agressor) TableName() string {
// 	return "\"SAVe_Agressor\""
// }

type SAVe_Perfil_Agressor struct {
	ID                         int       `gorm:"primaryKey;autoIncrement;column:\"ID\"" json:"ID"`
	ID_Caso                    int       `gorm:"column:\"ID_Caso\"" json:"ID_Caso"`
	PA_Nome_Civil              string    `gorm:"column:\"PA_Nome_Civil\"" json:"PA_Nome_Civil"`
	PA_Nome_Social_Ancestral   string    `gorm:"column:\"PA_Nome_Social_Ancestral\"" json:"PA_Nome_Social_Ancestral"`
	PA_Apelido                 string    `gorm:"column:\"PA_Apelido\"" json:"PA_Apelido"`
	PA_Data_Nascimento         string    `gorm:"column:\"PA_Data_Nascimento\"" json:"PA_Data_Nascimento"`
	PA_Idade                   int       `gorm:"column:\"PA_Idade\"" json:"PA_Idade"`
	PA_Filiacao_Mae            string    `gorm:"column:\"PA_Filiacao_Mae\"" json:"PA_Filiacao_Mae"`
	PA_Filiacao_Pai            string    `gorm:"column:\"PA_Filiacao_Pai\"" json:"PA_Filiacao_Pai"`
	PA_Nacionalidade           string    `gorm:"column:\"PA_Nacionalidade\"" json:"PA_Nacionalidade"`
	PA_Naturalidade            string    `gorm:"column:\"PA_Naturalidade\"" json:"PA_Naturalidade"`
	PA_Doc_CPF                 string    `gorm:"column:\"PA_Doc_CPF\"" json:"PA_Doc_CPF"`
	PA_Doc_RG                  string    `gorm:"column:\"PA_Doc_RG\"" json:"PA_Doc_RG"`
	PA_Doc_Situacao            string    `gorm:"column:\"PA_Doc_Situacao\"" json:"PA_Doc_Situacao"`
	PA_PPS_Sexo                string    `gorm:"column:\"PA_PPS_Sexo\"" json:"PA_PPS_Sexo"`
	PA_PPS_Identidade_Sexual   string    `gorm:"column:\"PA_PPS_Identidade_Sexual\"" json:"PA_PPS_Identidade_Sexual"`
	PA_PPS_Identidade_Genero   string    `gorm:"column:\"PA_PPS_Identidade_Genero\"" json:"PA_PPS_Identidade_Genero"`
	PA_PPS_Raca_Cor_Etnia      string    `gorm:"column:\"PA_PPS_Raca_Cor_Etnia\"" json:"PA_PPS_Raca_Cor_Etnia"`
	PA_PPS_Estado_Civil        string    `gorm:"column:\"PA_PPS_Estado_Civil\"" json:"PA_PPS_Estado_Civil"`
	PA_PPS_Religiao            string    `gorm:"column:\"PA_PPS_Religiao\"" json:"PA_PPS_Religiao"`
	PA_Tipo_Agressor           string    `gorm:"column:\"PA_Tipo_Agressor\"" json:"PA_Tipo_Agressor"`
	PA_CNPJ                    string    `gorm:"column:\"PA_CNPJ\"" json:"PA_CNPJ"`
	PA_Razao_Social            string    `gorm:"column:\"PA_Razao_Social\"" json:"PA_Razao_Social"`
	PA_Endereco_Juridica       string    `gorm:"column:\"PA_Endereco_Juridica\"" json:"PA_Endereco_Juridica"`
	PA_Vitima_Multiplos_Agress string    `gorm:"column:\"PA_Vitima_Multiplos_Agress\"" json:"PA_Vitima_Multiplos_Agress"`
	Modificado                 time.Time `gorm:"column:\"Modificado\"" json:"Modificado"`
}

func (SAVe_Perfil_Agressor) TableName() string {
	return "\"SAVe_Perfil_Agressor\""
}

type SAVe_Perfil_Agressor_Endereco struct {
	ID                   int       `gorm:"primaryKey;autoIncrement;column:\"ID\"" json:"ID"`
	ID_Caso              int       `gorm:"column:\"ID_Caso\"" json:"ID_Caso"`
	ID_Perfil_Agressor   int       `gorm:"column:\"ID_Perfil_Agressor\"" json:"ID_Perfil_Agressor"`
	PAE_Endereco         string    `gorm:"column:\"PAE_Endereco\"" json:"PAE_Endereco"`
	PAE_Numero           string    `gorm:"column:\"PAE_Numero\"" json:"PAE_Numero"`
	PAE_Complemento      string    `gorm:"column:\"PAE_Complemento\"" json:"PAE_Complemento"`
	PAE_Bairro           string    `gorm:"column:\"PAE_Bairro\"" json:"PAE_Bairro"`
	PAE_Cidade           string    `gorm:"column:\"PAE_Cidade\"" json:"PAE_Cidade"`
	PAE_UF               string    `gorm:"column:\"PAE_UF\"" json:"PAE_UF"`
	PAE_CEP              string    `gorm:"column:\"PAE_CEP\"" json:"PAE_CEP"`
	PAE_Situacao_Moradia string    `gorm:"column:\"PAE_Situacao_Moradia\"" json:"PAE_Situacao_Moradia"`
	Modificado           time.Time `gorm:"column:\"Modificado\"" json:"Modificado"`
}

func (SAVe_Perfil_Agressor_Endereco) TableName() string {
	return "\"SAVe_Perfil_Agressor_Endereco\""
}

type SAVe_Sintese_Analitica struct {
	ID                int    `gorm:"primaryKey;autoIncrement;column:\"ID\"" json:"ID"`
	ID_Caso           int    `gorm:"column:\"ID_Caso\"" json:"ID_Caso"`
	UnidadeAnalitica  string `gorm:"column:\"UnidadeAnalitica\"" json:"UnidadeAnalitica"`
	AvaliacaoDeRiscos string `gorm:"column:\"AvaliacaoDeRiscos\"" json:"AvaliacaoDeRiscos"`
	PlanoDePrevencao  string `gorm:"column:\"PlanoDePrevencao\"" json:"PlanoDePrevencao"`
	DataVencimento    string `gorm:"column:\"DataVencimento\"" json:"DataVencimento"`
	Cor               string `gorm:"column:\"Cor\"" json:"Cor"`
}

func (SAVe_Sintese_Analitica) TableName() string {
	return "\"SAVe_Sintese_Analitica\""
}
