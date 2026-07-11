import { z } from "zod";

export const employeeStatusEnum = z.enum(["Active", "Vacation", "Suspended", "Resigned"]);

export const employeeSchema = z.object({
  name: z
    .string()
    .min(1, "الاسم مطلوب")
    .min(3, "يجب ألا يقل الاسم عن 3 أحرف")
    .max(100, "يجب ألا يتجاوز الاسم 100 حرف"),
  phone: z
    .string()
    .min(1, "رقم الهاتف مطلوب")
    .regex(/^[0-9+\-\s()]{8,20}$/, "رقم هاتف غير صحيح"),
  nationalId: z
    .string()
    .min(1, "الرقم القومي مطلوب")
    .length(14, "الرقم القومي يجب أن يتكون من 14 رقماً بالضبط")
    .regex(/^[0-9]+$/, "الرقم القومي يجب أن يحتوي على أرقام فقط"),
  baseSalary: z
    .number({ invalid_type_error: "الراتب الأساسي يجب أن يكون رقماً" })
    .min(0, "الراتب الأساسي لا يمكن أن يكون سالباً"),
  hiringDate: z
    .string()
    .min(1, "تاريخ التعيين مطلوب")
    .refine((val) => {
      const date = new Date(val);
      const today = new Date();
      // Remove time parts for correct day comparison
      today.setHours(0, 0, 0, 0);
      return date <= today;
    }, "تاريخ التعيين لا يمكن أن يكون في المستقبل"),
  status: employeeStatusEnum,
});

export type EmployeeInput = z.infer<typeof employeeSchema>;
export type EmployeeStatus = z.infer<typeof employeeStatusEnum>;
