# Script para construir e enviar imagens para o Docker Hub
# Uso: .\build_and_push.ps1

# Carregar variáveis de ambiente do arquivo .env
if (Test-Path .env) {
    Get-Content .env | Where-Object { $_ -match '=' } | ForEach-Object {
        $key, $value = $_.Split('=', 2)
        [Environment]::SetEnvironmentVariable($key, $value, "Process")
    }
} else {
    Write-Host "Arquivo .env não encontrado!" -ForegroundColor Red
    exit 1
}

$DOCKER_USERNAME = $env:DOCKER_USERNAME

if (-not $DOCKER_USERNAME) {
    Write-Host "ERRO: Variavel DOCKER_USERNAME não encontrada no arquivo .env" -ForegroundColor Red
    Write-Host "Por favor, adicione DOCKER_USERNAME=seu_usuario ao arquivo .env" -ForegroundColor Yellow
    exit 1
}

Write-Host "Iniciando processo de Build e Push para o usuário: $DOCKER_USERNAME" -ForegroundColor Cyan

# 1. Login no Docker Hub
Write-Host "`n[1/5] Realizando login no Docker Hub..." -ForegroundColor Yellow
docker login
if ($LASTEXITCODE -ne 0) {
    Write-Host "Falha no login. Verifique suas credenciais." -ForegroundColor Red
    exit 1
}

# 2. Build Backend
Write-Host "`n[2/5] Construindo imagem do Backend..." -ForegroundColor Yellow
docker build -t "$DOCKER_USERNAME/save-backend:latest" ./backend
if ($LASTEXITCODE -ne 0) {
    Write-Host "Falha no build do Backend." -ForegroundColor Red
    exit 1
}

# 3. Push Backend
Write-Host "`n[3/5] Enviando imagem do Backend para o Docker Hub..." -ForegroundColor Yellow
docker push "$DOCKER_USERNAME/save-backend:latest"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Falha no push do Backend." -ForegroundColor Red
    exit 1
}

# 4. Build Frontend
Write-Host "`n[4/5] Construindo imagem do Frontend..." -ForegroundColor Yellow
docker build -t "$DOCKER_USERNAME/save-frontend:latest" ./frontend
if ($LASTEXITCODE -ne 0) {
    Write-Host "Falha no build do Frontend." -ForegroundColor Red
    exit 1
}

# 5. Push Frontend
Write-Host "`n[5/5] Enviando imagem do Frontend para o Docker Hub..." -ForegroundColor Yellow
docker push "$DOCKER_USERNAME/save-frontend:latest"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Falha no push do Frontend." -ForegroundColor Red
    exit 1
}

Write-Host "`nSUCESSO! As imagens foram construídas e enviadas." -ForegroundColor Green
Write-Host "Agora você pode usar 'docker stack deploy -c docker-compose.yml save_stack' para implantar." -ForegroundColor ensure
