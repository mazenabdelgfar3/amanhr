import { createClient } from "@/lib/supabase/server";
import { 
  Users, 
  CalendarCheck, 
  DollarSign, 
  TrendingUp,
  Activity,
  UserPlus,
  Coins,
  Package2
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Get total active employees count
  const { count: activeEmployeesCount } = await supabase
    .from("employees")
    .select("*", { count: "exact", head: true })
    .is("deleted_at", null)
    .eq("status", "Active");

  // 2. Get today's attendance metrics
  const todayStr = new Date().toISOString().split("T")[0];
  const { data: todayAttendance } = await supabase
    .from("attendance")
    .select("status")
    .eq("date", todayStr);

  const presentCount = todayAttendance?.filter((a: any) => a.status === "Present").length || 0;
  const totalLogged = todayAttendance?.length || 0;
  const attendanceRate = totalLogged > 0 ? Math.round((presentCount / totalLogged) * 100) : 0;

  // 3. Get total approved & unpaid advances
  const { data: approvedAdvances } = await supabase
    .from("advances")
    .select("amount")
    .eq("status", "Approved");

  const totalApprovedAdvances = approvedAdvances?.reduce((sum: number, adv: any) => sum + Number(adv.amount), 0) || 0;

  // 4. Get active assets (assigned count)
  const { count: assignedAssetsCount } = await supabase
    .from("assets")
    .select("*", { count: "exact", head: true })
    .eq("status", "Assigned");

  // 5. Query recent activities
  const { data: recentEmployees } = await supabase
    .from("employees")
    .select("name, created_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(3);

  const { data: recentAdvances } = await supabase
    .from("advances")
    .select(`
      amount,
      created_at,
      employees (
        name
      )
    `)
    .order("created_at", { ascending: false })
    .limit(3);

  // Format activities into a single chronological feed
  const activities: { id: string; type: string; message: string; date: Date; icon: any }[] = [];

  recentEmployees?.forEach((emp: any, idx: number) => {
    activities.push({
      id: `emp-${idx}`,
      type: "employee",
      message: `تم إضافة الموظف الجديد: ${emp.name}`,
      date: new Date(emp.created_at),
      icon: UserPlus,
    });
  });

  recentAdvances?.forEach((adv: any, idx: number) => {
    activities.push({
      id: `adv-${idx}`,
      type: "advance",
      message: `طلب سلفة بقيمة ${Number(adv.amount).toLocaleString()} ج.م للموظف: ${adv.employees?.name || "موظف"}`,
      date: new Date(adv.created_at),
      icon: Coins,
    });
  });

  // Sort activities by date descending
  activities.sort((a, b) => b.date.getTime() - a.date.getTime());

  const stats = [
    { 
      name: "إجمالي الموظفين النشطين", 
      value: `${activeEmployeesCount || 0} موظف`, 
      icon: Users, 
      change: "الموظفون المسجلون حالياً",
      link: "/dashboard/employees"
    },
    { 
      name: "الحضور اليوم", 
      value: `${presentCount} عامل`, 
      icon: CalendarCheck, 
      change: totalLogged > 0 ? `${attendanceRate}٪ نسبة الحضور اليوم` : "لم يتم تسجيل الحضور اليوم بعد",
      link: "/dashboard/daily-work"
    },
    { 
      name: "إجمالي السلف المعتمدة", 
      value: `${totalApprovedAdvances.toLocaleString()} ج.م`, 
      icon: DollarSign, 
      change: "بانتظار الخصم من الرواتب",
      link: "/dashboard/advances"
    },
    { 
      name: "العهد المستلمة", 
      value: `${assignedAssetsCount || 0} عهدة`, 
      icon: Package2, 
      change: "موزعة على العمال حالياً",
      link: "/dashboard/assets"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white font-sans">لوحة التحكم — Aman HR</h1>
          <p className="text-sm text-zinc-500 font-sans">نظرة عامة حية ومباشرة على القوى العاملة والعهد والسلف المالية.</p>
        </div>
        <div className="text-xs bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded-full font-mono">
          تحديث تلقائي: {new Date().toLocaleDateString("ar-EG", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.link}
            className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-600 transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-500 font-sans">{stat.name}</span>
              <stat.icon className="h-5 w-5 text-zinc-400 dark:text-zinc-600" />
            </div>
            <div className="mt-4 flex flex-col">
              <span className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white font-sans">{stat.value}</span>
              <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-1.5 font-sans">{stat.change}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Updates */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-zinc-950 dark:text-white font-sans flex items-center gap-2">
            <Activity className="h-5 w-5 text-zinc-500" />
            أحدث التحديثات والنشاطات
          </h2>
        </div>

        {activities.length === 0 ? (
          <div className="h-32 flex items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-400 text-sm font-sans">
            لا توجد نشاطات مسجلة اليوم حتى الآن.
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((act) => {
              const Icon = act.icon;
              return (
                <div key={act.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-750 text-zinc-700 dark:text-zinc-300">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 font-sans">{act.message}</span>
                  </div>
                  <span className="text-xs text-zinc-400 font-mono">
                    {act.date.toLocaleTimeString("ar-EG", { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
