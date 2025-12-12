-- Mini ERP Finance System - SQLite Seed Data

-- Insert Roles
INSERT INTO roles (role_name, description) VALUES 
('Admin', 'System administrator with full access'),
('Finance Manager', 'Manages financial operations'),
('Project Manager', 'Manages construction projects');

-- Insert Users (passwords: password123 hashed with bcrypt)
-- Hash: $2b$10$q6tGSSFMo2vBjJO2mULWAuBU3JgcmB4X6RiQScrP79hTR3dcV9w0G
INSERT INTO users (username, email, password_hash, full_name, role_id, is_active) VALUES 
('admin', 'admin@minierp.com', '$2b$10$q6tGSSFMo2vBjJO2mULWAuBU3JgcmB4X6RiQScrP79hTR3dcV9w0G', 'System Administrator', 1, 1),
('finance_mgr', 'finance@minierp.com', '$2b$10$q6tGSSFMo2vBjJO2mULWAuBU3JgcmB4X6RiQScrP79hTR3dcV9w0G', 'Finance Manager', 2, 1),
('project_mgr', 'project@minierp.com', '$2b$10$q6tGSSFMo2vBjJO2mULWAuBU3JgcmB4X6RiQScrP79hTR3dcV9w0G', 'Project Manager', 3, 1);

-- Insert Chart of Accounts
INSERT INTO accounts (account_code, account_name, account_type, balance, is_active) VALUES 
('1000', 'Cash', 'Asset', 500000, 1),
('1100', 'Accounts Receivable', 'Asset', 150000, 1),
('1200', 'Inventory', 'Asset', 80000, 1),
('1500', 'Equipment', 'Asset', 250000, 1),
('2000', 'Accounts Payable', 'Liability', 75000, 1),
('2100', 'Short-term Loans', 'Liability', 100000, 1),
('2200', 'Long-term Debt', 'Liability', 200000, 1),
('3000', 'Owner Equity', 'Equity', 500000, 1),
('3100', 'Retained Earnings', 'Equity', 105000, 1),
('4000', 'Project Revenue', 'Revenue', 0, 1),
('4100', 'Service Revenue', 'Revenue', 0, 1),
('5000', 'Material Costs', 'Expense', 0, 1),
('5100', 'Labor Costs', 'Expense', 0, 1),
('5200', 'Equipment Rental', 'Expense', 0, 1),
('5300', 'Administrative Expenses', 'Expense', 0, 1),
('5400', 'Marketing Expenses', 'Expense', 0, 1);

-- Insert Customers
INSERT INTO customers (customer_name, contact_person, email, phone, address, credit_limit, is_active) VALUES 
('ABC Construction Ltd', 'John Smith', 'john@abcconstruction.com', '+1-555-0101', '123 Main St, New York, NY 10001', 500000, 1),
('XYZ Developers', 'Sarah Johnson', 'sarah@xyzdev.com', '+1-555-0102', '456 Oak Ave, Los Angeles, CA 90001', 750000, 1),
('BuildRight Corp', 'Michael Brown', 'michael@buildright.com', '+1-555-0103', '789 Pine Rd, Chicago, IL 60601', 600000, 1),
('Metro Infrastructure', 'Emily Davis', 'emily@metroinfra.com', '+1-555-0104', '321 Elm St, Houston, TX 77001', 1000000, 1);

-- Insert Vendors
INSERT INTO vendors (vendor_name, contact_person, email, phone, address, payment_terms, is_active) VALUES 
('Steel Supplies Inc', 'Robert Wilson', 'robert@steelsupplies.com', '+1-555-0201', '111 Industrial Blvd, Detroit, MI 48201', 'Net 30', 1),
('Concrete Solutions', 'Lisa Anderson', 'lisa@concretesolutions.com', '+1-555-0202', '222 Factory Ln, Miami, FL 33101', 'Net 45', 1),
('Equipment Rentals Pro', 'James Taylor', 'james@equipmentpro.com', '+1-555-0203', '333 Service Dr, Seattle, WA 98101', 'Net 15', 1),
('Tools & Hardware Co', 'Patricia Martinez', 'patricia@toolshardware.com', '+1-555-0204', '444 Commerce St, Boston, MA 02101', 'Net 30', 1);

