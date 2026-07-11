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
      { name: "إجمالي سجلات الحضور والغياب", value: `${total} سجل`, icon: CalendarRange, color: "text-zinc-500" },
      { name: "مجموع أيام الحضور الفعلي", value: `${present} يوم`, icon: UserCheck, color: "text-green-600 dark:text-green-400" },
      { name: "مجموع أيام الغياب الكلي", value: `${absent} يوم`, icon: UserMinus, color: "text-red-600 dark:text-red-400" },
      { name: "إجمالي الإجازات والأذونات", value: `${vacation + permission} يوم`, icon: Briefcase, color: "text-amber-600 dark:text-amber-400" },
    ];

    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 rtl text-right font-sans">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between shadow-xs hover:border-zinc-400 dark:hover:border-zinc-650 transition-all duration-150">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-350">{stat.name}</span>
              <span className="text-2xl font-bold mt-3 text-zinc-900 dark:text-white font-mono">{stat.value}</span>
            </div>
            <stat.icon className={`h-9 w-9 ${stat.color} opacity-90`} />
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
      { name: "أيام العمل المسجلة بالكشف", value: `${totalDays} يوم`, icon: CalendarRange, color: "text-zinc-500" },
      { name: "إجمالي قيمة الإنتاجية اليومية", value: `${totalProduction.toLocaleString()} ج.م`, icon: TrendingUp, color: "text-green-600 dark:text-green-400" },
      { name: "إجمالي الساعات الإضافية للعمال", value: `${totalOvertime.toLocaleString()} ساعة`, icon: Clock, color: "text-blue-600 dark:text-blue-450" },
      { name: "متوسط الإنتاج اليومي للمجموعة", value: `${avgProduction} ج.م`, icon: Coins, color: "text-amber-600 dark:text-amber-450" },
    ];

    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 rtl text-right font-sans">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between shadow-xs hover:border-zinc-400 dark:hover:border-zinc-650 transition-all duration-150">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-zinc-750 dark:text-zinc-350">{stat.name}</span>
              <span className="text-2xl font-bold mt-3 text-zinc-900 dark:text-white font-mono">{stat.value}</span>
            </div>
            <stat.icon className={`h-9 w-9 ${stat.color} opacity-90`} />
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
      { name: "إجمالي الرواتب الأساسية", value: `${totalBase.toLocaleString()} ج.م`, icon: DollarSign, color: "text-zinc-550" },
      { name: "حوافز الإنتاج والساعات الإضافية", value: `${(totalProduction + totalOvertime).toLocaleString()} ج.م`, icon: TrendingUp, color: "text-green-600 dark:text-green-400" },
      { name: "إجمالي السلف المخصومة للعمال", value: `${totalAdvances.toLocaleString()} ج.م`, icon: Coins, color: "text-red-600 dark:text-red-400" },
      { name: "صافي الرواتب المصروفة", value: `${totalNet.toLocaleString()} ج.م`, icon: UserCheck, color: "text-emerald-600 dark:text-emerald-400 font-bold" },
    ];

    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 rtl text-right font-sans">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between shadow-xs hover:border-zinc-400 dark:hover:border-zinc-650 transition-all duration-150">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-zinc-750 dark:text-zinc-350">{stat.name}</span>
              <span className="text-2xl font-bold mt-3 text-zinc-900 dark:text-white font-mono">{stat.value}</span>
            </div>
            <stat.icon className={`h-9 w-9 ${stat.color} opacity-90`} />
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
      { name: "إجمالي السلف الكلية المطلوبة", value: `${totalAdvancesAmount.toLocaleString()} ج.م`, icon: DollarSign, color: "text-zinc-550" },
      { name: "سلفيات معتمدة ومسددة للشركة", value: `${deductedAmount.toLocaleString()} ج.م`, icon: UserCheck, color: "text-green-600 dark:text-green-400" },
      { name: "سلفيات معلقة بانتظار المراجعة", value: `${pendingAmount.toLocaleString()} ج.م`, icon: Briefcase, color: "text-amber-600 dark:text-amber-400" },
      { name: "متبقي بانتظار الخصم والسداد", value: `${(approvedAmount - deductedAmount).toLocaleString()} ج.م`, icon: Coins, color: "text-blue-600 dark:text-blue-450" },
    ];

    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 rtl text-right font-sans">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between shadow-xs hover:border-zinc-400 dark:hover:border-zinc-650 transition-all duration-150">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-zinc-750 dark:text-zinc-350">{stat.name}</span>
              <span className="text-2xl font-bold mt-3 text-zinc-900 dark:text-white font-mono">{stat.value}</span>
            </div>
            <stat.icon className={`h-9 w-9 ${stat.color} opacity-90`} />
          </div>
        ))}
      </div>
    );
  }

  return null;
}
