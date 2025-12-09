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

## 3. Tabelas Necessárias no Banco de Dados

O banco `save_db` **DEVE** conter as seguintes tabelas para funcionar corretamente:

### Tabelas 1:1 (Uma linha por caso)
- `SAVe_Geral` - Informações gerais do caso
- `SAVe_DadosDeEntrada` - Dados de entrada
- `SAVe_Identificacao` - Identificação da vítima
- `SAVe_Situacao_Juridica` - Situação jurídica
- `SAVe_Saude` - Informações de saúde
- `SAVe_Habitacao_territorio` - Habitação e território
- `SAVe_Assistencia` - Assistência social
- `SAVe_Ensino_trab_renda` - Ensino, trabalho e renda
- `SAVe_Vinculos` - Vínculos familiares
- `SAVe_protecao_seguranca` - Proteção e segurança
- `SAVe_Vitimizacao` - Vitimização secundária e terciária ⭐ **NOVA**
- `SAVe_Encerramento` - Dados de encerramento
- `SAVe_Casos_Vinculados` - Casos relacionados

### Tabelas 1:N (Múltiplas linhas por caso)
- `SAVe_Identificacao_telefone` - Telefones da vítima
- `SAVe_Identificacao_email` - Emails da vítima
- `SAVe_Identificacao_endereco` - Endereços da vítima
- `SAVe_Situacao_Juridica2` - Processos judiciais
- `SAVe_Vinculos_Apoio` - Rede de apoio
- `SAVe_protecao_seguranca_ameacadores` - Ameaçadores
- `SAVe_protecao_seguranca_adolescente` - Adolescentes envolvidos
- `SAVe_Agressor` - Agressores ⭐ **NOVA**
- `SAVe_Acompanhamentos` - Acompanhamentos do caso

### Tabela de Sistema
- `users` - Usuários do sistema

## 4. Como Rodar o Backend Corretamente

Para iniciar o servidor com a configuração correta:

1.  Abra o terminal na pasta `SAVe_New/backend`.
2.  Verifique se o arquivo `.env` está com a senha `86076448`.
3.  Execute:
    ```bash
    go run cmd/server/main.go
    ```
4.  Aguarde a mensagem de confirmação de que o servidor está rodando na porta `8080`.

## 5. Verificação do Banco de Dados

### Verificar Conexão

Para confirmar que está usando o banco real:
- Acesse `http://localhost:8080/api/cases/6` (ou outro ID existente).
- Se retornar um JSON com os dados, o banco está conectado.
- Se der erro de conexão ou 500, verifique a senha no `.env`.

### Verificar Tabelas

Execute o script de verificação:

```bash
cd backend
go run check_tables.go
```

Este script irá:
- ✅ Verificar conexão com o banco
- ✅ Listar todas as tabelas existentes
- ⚠️ Mostrar quais tabelas estão faltando

## 6. Solução de Problemas Comuns

### Erro 500 mesmo com senha correta

Se a senha estiver correta e você ainda receber um erro 500, verifique os logs do backend. Isso pode indicar que uma **tabela está faltando no banco de dados**.

**Sintoma:**
- O backend conecta (`Connected to database successfully`), mas retorna 500 ao acessar um caso.
- Logs mostram erro: `ERROR: relation "Nome_Da_Tabela" does not exist`.

**Solução:**
- Verifique se todas as tabelas necessárias foram criadas no PostgreSQL.
- Use o script `check_tables.go` para identificar tabelas faltantes.
- Crie as tabelas faltantes usando os scripts de migração ou manualmente.

### Frontend mostrando "Mock Data"

Se o frontend exibir "Backend unavailable, using Mock Data":

1. **Verifique se o backend está rodando:** Acesse `http://localhost:8080/api/cases`
2. **Verifique a senha no `.env`:** Deve ser `86076448`
3. **Verifique os logs do backend:** Procure por erros de conexão
4. **Verifique se as tabelas existem:** Use `check_tables.go`

## 7. Confirmação de Uso do Banco Real

**✅ VOCÊ ESTÁ USANDO O BANCO DE DADOS REAL SE:**
- O backend conecta com sucesso (`Connected to database successfully`)
- Todas as tabelas listadas acima existem no banco `save_db`
- O frontend carrega dados de casos existentes (não dados de exemplo)
- Alterações feitas no frontend são salvas e persistem após recarregar a página

**❌ VOCÊ ESTÁ USANDO MOCK SE:**
- Frontend exibe mensagem "Backend unavailable, using Mock Data"
- Dados mostrados são sempre os mesmos (casos de exemplo)
- Alterações não são salvas após recarregar a página

---

**Última atualização:** 30/11/2025  
**Tabelas adicionadas recentemente:** `SAVe_Vitimizacao`, `SAVe_Agressor`
