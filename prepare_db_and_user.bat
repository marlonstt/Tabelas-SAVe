@echo off
echo ==================================================
echo Preparando Banco de Dados e Criando Usuario Admin
echo ==================================================
set PSQL_PATH="C:\Program Files\PostgreSQL\18\bin\psql.exe"

echo.
echo 1. Renomeando tabelas para minusculas...
%PSQL_PATH% -U postgres -d save_db -f rename_tables_lowercase.sql
if %errorlevel% neq 0 (
    echo ERRO ao renomear tabelas. Verifique se o banco 'save_db' existe.
    pause
    exit /b 1
)

echo.
echo 2. Renomeando colunas da tabela de usuarios...
%PSQL_PATH% -U postgres -d save_db -f rename_user_columns.sql
if %errorlevel% neq 0 (
    echo ERRO ao renomear colunas.
    pause
    exit /b 1
)

echo.
echo 3. Criando/Atualizando usuario admin (amd)...
%PSQL_PATH% -U postgres -d save_db -f create_amd_user.sql
if %errorlevel% neq 0 (
    echo ERRO ao criar usuario.
    pause
    exit /b 1
)

echo.
echo ==================================================
echo TUDO PRONTO!
echo Tabelas renomeadas e usuario 'amd' criado com sucesso.
echo ==================================================
pause
