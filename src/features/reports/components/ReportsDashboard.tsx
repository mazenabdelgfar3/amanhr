"use client";

import { useState, useEffect } from "react";
import ReportsFilter from "./ReportsFilter";
import ReportsSummary from "./ReportsSummary";
import ReportsTable from "./ReportsTable";
import { getReportData } from "../actions/get-report";
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
    <div className="space-y-8 font-sans text-right rtl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:text-right print:w-full border-b border-zinc-200/80 dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white flex items-center gap-3">
            <FileBarChart className="h-7.5 w-7.5 text-zinc-500 print:hidden" />
            استخراج التقارير الشاملة
          </h1>
          <p className="text-sm text-zinc-550 mt-1.5 print:hidden">استعرض وحمل تقارير الحضور والغياب اليومية، الإنتاجيات، حركات السلف والرواتب للعمال.</p>
          
          {/* Printable Header */}
          <div className="hidden print:block border-b border-zinc-350 pb-4 mb-4">
            <h2 className="text-3xl font-bold text-zinc-900">تقرير نظام الموارد البشرية Aman HR</h2>
            <p className="text-sm text-zinc-700 mt-1.5">
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
        <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-4.5 text-sm font-bold text-red-650 dark:text-red-400 border border-red-200/60 dark:border-red-900/40 text-right">
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
