import { z } from "zod";

export const advanceStatusEnum = z.enum(["Pending", "Approved", "Deducted", "Rejected"]);

export const advanceSchema = z.object({
  employeeId: z.string().uuid("رقم الموظف غير صحيح"),
  date: z.string().min(1, "تاريخ الاستلام مطلوب"),
  amount: z
    .number({ invalid_type_error: "المبلغ يجب أن يكون رقماً" })
    .min(1, "مبلغ السلفة يجب أن يكون أكبر من الصفر"),
  status: advanceStatusEnum,
  notes: z
    .string()
    .max(500, "يجب ألا تتجاوز الملاحظات 500 حرف")
    .optional()
    .nullable(),
});

export type AdvanceInput = z.infer<typeof advanceSchema>;
export type AdvanceStatus = z.infer<typeof advanceStatusEnum>;
