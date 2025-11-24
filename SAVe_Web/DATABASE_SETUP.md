# Guia de Configuração do Banco de Dados SAVe

## Status Atual
✅ PostgreSQL 18 instalado e rodando
✅ Scripts de configuração criados

## Opção 1: Configuração Automática (Recomendado)

1. **Abra o PowerShell como Administrador** na pasta do projeto:
   ```
   cd "C:\Users\User\Desktop\Tabelas SAVe"
   ```

2. **Execute o script de configuração**:
   ```
   .\setup_database.bat
   ```

3. **Digite a senha do usuário postgres** quando solicitado

## Opção 2: Configuração Manual

### Passo 1: Criar o Banco de Dados

Abra o **pgAdmin** ou **SQL Shell (psql)** e execute:

```sql
CREATE DATABASE save_db;
```

### Passo 2: Aplicar o Schema

No terminal, execute:
```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d save_db -f tables.sql
```

### Passo 3: Inserir Dados de Teste

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d save_db -f insert_sample_data.sql
```

## Opção 3: Usar pgAdmin (Interface Gráfica)

1. Abra o **pgAdmin 4**
2. Conecte ao servidor PostgreSQL local
3. Clique com botão direito em "Databases" → "Create" → "Database"
4. Nome: `save_db`
5. Clique com botão direito no banco `save_db` → "Query Tool"
6. Abra o arquivo `tables.sql` e execute
7. Abra o arquivo `insert_sample_data.sql` e execute

## Configuração da Aplicação

Após criar o banco, atualize o arquivo `.env` do servidor se necessário:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/save_db"
PORT=3001
```

## Verificação

Para verificar se funcionou, execute no psql:

```sql
\c save_db
SELECT * FROM "SAVe_Geral";
```

Você deve ver 3 casos de teste!

## Problemas Comuns

### "Senha incorreta"
- A senha foi definida durante a instalação do PostgreSQL
- Tente recuperar usando pgAdmin ou reinstale o PostgreSQL

### "Banco já existe"
- Execute: `DROP DATABASE save_db;` antes de criar novamente

### "Permissão negada"
- Execute o terminal/script como Administrador
