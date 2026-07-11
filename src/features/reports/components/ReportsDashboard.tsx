"use client";

import { useState, useEffect } from "react";
import ReportsFilter from "./ReportsFilter";
import ReportsSummary from "./ReportsSummary";
import ReportsTable from "./ReportsTable";
import { getReportData, type ReportFilterInput } from "../actions/get-report";
import { FileBarChart } from "lucide-react";

interface ReportsDashboardProps {
  employees: { id: string; name: string }[];
}

export default function ReportsDashboard({ employees }: ReportsDashboardProps) {
  const [filters, setFilters] = useState({
    reportType: "attendance" as "attendance" | "production" | "payroll" | "advances",
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0], // Default: last 30 days
    endDate: new Date().toISOString().split("T")[0],
    employeeId: "all",
  });

  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load report data on submit or when initial render happens
  const loadData = async () => {
    setError(null);
    const response = await getReportData(filters);
    if (response.success) {
      setData(response.data || []);
    } else {
      setError(response.error?.message || "حدث خطأ غير متوقع أثناء جلب البيانات.");
      setData([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:text-right print:w-full">
        <div className="rtl text-right">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white font-sans flex items-center gap-2">
            <FileBarChart className="h-6 w-6 text-zinc-500 print:hidden" />
            منظومة التقارير الشاملة
          </h1>
          <p className="text-sm text-zinc-500 font-sans print:hidden">استخرج تقارير الحضور، الإنتاجيات، السلف والرواتب لجميع العمال والموظفين.</p>
          {/* Printable Header */}
          <div className="hidden print:block border-b border-zinc-300 pb-4 mb-4">
            <h2 className="text-3xl font-extrabold text-zinc-900">تقرير نظام Aman HR</h2>
            <p className="text-sm text-zinc-600 mt-1">
              النوع: {filters.reportType === "attendance" ? "الحضور والانصراف" : filters.reportType === "production" ? "اليومية والإنتاجية" : filters.reportType === "payroll" ? "كشوف الرواتب" : "السلف والمدفوعات"} 
              {" | "}
              التاريخ: من {filters.startDate} إلى {filters.endDate}
            </p>
          </div>
        </div>
      </div>

      {/* Filters (Hidden in print) */}
      <ReportsFilter
        employees={employees}
        filters={filters}
        setFilters={setFilters}
        onFilterSubmit={loadData}
      />

      {/* Error alert */}
      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-4 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 text-right rtl">
          {error}
        </div>
      )}

      {/* Summary Aggregate Cards */}
      <ReportsSummary reportType={filters.reportType} data={data} />

      {/* Main Data Table */}
      <div className="pt-2">
        <ReportsTable reportType={filters.reportType} data={data} />
      </div>
    </div>
  );
}
