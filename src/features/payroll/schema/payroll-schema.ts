import { z } from "zod";

export const payrollStatusEnum = z.enum(["Draft", "Approved", "Paid"]);

export const payrollAdjustmentSchema = z.object({
  bonuses: z
    .number({ invalid_type_error: "المكافآت يجب أن تكون رقماً" })
    .min(0, "المكافآت لا يمكن أن تكون قيمة سالبة"),
  deductions: z
    .number({ invalid_type_error: "الخصومات يجب أن تكون رقماً" })
    .min(0, "الخصومات لا يمكن أن تكون قيمة سالبة"),
  notes: z
    .string()
    .max(500, "يجب ألا تتجاوز الملاحظات 500 حرف")
    .optional()
    .nullable(),
});

export const generatePayrollSchema = z.object({
  month: z
    .number()
    .min(1, "الشهر غير صحيح")
    .max(12, "الشهر غير صحيح"),
  year: z
    .number()
    .min(2020, "السنة غير صحيحة")
    .max(2100, "السنة غير صحيحة"),
  overtimeMultiplier: z.number().optional(),
  workingDays: z.number().optional(),
  workingHours: z.number().optional(),
  productionUnitRate: z.number().optional(),
});

export type PayrollAdjustmentInput = z.infer<typeof payrollAdjustmentSchema>;
export type GeneratePayrollInput = z.infer<typeof generatePayrollSchema>;
export type PayrollStatus = z.infer<typeof payrollStatusEnum>;
