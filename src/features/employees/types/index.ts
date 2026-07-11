import { EmployeeStatus } from "../schema/employee-schema";

export interface Employee {
  id: string;
  name: string;
  phone: string;
  national_id: string;
  base_salary: number;
  hiring_date: string;
  status: EmployeeStatus;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  updated_by?: string | null;
  deleted_at?: string | null;
}
