"use client";

import { useState, useEffect, useTransition } from "react";
import { getDailySheet } from "../actions/get-daily-sheet";
import { saveDailySheet } from "../actions/save-daily-sheet";
import { DailyWorkRow } from "../types";
import DateSelector from "./DateSelector";
import SummaryCards from "./SummaryCards";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

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
    <div className="space-y-6 rtl text-right">
      
      {/* Date Selector */}
      <DateSelector
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        disabled={loading || isPending}
      />

      {/* Notifications */}
      {statusMessage && (
        <div
          className={`flex items-center gap-2 rounded-lg border p-4 text-sm ${
            statusMessage.type === "success"
              ? "bg-green-50 text-green-800 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50"
              : "bg-red-50 text-red-800 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Summary Cards */}
      {!loading && <SummaryCards rows={rows} />}

      {/* Worksheet Container */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-500">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-sm">جاري تحميل كشف اليومية...</span>
          </div>
        ) : rows.length === 0 ? (
          <div className="py-20 text-center text-zinc-400">
            لا يوجد موظفون مسجلون في قاعدة البيانات لإعداد هذا الكشف. 
            يرجى إضافة موظفين أولاً من صفحة الموظفين.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm text-right">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 font-medium">
                <tr>
                  <th className="px-6 py-3">الاسم بالكامل</th>
                  <th className="px-6 py-3 w-40">حالة الحضور اليومي</th>
                  <th className="px-6 py-3 w-36">الإنتاج اليومي (وحدة)</th>
                  <th className="px-6 py-3 w-36">ساعات الإضافي</th>
                  <th className="px-6 py-3">الملاحظات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {rows.map((row, index) => {
                  const isPresent = row.attendance === "Present";

                  return (
                    <tr
                      key={row.employeeId}
                      className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors"
                    >
                      {/* Name */}
                      <td className="px-6 py-4 font-medium text-zinc-950 dark:text-white">
                        {row.name}
                      </td>

                      {/* Attendance Selector */}
                      <td className="px-6 py-3">
                        <select
                          value={row.attendance}
                          onChange={(e) =>
                            handleRowChange(index, "attendance", e.target.value)
                          }
                          className={`w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-2 py-1.5 text-xs text-right focus:outline-none focus:border-zinc-950 dark:focus:border-white font-medium ${
                            row.attendance === "Present"
                              ? "text-green-600 dark:text-green-400 font-bold"
                              : "text-zinc-600 dark:text-zinc-400"
                          }`}
                        >
                          <option value="Present">حاضر (Present)</option>
                          <option value="Absent">غائب (Absent)</option>
                          <option value="Vacation">إجازة (Vacation)</option>
                          <option value="Permission">إذن (Permission)</option>
                        </select>
                      </td>

                      {/* Production Output */}
                      <td className="px-6 py-3">
                        <input
                          type="number"
                          min="0"
                          value={row.production}
                          disabled={!isPresent}
                          onChange={(e) =>
                            handleRowChange(
                              index,
                              "production",
                              Math.max(0, Number(e.target.value))
                            )
                          }
                          className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-xs focus:outline-none focus:border-zinc-950 dark:focus:border-white text-center font-semibold font-mono disabled:opacity-40"
                        />
                      </td>

                      {/* Overtime Hours */}
                      <td className="px-6 py-3">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="24"
                          value={row.overtimeHours}
                          disabled={!isPresent}
                          onChange={(e) =>
                            handleRowChange(
                              index,
                              "overtimeHours",
                              Math.min(24, Math.max(0, Number(e.target.value)))
                            )
                          }
                          className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-xs focus:outline-none focus:border-zinc-950 dark:focus:border-white text-center font-semibold font-mono disabled:opacity-40"
                        />
                      </td>

                      {/* Notes */}
                      <td className="px-6 py-3">
                        <input
                          type="text"
                          placeholder="ملاحظات الحضور أو الإنتاج..."
                          value={row.notes || ""}
                          onChange={(e) =>
                            handleRowChange(index, "notes", e.target.value)
                          }
                          className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-xs focus:outline-none focus:border-zinc-950 dark:focus:border-white text-right placeholder-zinc-400"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Save Button */}
        {!loading && rows.length > 0 && (
          <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/30 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="text-xs text-zinc-500 font-medium">
              {hasChanges ? (
                <span className="text-amber-600 dark:text-amber-400 animate-pulse">
                  ● هناك تعديلات غير محفوظة في الكشف اليومي
                </span>
              ) : (
                <span className="text-green-600 dark:text-green-400">
                  ✓ الكشف مطابق لقاعدة البيانات ومحفوظ
                </span>
              )}
            </div>

            <button
              onClick={handleSave}
              disabled={isPending || !hasChanges}
              className="flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 disabled:opacity-50 transition-opacity"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ الكشف اليومي"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
