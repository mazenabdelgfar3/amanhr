"use client";

import { useTransition, useState } from "react";
import { archiveEmployee, restoreEmployee } from "../actions/archive-employee";
import { Employee } from "../types";
import { AlertTriangle, Loader2 } from "lucide-react";

interface ArchiveDialogProps {
  employee: Employee;
  mode: "archive" | "restore";
  onClose: () => void;
  onSuccess: () => void;
}

export default function ArchiveDialog({ employee, mode, onClose, onSuccess }: ArchiveDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const handleAction = () => {
    setServerError(null);
    startTransition(async () => {
      let response;
      if (mode === "archive") {
        response = await archiveEmployee(employee.id);
      } else {
        response = await restoreEmployee(employee.id);
      }

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        setServerError(response.error?.message || "فشلت العملية. يرجى المحاولة لاحقاً.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 rtl">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-lg space-y-6 animate-in fade-in zoom-in-95 duration-150 text-right">
        
        {/* Icon & Title */}
        <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div className="rounded-full bg-amber-50 dark:bg-amber-950/30 p-2 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-zinc-950 dark:text-white">
            {mode === "archive" ? "تأكيد أرشفة الموظف" : "تأكيد استعادة الموظف"}
          </h3>
        </div>

        {/* Message */}
        <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-2">
          {mode === "archive" ? (
            <p>
              هل أنت متأكد من رغبتك في أرشفة الموظف <strong>{employee.name}</strong>؟ 
              سيتم وضع حالة الموظف كـ "مستقيل" ولن يتم عرضه في الكشوفات النشطة الحالية، ولكن ستبقى سجلاته التاريخية محفوظة.
            </p>
          ) : (
            <p>
              هل تريد استعادة الموظف <strong>{employee.name}</strong> لإعادته إلى القوائم النشطة؟
            </p>
          )}
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50">
            {serverError}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            إلغاء
          </button>
          <button
            onClick={handleAction}
            disabled={isPending}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري المعالجة...
              </>
            ) : (
              mode === "archive" ? "تأكيد الأرشفة" : "تأكيد الاستعادة"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
