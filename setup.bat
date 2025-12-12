@echo off
echo ========================================
echo Mini ERP System - Quick Setup Script
echo ========================================
echo.

echo Step 1: Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed!
    pause
    exit /b 1
)
echo ✓ Backend dependencies installed
echo.

echo Step 2: Generating Password Hash...
node scripts\generateHash.js
echo.
echo Please copy the hash above and update backend\database\seed.sql
echo Press any key after updating seed.sql...
pause > nul
echo.

echo Step 3: Setting up environment file...
if not exist .env (
    copy .env.example .env
    echo ✓ .env file created. Please edit it with your database credentials.
    notepad .env
) else (
    echo .env already exists
)
echo.

cd ..

echo Step 4: Installing Frontend Dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed!
    pause
    exit /b 1
)
echo ✓ Frontend dependencies installed
echo.

echo Step 5: Setting up frontend environment...
if not exist .env (
    copy .env.example .env
    echo ✓ Frontend .env file created
) else (
    echo .env already exists
)
echo.

cd ..

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Create PostgreSQL database: createdb mini_erp_db
echo 2. Run schema: psql -U postgres -d mini_erp_db -f backend\database\schema.sql
echo 3. Run seed: psql -U postgres -d mini_erp_db -f backend\database\seed.sql
echo 4. Start backend: cd backend ^&^& npm run dev
echo 5. Start frontend: cd frontend ^&^& npm run dev
echo 6. Visit http://localhost:5173
echo.
pause
