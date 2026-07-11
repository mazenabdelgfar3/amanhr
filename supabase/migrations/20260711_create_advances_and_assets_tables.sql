-- Create advances table (السلف المالية)
CREATE TABLE IF NOT EXISTS public.advances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE RESTRICT,
    date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Deducted', 'Rejected')),
    notes VARCHAR(500) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create assets table (العهد والمعدات)
CREATE TABLE IF NOT EXISTS public.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL CHECK (char_length(name) >= 2 AND char_length(name) <= 100),
    serial_number VARCHAR(50) UNIQUE NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Assigned', 'Damaged', 'Maintenance')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create asset_allocations table (تخصيص العهد للموظفين)
CREATE TABLE IF NOT EXISTS public.asset_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE RESTRICT,
    allocated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    returned_at TIMESTAMP WITH TIME ZONE NULL,
    notes VARCHAR(500) NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_advances_employee ON public.advances(employee_id);
CREATE INDEX IF NOT EXISTS idx_advances_date ON public.advances(date);
CREATE INDEX IF NOT EXISTS idx_assets_status ON public.assets(status);
CREATE INDEX IF NOT EXISTS idx_allocations_asset ON public.asset_allocations(asset_id);
CREATE INDEX IF NOT EXISTS idx_allocations_employee ON public.asset_allocations(employee_id);

-- Create triggers to update updated_at columns automatically
CREATE OR REPLACE TRIGGER update_advances_updated_at
    BEFORE UPDATE ON public.advances
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_assets_updated_at
    BEFORE UPDATE ON public.assets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
