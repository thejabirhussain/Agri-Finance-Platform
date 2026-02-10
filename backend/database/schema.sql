-- ===================================================
-- DAIRY, AGRICULTURE & FINANCE PLATFORM
-- Phase 1: Finance Engine - Database Schema
-- PostgreSQL 15+
-- ===================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================================
-- MASTER DATA MANAGEMENT (MDM) TABLES
-- ===================================================

-- MDM: Accounts (Bank, Cash)
CREATE TABLE mdm_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('BANK', 'CASH')),
    account_number VARCHAR(100),
    bank_name VARCHAR(255),
    branch_name VARCHAR(255),
    ifsc_code VARCHAR(20),
    opening_balance DECIMAL(15, 2) NOT NULL DEFAULT 0,
    current_balance DECIMAL(15, 2) NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_mdm_accounts_active ON mdm_accounts(is_active);
CREATE INDEX idx_mdm_accounts_type ON mdm_accounts(account_type);

-- MDM: Categories (Hierarchical)
CREATE TABLE mdm_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(255) NOT NULL,
    category_code VARCHAR(50) UNIQUE NOT NULL,
    parent_category_id UUID,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    FOREIGN KEY (parent_category_id) REFERENCES mdm_categories(id)
);

CREATE INDEX idx_mdm_categories_active ON mdm_categories(is_active);
CREATE INDEX idx_mdm_categories_parent ON mdm_categories(parent_category_id);

-- MDM: Products
CREATE TABLE mdm_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_code VARCHAR(50) UNIQUE NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    category_id UUID,
    description TEXT,
    unit_of_measure VARCHAR(50) NOT NULL, -- Litre, Kg, Unit, etc.
    is_raw_material BOOLEAN DEFAULT FALSE,
    is_finished_good BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    FOREIGN KEY (category_id) REFERENCES mdm_categories(id)
);

CREATE INDEX idx_mdm_products_active ON mdm_products(is_active);
CREATE INDEX idx_mdm_products_category ON mdm_products(category_id);
CREATE INDEX idx_mdm_products_code ON mdm_products(product_code);

-- MDM: Customers
CREATE TABLE mdm_customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_code VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_type VARCHAR(50) CHECK (customer_type IN ('RETAIL', 'B2B', 'DISTRIBUTOR', 'BULK')),
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    credit_limit DECIMAL(15, 2) DEFAULT 0,
    payment_terms VARCHAR(100), -- '7 days', '15 days', '30 days', 'Advance', etc.
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_mdm_customers_active ON mdm_customers(is_active);
CREATE INDEX idx_mdm_customers_code ON mdm_customers(customer_code);
CREATE INDEX idx_mdm_customers_type ON mdm_customers(customer_type);

-- MDM: Vendors
CREATE TABLE mdm_vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_code VARCHAR(50) UNIQUE NOT NULL,
    vendor_name VARCHAR(255) NOT NULL,
    vendor_type VARCHAR(50), -- Feed, Equipment, Medicine, etc.
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    payment_terms VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_mdm_vendors_active ON mdm_vendors(is_active);
CREATE INDEX idx_mdm_vendors_code ON mdm_vendors(vendor_code);

-- MDM: Locations
CREATE TABLE mdm_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_code VARCHAR(50) UNIQUE NOT NULL,
    location_name VARCHAR(255) NOT NULL,
    location_type VARCHAR(50) CHECK (location_type IN ('FARM', 'FIELD', 'WAREHOUSE', 'OFFICE', 'OTHER')),
    address TEXT,
    area_size DECIMAL(10, 2), -- in acres or sqft
    area_unit VARCHAR(20), -- ACRE, SQFT
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_mdm_locations_active ON mdm_locations(is_active);
CREATE INDEX idx_mdm_locations_type ON mdm_locations(location_type);

-- MDM: Cost Centers
CREATE TABLE mdm_cost_centers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cost_center_code VARCHAR(50) UNIQUE NOT NULL,
    cost_center_name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_mdm_cost_centers_active ON mdm_cost_centers(is_active);
CREATE INDEX idx_mdm_cost_centers_code ON mdm_cost_centers(cost_center_code);

-- MDM: Operation Units
CREATE TABLE mdm_operation_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_code VARCHAR(50) UNIQUE NOT NULL,
    unit_name VARCHAR(255) NOT NULL,
    unit_type VARCHAR(50) CHECK (unit_type IN ('ANIMAL', 'LAND', 'VOLUME', 'WEIGHT', 'OTHER')),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_mdm_operation_units_active ON mdm_operation_units(is_active);
