@echo off
set PGPASSWORD=86076448
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d save_db -f create_missing_tables.sql
if %errorlevel% neq 0 (
    echo Error executing create_missing_tables.sql
    exit /b %errorlevel%
)
echo Missing tables created successfully.
