"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { advanceSchema, type AdvanceInput } from "../schema/advance-schema";
import { createAdvance } from "../actions/create-advance";
import { useTransition, useState } from "react";
import { X, Loader2 } from "lucide-react";

interface EmployeeLookup {
  id: string;
  name: string;
}

interface AdvanceFormProps {
  employees: EmployeeLookup[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdvanceForm({ employees, onClose, onSuccess }: AdvanceFormProps) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdvanceInput>({
    resolver: zodResolver(advanceSchema),
    defaultValues: {
      employeeId: "",
      date: new Date().toISOString().split("T")[0],
      amount: 0,
      status: "Pending",
      notes: "",
    },
  });

  const onSubmit = (data: AdvanceInput) => {
    setServerError(null);
    startTransition(async () => {
      const response = await createAdvance(data);
      if (response.success) {
        onSuccess();
        onClose();
      } else {
        setServerError(response.error?.message || "حدث خطأ أثناء حفظ السلفة.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 rtl">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-lg space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <h2 className="text-lg font-bold text-zinc-950 dark:text-white">تسجيل سلفة مالية جديدة</h2>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white p-1 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 text-right">
            {serverError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-right">
          
          {/* Employee Dropdown */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              اختر الموظف <span className="text-red-500">*</span>
            </label>
            <select
              {...register("employeeId")}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none dark:focus:border-white text-right"
            >
              <option value="">-- اختر من قائمة العمال --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
            {errors.employeeId && (
              <span className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.employeeId.message}</span>
            )}
          </div>

          {/* Amount */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              مبلغ السلفة (ج.م) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              {...register("amount", { valueAsNumber: true })}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none dark:focus:border-white text-right font-mono"
              placeholder="0.00"
            />
            {errors.amount && (
              <span className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.amount.message}</span>
            )}
          </div>

          {/* Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              تاريخ الاستحقاق <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register("date")}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none dark:focus:border-white text-right font-mono"
            />
            {errors.date && (
              <span className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.date.message}</span>
            )}
          </div>

          {/* Notes */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              ملاحظات إضافية
            </label>
            <textarea
              {...register("notes")}
              rows={3}
              placeholder="توضيح سبب السلفة أو شروط السداد إن وجدت..."
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none dark:focus:border-white text-right"
            />
            {errors.notes && (
              <span className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.notes.message}</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "تسجيل السلفة"
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
