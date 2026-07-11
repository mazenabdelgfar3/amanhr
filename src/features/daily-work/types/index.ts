import { AttendanceStatus } from "../schema/daily-work-schema";

export interface DailyWorkRow {
  employeeId: string;
  name: string;
  attendance: AttendanceStatus;
  production: number;
  overtimeHours: number;
  notes?: string | null;
  attendanceId?: string; // Optional reference if record already exists
  dailyWorkId?: string; // Optional reference if record already exists
}

export interface DailySheetSummary {
  date: string;
  totalEmployees: number;
  totalPresent: number;
  totalAbsent: number;
  totalVacation: number;
  totalPermission: number;
  totalProduction: number;
  totalOvertimeHours: number;
}
