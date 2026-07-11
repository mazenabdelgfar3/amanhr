"use client";

import { 
  CalendarRange, 
  UserCheck, 
  UserMinus, 
  Coins, 
  TrendingUp, 
  Clock,
  Briefcase,
  DollarSign
} from "lucide-react";

interface ReportsSummaryProps {
  reportType: "attendance" | "production" | "payroll" | "advances";
  data: any[];
}

export default function ReportsSummary({ reportType, data }: ReportsSummaryProps) {
  if (!data || data.length === 0) return null;

  // Render summaries based on type
  if (reportType === "attendance") {
    const total = data.length;
    const present = data.filter((d) => d.status === "Present").length;
    const absent = data.filter((d) => d.status === "Absent").length;
    const vacation = data.filter((d) => d.status === "Vacation").length;
    const permission = data.filter((d) => d.status === "Permission").length;

    const stats = [
      { name: "إجمالي السجلات", value: total, icon: CalendarRange, color: "text-zinc-500" },
      { name: "أيام الحضور", value: present, icon: UserCheck, color: "text-green-600" },
      { name: "أيام الغياب", value: absent, icon: UserMinus, color: "text-red-600" },
      { name: "إجازات وأذونات", value: vacation + permission, icon: Briefcase, color: "text-amber-600" },
    ];

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 rtl text-right">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow-sm">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{stat.name}</span>
              <span className="text-2xl font-bold mt-1 text-zinc-900 dark:text-white font-mono">{stat.value}</span>
            </div>
            <stat.icon className={`h-8 w-8 ${stat.color}`} />
          </div>
        ))}
      </div>
    );
  }

  if (reportType === "production") {
    const totalDays = data.length;
    const totalProduction = data.reduce((sum, d) => sum + Number(d.production || 0), 0);
    const totalOvertime = data.reduce((sum, d) => sum + Number(d.overtime_hours || 0), 0);
    const avgProduction = totalDays > 0 ? (totalProduction / totalDays).toFixed(1) : 0;

    const stats = [
      { name: "أيام العمل المسجلة", value: totalDays, icon: CalendarRange, color: "text-zinc-500" },
      { name: "إجمالي قيمة الإنتاجية", value: `${totalProduction.toLocaleString()} ج.م`, icon: TrendingUp, color: "text-green-600" },
      { name: "إجمالي الساعات الإضافية", value: `${totalOvertime.toLocaleString()} ساعة`, icon: Clock, color: "text-indigo-600" },
      { name: "متوسط الإنتاجية اليومي", value: `${avgProduction} ج.م`, icon: Coins, color: "text-amber-600" },
    ];

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 rtl text-right">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow-sm">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{stat.name}</span>
              <span className="text-2xl font-bold mt-1 text-zinc-900 dark:text-white font-mono">{stat.value}</span>
            </div>
            <stat.icon className={`h-8 w-8 ${stat.color}`} />
          </div>
        ))}
      </div>
    );
  }

  if (reportType === "payroll") {
    const totalBase = data.reduce((sum, d) => sum + Number(d.base_salary || 0), 0);
    const totalProduction = data.reduce((sum, d) => sum + Number(d.total_production || 0), 0);
    const totalOvertime = data.reduce((sum, d) => sum + Number(d.total_overtime || 0), 0);
    const totalAdvances = data.reduce((sum, d) => sum + Number(d.total_advances || 0), 0);
    const totalNet = data.reduce((sum, d) => sum + Number(d.net_salary || 0), 0);

    const stats = [
      { name: "إجمالي الرواتب الأساسية", value: `${totalBase.toLocaleString()} ج.م`, icon: DollarSign, color: "text-zinc-500" },
      { name: "إجمالي حوافز الإنتاج", value: `${totalProduction.toLocaleString()} / الإضافي: ${totalOvertime.toLocaleString()} ج.م`, icon: TrendingUp, color: "text-green-600" },
      { name: "إجمالي السلف المخصومة", value: `${totalAdvances.toLocaleString()} ج.م`, icon: Coins, color: "text-red-600" },
      { name: "صافي الرواتب المصروفة", value: `${totalNet.toLocaleString()} ج.م`, icon: UserCheck, color: "text-emerald-600 font-bold" },
    ];

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 rtl text-right">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow-sm">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{stat.name}</span>
              <span className="text-xl font-bold mt-1 text-zinc-900 dark:text-white font-mono">{stat.value}</span>
            </div>
            <stat.icon className={`h-8 w-8 ${stat.color}`} />
          </div>
        ))}
      </div>
    );
  }

  if (reportType === "advances") {
    const totalAdvancesAmount = data.reduce((sum, d) => sum + Number(d.amount || 0), 0);
    const approvedAmount = data.filter((d) => d.status === "Approved" || d.status === "Deducted").reduce((sum, d) => sum + Number(d.amount), 0);
    const pendingAmount = data.filter((d) => d.status === "Pending").reduce((sum, d) => sum + Number(d.amount), 0);
    const deductedAmount = data.filter((d) => d.status === "Deducted").reduce((sum, d) => sum + Number(d.amount), 0);

    const stats = [
      { name: "إجمالي السلف المطلوبة", value: `${totalAdvancesAmount.toLocaleString()} ج.م`, icon: DollarSign, color: "text-zinc-500" },
      { name: "سلفيات معتمدة ومسددة", value: `${deductedAmount.toLocaleString()} ج.م`, icon: UserCheck, color: "text-green-600" },
      { name: "سلفيات معلقة للمراجعة", value: `${pendingAmount.toLocaleString()} ج.م`, icon: Briefcase, color: "text-amber-600" },
      { name: "متبقي بانتظار السداد", value: `${(approvedAmount - deductedAmount).toLocaleString()} ج.م`, icon: Coins, color: "text-indigo-600" },
    ];

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 rtl text-right">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow-sm">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{stat.name}</span>
              <span className="text-xl font-bold mt-1 text-zinc-900 dark:text-white font-mono">{stat.value}</span>
            </div>
            <stat.icon className={`h-8 w-8 ${stat.color}`} />
          </div>
        ))}
      </div>
    );
  }

  return null;
}
