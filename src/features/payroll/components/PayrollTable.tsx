"use client";

import { useState, useMemo, useTransition } from "react";
import { PayrollItem } from "../types";
import { updatePayrollItem, deletePayrollSheet } from "../actions/update-payroll-item";
import { updatePayrollSheetStatus } from "../actions/approve-payroll";
import { Edit2, BadgePercent, CheckCircle, Wallet, Trash, Calendar, FileText } from "lucide-react";
import PayrollAdjustDialog from "./PayrollAdjustDialog";
import PayrollGenerator from "./PayrollGenerator";

interface PayrollTableProps {
  initialPayroll: PayrollItem[];
}

export default function PayrollTable({ initialPayroll }: PayrollTableProps) {
  const [payroll, setPayroll] = useState<PayrollItem[]>(initialPayroll);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isPending, startTransition] = useTransition();

  // Adjust dialog trigger
  const [adjustTarget, setAdjustTarget] = useState<PayrollItem | null>(null);

  // Status mapping
  const statusBadges: Record<string, string> = {
    Draft: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
    Approved: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50",
    Paid: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50",
  };

  const statusTranslations: Record<string, string> = {
    Draft: "مسودة",
    Approved: "معتمدة",
    Paid: "مصلت ومصروفة",
  };

  // Filtered rows for the selected month/year
  const filteredRows = useMemo(() => {
    return payroll.filter(
      (item) => item.month === selectedMonth && item.year === selectedYear
    );
  }, [payroll, selectedMonth, selectedYear]);

  // Overall sheet status
  const sheetStatus = filteredRows[0]?.status || "None";

  // Financial aggregates
  const aggregates = useMemo(() => {
    return filteredRows.reduce(
      (acc, item) => {
        acc.employees += 1;
        acc.baseEarned += (Number(item.base_salary_captured) / 26) * item.days_present;
        acc.production += Number(item.production_pay || 0);
        acc.overtime += Number(item.overtime_pay || 0);
        acc.advances += Number(item.advances_deducted || 0);
        acc.bonuses += Number(item.bonuses || 0);
        acc.deductions += Number(item.deductions || 0);
        acc.netSalary += Number(item.net_salary || 0);
        return acc;
      },
      { employees: 0, baseEarned: 0, production: 0, overtime: 0, advances: 0, bonuses: 0, deductions: 0, netSalary: 0 }
    );
  }, [filteredRows]);

  const handleUpdateStatus = (nextStatus: "Approved" | "Paid") => {
    const msg = 
      nextStatus === "Approved" 
        ? "هل أنت متأكد من اعتماد كشف الرواتب لهذا الشهر؟ لن يكون من الممكن تعديل البنود المالية بعد الاعتماد."
        : "تأكيد صرف رواتب العمال لهذا الشهر؟ سيتم تسوية سلف العمال المدرجة تلقائياً كـ 'تم الخصم'.";

    if (!confirm(msg)) return;

    startTransition(async () => {
      const res = await updatePayrollSheetStatus(selectedMonth, selectedYear, nextStatus);
      if (res.success) {
        window.location.reload();
      } else {
        alert(res.error?.message || "فشلت العملية.");
      }
    });
  };

  const handleDeleteSheet = () => {
    if (!confirm("هل تريد حذف مسيرة الرواتب لهذا الشهر وإعادة احتسابها؟")) return;
    startTransition(async () => {
      const res = await deletePayrollSheet(selectedMonth, selectedYear);
      if (res.success) {
        window.location.reload();
      } else {
        alert(res.error?.message || "فشلت العملية.");
      }
    });
  };

  return (
    <div className="space-y-6 rtl text-right">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white">مسيرات الرواتب الشهرية</h1>
          <p className="text-sm text-zinc-500">احتساب مستحقات عمال المقاولات بناءً على دفاتر الحضور وإنتاجية العمل اليومية.</p>
        </div>
      </div>

      {/* Selector and Generator Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Month/Year Filter Selection */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between gap-4 lg:col-span-1">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-zinc-500">كشف الشهر المستهدف</h2>
            <p className="text-xs text-zinc-400">حدد كشف الرواتب لعرض تفاصيله وتسوية القيم يدويّاً.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm focus:outline-none focus:border-zinc-950 dark:focus:border-white text-right"
            >
              {Array.from({ length: 12 }, (_, i) => ({
                value: i + 1,
                label: `شهر ${i + 1}`,
              })).map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm focus:outline-none focus:border-zinc-950 dark:focus:border-white text-right font-mono"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Generate triggers */}
        <div className="lg:col-span-2">
          <PayrollGenerator onSuccess={() => window.location.reload()} />
        </div>

      </div>

      {/* Aggregate Cards for the filtered sheet */}
      {filteredRows.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white dark:bg-zinc-950 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1">
            <div className="text-xs text-zinc-500">حالة الكشف لشهر {selectedMonth}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold border ${statusBadges[sheetStatus]}`}>
                {statusTranslations[sheetStatus]}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-950 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1">
            <div className="text-xs text-zinc-500">عدد العمال المدرجين</div>
            <div className="text-xl font-bold font-mono text-zinc-950 dark:text-white">{aggregates.employees} عمال</div>
          </div>

          <div className="bg-white dark:bg-zinc-950 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1">
            <div className="text-xs text-zinc-500">الاستقطاعات والسلف المحسومة</div>
            <div className="text-xl font-bold font-mono text-red-600 dark:text-red-400">
              -{(aggregates.advances + aggregates.deductions).toLocaleString("ar-EG")} ج.م
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-950 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1">
            <div className="text-xs text-zinc-500">صافي المستحقات الصافي للعمال</div>
            <div className="text-xl font-bold font-mono text-zinc-950 dark:text-white">
              {aggregates.netSalary.toLocaleString("ar-EG")} ج.م
            </div>
          </div>
        </div>
      )}

      {/* Main Table */}
      {filteredRows.length === 0 ? (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-20 text-center text-zinc-400">
          لا يوجد كشف رواتب محتسب لشهر {selectedMonth} / {selectedYear} حتى الآن. 
          يرجى استخدام لوحة الاحتساب التلقائي أعلاه لإنشائه.
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm space-y-4">
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-right text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 font-medium">
                <tr>
                  <th className="px-4 py-3">اسم العامل</th>
                  <th className="px-4 py-3 w-20">أيام العمل</th>
                  <th className="px-4 py-3 w-28">الراتب المستحق</th>
                  <th className="px-4 py-3 w-24">مستحقات الإنتاج</th>
                  <th className="px-4 py-3 w-24">بدل إضافي</th>
                  <th className="px-4 py-3 w-24">المكافآت (+)</th>
                  <th className="px-4 py-3 w-24">الخصومات (-)</th>
                  <th className="px-4 py-3 w-24">السلف المحسومة</th>
                  <th className="px-4 py-3 w-28">صافي الراتب</th>
                  <th className="px-4 py-3 text-left w-20">تعديل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {filteredRows.map((item) => {
                  const baseEarned = (Number(item.base_salary_captured) / 26) * item.days_present;

                  return (
                    <tr 
                      key={item.id}
                      className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors"
                    >
                      <td className="px-4 py-4 font-bold text-zinc-950 dark:text-white">
                        {item.employee_name}
                        {item.notes && (
                          <div className="text-[10px] text-zinc-400 font-normal mt-0.5">
                            ملاحظة: {item.notes}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 font-mono font-medium text-zinc-700 dark:text-zinc-300">
                        {item.days_present} / 26
                      </td>
                      <td className="px-4 py-4 font-mono text-zinc-600 dark:text-zinc-400">
                        {Math.round(baseEarned).toLocaleString("ar-EG")} ج.م
                      </td>
                      <td className="px-4 py-4 font-mono text-zinc-600 dark:text-zinc-400">
                        {Number(item.production_pay).toLocaleString("ar-EG")} ج.م
                      </td>
                      <td className="px-4 py-4 font-mono text-zinc-600 dark:text-zinc-400">
                        {Number(item.overtime_pay).toLocaleString("ar-EG")} ج.م
                      </td>
                      <td className="px-4 py-4 font-mono text-green-600 font-semibold">
                        +{Number(item.bonuses).toLocaleString("ar-EG")} ج.m
                      </td>
                      <td className="px-4 py-4 font-mono text-red-500 font-semibold">
                        -{Number(item.deductions).toLocaleString("ar-EG")} ج.م
                      </td>
                      <td className="px-4 py-4 font-mono text-amber-600 font-semibold">
                        -{Number(item.advances_deducted).toLocaleString("ar-EG")} ج.م
                      </td>
                      <td className="px-4 py-4 font-mono text-zinc-950 dark:text-white font-bold text-sm bg-zinc-50/20 dark:bg-zinc-900/10">
                        {Number(item.net_salary).toLocaleString("ar-EG")} ج.م
                      </td>
                      <td className="px-4 py-4 text-left">
                        {item.status === "Draft" ? (
                          <button
                            onClick={() => setAdjustTarget(item)}
                            className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded hover:bg-zinc-100 dark:hover:bg-zinc-900"
                            title="تعديل المكافآت أو الخصومات"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-zinc-400 select-none">مغلق</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/30 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
            <div>
              {sheetStatus === "Draft" && (
                <button
                  onClick={handleDeleteSheet}
                  disabled={isPending}
                  className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:underline disabled:opacity-50"
                >
                  <Trash className="h-4 w-4" />
                  حذف الكشف بالكامل
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {sheetStatus === "Draft" && (
                <button
                  onClick={() => handleUpdateStatus("Approved")}
                  disabled={isPending}
                  className="flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4" />
                  اعتماد كشف الرواتب
                </button>
              )}

              {sheetStatus === "Approved" && (
                <button
                  onClick={() => handleUpdateStatus("Paid")}
                  disabled={isPending}
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                >
                  <Wallet className="h-4 w-4" />
                  تأكيد دفع وصرف الرواتب
                </button>
              )}

              {sheetStatus === "Paid" && (
                <span className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4" />
                  تم صرف الكشف وتسوية جميع الحسابات والسلف بنجاح.
                </span>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Adjust Dialog */}
      {adjustTarget && (
        <PayrollAdjustDialog
          item={adjustTarget}
          onClose={() => setAdjustTarget(null)}
          onSuccess={() => window.location.reload()}
        />
      )}

    </div>
  );
}
