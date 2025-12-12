# Mini ERP System - PowerShell Setup Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Mini ERP System - Quick Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Backend Dependencies
Write-Host "Step 1: Installing Backend Dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Backend installation failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
Write-Host ""

# Step 2: Generate Password Hash
Write-Host "Step 2: Generating Password Hash..." -ForegroundColor Yellow
node scripts/generateHash.js
Write-Host ""
Write-Host "Please copy the hash above and update backend/database/seed.sql" -ForegroundColor Yellow
Read-Host "Press Enter after updating seed.sql"
Write-Host ""

# Step 3: Backend Environment
Write-Host "Step 3: Setting up backend environment..." -ForegroundColor Yellow
if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "✓ .env file created. Opening for editing..." -ForegroundColor Green
    Start-Process notepad .env -Wait
} else {
    Write-Host ".env already exists" -ForegroundColor Gray
}
Write-Host ""

Set-Location ..

# Step 4: Frontend Dependencies
Write-Host "Step 4: Installing Frontend Dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Frontend installation failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
Write-Host ""

# Step 5: Frontend Environment
Write-Host "Step 5: Setting up frontend environment..." -ForegroundColor Yellow
if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "✓ Frontend .env file created" -ForegroundColor Green
} else {
    Write-Host ".env already exists" -ForegroundColor Gray
}
Write-Host ""

Set-Location ..

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Create PostgreSQL database: createdb mini_erp_db"
Write-Host "2. Run schema: psql -U postgres -d mini_erp_db -f backend/database/schema.sql"
Write-Host "3. Run seed: psql -U postgres -d mini_erp_db -f backend/database/seed.sql"
Write-Host "4. Start backend: cd backend; npm run dev"
Write-Host "5. Start frontend: cd frontend; npm run dev"
Write-Host "6. Visit http://localhost:5173"
Write-Host ""
Read-Host "Press Enter to exit"
