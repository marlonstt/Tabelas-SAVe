@echo off
echo Criando usuario admin (amd)...
set PSQL_PATH="C:\Program Files\PostgreSQL\18\bin\psql.exe"

echo Verificando se o psql existe...
if not exist %PSQL_PATH% (
    echo ERRO: psql.exe nao encontrado em %PSQL_PATH%
    echo Por favor, verifique o caminho da instalacao do PostgreSQL.
    pause
    exit /b 1
)

echo Executando script SQL...
%PSQL_PATH% -U postgres -d save_db -f create_amd_user.sql

if %errorlevel% neq 0 (
    echo.
    echo ERRO: Falha ao criar usuario.
    echo Verifique se o banco de dados 'save_db' existe e se as tabelas foram renomeadas.
    echo Dica: Execute rename_tables_lowercase.sql e rename_user_columns.sql se necessario.
) else (
    echo.
    echo Sucesso! Usuario criado/atualizado.
)

pause
