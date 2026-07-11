import { PayrollStatus } from "../schema/payroll-schema";

export interface PayrollItem {
  id: string;
  employee_id: string;
  month: number;
  year: number;
  days_present: number;
  days_absent: number;
  total_production: number;
  total_overtime_hours: number;
  base_salary_captured: number;
  production_pay: number;
  overtime_pay: number;
  advances_deducted: number;
  bonuses: number;
  deductions: number;
  net_salary: number;
  status: PayrollStatus;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  updated_by?: string | null;
  // Merged lookup property
  employee_name?: string;
}

export interface PayrollSummary {
  month: number;
  year: number;
  totalEmployees: number;
  totalBaseSalary: number;
  totalProductionPay: number;
  totalOvertimePay: number;
  totalAdvancesDeducted: number;
  totalBonuses: number;
  totalDeductions: number;
  totalNetSalary: number;
  status: PayrollStatus;
}
