import { AssetStatus } from "../schema/asset-schema";

export interface Asset {
  id: string;
  name: string;
  serial_number?: string | null;
  status: AssetStatus;
  created_at: string;
  updated_at: string;
  // Merged allocations info for UI representation
  current_employee_name?: string | null;
  current_employee_id?: string | null;
  allocated_at?: string | null;
  allocation_id?: string | null;
}

export interface AssetAllocation {
  id: string;
  asset_id: string;
  employee_id: string;
  allocated_at: string;
  returned_at?: string | null;
  notes?: string | null;
  created_by?: string | null;
}
