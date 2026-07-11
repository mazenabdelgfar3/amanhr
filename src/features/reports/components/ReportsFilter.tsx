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
    <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4 print:hidden text-right rtl">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Report Type */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">نوع التقرير</label>
          <select
            value={filters.reportType}
            onChange={handleTypeChange}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm focus:border-zinc-950 focus:outline-none dark:focus:border-white text-right"
          >
            <option value="attendance">سجل الحضور والانصراف</option>
            <option value="production">سجل اليومية والإنتاجية</option>
            <option value="payroll">سجل الرواتب المصروفة</option>
            <option value="advances">سجل السلف والمدفوعات</option>
          </select>
        </div>

        {/* Employee */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">الموظف</label>
          <select
            value={filters.employeeId}
            onChange={handleEmployeeChange}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm focus:border-zinc-950 focus:outline-none dark:focus:border-white text-right"
          >
            <option value="all">جميع الموظفين</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">من تاريخ</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={handleStartDateChange}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm focus:border-zinc-950 focus:outline-none dark:focus:border-white text-right"
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">إلى تاريخ</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={handleEndDateChange}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm focus:border-zinc-950 focus:outline-none dark:focus:border-white text-right"
          />
        </div>
      </div>

      <div className="flex justify-between items-center gap-4 pt-2">
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          <Printer className="h-4 w-4" />
          طباعة / حفظ PDF
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 px-5 py-2 text-sm font-medium text-white dark:text-zinc-950 disabled:opacity-50"
        >
          <Filter className="h-4 w-4" />
          {isPending ? "جاري التحميل..." : "عرض التقرير"}
        </button>
      </div>
    </form>
  );
}
