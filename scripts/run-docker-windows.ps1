# TISedu ERP "One-Click" Docker Starter for Windows
# This script ensures Docker is running and starts the environment correctly.

$ErrorActionPreference = "Stop"

Write-Host "----------------------------------------------------" -ForegroundColor Cyan
Write-Host "   TISEDU ERP - WINDOWS DOCKER DEPLOYMENT           " -ForegroundColor Cyan
Write-Host "----------------------------------------------------" -ForegroundColor Cyan

# 1. Check if Docker is running
Write-Host "[1/4] Checking Docker status..." -NoNewline
try {
    & docker ps > $null
    Write-Host " [OK]" -ForegroundColor Green
} catch {
    Write-Host " [FAILED]" -ForegroundColor Red
    Write-Host "ERROR: Docker Desktop is not running. Please start Docker Desktop and try again." -ForegroundColor Yellow
    exit
}

# 2. Fix Line Endings for Entrypoint (Common Windows Git issue)
Write-Host "[2/4] Fixing script permissions and formats..." -NoNewline
try {
    # Ensure entrypoint.sh has LF line endings
    $entrypointPath = "docker/entrypoint.sh"
    if (Test-Path $entrypointPath) {
        $content = Get-Content $entrypointPath -Raw
        $content = $content -replace "`r`n", "`n"
        [IO.File]::WriteAllText((Resolve-Path $entrypointPath), $content, [New-Object System.Text.UTF8Encoding($false)])
        Write-Host " [OK]" -ForegroundColor Green
    }
} catch {
    Write-Host " [SKIP] (Non-fatal)" -ForegroundColor Gray
}

# 3. Start Docker Containers
Write-Host "[3/4] Starting containers (this may take a few minutes)..." -ForegroundColor Cyan
& docker-compose up -d --build

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to start Docker containers." -ForegroundColor Red
    exit
}

# 4. Success and Access
Write-Host "----------------------------------------------------" -ForegroundColor Green
Write-Host " SUCCESS: Application is starting up! " -ForegroundColor Green
Write-Host "----------------------------------------------------" -ForegroundColor Green
Write-Host " Wait 10-20 seconds for the database to initialize."
Write-Host ""
Write-Host " Access URLs:" -ForegroundColor White
Write-Host "  - ERP Application:  http://localhost:8888" -ForegroundColor Cyan
Write-Host "  - phpMyAdmin:       http://localhost:8881" -ForegroundColor Cyan
Write-Host ""
Write-Host " Admin Login:" -ForegroundColor White
Write-Host "  - Email:    admin@sac developed by TIS.com"
Write-Host "  - Password: 123456"
Write-Host ""
Write-Host " Press any key to open the application in your browser..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Start-Process "http://localhost:8888"