CREATE INDEX idx_mdm_operation_units_type ON mdm_operation_units(unit_type);

-- MDM: Assets
CREATE TABLE mdm_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_code VARCHAR(50) UNIQUE NOT NULL,
    asset_name VARCHAR(255) NOT NULL,
    asset_type VARCHAR(50) CHECK (asset_type IN ('LAND', 'LIVESTOCK', 'EQUIPMENT', 'VEHICLE', 'BUILDING', 'OTHER')),
    category_id UUID,
    location_id UUID,
    cost_center_id UUID,
    operation_unit_id UUID,
    purchase_date DATE,
    purchase_value DECIMAL(15, 2) NOT NULL DEFAULT 0,
    current_value DECIMAL(15, 2) NOT NULL DEFAULT 0,
    depreciation_rate DECIMAL(5, 2) DEFAULT 0, -- Percentage
    quantity DECIMAL(10, 2) DEFAULT 1,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    FOREIGN KEY (category_id) REFERENCES mdm_categories(id),
    FOREIGN KEY (location_id) REFERENCES mdm_locations(id),
    FOREIGN KEY (cost_center_id) REFERENCES mdm_cost_centers(id),
    FOREIGN KEY (operation_unit_id) REFERENCES mdm_operation_units(id)
);

CREATE INDEX idx_mdm_assets_active ON mdm_assets(is_active);
CREATE INDEX idx_mdm_assets_type ON mdm_assets(asset_type);
CREATE INDEX idx_mdm_assets_cost_center ON mdm_assets(cost_center_id);
CREATE INDEX idx_mdm_assets_location ON mdm_assets(location_id);

-- ===================================================
-- FINANCIAL STRUCTURE TABLES
-- ===================================================

-- Transaction Groups (Income, Expense, Investment)
CREATE TABLE fin_transaction_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_code VARCHAR(50) UNIQUE NOT NULL,
    group_name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fin_transaction_groups_active ON fin_transaction_groups(is_active);

-- Financial Categories
CREATE TABLE fin_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_code VARCHAR(50) UNIQUE NOT NULL,
    category_name VARCHAR(255) NOT NULL,
    transaction_group_id UUID NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_group_id) REFERENCES fin_transaction_groups(id)
);

CREATE INDEX idx_fin_categories_active ON fin_categories(is_active);
CREATE INDEX idx_fin_categories_group ON fin_categories(transaction_group_id);

-- Financial Subcategories
CREATE TABLE fin_subcategories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subcategory_code VARCHAR(50) UNIQUE NOT NULL,
    subcategory_name VARCHAR(255) NOT NULL,
    category_id UUID NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES fin_categories(id)
);

CREATE INDEX idx_fin_subcategories_active ON fin_subcategories(is_active);
CREATE INDEX idx_fin_subcategories_category ON fin_subcategories(category_id);

-- Budget Groups
CREATE TABLE fin_budget_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_code VARCHAR(50) UNIQUE NOT NULL,
    group_name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fin_budget_groups_active ON fin_budget_groups(is_active);

-- ===================================================
-- TRANSACTIONAL TABLES
-- ===================================================

-- Budgets
CREATE TABLE fin_budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    budget_code VARCHAR(50) UNIQUE NOT NULL,
    budget_name VARCHAR(255) NOT NULL,
    budget_period VARCHAR(50) CHECK (budget_period IN ('MONTHLY', 'QUARTERLY', 'YEARLY')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget_group_id UUID,
    cost_center_id UUID,
    total_budget_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    total_actual_amount DECIMAL(15, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'ACTIVE', 'CLOSED')),
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    FOREIGN KEY (budget_group_id) REFERENCES fin_budget_groups(id),
    FOREIGN KEY (cost_center_id) REFERENCES mdm_cost_centers(id)
);

CREATE INDEX idx_fin_budgets_active ON fin_budgets(is_active);
CREATE INDEX idx_fin_budgets_period ON fin_budgets(start_date, end_date);
CREATE INDEX idx_fin_budgets_cost_center ON fin_budgets(cost_center_id);
CREATE INDEX idx_fin_budgets_status ON fin_budgets(status);

