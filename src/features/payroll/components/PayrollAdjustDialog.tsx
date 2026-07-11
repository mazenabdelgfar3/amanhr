"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { payrollAdjustmentSchema, type PayrollAdjustmentInput } from "../schema/payroll-schema";
import { updatePayrollItem } from "../actions/update-payroll-item";
import { PayrollItem } from "../types";
import { useTransition, useState } from "react";
import { X, Loader2 } from "lucide-react";

interface PayrollAdjustDialogProps {
  item: PayrollItem;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PayrollAdjustDialog({ item, onClose, onSuccess }: PayrollAdjustDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PayrollAdjustmentInput>({
    resolver: zodResolver(payrollAdjustmentSchema),
    defaultValues: {
      bonuses: Number(item.bonuses || 0),
      deductions: Number(item.deductions || 0),
      notes: item.notes || "",
    },
  });

  const onSubmit = (data: PayrollAdjustmentInput) => {
    setServerError(null);
    startTransition(async () => {
      const response = await updatePayrollItem(item.id, data);
      if (response.success) {
        onSuccess();
        onClose();
      } else {
        setServerError(response.error?.message || "حدث خطأ أثناء حفظ التعديلات.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/20 backdrop-blur-xs px-4 rtl">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 shadow-lg space-y-5 animate-in fade-in zoom-in-95 duration-155">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white">تسوية الراتب والمكافآت</h2>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 p-1.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Worker Info */}
        <div className="rounded-lg bg-zinc-50/50 dark:bg-zinc-950 p-3.5 border border-zinc-200/60 dark:border-zinc-850 text-right text-sm">
          <div className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold">الراتب المحسوب للموظف</div>
          <div className="font-bold text-zinc-900 dark:text-white mt-1 text-sm">{item.employee_name}</div>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-3.5 text-xs font-semibold text-red-650 dark:text-red-400 border border-red-200/60 dark:border-red-900/40 text-right">
            {serverError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-right">
          
          {/* Bonuses */}
          <div className="flex flex-col">
            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
              المكافآت والزيادات الشهرية (ج.م)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("bonuses", { valueAsNumber: true })}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-3.5 py-2.5 text-sm focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white focus:outline-none transition-all text-right font-bold font-mono"
              placeholder="0.00"
            />
            {errors.bonuses && (
              <span className="text-xs text-red-650 dark:text-red-400 mt-1">{errors.bonuses.message}</span>
            )}
          </div>

          {/* Deductions */}
          <div className="flex flex-col">
            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
              الخصومات والجزاءات العادية (ج.م)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("deductions", { valueAsNumber: true })}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-3.5 py-2.5 text-sm focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white focus:outline-none transition-all text-right font-bold font-mono"
              placeholder="0.00"
            />
            {errors.deductions && (
              <span className="text-xs text-red-650 dark:text-red-400 mt-1">{errors.deductions.message}</span>
            )}
          </div>

          {/* Notes */}
          <div className="flex flex-col">
            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
              أسباب التسوية والملاحظات
            </label>
            <textarea
              {...register("notes")}
              rows={3}
              placeholder="تفاصيل التعديلات لتسجيلها بالتقرير..."
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-3.5 py-2.5 text-sm focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white focus:outline-none transition-all text-right leading-relaxed"
            />
            {errors.notes && (
              <span className="text-xs text-red-650 dark:text-red-400 mt-1">{errors.notes.message}</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 border-t border-zinc-100 dark:border-zinc-850 pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 px-4.5 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 px-5 py-2.5 text-sm font-semibold text-white dark:text-zinc-950 disabled:opacity-50 transition-colors"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ التسوية"
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