-- Insert Projects
INSERT INTO projects (project_name, description, customer_id, start_date, end_date, budget, actual_cost, planned_progress, actual_progress, status, risk_level, created_by) VALUES 
('Downtown Office Complex', 'Construction of 15-story office building', 1, '2024-01-15', '2025-06-30', 5000000, 2800000, 60, 55, 'active', 'Medium', 1),
('Highway Bridge Renovation', 'Renovation and expansion of highway bridge', 2, '2024-03-01', '2024-12-31', 3500000, 2100000, 65, 60, 'active', 'Low', 1),
('Residential Complex Phase 1', '50-unit residential apartment complex', 3, '2024-02-01', '2025-08-31', 8000000, 3200000, 45, 40, 'active', 'Medium', 1),
('Shopping Mall Extension', 'Extension of existing shopping mall', 4, '2023-11-01', '2024-10-31', 6500000, 6100000, 92, 90, 'active', 'High', 1),
('Industrial Warehouse', 'New industrial warehouse construction', 1, '2024-04-15', '2024-11-30', 2500000, 800000, 35, 32, 'active', 'Low', 1);

-- Insert Project Progress
INSERT INTO project_progress (project_id, progress_percent, health_status, budget_status) VALUES 
(1, 55, 'Healthy', 'On Track'),
(2, 60, 'Healthy', 'On Track'),
(3, 40, 'At Risk', 'Over Budget'),
(4, 90, 'Healthy', 'Over Budget'),
(5, 32, 'Healthy', 'On Track');

-- Insert Invoices
INSERT INTO invoices (invoice_number, customer_id, project_id, invoice_date, due_date, total_amount, paid_amount, tax_amount, status, created_by) VALUES 
('INV-2024-001', 1, 1, '2024-02-01', '2024-03-03', 500000, 500000, 50000, 'paid', 2),
('INV-2024-002', 1, 1, '2024-04-01', '2024-05-01', 600000, 400000, 60000, 'partial', 2),
('INV-2024-003', 2, 2, '2024-04-15', '2024-05-15', 450000, 450000, 45000, 'paid', 2),
('INV-2024-004', 3, 3, '2024-05-01', '2024-06-01', 800000, 0, 80000, 'pending', 2),
('INV-2024-005', 4, 4, '2024-03-15', '2024-04-15', 1200000, 1200000, 120000, 'paid', 2),
('INV-2024-006', 2, 2, '2024-06-01', '2024-07-01', 500000, 0, 50000, 'pending', 2),
('INV-2024-007', 1, 5, '2024-05-15', '2024-05-01', 300000, 0, 30000, 'overdue', 2);

-- Insert Payments
INSERT INTO payments (invoice_id, amount, payment_date, payment_method, type, reference, created_by) VALUES 
(1, 500000, '2024-02-28', 'bank_transfer', 'inflow', 'TXN-20240228-001', 2),
(2, 400000, '2024-04-25', 'bank_transfer', 'inflow', 'TXN-20240425-001', 2),
(3, 450000, '2024-05-10', 'check', 'inflow', 'CHK-789456', 2),
(5, 1200000, '2024-04-10', 'bank_transfer', 'inflow', 'TXN-20240410-001', 2);

-- Insert Exchange Rates
INSERT INTO exchange_rates (from_currency, to_currency, rate, effective_date) VALUES 
('EUR', 'USD', 1.085, '2024-01-01'),
('GBP', 'USD', 1.27, '2024-01-01'),
('CAD', 'USD', 0.745, '2024-01-01'),
('EUR', 'USD', 1.09, '2024-06-01'),
('GBP', 'USD', 1.275, '2024-06-01'),
('CAD', 'USD', 0.75, '2024-06-01');

-- Insert Journal Entry
INSERT INTO journal_entries (entry_date, description, reference, status, created_by) VALUES 
('2024-01-01', 'Opening balance', 'JE-2024-001', 'approved', 2);

-- Insert Notifications
INSERT INTO notifications (user_id, title, message, type) VALUES 
(1, 'System Started', 'Mini ERP system has been initialized successfully', 'success'),
(2, 'Invoice Overdue', 'Invoice INV-2024-007 is overdue. Please follow up with customer.', 'warning'),
(2, 'Payment Received', 'Payment of $500,000 received for invoice INV-2024-001', 'payment'),
(3, 'Project Update Required', 'Please update progress for project: Downtown Office Complex', 'project');

-- Insert Risk Logs
INSERT INTO risk_logs (project_id, risk_score, risk_level, risk_factors) VALUES 
(1, 25, 'Medium', '["Budget slightly exceeds progress"]'),
(2, 10, 'Low', '[]'),
(3, 20, 'Medium', '["Moderate progress deviation"]'),
(4, 65, 'High', '["Budget significantly exceeds progress", "Project nearing completion"]'),
(5, 8, 'Low', '[]');
