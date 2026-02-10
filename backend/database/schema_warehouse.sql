-- Warehouse Module Schema

-- 1. Locations Table
CREATE TABLE warehouse_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'WAREHOUSE', -- WAREHOUSE, ZONE, RACK, BIN, TANK, SILO
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES warehouse_locations(id),
    is_active BOOLEAN DEFAULT TRUE,
    capacity DECIMAL(10, 2),
    capacity_unit VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Stock Transfers Table
CREATE TABLE warehouse_transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transfer_number VARCHAR(50) UNIQUE NOT NULL,
    item_id UUID NOT NULL, -- References inventory_items (loose coupling or FK)
    from_location_id UUID REFERENCES warehouse_locations(id),
    to_location_id UUID REFERENCES warehouse_locations(id) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, COMPLETED, CANCELLED
    transferred_by VARCHAR(100), -- User ID or Name
    notes TEXT,
    transferred_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_location_parent ON warehouse_locations(parent_id);
CREATE INDEX idx_transfer_item ON warehouse_transfers(item_id);
CREATE INDEX idx_transfer_status ON warehouse_transfers(status);
