# Script de Automação de Build e Upload para Docker Hub
# Dica: Execute este script no PowerShell

$ErrorActionPreference = "Stop"

# --- CONFIGURAÇÃO ---
# Substitua pelo seu usuário do Docker Hub se quiser deixar fixo
$DOCKER_USER = Read-Host "Digite seu nome de usuário do Docker Hub"
# --------------------

if ([string]::IsNullOrWhiteSpace($DOCKER_USER)) {
    Write-Host "Erro: Usuário não fornecido." -ForegroundColor Red
    exit 1
}

Write-Host "`n1. Verificando Login no Docker..." -ForegroundColor Cyan
docker login
if ($LASTEXITCODE -ne 0) {
    Write-Host "Falha no login. Verifique suas credenciais." -ForegroundColor Red
    exit 1
}

Write-Host "`n2. Construindo Backend (Go)..." -ForegroundColor Cyan
docker build -t "$DOCKER_USER/save-backend:latest" ./backend

Write-Host "`n3. Construindo Frontend (Svelte)..." -ForegroundColor Cyan
docker build -t "$DOCKER_USER/save-frontend:latest" ./frontend

Write-Host "`n4. Enviando imagens para o Docker Hub (Upload)..." -ForegroundColor Cyan
Write-Host "Enviando Backend..."
docker push "$DOCKER_USER/save-backend:latest"

Write-Host "Enviando Frontend..."
docker push "$DOCKER_USER/save-frontend:latest"

Write-Host "`nSUCESSO! As imagens foram enviadas para:" -ForegroundColor Green
Write-Host "  - $DOCKER_USER/save-backend:latest"
Write-Host "  - $DOCKER_USER/save-frontend:latest"
Write-Host "`nAgora você pode usar essas imagens no seu docker-compose.yml do Portainer."
