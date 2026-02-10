-- =============================================
-- Agriculture Operations Schema
-- Phase 3 Implementation
-- =============================================

-- =============================================
-- CORE TABLES
-- =============================================

-- Fields/Plots Management
CREATE TABLE agri_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_name VARCHAR(100) NOT NULL,
    field_code VARCHAR(50) UNIQUE NOT NULL,
    area_size DECIMAL(10, 2) NOT NULL, -- in acres or hectares
    area_unit VARCHAR(20) DEFAULT 'acres',
    location VARCHAR(200),
    gps_coordinates VARCHAR(100), -- latitude,longitude format
    soil_type VARCHAR(50),
    irrigation_type VARCHAR(50), -- Drip, Sprinkler, Flood, Rain-fed
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crop Catalog
CREATE TABLE agri_crops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_name VARCHAR(100) NOT NULL,
    crop_code VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(50), -- Cereal, Vegetable, Fruit, Cash Crop
    variety VARCHAR(100),
    growing_season VARCHAR(50), -- Kharif, Rabi, Zaid, Year-round
    avg_duration_days INT, -- Average crop cycle in days
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Planting Records
CREATE TABLE IF NOT EXISTS agri_plantings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_id UUID NOT NULL REFERENCES agri_fields(id),
    crop_id UUID NOT NULL REFERENCES agri_crops(id),
    planting_date DATE NOT NULL,
    expected_harvest_date DATE,
    area_planted DECIMAL(10, 2), -- Portion of field used
    seed_quantity DECIMAL(10, 2),
    seed_unit VARCHAR(20),
    planting_method VARCHAR(50), -- Direct seeding, Transplanting, etc.
    cost_center_id UUID REFERENCES mdm_cost_centers(id),
    status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, HARVESTED, FAILED
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Harvest Records
CREATE TABLE IF NOT EXISTS agri_harvests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    planting_id UUID NOT NULL REFERENCES agri_plantings(id),
    harvest_date DATE NOT NULL,
    quantity_harvested DECIMAL(10, 2) NOT NULL,
    quantity_unit VARCHAR(20) NOT NULL, -- kg, tons, quintals
    quality_grade VARCHAR(50), -- A, B, C or Premium, Standard, Below Standard
    market_price DECIMAL(15, 2), -- Price per unit
    total_value DECIMAL(15, 2), -- Calculated: quantity * market_price
    storage_location VARCHAR(100),
    product_id UUID REFERENCES mdm_products(id), -- Link to product catalog
    transaction_id UUID, -- Auto-created income transaction (nullable for now)
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agriculture Expenses
CREATE TABLE IF NOT EXISTS agri_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_id UUID REFERENCES agri_fields(id),
    planting_id UUID REFERENCES agri_plantings(id),
    expense_type VARCHAR(50) NOT NULL, -- Seeds, Fertilizer, Pesticide, Labor, Equipment, Irrigation
    expense_date DATE NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    vendor_id UUID REFERENCES mdm_vendors(id),
    account_id UUID REFERENCES mdm_accounts(id),
    cost_center_id UUID REFERENCES mdm_cost_centers(id),
    category_id UUID REFERENCES mdm_categories(id),
    transaction_id UUID, -- Auto-created expense transaction (nullable for now)
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_agri_fields_active ON agri_fields(is_active);
CREATE INDEX idx_agri_crops_category ON agri_crops(category);
CREATE INDEX idx_agri_plantings_field ON agri_plantings(field_id);
CREATE INDEX idx_agri_plantings_crop ON agri_plantings(crop_id);
CREATE INDEX idx_agri_plantings_status ON agri_plantings(status);
CREATE INDEX idx_agri_plantings_date ON agri_plantings(planting_date);
CREATE INDEX idx_agri_harvests_planting ON agri_harvests(planting_id);
CREATE INDEX idx_agri_harvests_date ON agri_harvests(harvest_date);
CREATE INDEX idx_agri_expenses_field ON agri_expenses(field_id);
CREATE INDEX idx_agri_expenses_planting ON agri_expenses(planting_id);
CREATE INDEX idx_agri_expenses_date ON agri_expenses(expense_date);

-- =============================================
-- TRIGGERS
-- =============================================

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_agri_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_agri_fields_timestamp
    BEFORE UPDATE ON agri_fields
    FOR EACH ROW
    EXECUTE FUNCTION update_agri_timestamp();

CREATE TRIGGER update_agri_crops_timestamp
    BEFORE UPDATE ON agri_crops
    FOR EACH ROW
    EXECUTE FUNCTION update_agri_timestamp();

CREATE TRIGGER update_agri_plantings_timestamp
    BEFORE UPDATE ON agri_plantings
    FOR EACH ROW
    EXECUTE FUNCTION update_agri_timestamp();

CREATE TRIGGER update_agri_harvests_timestamp
    BEFORE UPDATE ON agri_harvests
    FOR EACH ROW
    EXECUTE FUNCTION update_agri_timestamp();

CREATE TRIGGER update_agri_expenses_timestamp
    BEFORE UPDATE ON agri_expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_agri_timestamp();

-- =============================================
-- VIEWS
-- =============================================

