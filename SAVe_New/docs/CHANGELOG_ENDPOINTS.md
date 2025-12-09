# Changelog - Endpoints e Banco de Dados

**Data:** 29/11/2025  
**Versão:** 1.1.0

## Resumo

Implementação de endpoints faltantes para as seções Agressor, Encerramento e Acompanhamentos, permitindo que todos os componentes do frontend salvem e carreguem dados corretamente.

---

## 🗄️ Alterações no Banco de Dados

### Nova Tabela: `SAVe_Agressor`

Tabela criada para armazenar informações sobre agressores (relação 1:N com casos).

**Estrutura:**
```sql
CREATE TABLE "SAVe_Agressor" (
    "ID" SERIAL PRIMARY KEY,
    "ID_Caso" INTEGER NOT NULL,
    "Tipo" VARCHAR(255),
    "Nome" VARCHAR(255),
    "Apelido" VARCHAR(255),
    "Idade" INTEGER,
    "Sexo" VARCHAR(50),
    "Raca" VARCHAR(50),
    "Relacao" VARCHAR(255),
    "Ocupacao" VARCHAR(255),
    "Renda" VARCHAR(100),
    "Escolaridade" VARCHAR(100),
    "Endereco" TEXT,
    "Antecedentes" VARCHAR(255),
    "Uso_Drogas" VARCHAR(255),
    "Porte_Arma" VARCHAR(50),
    FOREIGN KEY ("ID_Caso") REFERENCES "SAVe_Geral"("ID_Caso") ON DELETE CASCADE
);
```

**Índice criado:**
- `idx_agressor_id_caso` em `ID_Caso` para otimizar consultas

---

## 🔌 Novos Endpoints

### 1. `/api/cases/:id/agressor` (PUT)

**Descrição:** Salva dados de agressores para um caso  
**Método:** PUT  
**Payload:**
```json
{
  "agressores": [
    {
      "Tipo": "Pessoa Física",
      "Nome": "Nome do Agressor",
      "Apelido": "Apelido",
      "Idade": 35,
      "Sexo": "Masculino",
      "Raca": "Parda",
      "Relacao": "Ex-marido",
      "Ocupacao": "Pedreiro",
      "Renda": "2000,00",
      "Escolaridade": "Ensino Médio",
      "Endereco": "Rua X, 123",
      "Antecedentes": "Sim",
      "Uso_Drogas": "Álcool",
      "Porte_Arma": "Não"
    }
  ]
}
```

**Comportamento:**
- Deleta todos os agressores existentes do caso
- Cria novos registros com os dados fornecidos
- Usa transação para garantir consistência

---

### 2. `/api/cases/:id/encerramento` (PUT)

**Descrição:** Salva dados de encerramento de um caso  
**Método:** PUT  
**Payload:**
```json
{
  "Data_Encerramento": "2025-11-29",
  "Forma_Encerramento": "Alta",
  "Especifique_Outros": "",
  "Observacao": "Caso encerrado com sucesso",
  "Encaminhamento_Pos_Alta": "CRAS"
}
```

**Comportamento:**
- Cria registro se não existir
- Atualiza registro existente se já houver dados

---

### 3. `/api/cases/:id/acompanhamentos` (PUT)

**Descrição:** Salva registros de acompanhamento de um caso  
**Método:** PUT  
**Payload:**
```json
{
  "acompanhamentos": [
    {
      "Data": "2025-11-29",
      "Tipo_Atendimento": "Presencial",
      "Sintese": "Atendimento realizado",
      "Encaminhamento": "Retorno em 30 dias",
      "Responsaveis": "Equipe SAVe"
    }
  ]
}
```

**Comportamento:**
- Deleta todos os acompanhamentos existentes do caso
- Cria novos registros com os dados fornecidos
- Usa transação para garantir consistência

---

## 📝 Alterações no Backend

### Arquivo: `backend/internal/models/models.go`

**Adicionado:**
- Modelo `SAVe_Agressor` (linhas 612-638)

### Arquivo: `backend/internal/handlers/cases.go`

**Modificado:**
- `GetCaseById`: Adicionada busca de agressores (linhas 64-66)
- `GetCaseById`: Adicionado `"agressor"` ao JSON de resposta (linha 140)
- `UpdateCaseSection`: Implementado handler para `"agressor"` (linhas 993-1027)
- `UpdateCaseSection`: Implementado handler para `"encerramento"` (linhas 1029-1063)
- `UpdateCaseSection`: Implementado handler para `"acompanhamentos"` (linhas 1065-1099)

---

## 📊 Status Completo dos Endpoints

| Endpoint | Componente Frontend | Status |
|----------|---------------------|--------|
| `/api/cases/:id/dados-entrada` | DadosEntrada.svelte | ✅ Funcional |
| `/api/cases/:id/identificacao` | Identificacao.svelte | ✅ Funcional |
| `/api/cases/:id/agressor` | Agressor.svelte | ✅ **NOVO** |
| `/api/cases/:id/encerramento` | Encerramento.svelte | ✅ **NOVO** |
| `/api/cases/:id/acompanhamentos` | Acompanhamento.svelte | ✅ **NOVO** |
| `/api/cases/:id/vitimizacao` | Vitimizacao.svelte | ✅ Funcional |
| `/api/cases/:id/protecao-seguranca` | ProtecaoSeguranca.svelte | ✅ Funcional |
| `/api/cases/:id/saude` | Saude.svelte | ✅ Funcional |
| `/api/cases/:id/habitacao-territorio` | Territorio.svelte | ✅ Funcional |
| `/api/cases/:id/assistencia` | Assistencia.svelte | ✅ Funcional |
| `/api/cases/:id/ensino-trab-renda` | EnsinoTrabRenda.svelte | ✅ Funcional |
| `/api/cases/:id/vinculos` | Vinculos.svelte | ✅ Funcional |

---

## 🔧 Scripts Auxiliares Criados

1. **`create_agressor_table.sql`** - Script SQL para criar tabela manualmente
2. **`create_agressor_table.go`** - Script Go para criar tabela via código

---

## ⚠️ Notas Importantes

1. **Reinicialização Necessária:** O backend deve ser reiniciado após a criação da tabela para carregar o novo modelo
2. **Estratégia de Persistência:** Endpoints com relação 1:N (agressor, acompanhamentos) usam estratégia delete-and-recreate
3. **Transações:** Todas as operações de escrita usam transações GORM para garantir consistência
4. **Compatibilidade:** Frontend já estava preparado, apenas faltavam os endpoints no backend

---

## 📚 Referências

- [Modelo SAVe_Agressor](file:///c:/Users/User/Desktop/SAVe_Svelt%20e%20GoLang/Tabelas%20SAVe/SAVe_New/backend/internal/models/models.go#L612-L638)
- [Handlers](file:///c:/Users/User/Desktop/SAVe_Svelt%20e%20GoLang/Tabelas%20SAVe/SAVe_New/backend/internal/handlers/cases.go)
- [Script SQL](file:///c:/Users/User/Desktop/SAVe_Svelt%20e%20GoLang/Tabelas%20SAVe/SAVe_New/backend/create_agressor_table.sql)
