"use client";

import { useState, useEffect, useTransition } from "react";
import { getDailySheet } from "../actions/get-daily-sheet";
import { saveDailySheet } from "../actions/save-daily-sheet";
import { DailyWorkRow } from "../types";
import DateSelector from "./DateSelector";
import SummaryCards from "./SummaryCards";
import { CheckCircle2, AlertCircle, Save } from "lucide-react";

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4.5">
      <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded-md w-36"></div>
    </td>
    <td className="px-6 py-3">
      <div className="h-8 bg-zinc-150 dark:bg-zinc-850 rounded-md w-full"></div>
    </td>
    <td className="px-6 py-3">
      <div className="h-8 bg-zinc-150 dark:bg-zinc-850 rounded-md w-24 mx-auto"></div>
    </td>
    <td className="px-6 py-3">
      <div className="h-8 bg-zinc-150 dark:bg-zinc-850 rounded-md w-24 mx-auto"></div>
    </td>
    <td className="px-6 py-3">
      <div className="h-8 bg-zinc-150 dark:bg-zinc-850 rounded-md w-full"></div>
    </td>
  </tr>
);

export default function DailyWorkSheet() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [rows, setRows] = useState<DailyWorkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Notifications
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Unsaved changes state
  const [hasChanges, setHasChanges] = useState(false);

  // Load daily sheet whenever the selected date changes
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setStatusMessage(null);
      setHasChanges(false);
      
      const response = await getDailySheet(selectedDate);
      if (response.success && response.data) {
        setRows(response.data);
      } else {
        setStatusMessage({
          type: "error",
          text: response.error?.message || "فشل تحميل البيانات لهذا اليوم.",
        });
      }
      setLoading(false);
    }
    loadData();
  }, [selectedDate]);

  // Handle inline updates
  const handleRowChange = (
    index: number,
    field: keyof DailyWorkRow,
    value: any
  ) => {
    setHasChanges(true);
    setRows((prev) => {
      const updated = [...prev];
      const row = { ...updated[index], [field]: value };

      // Business Rule: If attendance is not "Present", reset and force production/overtime to 0
      if (field === "attendance" && value !== "Present") {
        row.production = 0;
        row.overtimeHours = 0;
      }

      updated[index] = row;
      return updated;
    });
  };

  // Submit changes
  const handleSave = () => {
    setStatusMessage(null);
    startTransition(async () => {
      const response = await saveDailySheet({
        date: selectedDate,
        rows: rows,
      });

      if (response.success) {
        setStatusMessage({
          type: "success",
          text: "تم حفظ الكشف اليومي بنجاح.",
        });
        setHasChanges(false);
      } else {
        setStatusMessage({
          type: "error",
          text: response.error?.message || "حدث خطأ أثناء حفظ الكشف اليومي.",
        });
      }
    });
  };

  return (
    <div className="space-y-6 rtl text-right font-sans">
      
      {/* Date Selector */}
      <DateSelector
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        disabled={loading || isPending}
      />

      {/* Notifications */}
      {statusMessage && (
        <div
          className={`flex items-center gap-2 rounded-lg border p-4 text-xs font-semibold ${
            statusMessage.type === "success"
              ? "bg-green-50 text-green-800 border-green-200/60 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/40"
              : "bg-red-50 text-red-800 border-red-200/60 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/40"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="h-4.5 w-4.5 text-green-600 dark:text-green-400 shrink-0" />
          ) : (
            <AlertCircle className="h-4.5 w-4.5 text-red-600 dark:text-red-400 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Summary Cards */}
      {!loading && <SummaryCards rows={rows} />}

      {/* Worksheet Container */}
      <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 overflow-hidden shadow-xs">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full border-collapse text-xs text-right">
            <thead className="sticky top-0 bg-zinc-50/95 dark:bg-zinc-900/95 backdrop-blur-xs text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800 z-5">
              <tr>
                <th className="px-6 py-3.5">الاسم الكامل للموظف</th>
                <th className="px-6 py-3.5 w-48">حالة الحضور والغياب اليومي</th>
                <th className="px-6 py-3.5 w-40 text-center">الإنتاج اليومي (ج.م)</th>
                <th className="px-6 py-3.5 w-40 text-center">ساعات العمل الإضافي</th>
                <th className="px-6 py-3.5">الملاحظات واليوميات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-zinc-400 dark:text-zinc-550">
                    لا يوجد موظفون نشطون مسجلون في قاعدة البيانات لإعداد هذا الكشف.
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => {
                  const isPresent = row.attendance === "Present";

                  return (
                    <tr
                      key={row.employeeId}
                      className="hover:bg-zinc-55/30 dark:hover:bg-zinc-900/30 transition-colors duration-150"
                    >
                      {/* Name */}
                      <td className="px-6 py-3.5 font-semibold text-zinc-900 dark:text-white">
                        {row.name}
                      </td>

                      {/* Attendance Selector */}
                      <td className="px-6 py-2.5">
                        <select
                          value={row.attendance}
                          disabled={isPending}
                          onChange={(e) =>
                            handleRowChange(index, "attendance", e.target.value)
                          }
                          className={`w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-2 py-1.5 text-xs text-right focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white focus:outline-none transition-all font-medium ${
                            row.attendance === "Present"
                              ? "text-green-600 dark:text-green-400 font-bold"
                              : "text-zinc-500 dark:text-zinc-400"
                          }`}
                        >
                          <option value="Present">حاضر (Present)</option>
                          <option value="Absent">غائب (Absent)</option>
                          <option value="Vacation">إجازة (Vacation)</option>
                          <option value="Permission">إذن (Permission)</option>
                        </select>
                      </td>

                      {/* Production Output */}
                      <td className="px-6 py-2.5">
                        <input
                          type="number"
                          min="0"
                          value={row.production}
                          disabled={!isPresent || isPending}
                          onChange={(e) =>
                            handleRowChange(
                              index,
                              "production",
                              Math.max(0, Number(e.target.value))
                            )
                          }
                          className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-3 py-1.5 text-xs focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white focus:outline-none transition-all text-center font-bold font-mono disabled:opacity-40"
                        />
                      </td>

                      {/* Overtime Hours */}
                      <td className="px-6 py-2.5">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="24"
                          value={row.overtimeHours}
                          disabled={!isPresent || isPending}
                          onChange={(e) =>
                            handleRowChange(
                              index,
                              "overtimeHours",
                              Math.min(24, Math.max(0, Number(e.target.value)))
                            )
                          }
                          className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-3 py-1.5 text-xs focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white focus:outline-none transition-all text-center font-bold font-mono disabled:opacity-40"
                        />
                      </td>

                      {/* Notes */}
                      <td className="px-6 py-2.5">
                        <input
                          type="text"
                          placeholder="ملاحظات الحضور أو الإنتاج..."
                          value={row.notes || ""}
                          disabled={isPending}
                          onChange={(e) =>
                            handleRowChange(index, "notes", e.target.value)
                          }
                          className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-3 py-1.5 text-xs focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white focus:outline-none transition-all text-right placeholder-zinc-400"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Save Button */}
        {!loading && rows.length > 0 && (
          <div className="flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/10 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="text-[11px] font-semibold">
              {hasChanges ? (
                <span className="text-amber-600 dark:text-amber-400 animate-pulse">
                  ● هناك تعديلات غير محفوظة في الكشف اليومي
                </span>
              ) : (
                <span className="text-green-600 dark:text-green-400">
                  ✓ تم حفظ كافة المدخلات ومطابقتها مع خادم قاعدة البيانات
                </span>
              )}
            </div>

            <button
              onClick={handleSave}
              disabled={isPending || !hasChanges}
              className="flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 px-5 py-2 text-xs font-bold text-white dark:text-zinc-950 disabled:opacity-50 transition-colors shadow-xs"
            >
              <Save className="h-4 w-4" />
              {isPending ? "جاري الحفظ..." : "حفظ اليومية الحالية"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