-- Field Overview with Current Crops
CREATE OR REPLACE VIEW v_agri_field_overview AS
SELECT 
    f.id AS field_id,
    f.field_name,
    f.field_code,
    f.area_size,
    f.area_unit,
    f.location,
    f.soil_type,
    f.irrigation_type,
    COUNT(DISTINCT p.id) AS total_plantings,
    COUNT(DISTINCT CASE WHEN p.status = 'ACTIVE' THEN p.id END) AS active_plantings,
    SUM(CASE WHEN p.status = 'ACTIVE' THEN p.area_planted ELSE 0 END) AS area_in_use,
    f.area_size - COALESCE(SUM(CASE WHEN p.status = 'ACTIVE' THEN p.area_planted ELSE 0 END), 0) AS area_available
FROM agri_fields f
LEFT JOIN agri_plantings p ON f.id = p.field_id
WHERE f.is_active = true
GROUP BY f.id, f.field_name, f.field_code, f.area_size, f.area_unit, f.location, f.soil_type, f.irrigation_type;

-- Planting Details with Crop Info
CREATE OR REPLACE VIEW v_agri_planting_details AS
SELECT 
    p.id AS planting_id,
    p.planting_date,
    p.expected_harvest_date,
    p.status,
    f.field_name,
    f.field_code,
    c.crop_name,
    c.crop_code,
    c.category AS crop_category,
    c.variety,
    p.area_planted,
    p.seed_quantity,
    p.seed_unit,
    COALESCE(SUM(e.amount), 0) AS total_expenses,
    COALESCE(SUM(h.total_value), 0) AS total_revenue,
    COALESCE(SUM(h.total_value), 0) - COALESCE(SUM(e.amount), 0) AS net_profit,
    COUNT(DISTINCT h.id) AS harvest_count,
    COALESCE(SUM(h.quantity_harvested), 0) AS total_quantity_harvested
FROM agri_plantings p
JOIN agri_fields f ON p.field_id = f.id
JOIN agri_crops c ON p.crop_id = c.id
LEFT JOIN agri_expenses e ON p.id = e.planting_id
LEFT JOIN agri_harvests h ON p.id = h.planting_id
GROUP BY p.id, p.planting_date, p.expected_harvest_date, p.status, 
         f.field_name, f.field_code, c.crop_name, c.crop_code, 
         c.category, c.variety, p.area_planted, p.seed_quantity, p.seed_unit;

-- Harvest Summary
CREATE OR REPLACE VIEW v_agri_harvest_summary AS
SELECT 
    h.id AS harvest_id,
    h.harvest_date,
    c.crop_name,
    c.category AS crop_category,
    f.field_name,
    h.quantity_harvested,
    h.quantity_unit,
    h.quality_grade,
    h.market_price,
    h.total_value,
    p.planting_date,
    EXTRACT(DAY FROM (h.harvest_date - p.planting_date)) AS days_to_harvest
FROM agri_harvests h
JOIN agri_plantings p ON h.planting_id = p.id
JOIN agri_crops c ON p.crop_id = c.id
JOIN agri_fields f ON p.field_id = f.id;

-- =============================================
-- SEED DATA
-- =============================================

-- Sample Crops
INSERT INTO agri_crops (crop_name, crop_code, category, variety, growing_season, avg_duration_days) VALUES
('Rice', 'CROP_RICE', 'Cereal', 'Basmati', 'Kharif', 120),
('Wheat', 'CROP_WHEAT', 'Cereal', 'PBW-343', 'Rabi', 150),
('Cotton', 'CROP_COTTON', 'Cash Crop', 'BT Cotton', 'Kharif', 180),
('Sugarcane', 'CROP_SUGARCANE', 'Cash Crop', 'Co-86032', 'Year-round', 365),
('Tomato', 'CROP_TOMATO', 'Vegetable', 'Hybrid', 'Rabi', 90),
('Potato', 'CROP_POTATO', 'Vegetable', 'Kufri Jyoti', 'Rabi', 100),
('Mango', 'CROP_MANGO', 'Fruit', 'Alphonso', 'Year-round', 120),
('Banana', 'CROP_BANANA', 'Fruit', 'Grand Naine', 'Year-round', 270);

-- Sample Fields
INSERT INTO agri_fields (field_name, field_code, area_size, area_unit, location, soil_type, irrigation_type) VALUES
('North Field', 'FIELD_N001', 5.0, 'acres', 'North Section', 'Loamy', 'Drip'),
('South Field', 'FIELD_S001', 8.0, 'acres', 'South Section', 'Clay', 'Sprinkler'),
('East Field', 'FIELD_E001', 3.5, 'acres', 'East Section', 'Sandy Loam', 'Rain-fed'),
('West Field', 'FIELD_W001', 6.0, 'acres', 'West Section', 'Loamy', 'Flood');

COMMENT ON TABLE agri_fields IS 'Agricultural fields/plots management';
COMMENT ON TABLE agri_crops IS 'Crop catalog with varieties and growing information';
COMMENT ON TABLE agri_plantings IS 'Crop planting records linking fields and crops';
COMMENT ON TABLE agri_harvests IS 'Harvest tracking with quantity, quality, and revenue';
COMMENT ON TABLE agri_expenses IS 'Agriculture expenses with automatic financial transaction creation';
