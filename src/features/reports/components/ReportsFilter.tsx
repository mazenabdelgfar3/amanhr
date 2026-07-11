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
    <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-950 p-5 rounded-xl border border-zinc-200/85 dark:border-zinc-800/85 shadow-xs space-y-4 print:hidden text-right rtl font-sans">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Report Type */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">نوع التقرير الاستعلامي</label>
          <select
            value={filters.reportType}
            onChange={handleTypeChange}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-3 py-1.5 text-xs focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white text-right font-medium"
          >
            <option value="attendance">سجل الحضور والانصراف اليومي</option>
            <option value="production">سجل اليومية وحجم الإنتاج</option>
            <option value="payroll">سجل كشوف الرواتب الشهرية</option>
            <option value="advances">سجل السلف والمدفوعات</option>
          </select>
        </div>

        {/* Employee */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">الموظف المعني</label>
          <select
            value={filters.employeeId}
            onChange={handleEmployeeChange}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-3 py-1.5 text-xs focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white text-right font-medium"
          >
            <option value="all">جميع الموظفين المقيدين</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">من تاريخ</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={handleStartDateChange}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-3 py-1.5 text-xs focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white text-right font-mono"
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">إلى تاريخ</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={handleEndDateChange}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-3 py-1.5 text-xs focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white text-right font-mono"
          />
        </div>
      </div>

      <div className="flex justify-between items-center gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-850">
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white hover:bg-zinc-55 dark:bg-zinc-950 dark:hover:bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 transition-colors shadow-xs"
        >
          <Printer className="h-4 w-4" />
          تحميل تقرير للطباعة أو حفظ PDF
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 px-5 py-2 text-xs font-bold text-white dark:text-zinc-950 disabled:opacity-50 transition-colors shadow-xs"
        >
          <Filter className="h-4 w-4" />
          {isPending ? "جاري البحث..." : "تطبيق الفلتر وتحديث البيانات"}
        </button>
      </div>
    </form>
  );
}
