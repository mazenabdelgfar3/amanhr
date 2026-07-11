-- Create payroll table (الرواتب الشهرية)
CREATE TABLE IF NOT EXISTS public.payroll (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE RESTRICT,
    month INT NOT NULL CHECK (month >= 1 AND month <= 12),
    year INT NOT NULL CHECK (year >= 2020 AND year <= 2100),
    days_present INT NOT NULL DEFAULT 0 CHECK (days_present >= 0),
    days_absent INT NOT NULL DEFAULT 0 CHECK (days_absent >= 0),
    total_production DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (total_production >= 0),
    total_overtime_hours DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (total_overtime_hours >= 0),
    base_salary_captured DECIMAL(12, 2) NOT NULL CHECK (base_salary_captured >= 0),
    production_pay DECIMAL(12, 2) NOT NULL DEFAULT 0 CHECK (production_pay >= 0),
    overtime_pay DECIMAL(12, 2) NOT NULL DEFAULT 0 CHECK (overtime_pay >= 0),
    advances_deducted DECIMAL(12, 2) NOT NULL DEFAULT 0 CHECK (advances_deducted >= 0),
    bonuses DECIMAL(12, 2) NOT NULL DEFAULT 0 CHECK (bonuses >= 0),
    deductions DECIMAL(12, 2) NOT NULL DEFAULT 0 CHECK (deductions >= 0),
    net_salary DECIMAL(12, 2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Approved', 'Paid')),
    notes VARCHAR(500) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    UNIQUE (employee_id, month, year) -- One payroll record per employee per month/year
);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_payroll_date ON public.payroll(year, month);
CREATE INDEX IF NOT EXISTS idx_payroll_employee ON public.payroll(employee_id);
CREATE INDEX IF NOT EXISTS idx_payroll_status ON public.payroll(status);

-- Create trigger to update updated_at columns automatically
CREATE OR REPLACE TRIGGER update_payroll_updated_at
    BEFORE UPDATE ON public.payroll
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
