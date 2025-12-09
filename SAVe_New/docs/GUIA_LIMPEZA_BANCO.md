# Guia de Limpeza do Banco de Dados

## Objetivo
Padronizar os nomes de todas as tabelas para o padrão `"SAVe_..."` e remover tabelas duplicadas minúsculas.

## Pré-requisitos
- ✅ Código Go atualizado (`models.go`, `db.go`)
- ✅ `tables.sql` atualizado
- ⚠️ **IMPORTANTE**: Faça backup do banco de dados antes de prosseguir!

## Passos

### 1. Renomear Tabelas

Execute o script [`1_renomear_tabelas.sql`](file:///C:/Users/User/Desktop/SAVe_Svelt%20e%20GoLang/Tabelas%20SAVe/SAVe_New/1_renomear_tabelas.sql):

```bash
psql -U postgres -d save_db -f "1_renomear_tabelas.sql"
```

Ou execute manualmente no pgAdmin/DBeaver.

**O que faz:**
- Renomeia `"save_usuarios"` → `"SAVe_Usuarios"`
- Renomeia `"save_ensino_trab_renda"` → `"SAVe_Ensino_Trab_Renda"`

### 2. Verificar Tabelas Duplicadas

Execute o script [`2_verificar_duplicadas.sql`](file:///C:/Users/User/Desktop/SAVe_Svelt%20e%20GoLang/Tabelas%20SAVe/SAVe_New/2_verificar_duplicadas.sql):

```bash
psql -U postgres -d save_db -f "2_verificar_duplicadas.sql"
```

**O que faz:**
- Lista todas as tabelas e identifica quais são duplicadas
- Mostra quais tabelas serão removidas

**Verifique:**
- Tabelas minúsculas (ex: `save_geral`) devem estar vazias ou duplicadas
- Tabelas com padrão `"SAVe_..."` devem ter os dados corretos

### 3. Remover Tabelas Duplicadas

**⚠️ ATENÇÃO: Este passo é IRREVERSÍVEL!**

Execute o script [`3_remover_duplicadas.sql`](file:///C:/Users/User/Desktop/SAVe_Svelt%20e%20GoLang/Tabelas%20SAVe/SAVe_New/3_remover_duplicadas.sql):

```bash
psql -U postgres -d save_db -f "3_remover_duplicadas.sql"
```

**O que faz:**
- Remove todas as tabelas minúsculas duplicadas
- Usa transação (BEGIN/COMMIT) para segurança
- Mostra as tabelas restantes para verificação

**Se algo der errado:**
- O script usa `BEGIN` e `COMMIT`
- Se houver erro, execute `ROLLBACK;` para desfazer

### 4. Reiniciar Backend

Após executar os scripts SQL:

```bash
cd backend
# Pare o backend (Ctrl+C)
go run cmd/server/main.go
```

### 5. Testar Aplicação

1. Recarregue a página no navegador (F5)
2. Teste o login
3. Teste o campo "Titulado Incra" (deve continuar funcionando)
4. Verifique se não há erros no console

## Verificação Final

Execute no PostgreSQL:

```sql
-- Deve mostrar apenas tabelas com padrão SAVe_
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

**Resultado esperado:**
- ✅ Todas as tabelas começam com `"SAVe_"`
- ✅ Nenhuma tabela minúscula duplicada
- ✅ Aplicação funciona normalmente

## Rollback (se necessário)

Se algo der errado, você pode:

1. **Restaurar o backup** do banco de dados
2. **Reverter as mudanças no código:**
   - `models.go`: Voltar `TableName()` para minúsculas
   - `db.go`: Voltar ALTER TABLE para minúsculas
   - `tables.sql`: Voltar nomes de tabelas para minúsculas

## Problemas Comuns

### "Tabela não existe"
- Verifique se executou o passo 1 (renomear) primeiro
- Verifique se o nome da tabela está correto (case-sensitive)

### "Dados perdidos"
- Restaure o backup
- Verifique se executou os passos na ordem correta

### "Backend não inicia"
- Verifique se há erros de compilação
- Verifique se as tabelas foram renomeadas corretamente
