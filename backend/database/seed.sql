-- Sample Data for Mini ERP System
-- Insert sample data after running schema.sql

-- Insert sample users (password: 'password123' for all)
INSERT INTO users (username, email, password_hash, full_name, role_id) VALUES
('admin', 'admin@minierp.com', '$2b$10$YQjnKZ5mX5j5GZGz5C5C5O5C5C5C5C5C5C5C5C5C5C5C5C5C5C5C5', 'System Administrator', 1),
('finance_mgr', 'finance@minierp.com', '$2b$10$YQjnKZ5mX5j5GZGz5C5C5O5C5C5C5C5C5C5C5C5C5C5C5C5C5C5C5', 'Finance Manager', 2),
('project_mgr', 'project@minierp.com', '$2b$10$YQjnKZ5mX5j5GZGz5C5C5O5C5C5C5C5C5C5C5C5C5C5C5C5C5C5C5', 'Project Manager', 3);

-- Insert sample chart of accounts
INSERT INTO accounts (account_code, account_name, account_type, balance) VALUES
-- Assets
('1000', 'Cash', 'Asset', 500000.00),
('1100', 'Accounts Receivable', 'Asset', 150000.00),
('1200', 'Inventory', 'Asset', 80000.00),
('1500', 'Equipment', 'Asset', 250000.00),
-- Liabilities
('2000', 'Accounts Payable', 'Liability', 75000.00),
('2100', 'Short-term Loans', 'Liability', 100000.00),
('2200', 'Long-term Debt', 'Liability', 200000.00),
-- Equity
('3000', 'Owner Equity', 'Equity', 500000.00),
('3100', 'Retained Earnings', 'Equity', 105000.00),
-- Revenue
('4000', 'Project Revenue', 'Revenue', 0.00),
('4100', 'Service Revenue', 'Revenue', 0.00),
-- Expenses
('5000', 'Material Costs', 'Expense', 0.00),
('5100', 'Labor Costs', 'Expense', 0.00),
('5200', 'Equipment Rental', 'Expense', 0.00),
('5300', 'Administrative Expenses', 'Expense', 0.00),
('5400', 'Marketing Expenses', 'Expense', 0.00);

-- Insert sample customers
INSERT INTO customers (customer_name, contact_person, email, phone, address, credit_limit) VALUES
('ABC Construction Ltd', 'John Smith', 'john@abcconstruction.com', '+1-555-0101', '123 Main St, New York, NY 10001', 500000.00),
('XYZ Developers', 'Sarah Johnson', 'sarah@xyzdev.com', '+1-555-0102', '456 Oak Ave, Los Angeles, CA 90001', 750000.00),
('BuildRight Corp', 'Michael Brown', 'michael@buildright.com', '+1-555-0103', '789 Pine Rd, Chicago, IL 60601', 600000.00),
('Metro Infrastructure', 'Emily Davis', 'emily@metroinfra.com', '+1-555-0104', '321 Elm St, Houston, TX 77001', 1000000.00);

-- Insert sample vendors
INSERT INTO vendors (vendor_name, contact_person, email, phone, address, payment_terms) VALUES
('Steel Supplies Inc', 'Robert Wilson', 'robert@steelsupplies.com', '+1-555-0201', '111 Industrial Blvd, Detroit, MI 48201', 'Net 30'),
('Concrete Solutions', 'Lisa Anderson', 'lisa@concretesolutions.com', '+1-555-0202', '222 Factory Ln, Miami, FL 33101', 'Net 45'),
('Equipment Rentals Pro', 'James Taylor', 'james@equipmentpro.com', '+1-555-0203', '333 Service Dr, Seattle, WA 98101', 'Net 15'),
('Tools & Hardware Co', 'Patricia Martinez', 'patricia@toolshardware.com', '+1-555-0204', '444 Commerce St, Boston, MA 02101', 'Net 30');

