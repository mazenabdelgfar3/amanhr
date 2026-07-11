-- Create employees table
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL CHECK (char_length(name) >= 3 AND char_length(name) <= 100),
    phone VARCHAR(20) NOT NULL UNIQUE,
    national_id CHAR(14) NOT NULL UNIQUE CHECK (char_length(national_id) = 14),
    base_salary DECIMAL(12, 2) NOT NULL CHECK (base_salary >= 0),
    hiring_date DATE NOT NULL CHECK (hiring_date <= CURRENT_DATE),
    status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Vacation', 'Suspended', 'Resigned')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_employees_name ON public.employees(name);
CREATE INDEX IF NOT EXISTS idx_employees_phone ON public.employees(phone);
CREATE INDEX IF NOT EXISTS idx_employees_national_id ON public.employees(national_id);
CREATE INDEX IF NOT EXISTS idx_employees_status ON public.employees(status);

-- Create trigger to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_employees_updated_at
    BEFORE UPDATE ON public.employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
