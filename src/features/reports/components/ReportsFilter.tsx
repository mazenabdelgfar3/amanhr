"use client";

import { useTransition } from "react";
import { Filter, Printer } from "lucide-react";

interface ReportsFilterProps {
  employees: { id: string; name: string }[];
  filters: {
    reportType: "attendance" | "production" | "payroll" | "advances";
    startDate: string;
    endDate: string;
    employeeId: string;
  };
  setFilters: (filters: any) => void;
  onFilterSubmit: () => void;
}

export default function ReportsFilter({
  employees,
  filters,
  setFilters,
  onFilterSubmit,
}: ReportsFilterProps) {
  const [isPending, startTransition] = useTransition();

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, reportType: e.target.value });
  };

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, employeeId: e.target.value });
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, startDate: e.target.value });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, endDate: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      onFilterSubmit();
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-5 print:hidden text-right rtl font-sans">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Report Type */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">نوع الاستعلام والتقرير</label>
          <select
            value={filters.reportType}
            onChange={handleTypeChange}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-3.5 py-2 text-sm font-semibold focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white focus:outline-none transition-all text-right h-10"
          >
            <option value="attendance">سجل الحضور والغياب للعمال</option>
            <option value="production">سجل حجم الإنتاج اليومي</option>
            <option value="payroll">سجل كشوف الرواتب الشهرية</option>
            <option value="advances">سجل السلف والمدفوعات المالية</option>
          </select>
        </div>

        {/* Employee */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">اسم الموظف المستهدف</label>
          <select
            value={filters.employeeId}
            onChange={handleEmployeeChange}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-3.5 py-2 text-sm font-semibold focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white focus:outline-none transition-all text-right h-10"
          >
            <option value="all">كافة الموظفين المقيدين</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">من تاريخ</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={handleStartDateChange}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-3.5 py-2 text-sm font-semibold focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white focus:outline-none transition-all text-center font-mono h-10"
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">إلى تاريخ</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={handleEndDateChange}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-3.5 py-2 text-sm font-semibold focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white focus:outline-none transition-all text-center font-mono h-10"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-zinc-150 dark:border-zinc-850">
        <button
          type="button"
          onClick={handlePrint}
          className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 px-5 py-2.5 text-sm font-bold text-zinc-700 dark:text-zinc-300 transition-colors shadow-xs h-10"
        >
          <Printer className="h-4.5 w-4.5" />
          تصدير التقرير للطباعة أو حفظ PDF
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 px-6 py-2.5 text-sm font-bold text-white dark:text-zinc-950 disabled:opacity-50 transition-colors shadow-xs h-10"
        >
          <Filter className="h-4.5 w-4.5" />
          {isPending ? "جاري الاستعلام..." : "تحديث واستخراج البيانات"}
        </button>
      </div>
    </form>
  );
}
