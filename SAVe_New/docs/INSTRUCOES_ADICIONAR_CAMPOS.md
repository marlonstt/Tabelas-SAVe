# Instruções para Adicionar Campos RFC no models.go

## ⚠️ PROBLEMA
A ferramenta de edição está corrompendo o arquivo `models.go` ao tentar adicionar os campos automaticamente.

## ✅ SOLUÇÃO MANUAL

Abra o arquivo:
```
C:\Users\User\Desktop\SAVe_Svelt e GoLang\Tabelas SAVe\SAVe_New\backend\internal\models\models.go
```

### Localize a linha 317:
```go
RS_Contato_email                 string `gorm:"column:\"RS_Contato_email\"" json:"RS_Contato_email"`
```

### Adicione APÓS essa linha as seguintes 2 linhas:
```go
RFC_Familia_Vulnerab             string `gorm:"column:\"RFC_Familia_Vulnerab\"" json:"RFC_Familia_Vulnerab"`
RFC_Vulnerab_especif             string `gorm:"column:\"RFC_Vulnerab_especif\"" json:"RFC_Vulnerab_especif"`
```

### Resultado final (linhas 317-320):
```go
RS_Contato_email                 string `gorm:"column:\"RS_Contato_email\"" json:"RS_Contato_email"`
RFC_Familia_Vulnerab             string `gorm:"column:\"RFC_Familia_Vulnerab\"" json:"RFC_Familia_Vulnerab"`
RFC_Vulnerab_especif             string `gorm:\"column:\"RFC_Vulnerab_especif\"" json:"RFC_Vulnerab_especif"`
IV_Houve_Impacto_Saude           string `gorm:"column:\"IV_Houve_Impacto_Saude\"" json:"IV_Houve_Impacto_Saude"`
```

## ✅ VERIFICAÇÃO
Após adicionar, reinicie o backend:
- Pare o backend (Ctrl+C)
- Execute: `go run cmd/server/main.go`

## 📋 STATUS ATUAL
- ✅ Frontend (`Saude.svelte`) - COMPLETO com todos os campos
- ✅ Banco de dados - Colunas já adicionadas
- ⏳ Backend (`models.go`) - FALTAM 2 campos (RFC_Familia_Vulnerab e RFC_Vulnerab_especif)
