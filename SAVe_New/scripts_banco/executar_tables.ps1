# Script para executar tables.sql no PostgreSQL
# Encontra automaticamente o psql.exe

Write-Host "Procurando PostgreSQL..." -ForegroundColor Cyan

# Possíveis localizações do PostgreSQL
$possiblePaths = @(
    "C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "C:\Program Files\PostgreSQL\15\bin\psql.exe",
    "C:\Program Files\PostgreSQL\14\bin\psql.exe",
    "C:\Program Files\PostgreSQL\13\bin\psql.exe",
    "C:\Program Files (x86)\PostgreSQL\16\bin\psql.exe",
    "C:\Program Files (x86)\PostgreSQL\15\bin\psql.exe"
)

$psqlPath = $null
foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        $psqlPath = $path
        Write-Host "✓ PostgreSQL encontrado em: $path" -ForegroundColor Green
        break
    }
}

if (-not $psqlPath) {
    Write-Host "✗ PostgreSQL não encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, use uma das seguintes opções:" -ForegroundColor Yellow
    Write-Host "1. Abra o pgAdmin e execute o tables.sql manualmente"
    Write-Host "2. Instale o PostgreSQL com psql"
    Write-Host ""
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Caminho do arquivo SQL
$sqlFile = "C:\Users\User\Desktop\SAVe_Svelt e GoLang\Tabelas SAVe\tables.sql"

if (-not (Test-Path $sqlFile)) {
    Write-Host "✗ Arquivo tables.sql não encontrado em: $sqlFile" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""
Write-Host "Executando tables.sql..." -ForegroundColor Cyan
Write-Host "Banco de dados: save_db" -ForegroundColor Yellow
Write-Host "Usuário: postgres" -ForegroundColor Yellow
Write-Host ""

# Executar o script SQL
& $psqlPath -U postgres -d save_db -f $sqlFile

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Script executado com sucesso!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "✗ Erro ao executar o script. Código de saída: $LASTEXITCODE" -ForegroundColor Red
}

Write-Host ""
Read-Host "Pressione Enter para sair"
