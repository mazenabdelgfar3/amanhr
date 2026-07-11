"use client";

import { useState, useMemo, useTransition } from "react";
import { PayrollItem } from "../types";
import { updatePayrollItem, deletePayrollSheet } from "../actions/update-payroll-item";
import { updatePayrollSheetStatus } from "../actions/approve-payroll";
import { Edit2, CheckCircle, Wallet, Trash, Calculator, DollarSign, CalendarCheck } from "lucide-react";
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

  // Status mapping - Clean, neutral/cool tones
  const statusBadges: Record<string, string> = {
    Draft: "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40",
    Approved: "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/40",
    Paid: "bg-green-50 text-green-700 border-green-200/60 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/40",
  };

  const statusTranslations: Record<string, string> = {
    Draft: "مسودة غير معتمدة",
    Approved: "معتمدة بانتظار الصرف",
    Paid: "مصروفة ومسددة",
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
    <div className="space-y-6 rtl text-right font-sans">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">مسيرات وكشوف الرواتب</h1>
          <p className="text-xs text-zinc-500 mt-1 font-sans">احتساب مستحقات الموظفين والعمال الشهرية شاملة الحضور والإنتاجية والساعات الإضافية والسلف.</p>
        </div>
      </div>

      {/* Selector and Generator Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Month/Year Filter Selection */}
        <div className="bg-white dark:bg-zinc-950 p-5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col justify-between gap-4 lg:col-span-1 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <CalendarCheck className="h-4 w-4 text-zinc-400" />
              تحديد كشف الشهر المستهدف
            </h2>
            <p className="text-[11px] text-zinc-400">اختر الفترة المالية لعرض كشف الرواتب والتسويات النشطة.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-3 py-1.5 text-xs focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white text-right font-semibold"
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
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-3 py-1.5 text-xs focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white text-right font-mono"
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
          <div className="bg-white dark:bg-zinc-950 p-4 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl space-y-1 shadow-xs">
            <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">حالة الكشف للشهر</div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold border ${statusBadges[sheetStatus]}`}>
                {statusTranslations[sheetStatus]}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-950 p-4 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl space-y-1 shadow-xs">
            <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">إجمالي العمال المدرجين</div>
            <div className="text-xl font-bold font-mono text-zinc-900 dark:text-white mt-1">{aggregates.employees} عمال</div>
          </div>

          <div className="bg-white dark:bg-zinc-950 p-4 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl space-y-1 shadow-xs">
            <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">الاستقطاعات والسلف المحسومة</div>
            <div className="text-xl font-bold font-mono text-red-600 dark:text-red-400 mt-1">
              -{(aggregates.advances + aggregates.deductions).toLocaleString()} ج.م
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-950 p-4 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl space-y-1 shadow-xs">
            <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">صافي الرواتب المستحقة الصرف</div>
            <div className="text-xl font-bold font-mono text-green-600 dark:text-green-400 mt-1">
              {aggregates.netSalary.toLocaleString()} ج.م
            </div>
          </div>
        </div>
      )}

      {/* Main Table */}
      {filteredRows.length === 0 ? (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl py-16 text-center text-zinc-400 dark:text-zinc-550 shadow-xs">
          <div className="flex flex-col items-center justify-center space-y-3 max-w-sm mx-auto">
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-full text-zinc-400">
              <Calculator className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">لم يتم احتساب كشف رواتب</p>
            <p className="text-xs text-zinc-500">لا يوجد كشف رواتب مُحتسب ومُسجل لشهر {selectedMonth} / {selectedYear} حتى الآن.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl overflow-hidden shadow-xs space-y-4">
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-right text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 font-semibold sticky top-0 z-5">
                <tr>
                  <th className="px-4 py-3.5">اسم الموظف</th>
                  <th className="px-4 py-3.5 w-20">أيام العمل</th>
                  <th className="px-4 py-3.5 w-28 text-center">الراتب الأساسي المستحق</th>
                  <th className="px-4 py-3.5 w-24 text-center">حوافز الإنتاج</th>
                  <th className="px-4 py-3.5 w-24 text-center">أجر الإضافي</th>
                  <th className="px-4 py-3.5 w-24 text-center">المكافآت (+)</th>
                  <th className="px-4 py-3.5 w-24 text-center">الخصومات (-)</th>
                  <th className="px-4 py-3.5 w-24 text-center">خصم السلف</th>
                  <th className="px-4 py-3.5 w-28 text-center">صافي الراتب</th>
                  <th className="px-4 py-3.5 text-left w-20">تعديل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {filteredRows.map((item) => {
                  const baseEarned = (Number(item.base_salary_captured) / 26) * item.days_present;

                  return (
                    <tr 
                      key={item.id}
                      className="hover:bg-zinc-55/30 dark:hover:bg-zinc-900/30 transition-colors duration-150"
                    >
                      <td className="px-4 py-3.5 font-bold text-zinc-950 dark:text-white">
                        {item.employee_name}
                        {item.notes && (
                          <div className="text-[10px] text-zinc-400 font-normal mt-0.5">
                            ملاحظة: {item.notes}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-zinc-500">
                        {item.days_present} / 26
                      </td>
                      <td className="px-4 py-3.5 font-mono text-center text-zinc-600 dark:text-zinc-355">
                        {Math.round(baseEarned).toLocaleString()} ج.م
                      </td>
                      <td className="px-4 py-3.5 font-mono text-center text-zinc-600 dark:text-zinc-355">
                        {Number(item.production_pay).toLocaleString()} ج.م
                      </td>
                      <td className="px-4 py-3.5 font-mono text-center text-zinc-600 dark:text-zinc-355">
                        {Number(item.overtime_pay).toLocaleString()} ج.م
                      </td>
                      <td className="px-4 py-3.5 font-mono text-center text-green-600 font-bold">
                        +{Number(item.bonuses).toLocaleString()} ج.م
                      </td>
                      <td className="px-4 py-3.5 font-mono text-center text-red-500 font-bold">
                        -{Number(item.deductions).toLocaleString()} ج.م
                      </td>
                      <td className="px-4 py-3.5 font-mono text-center text-amber-600 font-bold">
                        -{Number(item.advances_deducted).toLocaleString()} ج.م
                      </td>
                      <td className="px-4 py-3.5 font-mono text-center text-zinc-950 dark:text-white font-bold text-sm bg-zinc-50/30 dark:bg-zinc-900/10">
                        {Number(item.net_salary).toLocaleString()} ج.م
                      </td>
                      <td className="px-4 py-3.5 text-left">
                        {item.status === "Draft" ? (
                          <button
                            onClick={() => setAdjustTarget(item)}
                            className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                            title="تعديل المكافآت أو الخصومات"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-zinc-400 select-none px-2 font-bold">مغلق</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/10 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
            <div>
              {sheetStatus === "Draft" && (
                <button
                  onClick={handleDeleteSheet}
                  disabled={isPending}
                  className="flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:underline disabled:opacity-50"
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
                  className="flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 px-5 py-2 text-xs font-bold text-white dark:text-zinc-950 disabled:opacity-50 transition-colors shadow-xs"
                >
                  <CheckCircle className="h-4 w-4" />
                  اعتماد كشف الرواتب
                </button>
              )}

              {sheetStatus === "Approved" && (
                <button
                  onClick={() => handleUpdateStatus("Paid")}
                  disabled={isPending}
                  className="flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 px-5 py-2 text-xs font-bold text-white disabled:opacity-50 transition-colors shadow-xs"
                >
                  <Wallet className="h-4 w-4" />
                  تأكيد دفع وصرف الرواتب
                </button>
              )}

              {sheetStatus === "Paid" && (
                <span className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1.5">
                  <CheckCircle className="h-4.5 w-4.5 shrink-0" />
                  تم صرف الكشف وتسوية جميع حسابات السلف والمستحقات بنجاح.
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
