import { 
  Users, 
  CalendarCheck, 
  DollarSign, 
  Activity 
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    { name: "إجمالي الموظفين", value: "٤٢ موظف", icon: Users, change: "نشط حالياً", changeType: "positive" },
    { name: "الحضور اليوم", value: "٣٨ عامل", icon: CalendarCheck, change: "٩٠٪ نسبة الحضور", changeType: "positive" },
    { name: "سلفيات النشطة", value: "١,٥٠٠ ج.م", icon: DollarSign, change: "خلال هذا الشهر", changeType: "neutral" },
    { name: "معدل الإنتاج", value: "٩٢٪", icon: Activity, change: "+٣٪ عن الأسبوع الماضي", changeType: "positive" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">نظام أمان لإدارة القوى العاملة</h1>
        <p className="text-sm text-zinc-500">نظرة عامة على مشاريع المقاولات الحالية وحالة الموظفين والإنتاجية.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-500">{stat.name}</span>
              <stat.icon className="h-5 w-5 text-zinc-400" />
            </div>
            <div className="mt-2 flex flex-col">
              <span className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">{stat.value}</span>
              <span className="text-xs text-zinc-400 mt-1">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
        <h2 className="text-lg font-medium text-zinc-950 dark:text-white mb-2">أحدث التحديثات والنشاطات اليومية</h2>
        <div className="h-32 flex items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-400 text-sm">
          لا توجد نشاطات مسجلة اليوم حتى الآن.
        </div>
      </div>
    </div>
  );
}
