package models

import (
	"time"
)

type SAVe_Geral struct {
	ID_Caso           int    `gorm:"primaryKey;column:ID_Caso" json:"ID_Caso"`
	Num_Processo      string `gorm:"column:Num_Processo" json:"Num_Processo"`
	Tipo_Vitima       string `gorm:"column:Tipo_Vitima" json:"Tipo_Vitima"`
	Comarca           string `gorm:"column:Comarca" json:"Comarca"`
	Data              string `gorm:"column:Data" json:"Data"`
	Tipo_Form         string `gorm:"column:Tipo_Form" json:"Tipo_Form"`
	Anexos_Info       string `gorm:"column:Anexos_Info" json:"Anexos_Info"`
	Paginas_Visitadas string `gorm:"column:Paginas_Visitadas" json:"Paginas_Visitadas"`
	Encerrado         string `gorm:"column:Encerrado" json:"Encerrado"`
	Nome              string `gorm:"column:Nome" json:"Nome"`
	Tipo_Crime        string `gorm:"column:Tipo_Crime" json:"Tipo_Crime"`
}

func (SAVe_Geral) TableName() string {
	return "\"SAVe_Geral\""
}

type SAVe_DadosDeEntrada struct {
	ID_Caso                      int    `gorm:"primaryKey;column:ID_Caso" json:"ID_Caso"`
	Data                         string `gorm:"column:Data" json:"Data"`
	Comarca_origem               string `gorm:"column:Comarca_origem" json:"Comarca_origem"`
	N_procedimento_MPE           string `gorm:"column:N_procedimento_MPE" json:"N_procedimento_MPE"`
	Quem_encaminha               string `gorm:"column:Quem_encaminha" json:"Quem_encaminha"`
	PE_nome                      string `gorm:"column:PE_nome" json:"PE_nome"`
	PE_telefone                  string `gorm:"column:PE_telefone" json:"PE_telefone"`
	PE_email                     string `gorm:"column:PE_email" json:"PE_email"`
	PE_cargo                     string `gorm:"column:PE_cargo" json:"PE_cargo"`
	Classificacao_crime          string `gorm:"column:Classificacao_crime" json:"Classificacao_crime"`
	Classificacao_vitima         string `gorm:"column:Classificacao_vitima" json:"Classificacao_vitima"`
	Vitimizacao                  string `gorm:"column:Vitimizacao" json:"Vitimizacao"`
	Crime_relacionado            string `gorm:"column:Crime_relacionado" json:"Crime_relacionado"`
	Observacao                   string `gorm:"column:Observacao" json:"Observacao"`
	Atendimento_Especial         string `gorm:"column:Atendimento_Especial" json:"Atendimento_Especial"`
	Vit_Terciaria_Origem         string `gorm:"column:Vit_Terciaria_Origem" json:"Vit_Terciaria_Origem"`
	Precisa_Atendimento_Esp      string `gorm:"column:Precisa_Atendimento_Esp" json:"Precisa_Atendimento_Esp"`
	Crime_relacionado_especifico string `gorm:"column:Crime_relacionado_especifico" json:"Crime_relacionado_especifico"`
	Possui_Relacionado           string `gorm:"column:Possui_Relacionado" json:"Possui_Relacionado"`
}

func (SAVe_DadosDeEntrada) TableName() string {
	return "\"SAVe_DadosDeEntrada\""
}

