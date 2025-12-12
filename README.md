# Mini ERP + Finance System for Construction Industry

A complete ERP and Finance Management System built with React.js, Node.js, Express, and PostgreSQL.

## 🚀 Features

### Core ERP Module
- User Management with JWT authentication
- Role-based access control (Admin, Finance Manager, Project Manager)
- System administration with audit logging
- Comprehensive dashboard with KPIs

### Finance Module
- **General Ledger**: Complete chart of accounts, journal entries
- **Accounts Receivable & Payable**: Vendor and customer management
- **Invoicing**: Create, track, and manage invoices
- **Payment Tracking**: Record and monitor payments
- **Multi-Currency Support**: Exchange rate management
- **Financial Reports**: Balance Sheet, P&L, Cash Flow Statement
- **Finance Dashboard**: Real-time financial metrics and charts

### AI Insights (Logic-Based)
- Project risk scoring and assessment
- Cash flow forecasting based on historical trends
- Project progress health monitoring
- Automated alerts for high-risk projects

### Professional Features
1. **Role-Based Sidebar Navigation**: Auto-hide/show based on user role
2. **Dark/Light Theme System**: Toggle with persistent localStorage
3. **Notification Center**: Real-time alerts with bell icon dropdown
4. **Export Functionality**: PDF and Excel export for reports and invoices

## 📁 Project Structure

```
mini-erp-project/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── dashboardController.js
│   │   ├── generalLedgerController.js
│   │   ├── vendorCustomerController.js
│   │   ├── invoiceController.js
│   │   ├── financeDashboardController.js
│   │   ├── aiInsightsController.js
│   │   ├── projectController.js
│   │   └── notificationController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── auditLog.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── generalLedgerRoutes.js
│   │   ├── vendorCustomerRoutes.js
│   │   ├── invoiceRoutes.js
│   │   ├── financeDashboardRoutes.js
│   │   ├── aiInsightsRoutes.js
│   │   ├── projectRoutes.js
│   │   └── notificationRoutes.js
│   ├── database/
│   │   ├── schema.sql
│   │   └── seed.sql
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Layout.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── FinanceDashboard.jsx
│   │   │   ├── Invoices.jsx
│   │   │   └── Admin.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── index.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🛠️ Tech Stack

**Frontend:**
- React.js 18
- Vite
- React Router v6
- Axios
- Recharts (for charts)
- Lucide React (icons)
- jsPDF & jsPDF-AutoTable (PDF export)
- SheetJS/xlsx (Excel export)

**Backend:**
- Node.js
- Express.js
- PostgreSQL
- JWT (authentication)
- Bcrypt (password hashing)
- Morgan (logging)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Database Setup

1. Create PostgreSQL database:
```bash
createdb mini_erp_db
```

2. Run schema and seed files:
```bash
psql -U postgres -d mini_erp_db -f backend/database/schema.sql
psql -U postgres -d mini_erp_db -f backend/database/seed.sql
```

**Note:** The seed.sql file contains placeholder password hashes. For actual passwords to work, you need to generate proper bcrypt hashes. Use this Node.js script:

```javascript
const bcrypt = require('bcrypt');
bcrypt.hash('password123', 10, (err, hash) => {
  console.log(hash);
});
```

Replace the password hashes in seed.sql with the generated hash.

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=mini_erp_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

CORS_ORIGIN=http://localhost:5173
```

5. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 👤 Default Login Credentials

After running the seed.sql (with proper password hashes):

- **Admin**: admin@minierp.com / password123
- **Finance Manager**: finance@minierp.com / password123
- **Project Manager**: project@minierp.com / password123

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

### Dashboard
- `GET /api/dashboard/kpis` - Get dashboard KPIs
- `GET /api/dashboard/activities` - Get recent activities

### Finance
- `GET /api/general-ledger/accounts` - Get all accounts
- `POST /api/general-ledger/accounts` - Create account
- `GET /api/general-ledger/journal-entries` - Get journal entries
- `POST /api/general-ledger/journal-entries` - Create journal entry
- `GET /api/general-ledger/reports/balance-sheet` - Get balance sheet
- `GET /api/general-ledger/reports/profit-loss` - Get P&L statement
- `GET /api/general-ledger/reports/cash-flow` - Get cash flow statement

### Invoices & Payments
- `GET /api/invoices` - Get all invoices
- `POST /api/invoices` - Create invoice
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Record payment

### AI Insights
- `GET /api/ai-insights/summary` - Get AI insights summary
- `GET /api/ai-insights/project-risk/:id` - Calculate project risk
- `GET /api/ai-insights/cash-flow-forecast` - Get cash flow forecast
- `GET /api/ai-insights/project-health/:id` - Get project health status

### Admin
- `GET /api/admin/users` - Get all users (Admin only)
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/audit-logs` - Get audit logs

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read

## 🎨 Features Showcase

### 1. Global Role-Based Sidebar
- Automatically shows/hides menu items based on user role
- Collapsible sidebar for better space management
- Smooth animations and transitions

### 2. Dark Mode & Light Mode
- Seamless theme switching
- Persists preference in localStorage
- Consistent styling across all components

### 3. Notification Center
- Real-time notification updates
- Unread badge counter
- Mark individual or all notifications as read
- Different notification types (payment, project, invoice)

### 4. Export Functionality
- **PDF Export**: Financial reports with jsPDF
- **Excel Export**: Invoice lists with SheetJS
- One-click export from dashboards

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Protected API routes
- Audit logging for all critical actions
- SQL injection prevention with parameterized queries

## 📊 Business Logic

### Project Risk Calculation
```javascript
// Risk factors:
// 1. Budget overrun vs progress
// 2. Progress deviation from plan
// 3. Overdue invoices

Risk Score = Budget Factor (50) + Progress Factor (30) + Invoice Factor (20)

Risk Levels:
- Critical: Score > 60
- High: Score > 30
- Medium: Score > 15
- Low: Score <= 15
```

### Cash Flow Forecast
- Uses last 6 months of data
- Simple linear trend analysis
- Confidence level based on data availability

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Test connection
psql -U postgres -d mini_erp_db -c "SELECT 1"
```

### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000

# Kill process on port 5173
npx kill-port 5173
```

### CORS Issues
- Ensure backend CORS_ORIGIN matches frontend URL
- Check that proxy is configured in vite.config.js

## 📝 License

This project is created for educational purposes.

## 👨‍💻 Author

Built with ❤️ using GitHub Copilot

---

**Happy Coding! 🚀**
