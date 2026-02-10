-- Processing Module Schema

-- 1. Recipes Table
CREATE TABLE processing_recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    output_item_id UUID NOT NULL, -- References inventory_items
    expected_yield DECIMAL(10, 2) NOT NULL,
    yield_unit VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Recipe Inputs Table (Ingredients)
CREATE TABLE processing_recipe_inputs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID REFERENCES processing_recipes(id) ON DELETE CASCADE,
    item_id UUID NOT NULL, -- References inventory_items
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL
);

-- 3. Batches Table (Production Runs)
CREATE TABLE processing_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_number VARCHAR(50) UNIQUE NOT NULL,
    recipe_id UUID REFERENCES processing_recipes(id),
    status VARCHAR(20) DEFAULT 'PLANNED', -- PLANNED, IN_PROGRESS, COMPLETED, CANCELLED
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    actual_yield DECIMAL(10, 2),
    managed_by VARCHAR(100), -- User ID
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_recipe_output ON processing_recipes(output_item_id);
CREATE INDEX idx_recipe_input_recipe ON processing_recipe_inputs(recipe_id);
CREATE INDEX idx_batch_recipe ON processing_batches(recipe_id);
CREATE INDEX idx_batch_status ON processing_batches(status);