type SAVe_Identificacao struct {
	ID_Caso               int        `gorm:"primaryKey;column:ID_Caso" json:"ID_Caso"`
	Nome_RC               string     `gorm:"column:Nome_RC" json:"Nome_RC"`
	Data_nascimento       *time.Time `gorm:"column:Data_nascimento" json:"Data_nascimento"`
	Idade                 string     `gorm:"column:Idade" json:"Idade"`
	Nome_social_ancestral string     `gorm:"column:Nome_social_ancestral" json:"Nome_social_ancestral"`
	Filiacao_1            string     `gorm:"column:Filiacao_1" json:"Filiacao_1"`
	Filiacao_2            string     `gorm:"column:Filiacao_2" json:"Filiacao_2"`
	Como_querser_chamada  string     `gorm:"column:Como_querser_chamada" json:"Como_querser_chamada"`
	Naturalidade          string     `gorm:"column:Naturalidade" json:"Naturalidade"`
	Nacionalidade         string     `gorm:"column:Nacionalidade" json:"Nacionalidade"`
	DC_situacao           string     `gorm:"column:DC_situacao" json:"DC_situacao"`
	DC_CPF                string     `gorm:"column:DC_CPF" json:"DC_CPF"`
	DC_RG                 string     `gorm:"column:DC_RG" json:"DC_RG"`
	DC_CTPS               string     `gorm:"column:DC_CTPS" json:"DC_CTPS"`
	CC_Nome               string     `gorm:"column:CC_Nome" json:"CC_Nome"`
	CC_telefoneDDD        string     `gorm:"column:CC_telefoneDDD" json:"CC_telefoneDDD"`
	CC_vinculo            string     `gorm:"column:CC_vinculo" json:"CC_vinculo"`
	PPS_Sexo              string     `gorm:"column:PPS_Sexo" json:"PPS_Sexo"`
	PPS_idgenero          string     `gorm:"column:PPS_idgenero" json:"PPS_idgenero"`
	PPS_orientacao_sexual string     `gorm:"column:PPS_orientacao_sexual" json:"PPS_orientacao_sexual"`
	PPS_Raca_cor_etnia    string     `gorm:"column:PPS_Raca_cor_etnia" json:"PPS_Raca_cor_etnia"`
	PPS_religiao          string     `gorm:"column:PPS_religiao" json:"PPS_religiao"`
	PPS_estado_civil      string     `gorm:"column:PPS_estado_civil" json:"PPS_estado_civil"`
}

func (SAVe_Identificacao) TableName() string {
	return "\"SAVe_Identificacao\""
}

type SAVe_Identificacao_telefone struct {
	ID          int        `gorm:"primaryKey;autoIncrement;column:ID" json:"ID"`
	ID_Caso     int        `gorm:"column:ID_Caso" json:"ID_Caso"`
	Atualizado  *time.Time `gorm:"column:Atualizado" json:"Atualizado"`
	TelefoneDDD string     `gorm:"column:TelefoneDDD" json:"TelefoneDDD"`
}

func (SAVe_Identificacao_telefone) TableName() string {
	return "\"SAVe_Identificacao_telefone\""
}

type SAVe_Identificacao_email struct {
	ID         int        `gorm:"primaryKey;autoIncrement;column:ID" json:"ID"`
	ID_Caso    int        `gorm:"column:ID_Caso" json:"ID_Caso"`
	Atualizado *time.Time `gorm:"column:Atualizado" json:"Atualizado"`
	Email      string     `gorm:"column:Email" json:"Email"`
}

func (SAVe_Identificacao_email) TableName() string {
	return "\"SAVe_Identificacao_email\""
}

type SAVe_Identificacao_endereco struct {
	ID               int    `gorm:"primaryKey;autoIncrement;column:ID" json:"ID"`
	ID_Caso          int    `gorm:"column:ID_Caso" json:"ID_Caso"`
	Endereco         string `gorm:"column:Endereco" json:"Endereco"`
	Numero           string `gorm:"column:Numero" json:"Numero"`
	Complemento      string `gorm:"column:Complemento" json:"Complemento"`
	Bairro           string `gorm:"column:Bairro" json:"Bairro"`
	Cidade           string `gorm:"column:Cidade" json:"Cidade"`
	UF               string `gorm:"column:UF" json:"UF"`
	CEP              string `gorm:"column:CEP" json:"CEP"`
	Moradia_Situacao string `gorm:"column:Moradia_Situacao" json:"Moradia_Situacao"`
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

// Add other structs as needed...

type SAVe_Encerramento struct {
	ID_Caso            int    `gorm:"primaryKey;column:ID_Caso" json:"ID_Caso"`
	Observacao         string `gorm:"column:Observacao" json:"Observacao"`
	Data               string `gorm:"column:Data" json:"Data_Encerramento"`
	Forma_Encerramento string `gorm:"column:Forma_Encerramento_Caso" json:"Forma_Encerramento"`
	Especifique_Outros string `gorm:"column:Especifique_Outros" json:"Especifique_Outros"`
}

func (SAVe_Encerramento) TableName() string {
	return "\"SAVe_Encerramento\""
}
