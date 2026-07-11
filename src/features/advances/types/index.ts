import { AdvanceStatus } from "../schema/advance-schema";

export interface Advance {
  id: string;
  employee_id: string;
  date: string;
  amount: number;
  status: AdvanceStatus;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  updated_by?: string | null;
  // Merged field for UI display convenience
  employee_name?: string;
}