-- Insert sample projects
INSERT INTO projects (project_name, description, customer_id, start_date, end_date, budget, actual_cost, planned_progress, actual_progress, status, risk_level, created_by) VALUES
('Downtown Office Complex', 'Construction of 15-story office building', 1, '2024-01-15', '2025-06-30', 5000000.00, 2800000.00, 60.00, 55.00, 'active', 'Medium', 1),
('Highway Bridge Renovation', 'Renovation and expansion of highway bridge', 2, '2024-03-01', '2024-12-31', 3500000.00, 2100000.00, 65.00, 60.00, 'active', 'Low', 1),
('Residential Complex Phase 1', '50-unit residential apartment complex', 3, '2024-02-01', '2025-08-31', 8000000.00, 3200000.00, 45.00, 40.00, 'active', 'Medium', 1),
('Shopping Mall Extension', 'Extension of existing shopping mall', 4, '2023-11-01', '2024-10-31', 6500000.00, 6100000.00, 92.00, 90.00, 'active', 'High', 1),
('Industrial Warehouse', 'New industrial warehouse construction', 1, '2024-04-15', '2024-11-30', 2500000.00, 800000.00, 35.00, 32.00, 'active', 'Low', 1);

-- Insert sample invoices
INSERT INTO invoices (invoice_number, customer_id, project_id, invoice_date, due_date, total_amount, paid_amount, tax_amount, status, created_by) VALUES
('INV-2024-001', 1, 1, '2024-02-01', '2024-03-03', 500000.00, 500000.00, 50000.00, 'paid', 2),
('INV-2024-002', 1, 1, '2024-04-01', '2024-05-01', 600000.00, 400000.00, 60000.00, 'partial', 2),
('INV-2024-003', 2, 2, '2024-04-15', '2024-05-15', 450000.00, 450000.00, 45000.00, 'paid', 2),
('INV-2024-004', 3, 3, '2024-05-01', '2024-06-01', 800000.00, 0.00, 80000.00, 'pending', 2),
('INV-2024-005', 4, 4, '2024-03-15', '2024-04-15', 1200000.00, 1200000.00, 120000.00, 'paid', 2),
('INV-2024-006', 2, 2, '2024-06-01', '2024-07-01', 500000.00, 0.00, 50000.00, 'pending', 2),
('INV-2024-007', 1, 5, '2024-05-15', '2024-05-01', 300000.00, 0.00, 30000.00, 'overdue', 2);

-- Insert sample payments
INSERT INTO payments (invoice_id, amount, payment_date, payment_method, type, reference, created_by) VALUES
(1, 500000.00, '2024-02-28', 'bank_transfer', 'inflow', 'TXN-20240228-001', 2),
(2, 400000.00, '2024-04-25', 'bank_transfer', 'inflow', 'TXN-20240425-001', 2),
(3, 450000.00, '2024-05-10', 'check', 'inflow', 'CHK-789456', 2),
(5, 1200000.00, '2024-04-10', 'bank_transfer', 'inflow', 'TXN-20240410-001', 2);

-- Insert sample exchange rates
INSERT INTO exchange_rates (from_currency, to_currency, rate, effective_date) VALUES
('EUR', 'USD', 1.085000, '2024-01-01'),
('GBP', 'USD', 1.270000, '2024-01-01'),
('CAD', 'USD', 0.745000, '2024-01-01'),
('EUR', 'USD', 1.090000, '2024-06-01'),
('GBP', 'USD', 1.275000, '2024-06-01'),
('CAD', 'USD', 0.750000, '2024-06-01');

-- Insert sample journal entry
INSERT INTO journal_entries (entry_date, description, reference, status, created_by) VALUES
('2024-01-01', 'Opening balance', 'JE-2024-001', 'approved', 2);

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type) VALUES
(1, 'System Started', 'Mini ERP system has been initialized successfully', 'success'),
(2, 'Invoice Overdue', 'Invoice INV-2024-007 is overdue. Please follow up with customer.', 'warning'),
(2, 'Payment Received', 'Payment of $500,000 received for invoice INV-2024-001', 'payment'),
(3, 'Project Update Required', 'Please update progress for project: Downtown Office Complex', 'project');

-- Update customer outstanding balances
UPDATE customers c SET outstanding_balance = (
    SELECT COALESCE(SUM(i.total_amount - i.paid_amount), 0)
    FROM invoices i
    WHERE i.customer_id = c.id
);

-- Insert sample risk logs
INSERT INTO risk_logs (project_id, risk_score, risk_level, risk_factors) VALUES
(1, 25, 'Medium', '["Budget slightly exceeds progress"]'),
(2, 10, 'Low', '[]'),
(3, 20, 'Medium', '["Moderate progress deviation"]'),
(4, 65, 'High', '["Budget significantly exceeds progress", "Project nearing completion"]'),
(5, 8, 'Low', '[]');