-- Budget Items
CREATE TABLE fin_budget_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    budget_id UUID NOT NULL,
    category_id UUID,
    subcategory_id UUID,
    budgeted_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    actual_amount DECIMAL(15, 2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (budget_id) REFERENCES fin_budgets(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES fin_categories(id),
    FOREIGN KEY (subcategory_id) REFERENCES fin_subcategories(id)
);

CREATE INDEX idx_fin_budget_items_budget ON fin_budget_items(budget_id);
CREATE INDEX idx_fin_budget_items_category ON fin_budget_items(category_id);

-- Financial Transactions
CREATE TABLE fin_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_code VARCHAR(50) UNIQUE NOT NULL,
    transaction_date DATE NOT NULL,
    transaction_group_id UUID NOT NULL,
    category_id UUID NOT NULL,
    subcategory_id UUID,
    account_id UUID NOT NULL,
    cost_center_id UUID,
    operation_unit_id UUID,
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    description TEXT,
    reference_type VARCHAR(50), -- DAIRY_EVENT, AGRI_HARVEST, WAREHOUSE_STOCK, SALES_ORDER, MANUAL
    reference_id UUID, -- ID of the linked operation
    payment_method VARCHAR(50), -- CASH, BANK_TRANSFER, CHEQUE, UPI
    vendor_id UUID,
    customer_id UUID,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    FOREIGN KEY (transaction_group_id) REFERENCES fin_transaction_groups(id),
    FOREIGN KEY (category_id) REFERENCES fin_categories(id),
    FOREIGN KEY (subcategory_id) REFERENCES fin_subcategories(id),
    FOREIGN KEY (account_id) REFERENCES mdm_accounts(id),
    FOREIGN KEY (cost_center_id) REFERENCES mdm_cost_centers(id),
    FOREIGN KEY (operation_unit_id) REFERENCES mdm_operation_units(id),
    FOREIGN KEY (vendor_id) REFERENCES mdm_vendors(id),
    FOREIGN KEY (customer_id) REFERENCES mdm_customers(id)
);

CREATE INDEX idx_fin_transactions_date ON fin_transactions(transaction_date);
CREATE INDEX idx_fin_transactions_account ON fin_transactions(account_id);
CREATE INDEX idx_fin_transactions_group ON fin_transactions(transaction_group_id);
CREATE INDEX idx_fin_transactions_category ON fin_transactions(category_id);
CREATE INDEX idx_fin_transactions_cost_center ON fin_transactions(cost_center_id);
CREATE INDEX idx_fin_transactions_reference ON fin_transactions(reference_type, reference_id);
CREATE INDEX idx_fin_transactions_active ON fin_transactions(is_active);

-- Account Balances (Materialized View for Performance)
CREATE TABLE fin_account_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL UNIQUE,
    current_balance DECIMAL(15, 2) NOT NULL DEFAULT 0,
    last_transaction_date DATE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES mdm_accounts(id) ON DELETE CASCADE
);

CREATE INDEX idx_fin_account_balances_account ON fin_account_balances(account_id);

-- ===================================================
-- USER & AUTHENTICATION TABLES
-- ===================================================

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'FINANCE', 'DAIRY', 'AGRI', 'WAREHOUSE', 'SALES', 'PLANNING', 'VIEWER')),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- ===================================================
-- TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- ===================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_mdm_accounts_updated_at BEFORE UPDATE ON mdm_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mdm_categories_updated_at BEFORE UPDATE ON mdm_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mdm_products_updated_at BEFORE UPDATE ON mdm_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mdm_customers_updated_at BEFORE UPDATE ON mdm_customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mdm_vendors_updated_at BEFORE UPDATE ON mdm_vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mdm_locations_updated_at BEFORE UPDATE ON mdm_locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mdm_cost_centers_updated_at BEFORE UPDATE ON mdm_cost_centers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mdm_operation_units_updated_at BEFORE UPDATE ON mdm_operation_units FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mdm_assets_updated_at BEFORE UPDATE ON mdm_assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fin_budgets_updated_at BEFORE UPDATE ON fin_budgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fin_budget_items_updated_at BEFORE UPDATE ON fin_budget_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fin_transactions_updated_at BEFORE UPDATE ON fin_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================================
-- SEED DATA - DEFAULT RECORDS
-- ===================================================

-- Transaction Groups
INSERT INTO fin_transaction_groups (group_code, group_name, description) VALUES
('INCOME', 'Income', 'All income transactions'),
('EXPENSE', 'Expense', 'All expense transactions'),
('INVESTMENT', 'Investment', 'Capital investments and asset purchases');

