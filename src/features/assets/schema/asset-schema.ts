import { z } from "zod";

export const assetStatusEnum = z.enum(["Available", "Assigned", "Damaged", "Maintenance"]);

export const assetSchema = z.object({
  name: z
    .string()
    .min(1, "اسم العهدة مطلوب")
    .min(2, "يجب ألا يقل اسم العهدة عن حرفين")
    .max(100, "يجب ألا يتجاوز الاسم 100 حرف"),
  serialNumber: z
    .string()
    .max(50, "يجب ألا يتجاوز الرقم التسلسلي 50 حرف")
    .optional(),
  status: assetStatusEnum,
});

export const allocateAssetSchema = z.object({
  employeeId: z.string().uuid("رقم الموظف غير صحيح"),
  notes: z
    .string()
    .max(500, "يجب ألا تتجاوز الملاحظات 500 حرف")
    .optional()
    .nullable(),
});

export type AssetInput = z.infer<typeof assetSchema>;
export type AllocateAssetInput = z.infer<typeof allocateAssetSchema>;
export type AssetStatus = z.infer<typeof assetStatusEnum>;
