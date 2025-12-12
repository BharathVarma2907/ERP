# 🚀 Quick Setup Guide

## Step-by-Step Installation

### 1. Database Setup (PostgreSQL)

Open PowerShell in the project root directory:

```powershell
# Create database
createdb mini_erp_db

# Run schema
psql -U postgres -d mini_erp_db -f backend/database/schema.sql

# Generate password hashes for seed data
cd backend
npm install
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('password123', 10).then(hash => console.log(hash));"

# Copy the generated hash and replace all instances of 
# '$2b$10$YQjnKZ5mX5j5GZGz5C5C5O5C5C5C5C5C5C5C5C5C5C5C5C5C5C5C5' 
# in backend/database/seed.sql with your generated hash

# Then run seed data
psql -U postgres -d mini_erp_db -f database/seed.sql
```

### 2. Backend Setup

```powershell
# Navigate to backend (if not already there)
cd backend

# Copy environment file
Copy-Item .env.example .env

# Edit .env and set your database password
notepad .env

# Install dependencies
npm install

# Start development server
npm run dev
```

Backend runs on: http://localhost:5000

### 3. Frontend Setup

Open a new PowerShell terminal:

```powershell
# Navigate to frontend
cd frontend

# Copy environment file
Copy-Item .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on: http://localhost:5173

### 4. Access the Application

Open browser and go to: http://localhost:5173

**Login Credentials:**
- Admin: admin@minierp.com / password123
- Finance: finance@minierp.com / password123
- Project: project@minierp.com / password123

## 📋 Verification Checklist

- [ ] PostgreSQL is running
- [ ] Database `mini_erp_db` created
- [ ] Schema and seed data imported
- [ ] Backend .env file configured
- [ ] Backend running on port 5000
- [ ] Frontend .env file configured
- [ ] Frontend running on port 5173
- [ ] Can login with demo credentials
- [ ] Can see dashboard with data

## 🔧 Common Issues

### Issue: Cannot connect to database
**Solution:** 
```powershell
# Start PostgreSQL service
net start postgresql-x64-14
```

### Issue: Port already in use
**Solution:**
```powershell
# For backend (port 5000)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# For frontend (port 5173)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Issue: Password hash not working
**Solution:** Generate fresh hash:
```powershell
cd backend
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('password123', 10).then(hash => console.log(hash));"
```

## 🎯 Testing the Features

1. **Dashboard**: View KPIs, cash flow chart, AI insights
2. **Theme Toggle**: Click moon/sun icon in navbar
3. **Notifications**: Click bell icon to see notifications
4. **Finance Dashboard**: Navigate to Finance Dashboard (Finance Manager role)
5. **Invoices Export**: Go to Invoices page, click Export to Excel
6. **Admin Panel**: Access Administration (Admin role only)
7. **Role-Based Sidebar**: Login with different roles to see different menu items

## 📱 Production Deployment

### Environment Variables for Production

**Backend (.env):**
```env
NODE_ENV=production
PORT=5000
DB_HOST=your-db-host
DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASSWORD=your-strong-password
JWT_SECRET=your-very-strong-secret-key-minimum-32-characters
CORS_ORIGIN=https://your-frontend-domain.com
```

**Frontend (.env):**
```env
VITE_API_URL=https://your-backend-domain.com/api
```

### Build for Production

**Backend:**
```powershell
cd backend
# No build needed, just set NODE_ENV=production in .env
```

**Frontend:**
```powershell
cd frontend
npm run build
# Serve the 'dist' folder with your web server
```

## 🎉 You're All Set!

Your Mini ERP system is now ready to use. Explore all the features:

✅ User Management & Authentication
✅ Role-Based Access Control  
✅ Financial Dashboard with Charts
✅ Invoice Management with Excel Export
✅ General Ledger & Financial Reports
✅ AI-Powered Risk Insights
✅ Dark/Light Theme Toggle
✅ Real-time Notifications
✅ PDF/Excel Export Functionality
✅ Audit Logging
✅ Multi-Currency Support

For detailed documentation, see README.md

---
**Need Help?** Check the README.md for full API documentation and troubleshooting guide.
