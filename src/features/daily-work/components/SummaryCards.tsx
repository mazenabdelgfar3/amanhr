"use client";

import { Users, CheckCircle, TrendingUp, Clock } from "lucide-react";
import { DailyWorkRow } from "../types";

interface SummaryCardsProps {
  rows: DailyWorkRow[];
}

export default function SummaryCards({ rows }: SummaryCardsProps) {
  const stats = rows.reduce(
    (acc, row) => {
      acc.total += 1;
      if (row.attendance === "Present") {
        acc.present += 1;
        acc.production += Number(row.production || 0);
        acc.overtime += Number(row.overtimeHours || 0);
      } else if (row.attendance === "Absent") {
        acc.absent += 1;
      } else if (row.attendance === "Vacation") {
        acc.vacation += 1;
      } else if (row.attendance === "Permission") {
        acc.permission += 1;
      }
      return acc;
    },
    { total: 0, present: 0, absent: 0, vacation: 0, permission: 0, production: 0, overtime: 0 }
  );

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 rtl text-right font-sans">
      
      {/* Total Active Workers */}
      <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-6 shadow-xs flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-650 transition-all duration-150">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-750 dark:text-zinc-300">إجمالي العمال المقيدين</span>
          <Users className="h-5 w-5 text-zinc-400 dark:text-zinc-600" />
        </div>
        <div className="flex items-baseline gap-2 mt-4">
          <span className="text-3xl font-bold font-mono text-zinc-900 dark:text-white">{stats.total}</span>
          <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">عامل مسجل</span>
        </div>
      </div>

      {/* Attendance Stats */}
      <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-6 shadow-xs flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-650 transition-all duration-150">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-750 dark:text-zinc-300">نسب الحضور والغياب اليوم</span>
          <CheckCircle className="h-5 w-5 text-green-500/80 dark:text-green-500/60" />
        </div>
        <div className="flex items-baseline justify-between mt-4">
          <div>
            <span className="text-3xl font-bold font-mono text-zinc-900 dark:text-white">{stats.present}</span>
            <span className="text-sm font-bold text-green-600 dark:text-green-400 mr-1.5">حاضر</span>
          </div>
          <div className="text-left">
            <span className="text-xl font-bold font-mono text-zinc-500 dark:text-zinc-400">{stats.absent}</span>
            <span className="text-sm font-bold text-red-500 mr-1.5">غائب</span>
          </div>
        </div>
      </div>

      {/* Total Daily Production */}
      <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-6 shadow-xs flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-650 transition-all duration-150">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-750 dark:text-zinc-300">إجمالي كمية الإنتاج اليوم</span>
          <TrendingUp className="h-5 w-5 text-blue-500/80 dark:text-blue-500/60" />
        </div>
        <div className="flex items-baseline gap-2 mt-4">
          <span className="text-3xl font-bold font-mono text-zinc-900 dark:text-white">
            {stats.production.toLocaleString()}
          </span>
          <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">وحدة إنتاج</span>
        </div>
      </div>

      {/* Total Overtime Hours */}
      <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-6 shadow-xs flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-650 transition-all duration-150">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-750 dark:text-zinc-300">إجمالي ساعات العمل الإضافي</span>
          <Clock className="h-5 w-5 text-amber-500/80 dark:text-amber-500/60" />
        </div>
        <div className="flex items-baseline gap-2 mt-4">
          <span className="text-3xl font-bold font-mono text-zinc-900 dark:text-white">{stats.overtime}</span>
          <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">ساعة إضافية</span>
        </div>
      </div>

    </div>
  );
}
