@echo off
echo ========================================
echo  Configuracao do Banco de Dados SAVe
echo ========================================
echo.

REM Definir caminho do PostgreSQL
set PSQL_PATH="C:\Program Files\PostgreSQL\18\bin\psql.exe"

echo Passo 1: Criando banco de dados...
%PSQL_PATH% -U postgres -f create_database.sql
if %errorlevel% neq 0 (
    echo ERRO: Falha ao criar banco de dados
    pause
    exit /b 1
)

echo.
echo Passo 2: Aplicando schema (tables.sql)...
%PSQL_PATH% -U postgres -d save_db -f tables.sql
if %errorlevel% neq 0 (
    echo ERRO: Falha ao aplicar schema
    pause
    exit /b 1
)

echo.
echo Passo 3: Inserindo dados de teste...
%PSQL_PATH% -U postgres -d save_db -f insert_sample_data.sql
if %errorlevel% neq 0 (
    echo AVISO: Falha ao inserir dados de teste (opcional)
)

echo.
echo ========================================
echo  Configuracao concluida com sucesso!
echo ========================================
echo.
echo Banco de dados: save_db
echo Usuario: postgres
echo Host: localhost
echo Porta: 5432
echo.
pause
