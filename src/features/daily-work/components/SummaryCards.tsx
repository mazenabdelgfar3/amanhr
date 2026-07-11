"use client";

import { Users, CheckCircle, AlertCircle, TrendingUp, Clock } from "lucide-react";
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 rtl text-right">
      
      {/* Total Active Workers */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-500">إجمالي العمال في الكشف</span>
          <Users className="h-5 w-5 text-zinc-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-zinc-950 dark:text-white">{stats.total}</span>
          <span className="text-xs text-zinc-400">عامل مسجل</span>
        </div>
      </div>

      {/* Attendance Stats */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-500">الحضور والغياب</span>
          <div className="flex gap-1">
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-2xl font-bold font-mono text-zinc-950 dark:text-white">{stats.present}</span>
            <span className="text-xs text-green-600 mr-1">حاضر</span>
          </div>
          <div className="text-left">
            <span className="text-lg font-bold font-mono text-zinc-500">{stats.absent}</span>
            <span className="text-xs text-red-500 mr-1">غائب</span>
          </div>
        </div>
      </div>

      {/* Total Daily Production */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-500">إجمالي إنتاج اليوم</span>
          <TrendingUp className="h-5 w-5 text-indigo-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-zinc-950 dark:text-white">
            {stats.production.toLocaleString("ar-EG")}
          </span>
          <span className="text-xs text-zinc-400">وحدة إنتاج</span>
        </div>
      </div>

      {/* Total Overtime Hours */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-500">ساعات الإضافي الكلية</span>
          <Clock className="h-5 w-5 text-amber-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-zinc-950 dark:text-white">{stats.overtime}</span>
          <span className="text-xs text-zinc-400">ساعة إضافية</span>
        </div>
      </div>

    </div>
  );
}
