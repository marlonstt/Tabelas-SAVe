# Configuração do Banco de Dados Correto (SAVe_New)

Este documento descreve como configurar e rodar o backend do **SAVe_New** para garantir que ele se conecte ao banco de dados **PostgreSQL real** e **NÃO** utilize dados de Mock (o frontend usa Mock apenas quando o backend falha).

## 1. Credenciais do Banco de Dados

O banco de dados correto é o **PostgreSQL** instalado localmente (ou no servidor).

**Credenciais Corretas:**
- **Host:** `localhost`
- **Porta:** `5432`
- **Usuário:** `postgres`
- **Senha:** `86076448`  <-- **CRÍTICO: Esta é a senha correta.**
- **Nome do Banco:** `save_db`

## 2. Configuração do Backend (.env)

O arquivo `backend/.env` **DEVE** conter exatamente estas configurações para funcionar:

```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=86076448
DB_NAME=save_db
DB_PORT=5432
PORT=8080
```

> **Atenção:** Se a senha estiver incorreta (ex: `postgres`), o backend falhará ao conectar e retornará erro 500. O frontend, ao receber erro 500, exibirá "Backend unavailable, using Mock Data". Para evitar o Mock, o backend **precisa** conectar com a senha acima.

## 3. Como Rodar o Backend Corretamente

Para iniciar o servidor com a configuração correta:

1.  Abra o terminal na pasta `SAVe_New/backend`.
2.  Verifique se o arquivo `.env` está com a senha `86076448`.
3.  Execute:
    ```bash
    go run cmd/server/main.go
    ```
4.  Aguarde a mensagem de confirmação de que o servidor está rodando na porta `8080`.

## 4. Verificação

Para confirmar que está usando o banco real:
- Acesse `http://localhost:8080/api/cases/6` (ou outro ID existente).
- Se retornar um JSON com os dados, o banco está conectado.
- Se der erro de conexão ou 500, verifique a senha no `.env`.

## 5. Solução de Problemas Comuns

### Erro 500 mesmo com senha correta

Se a senha estiver correta e você ainda receber um erro 500, verifique os logs do backend. Isso pode indicar que uma **tabela está faltando no banco de dados**.

**Sintoma:**
- O backend conecta (`Connected to database successfully`), mas retorna 500 ao acessar um caso.
- Logs mostram erro: `ERROR: relation "Nome_Da_Tabela" does not exist`.

**Solução:**
- Verifique se todas as tabelas necessárias foram criadas no PostgreSQL.
- Exemplo recente: A tabela `SAVe_Acompanhamentos` estava faltando e precisou ser criada manualmente.
- Certifique-se de que o esquema do banco (`tables.sql`) está sincronizado com os modelos do Go (`models.go`).
