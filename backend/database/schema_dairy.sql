-- ===================================================
-- DAIRY, AGRICULTURE & FINANCE PLATFORM
-- Database Schema - Phase 2: Dairy Operations Extension
-- PostgreSQL 15+
-- ===================================================

-- ============================================
-- PHASE 2: DAIRY OPERATIONS MODULE
-- ============================================

-- Dairy Cows - Master data for all cows
CREATE TABLE dairy_cows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cow_tag_number VARCHAR(50) UNIQUE NOT NULL,
    cow_name VARCHAR(100) NOT NULL,
    breed VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    purchase_date DATE,
    purchase_price DECIMAL(15, 2) DEFAULT 0,
    current_value DECIMAL(15, 2) DEFAULT 0,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('FEMALE', 'MALE')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SOLD', 'DEAD', 'DRY', 'PREGNANT', 'LACTATING')),
    vendor_id UUID REFERENCES mdm_vendors(id),
    location_id UUID REFERENCES mdm_locations(id),
    cost_center_id UUID REFERENCES mdm_cost_centers(id),
    asset_id UUID REFERENCES mdm_assets(id),
    parent_cow_id UUID REFERENCES dairy_cows(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Dairy Events - Lifecycle events for cows
CREATE TABLE dairy_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cow_id UUID NOT NULL REFERENCES dairy_cows(id),
    event_type VARCHAR(30) NOT NULL CHECK (event_type IN ('BIRTH', 'PURCHASE', 'SALE', 'DEATH', 'CALVING', 'INSEMINATION', 'PREGNANCY', 'ABORTION', 'DRY_OFF', 'LACTATION_START')),
    event_date DATE NOT NULL,
    description TEXT,
    transaction_id UUID REFERENCES fin_transactions(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Dairy Milk Production - Daily milk yield tracking
CREATE TABLE dairy_milk_production (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cow_id UUID NOT NULL REFERENCES dairy_cows(id),
    production_date DATE NOT NULL,
    session VARCHAR(20) NOT NULL CHECK (session IN ('MORNING', 'AFTERNOON', 'EVENING')),
    quantity_liters DECIMAL(10, 2) NOT NULL CHECK (quantity_liters >= 0),
    fat_percentage DECIMAL(5, 2),
    snf_percentage DECIMAL(5, 2),
    quality_grade VARCHAR(5) CHECK (quality_grade IN ('A', 'B', 'C')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    UNIQUE(cow_id, production_date, session)
);

-- Dairy Feeding Schedule - Planned feeding schedules
CREATE TABLE dairy_feeding_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cow_id UUID NOT NULL REFERENCES dairy_cows(id),
    feed_type VARCHAR(50) NOT NULL,
    product_id UUID REFERENCES mdm_products(id),
    quantity_kg DECIMAL(10, 2) NOT NULL CHECK (quantity_kg >= 0),
    feeding_time TIME,
    frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('DAILY', 'TWICE_DAILY', 'WEEKLY')),
    start_date DATE NOT NULL,
    end_date DATE,
    cost_per_day DECIMAL(15, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Dairy Feeding Records - Actual feed given
CREATE TABLE dairy_feeding_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cow_id UUID NOT NULL REFERENCES dairy_cows(id),
    feeding_date DATE NOT NULL,
    product_id UUID NOT NULL REFERENCES mdm_products(id),
    quantity_kg DECIMAL(10, 2) NOT NULL CHECK (quantity_kg >= 0),
    cost DECIMAL(15, 2) NOT NULL DEFAULT 0,
    transaction_id UUID REFERENCES fin_transactions(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Dairy Health Records - Veterinary and health tracking
CREATE TABLE dairy_health_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cow_id UUID NOT NULL REFERENCES dairy_cows(id),
    record_date DATE NOT NULL,
    record_type VARCHAR(30) NOT NULL CHECK (record_type IN ('VACCINATION', 'TREATMENT', 'CHECKUP', 'DEWORMING')),
    diagnosis TEXT,
    treatment TEXT,
    medicine_name VARCHAR(200),
    medicine_cost DECIMAL(15, 2) DEFAULT 0,
    vet_name VARCHAR(100),
    vendor_id UUID REFERENCES mdm_vendors(id),
    transaction_id UUID REFERENCES fin_transactions(id),
    next_checkup_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Dairy Breeding Records - Breeding and insemination
CREATE TABLE dairy_breeding_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cow_id UUID NOT NULL REFERENCES dairy_cows(id),
    breeding_date DATE NOT NULL,
    breeding_type VARCHAR(30) NOT NULL CHECK (breeding_type IN ('NATURAL', 'ARTIFICIAL_INSEMINATION')),
    bull_id UUID REFERENCES dairy_cows(id),
    semen_id VARCHAR(100),
    breed VARCHAR(50),
    cost DECIMAL(15, 2) DEFAULT 0,
    transaction_id UUID REFERENCES fin_transactions(id),
    expected_calving_date DATE,
    actual_calving_date DATE,
    pregnancy_status VARCHAR(20) DEFAULT 'PENDING' CHECK (pregnancy_status IN ('PENDING', 'CONFIRMED', 'FAILED', 'ABORTED', 'DELIVERED')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Dairy Calves - Calf management
CREATE TABLE dairy_calves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calf_tag_number VARCHAR(50) UNIQUE NOT NULL,
    calf_name VARCHAR(100) NOT NULL,
    mother_id UUID NOT NULL REFERENCES dairy_cows(id),
    father_id UUID REFERENCES dairy_cows(id),
    breeding_record_id UUID REFERENCES dairy_breeding_records(id),
    birth_date DATE NOT NULL,
    birth_weight_kg DECIMAL(10, 2),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('MALE', 'FEMALE')),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SOLD', 'DEAD', 'TRANSFERRED_TO_COW')),
    health_status VARCHAR(20) DEFAULT 'HEALTHY' CHECK (health_status IN ('HEALTHY', 'SICK', 'WEAK')),
    sale_date DATE,
    sale_price DECIMAL(15, 2),
    cow_id UUID REFERENCES dairy_cows(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- ============================================
-- DAIRY MODULE INDEXES
-- ============================================
CREATE INDEX idx_dairy_cows_status ON dairy_cows(status) WHERE is_active = true;
CREATE INDEX idx_dairy_cows_location ON dairy_cows(location_id) WHERE is_active = true;
CREATE INDEX idx_dairy_cows_cost_center ON dairy_cows(cost_center_id);
CREATE INDEX idx_dairy_cows_tag ON dairy_cows(cow_tag_number);

CREATE INDEX idx_dairy_events_cow ON dairy_events(cow_id, event_date DESC);
CREATE INDEX idx_dairy_events_type ON dairy_events(event_type, event_date DESC);

CREATE INDEX idx_dairy_milk_cow_date ON dairy_milk_production(cow_id, production_date DESC);
CREATE INDEX idx_dairy_milk_date ON dairy_milk_production(production_date DESC);

CREATE INDEX idx_dairy_feeding_cow ON dairy_feeding_records(cow_id, feeding_date DESC);
CREATE INDEX idx_dairy_feeding_date ON dairy_feeding_records(feeding_date DESC);

CREATE INDEX idx_dairy_health_cow ON dairy_health_records(cow_id, record_date DESC);
CREATE INDEX idx_dairy_health_date ON dairy_health_records(record_date DESC);

CREATE INDEX idx_dairy_breeding_cow ON dairy_breeding_records(cow_id, breeding_date DESC);
CREATE INDEX idx_dairy_breeding_status ON dairy_breeding_records(pregnancy_status);

CREATE INDEX idx_dairy_calves_mother ON dairy_calves(mother_id);
CREATE INDEX idx_dairy_calves_status ON dairy_calves(status) WHERE is_active = true;

-- ============================================
-- DAIRY MODULE TRIGGERS
-- ============================================

-- Trigger to auto-calculate expected calving date (pregnancy = ~280 days)
CREATE OR REPLACE FUNCTION calculate_expected_calving_date()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.breeding_date IS NOT NULL AND NEW.expected_calving_date IS NULL THEN
        NEW.expected_calving_date := NEW.breeding_date + INTERVAL '280 days';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calculate_calving_date
BEFORE INSERT OR UPDATE ON dairy_breeding_records
FOR EACH ROW
EXECUTE FUNCTION calculate_expected_calving_date();

-- Trigger to update cow status when breeding/pregnancy confirmed
CREATE OR REPLACE FUNCTION update_cow_status_on_breeding()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.pregnancy_status = 'CONFIRMED' THEN
        UPDATE dairy_cows 
        SET status = 'PREGNANT', updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.cow_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_cow_pregnancy_status
AFTER UPDATE ON dairy_breeding_records
FOR EACH ROW
WHEN (NEW.pregnancy_status = 'CONFIRMED' AND OLD.pregnancy_status != 'CONFIRMED')
EXECUTE FUNCTION update_cow_status_on_breeding();

-- Trigger to update timestamps for dairy tables
CREATE TRIGGER update_dairy_cows_updated_at BEFORE UPDATE ON dairy_cows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dairy_feeding_schedule_updated_at BEFORE UPDATE ON dairy_feeding_schedule FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DAIRY REPORTING VIEWS
-- ============================================

-- Daily milk production summary
CREATE MATERIALIZED VIEW vw_daily_milk_summary AS
SELECT  
    production_date,
    COUNT(DISTINCT cow_id) as total_cows_milked,
    SUM(quantity_liters) as total_liters,
    AVG(quantity_liters) as avg_liters_per_cow,
    AVG(fat_percentage) as avg_fat_percentage,
    AVG(snf_percentage) as avg_snf_percentage
FROM dairy_milk_production
GROUP BY production_date
ORDER BY production_date DESC;

CREATE INDEX idx_vw_daily_milk_date ON vw_daily_milk_summary(production_date);

-- Cow-wise milk production summary
CREATE MATERIALIZED VIEW vw_cow_milk_summary AS
SELECT 
    c.id,
    c.cow_tag_number,
    c.cow_name,
    c.breed,
    c.status,
    COUNT(mp.id) as total_records,
    SUM(mp.quantity_liters) as total_milk_liters,
    AVG(mp.quantity_liters) as avg_daily_milk,
    MAX(mp.production_date) as last_milking_date
FROM dairy_cows c
LEFT JOIN dairy_milk_production mp ON c.id = mp.cow_id
WHERE c.is_active = true
GROUP BY c.id, c.cow_tag_number, c.cow_name, c.breed, c.status;

-- Cost per cow analysis
CREATE MATERIALIZED VIEW vw_cow_cost_analysis AS
SELECT 
    c.id,
    c.cow_tag_number,
    c.cow_name,
    c.breed,
    COALESCE(SUM(CASE WHEN t.amount IS NOT NULL THEN t.amount ELSE 0 END), 0) as total_costs,
    COALESCE(SUM(mp.quantity_liters), 0) as total_milk_produced,
    CASE 
        WHEN SUM(mp.quantity_liters) > 0 THEN 
            SUM(CASE WHEN t.amount IS NOT NULL THEN t.amount ELSE 0 END) / SUM(mp.quantity_liters)
        ELSE 0 
    END as cost_per_liter
FROM dairy_cows c
LEFT JOIN fin_transactions t ON t.reference_type = 'COW' AND t.reference_id::text = c.id::text
LEFT JOIN dairy_milk_production mp ON c.id = mp.cow_id
WHERE c.is_active = true
GROUP BY c.id, c.cow_tag_number, c.cow_name, c.breed;

-- Breeding calendar (upcoming calvings)
CREATE OR REPLACE VIEW vw_breeding_calendar AS
SELECT 
    br.id,
    c.cow_tag_number,
    c.cow_name,
    br.breeding_date,
    br.expected_calving_date,
    br.actual_calving_date,
    br.pregnancy_status,
    CASE 
        WHEN br.expected_calving_date IS NOT NULL THEN 
            br.expected_calving_date - CURRENT_DATE
        ELSE NULL
    END as days_until_calving
FROM dairy_breeding_records br
JOIN dairy_cows c ON br.cow_id = c.id
WHERE br.pregnancy_status IN ('PENDING', 'CONFIRMED')
  AND br.actual_calving_date IS NULL
ORDER BY br.expected_calving_date ASC;

-- Cow health alerts (upcoming checkups)
CREATE OR REPLACE VIEW vw_health_alerts AS
SELECT 
    hr.id,
    c.cow_tag_number,
    c.cow_name,
    hr.record_date as last_checkup_date,
    hr.record_type,
    hr.next_checkup_date,
    hr.next_checkup_date - CURRENT_DATE as days_until_checkup
FROM dairy_health_records hr
JOIN dairy_cows c ON hr.cow_id = c.id
WHERE hr.next_checkup_date IS NOT NULL
  AND hr.next_checkup_date >= CURRENT_DATE
  AND c.is_active = true
ORDER BY hr.next_checkup_date ASC;

-- ============================================
-- REFRESH DAIRY MATERIALIZED VIEWS
-- ============================================
REFRESH MATERIALIZED VIEW vw_daily_milk_summary;
REFRESH MATERIALIZED VIEW vw_cow_milk_summary;
REFRESH MATERIALIZED VIEW vw_cow_cost_analysis;