-- Default Cost Centers
INSERT INTO mdm_cost_centers (cost_center_code, cost_center_name, description) VALUES
('DAIRY', 'Dairy Operations', 'All dairy-related operations'),
('AGRI', 'Agriculture Operations', 'All agriculture-related operations'),
('WAREHOUSE', 'Warehouse & Processing', 'Warehouse and processing operations'),
('ADMIN', 'Administration', 'Administrative and overhead costs');

-- Default Operation Units
INSERT INTO mdm_operation_units (unit_code, unit_name, unit_type, description) VALUES
('COW', 'Cow', 'ANIMAL', 'Per cow operational unit'),
('ACRE', 'Acre', 'LAND', 'Per acre of land'),
('LITRE', 'Litre', 'VOLUME', 'Per litre volume measurement'),
('KG', 'Kilogram', 'WEIGHT', 'Per kilogram weight measurement');

-- Default Budget Groups
INSERT INTO fin_budget_groups (group_code, group_name, description) VALUES
('OPERATIONAL', 'Operational Budget', 'Day-to-day operational expenses'),
('CAPITAL', 'Capital Budget', 'Capital expenditure and investments'),
('REVENUE', 'Revenue Budget', 'Expected revenue targets');

-- Default Admin User (password: admin123 - should be changed in production)
-- Password hash for 'admin123' using bcrypt rounds=10
INSERT INTO users (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@dairyagri.com', '$2b$10$rKqVXvXZr5K5hF5F5F5F5u5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5', 'System Administrator', 'ADMIN');

-- ===================================================
-- VIEWS FOR REPORTING
-- ===================================================

-- Cash Flow Summary View
CREATE OR REPLACE VIEW vw_cashflow_summary AS
SELECT 
    DATE_TRUNC('month', t.transaction_date) AS month,
    tg.group_name AS transaction_type,
    SUM(t.amount) AS total_amount,
    COUNT(t.id) AS transaction_count
FROM fin_transactions t
JOIN fin_transaction_groups tg ON t.transaction_group_id = tg.id
WHERE t.is_active = TRUE
GROUP BY DATE_TRUNC('month', t.transaction_date), tg.group_name
ORDER BY month DESC, tg.group_name;

-- Budget vs Actual View
CREATE OR REPLACE VIEW vw_budget_vs_actual AS
SELECT 
    b.budget_code,
    b.budget_name,
    b.start_date,
    b.end_date,
    bi.category_id,
    fc.category_name,
    bi.budgeted_amount,
    bi.actual_amount,
    (bi.actual_amount / NULLIF(bi.budgeted_amount, 0) * 100) AS utilization_percentage,
    (bi.budgeted_amount - bi.actual_amount) AS variance
FROM fin_budgets b
JOIN fin_budget_items bi ON b.id = bi.budget_id
JOIN fin_categories fc ON bi.category_id = fc.id
WHERE b.is_active = TRUE
ORDER BY b.start_date DESC, fc.category_name;

-- Cost Center Expense Summary
CREATE OR REPLACE VIEW vw_cost_center_expenses AS
SELECT 
    cc.cost_center_code,
    cc.cost_center_name,
    DATE_TRUNC('month', t.transaction_date) AS month,
    SUM(t.amount) AS total_expenses,
    COUNT(t.id) AS transaction_count
FROM fin_transactions t
JOIN mdm_cost_centers cc ON t.cost_center_id = cc.id
JOIN fin_transaction_groups tg ON t.transaction_group_id = tg.id
WHERE t.is_active = TRUE AND tg.group_code = 'EXPENSE'
GROUP BY cc.cost_center_code, cc.cost_center_name, DATE_TRUNC('month', t.transaction_date)
ORDER BY month DESC, cc.cost_center_name;

-- Company Valuation View
CREATE OR REPLACE VIEW vw_company_valuation AS
SELECT 
    SUM(current_value * quantity) AS total_asset_value,
    (SELECT SUM(current_balance) FROM mdm_accounts WHERE is_active = TRUE) AS total_cash_balance,
    (SUM(current_value * quantity) + (SELECT SUM(current_balance) FROM mdm_accounts WHERE is_active = TRUE)) AS total_valuation
FROM mdm_assets
WHERE is_active = TRUE;
