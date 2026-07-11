"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { allocateAssetSchema, type AllocateAssetInput } from "../schema/asset-schema";
import { allocateAsset } from "../actions/allocate-asset";
import { useTransition, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Asset } from "../types";

interface EmployeeLookup {
  id: string;
  name: string;
}

interface AllocateAssetDialogProps {
  asset: Asset;
  employees: EmployeeLookup[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function AllocateAssetDialog({
  asset,
  employees,
  onClose,
  onSuccess,
}: AllocateAssetDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AllocateAssetInput>({
    resolver: zodResolver(allocateAssetSchema),
    defaultValues: {
      employeeId: "",
      notes: "",
    },
  });

  const onSubmit = (data: AllocateAssetInput) => {
    setServerError(null);
    startTransition(async () => {
      const response = await allocateAsset(asset.id, data);
      if (response.success) {
        onSuccess();
        onClose();
      } else {
        setServerError(response.error?.message || "حدث خطأ أثناء تسليم العهدة.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 rtl">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-lg space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <h2 className="text-lg font-bold text-zinc-950 dark:text-white">تسليم عهدة لموظف</h2>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white p-1 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Selected Asset Info */}
        <div className="rounded-lg bg-zinc-50 dark:bg-zinc-950 p-3 border border-zinc-200 dark:border-zinc-850 text-right space-y-1">
          <div className="text-xs text-zinc-400">العهدة المحددة</div>
          <div className="text-sm font-bold text-zinc-900 dark:text-white">{asset.name}</div>
          {asset.serial_number && (
            <div className="text-xs font-mono text-zinc-500">رقم تسلسلي: {asset.serial_number}</div>
          )}
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
              المستلم (الموظف) <span className="text-red-500">*</span>
            </label>
            <select
              {...register("employeeId")}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none dark:focus:border-white text-right"
            >
              <option value="">-- اختر الموظف المستلم --</option>
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

          {/* Allocation Notes */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              ملاحظات الاستلام
            </label>
            <textarea
              {...register("notes")}
              rows={3}
              placeholder="مثال: حالة الأداة عند الاستلام، تاريخ الإرجاع المتوقع..."
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
                  جاري التسليم...
                </>
              ) : (
                "تأكيد التسليم"
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
