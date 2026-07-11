import { z } from "zod";

export const attendanceStatusEnum = z.enum(["Present", "Absent", "Vacation", "Permission"]);

export const dailyWorkRowSchema = z.object({
  employeeId: z.string().uuid("رقم الموظف غير صحيح"),
  name: z.string(), // Helper field for UI
  attendance: attendanceStatusEnum,
  production: z
    .number({ invalid_type_error: "الإنتاج يجب أن يكون رقماً" })
    .min(0, "الإنتاج لا يمكن أن يكون سالباً"),
  overtimeHours: z
    .number({ invalid_type_error: "ساعات الإضافي يجب أن تكون رقماً" })
    .min(0, "ساعات الإضافي لا يمكن أن تكون أقل من صفر")
    .max(24, "ساعات الإضافي لا يمكن أن تتجاوز 24 ساعة"),
  notes: z
    .string()
    .max(500, "يجب ألا تتجاوز الملاحظات 500 حرف")
    .optional()
    .nullable(),
});

export const saveDailySheetSchema = z.object({
  date: z.string().refine((val) => {
    const date = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date <= today;
  }, "التاريخ لا يمكن أن يكون في المستقبل"),
  rows: z.array(dailyWorkRowSchema),
});

export type DailyWorkRowInput = z.infer<typeof dailyWorkRowSchema>;
export type SaveDailySheetInput = z.infer<typeof saveDailySheetSchema>;
export type AttendanceStatus = z.infer<typeof attendanceStatusEnum>;
