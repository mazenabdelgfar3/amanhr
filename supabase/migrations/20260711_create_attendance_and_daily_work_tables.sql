-- Create public.attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE RESTRICT,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Present', 'Absent', 'Vacation', 'Permission')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    UNIQUE (employee_id, date)
);

-- Create public.daily_work table
CREATE TABLE IF NOT EXISTS public.daily_work (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE RESTRICT,
    date DATE NOT NULL,
    production DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (production >= 0),
    overtime_hours DECIMAL(4, 2) NOT NULL DEFAULT 0 CHECK (overtime_hours >= 0 AND overtime_hours <= 24),
    notes VARCHAR(500) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    UNIQUE (employee_id, date)
);

-- Create indexes for fast lookup by date and employee
CREATE INDEX IF NOT EXISTS idx_attendance_date_emp ON public.attendance(date, employee_id);
CREATE INDEX IF NOT EXISTS idx_daily_work_date_emp ON public.daily_work(date, employee_id);

-- Create trigger to update updated_at columns automatically
CREATE OR REPLACE TRIGGER update_attendance_updated_at
    BEFORE UPDATE ON public.attendance
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_daily_work_updated_at
    BEFORE UPDATE ON public.daily_work
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
