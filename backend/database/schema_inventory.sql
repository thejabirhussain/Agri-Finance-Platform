-- =============================================
-- Inventory Management Schema
-- Phase 5 Implementation
-- =============================================

-- =============================================
-- CORE TABLES
-- =============================================

-- Inventory Items (Catalog)
CREATE TABLE IF NOT EXISTS inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_code VARCHAR(50) UNIQUE NOT NULL,
    item_name VARCHAR(200) NOT NULL,
    category VARCHAR(100), -- Seeds, Fertilizers, Feed, Medicine, Equipment, etc.
    unit_of_measure VARCHAR(20) NOT NULL, -- kg, liter, piece, bag, etc.
    reorder_level DECIMAL(10, 2) DEFAULT 0, -- Minimum stock level before reorder
    reorder_quantity DECIMAL(10, 2) DEFAULT 0, -- Standard reorder quantity
    unit_cost DECIMAL(15, 2) DEFAULT 0, -- Average cost per unit
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stock Levels (Current Stock by Location)
CREATE TABLE IF NOT EXISTS inventory_stock (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES inventory_items(id),
    location VARCHAR(100) DEFAULT 'Main Warehouse', -- Storage location
    quantity_on_hand DECIMAL(10, 2) DEFAULT 0,
    quantity_reserved DECIMAL(10, 2) DEFAULT 0, -- Reserved for orders/use
    quantity_available DECIMAL(10, 2) DEFAULT 0, -- Available = on_hand - reserved
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(item_id, location)
);

-- Purchase Orders
CREATE TABLE IF NOT EXISTS purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_number VARCHAR(50) UNIQUE NOT NULL,
    vendor_id UUID REFERENCES mdm_vendors(id),
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    status VARCHAR(50) DEFAULT 'DRAFT', -- DRAFT, SUBMITTED, APPROVED, RECEIVED, CANCELLED
    subtotal DECIMAL(15, 2) DEFAULT 0,
    tax_amount DECIMAL(15, 2) DEFAULT 0,
    total_amount DECIMAL(15, 2) DEFAULT 0,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchase Order Items (Line Items)
CREATE TABLE IF NOT EXISTS purchase_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES inventory_items(id),
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(15, 2) NOT NULL,
    line_total DECIMAL(15, 2) NOT NULL, -- quantity * unit_price
    quantity_received DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stock Movements (Transactions)
CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES inventory_items(id),
    movement_type VARCHAR(50) NOT NULL, -- IN, OUT, TRANSFER, ADJUSTMENT
    movement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quantity DECIMAL(10, 2) NOT NULL, -- Positive for IN, negative for OUT
    location VARCHAR(100),
    reference_type VARCHAR(50), -- PO, SALE, PRODUCTION, ADJUSTMENT, etc.
    reference_id UUID, -- ID of related document
    cost_per_unit DECIMAL(15, 2),
    total_value DECIMAL(15, 2),
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_inventory_items_category ON inventory_items(category);
CREATE INDEX IF NOT EXISTS idx_inventory_items_active ON inventory_items(is_active);
CREATE INDEX IF NOT EXISTS idx_inventory_stock_item ON inventory_stock(item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_stock_location ON inventory_stock(location);
CREATE INDEX IF NOT EXISTS idx_po_vendor ON purchase_orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_po_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_po_date ON purchase_orders(order_date);
CREATE INDEX IF NOT EXISTS idx_po_items_po ON purchase_order_items(po_id);
CREATE INDEX IF NOT EXISTS idx_po_items_item ON purchase_order_items(item_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_item ON stock_movements(item_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_type ON stock_movements(movement_type);
CREATE INDEX IF NOT EXISTS idx_stock_movements_date ON stock_movements(movement_date);

-- =============================================
-- TRIGGERS
-- =============================================

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_inventory_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS update_inventory_items_timestamp
    BEFORE UPDATE ON inventory_items
    FOR EACH ROW
    EXECUTE FUNCTION update_inventory_timestamp();

CREATE TRIGGER IF NOT EXISTS update_purchase_orders_timestamp
    BEFORE UPDATE ON purchase_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_inventory_timestamp();

-- Auto-calculate available quantity
CREATE OR REPLACE FUNCTION update_available_quantity()
RETURNS TRIGGER AS $$
BEGIN
    NEW.quantity_available = NEW.quantity_on_hand - NEW.quantity_reserved;
    NEW.last_updated = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS calculate_available_quantity
    BEFORE INSERT OR UPDATE ON inventory_stock
    FOR EACH ROW
    EXECUTE FUNCTION update_available_quantity();

-- Auto-calculate PO line totals
CREATE OR REPLACE FUNCTION calculate_po_line_total()
RETURNS TRIGGER AS $$
BEGIN
    NEW.line_total = NEW.quantity * NEW.unit_price;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS calculate_po_item_total
    BEFORE INSERT OR UPDATE ON purchase_order_items
    FOR EACH ROW
    EXECUTE FUNCTION calculate_po_line_total();

-- =============================================
-- VIEWS
-- =============================================

-- Stock Status Overview
CREATE OR REPLACE VIEW v_inventory_stock_status AS
SELECT 
    i.id AS item_id,
    i.item_code,
    i.item_name,
    i.category,
    i.unit_of_measure,
    i.reorder_level,
    i.unit_cost,
    COALESCE(SUM(s.quantity_on_hand), 0) AS total_on_hand,
    COALESCE(SUM(s.quantity_reserved), 0) AS total_reserved,
    COALESCE(SUM(s.quantity_available), 0) AS total_available,
    CASE 
        WHEN COALESCE(SUM(s.quantity_available), 0) <= i.reorder_level THEN 'LOW_STOCK'
        WHEN COALESCE(SUM(s.quantity_available), 0) = 0 THEN 'OUT_OF_STOCK'
        ELSE 'IN_STOCK'
    END AS stock_status,
    COALESCE(SUM(s.quantity_available), 0) * i.unit_cost AS stock_value
FROM inventory_items i
LEFT JOIN inventory_stock s ON i.id = s.item_id
WHERE i.is_active = true
GROUP BY i.id, i.item_code, i.item_name, i.category, i.unit_of_measure, i.reorder_level, i.unit_cost;

-- Purchase Order Summary
CREATE OR REPLACE VIEW v_purchase_order_summary AS
SELECT 
    po.id AS po_id,
    po.po_number,
    po.order_date,
    po.expected_delivery_date,
    po.status,
    v.vendor_name,
    COUNT(poi.id) AS total_items,
    po.total_amount,
    SUM(poi.quantity) AS total_quantity,
    SUM(poi.quantity_received) AS total_received,
    CASE 
        WHEN SUM(poi.quantity_received) = 0 THEN 'PENDING'
        WHEN SUM(poi.quantity_received) < SUM(poi.quantity) THEN 'PARTIAL'
        WHEN SUM(poi.quantity_received) >= SUM(poi.quantity) THEN 'COMPLETE'
    END AS fulfillment_status
FROM purchase_orders po
LEFT JOIN mdm_vendors v ON po.vendor_id = v.id
LEFT JOIN purchase_order_items poi ON po.id = poi.po_id
GROUP BY po.id, po.po_number, po.order_date, po.expected_delivery_date, po.status, v.vendor_name, po.total_amount;

-- Stock Movement History
CREATE OR REPLACE VIEW v_stock_movement_history AS
SELECT 
    sm.id,
    sm.movement_date,
    sm.movement_type,
    i.item_code,
    i.item_name,
    sm.quantity,
    i.unit_of_measure,
    sm.location,
    sm.reference_type,
    sm.total_value,
    sm.notes
FROM stock_movements sm
JOIN inventory_items i ON sm.item_id = i.id
ORDER BY sm.movement_date DESC;

-- =============================================
-- SEED DATA
-- =============================================

-- Sample Inventory Items
INSERT INTO inventory_items (item_code, item_name, category, unit_of_measure, reorder_level, reorder_quantity, unit_cost) VALUES
('FEED_001', 'Cattle Feed Premium', 'Feed', 'kg', 500, 1000, 35.00),
('SEED_001', 'Wheat Seeds', 'Seeds', 'kg', 100, 500, 85.00),
('FERT_001', 'NPK Fertilizer', 'Fertilizers', 'kg', 200, 500, 42.00),
('MED_001', 'Veterinary Medicine Kit', 'Medicine', 'piece', 5, 10, 850.00),
('EQUIP_001', 'Irrigation Pipe', 'Equipment', 'meter', 50, 100, 125.00),
('SEED_002', 'Rice Seeds Hybrid', 'Seeds', 'kg', 150, 500, 120.00),
('PEST_001', 'Pesticide Spray', 'Pesticides', 'liter', 20, 50, 280.00),
('FEED_002', 'Poultry Feed', 'Feed', 'kg', 300, 800, 42.00)
ON CONFLICT (item_code) DO NOTHING;

-- Initialize Stock Levels
INSERT INTO inventory_stock (item_id, location, quantity_on_hand)
SELECT id, 'Main Warehouse', 0
FROM inventory_items
ON CONFLICT (item_id, location) DO NOTHING;

COMMENT ON TABLE inventory_items IS 'Inventory catalog with items available for stock';
COMMENT ON TABLE inventory_stock IS 'Current stock levels by item and location';
COMMENT ON TABLE purchase_orders IS 'Purchase orders for inventory procurement';
COMMENT ON TABLE purchase_order_items IS 'Line items in purchase orders';
COMMENT ON TABLE stock_movements IS 'Historical record of all stock transactions';
