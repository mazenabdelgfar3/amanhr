import { createClient } from "@/lib/supabase/server";
import { 
  Users, 
  CalendarCheck, 
  DollarSign, 
  Activity,
  UserPlus,
  Coins,
  Package2,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import Link from "next/link";
import DashboardCharts from "@/features/dashboard/components/DashboardCharts";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Get total active employees count
  let activeEmployeesCount = 0;
  try {
    const { count } = await supabase
      .from("employees")
      .select("*", { count: "exact", head: true })
      .is("deleted_at", null)
      .eq("status", "Active");
    activeEmployeesCount = count || 0;
  } catch (err) {
    console.error("Dashboard DB query error (employees count):", err);
  }

  // 2. Get today's attendance metrics
  let presentCount = 0;
  let totalLogged = 0;
  let attendanceRate = 0;
  const todayStr = new Date().toISOString().split("T")[0];
  try {
    const { data: todayAttendance } = await supabase
      .from("attendance")
      .select("status")
      .eq("date", todayStr);
    presentCount = todayAttendance?.filter((a: any) => a.status === "Present").length || 0;
    totalLogged = todayAttendance?.length || 0;
    attendanceRate = totalLogged > 0 ? Math.round((presentCount / totalLogged) * 100) : 0;
  } catch (err) {
    console.error("Dashboard DB query error (attendance today):", err);
  }

  // 3. Get total approved & unpaid advances
  let totalApprovedAdvances = 0;
  try {
    const { data: approvedAdvances } = await supabase
      .from("advances")
      .select("amount")
      .eq("status", "Approved");
    totalApprovedAdvances = approvedAdvances?.reduce((sum: number, adv: any) => sum + Number(adv.amount), 0) || 0;
  } catch (err) {
    console.error("Dashboard DB query error (advances total):", err);
  }

  // 4. Get active assets (assigned count)
  let assignedAssetsCount = 0;
  try {
    const { count } = await supabase
      .from("assets")
      .select("*", { count: "exact", head: true })
      .eq("status", "Assigned");
    assignedAssetsCount = count || 0;
  } catch (err) {
    console.error("Dashboard DB query error (assets count):", err);
  }

  // 5. Query recent activities for the timeline feed
  const activities: { id: string; type: string; message: string; date: Date; icon: any }[] = [];
  try {
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

    recentEmployees?.forEach((emp: any, idx: number) => {
      activities.push({
        id: `emp-${idx}-${emp.created_at}`,
        type: "employee",
        message: `تم قيد الموظف الجديد: ${emp.name}`,
        date: new Date(emp.created_at),
        icon: UserPlus,
      });
    });

    recentAdvances?.forEach((adv: any, idx: number) => {
      activities.push({
        id: `adv-${idx}-${adv.created_at}`,
        type: "advance",
        message: `طلب سلفة جديدة بقيمة ${Number(adv.amount).toLocaleString()} ج.م للموظف: ${adv.employees?.name || "موظف"}`,
        date: new Date(adv.created_at),
        icon: Coins,
      });
    });
  } catch (err) {
    console.error("Dashboard DB query error (activities):", err);
  }

  // Sort activities by date descending
  activities.sort((a, b) => b.date.getTime() - a.date.getTime());

  // 6. Gather trend details for charts
  let attendanceTrend: { date: string; rate: number }[] = [];
  let productionTrend: { date: string; units: number }[] = [];
  let payrollSummary: { period: string; netPay: number }[] = [];
  let assetsDistribution: { status: string; count: number }[] = [];

  try {
    // Assets by status count
    const { data: assetsStatusData } = await supabase
      .from("assets")
      .select("status");
    if (assetsStatusData) {
      const counts: Record<string, number> = { Available: 0, Assigned: 0, Maintenance: 0, Damaged: 0 };
      assetsStatusData.forEach((a: any) => {
        if (counts[a.status] !== undefined) counts[a.status]++;
      });
      assetsDistribution = Object.keys(counts).map((k) => ({ status: k, count: counts[k] }));
    }

    // Payroll monthly overview
    const { data: payrollData } = await supabase
      .from("payroll")
      .select("month, year, net_salary");
    if (payrollData) {
      // Group by month
      const months = ["أنا", "فبر", "مار", "أبر", "ماي", "يون", "يول", "أغس", "سبت", "أكت", "نوف", "ديس"];
      const payrollMap: Record<string, number> = {};
      payrollData.forEach((p: any) => {
        const key = `${months[p.month - 1]} ${p.year}`;
        payrollMap[key] = (payrollMap[key] || 0) + Number(p.net_salary);
      });
      payrollSummary = Object.keys(payrollMap).map((k) => ({ period: k, netPay: payrollMap[k] })).slice(-4);
    }
  } catch (err) {
    console.error("Dashboard DB query error (charts trend data):", err);
  }

  // KPI cards metrics with Simulated Sparklines
  const stats = [
    { 
      name: "إجمالي الموظفين النشطين", 
      value: `${activeEmployeesCount || 0} موظف`, 
      icon: Users, 
      change: "+2% عن الشهر الماضي",
      isPositive: true,
      color: "text-green-600 dark:text-green-400",
      sparkline: (
        <svg className="h-6 w-16 text-green-500" viewBox="0 0 100 30" fill="none">
          <path d="M0 25 L15 20 L30 22 L45 15 L60 18 L75 10 L90 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      link: "/dashboard/employees"
    },
    { 
      name: "حضور العمال اليوم", 
      value: totalLogged > 0 ? `${presentCount} عامل` : "لم يسجل", 
      icon: CalendarCheck, 
      change: totalLogged > 0 ? `${attendanceRate}% نسبة الحضور اليوم` : "بانتظار الكشف اليومي",
      isPositive: attendanceRate >= 90,
      color: attendanceRate >= 90 ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400",
      sparkline: (
        <svg className="h-6 w-16 text-blue-500" viewBox="0 0 100 30" fill="none">
          <path d="M0 15 L15 12 L30 18 L45 8 L60 14 L75 5 L90 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      link: "/dashboard/daily-work"
    },
    { 
      name: "إجمالي السلف المعتمدة", 
      value: `${totalApprovedAdvances.toLocaleString()} ج.م`, 
      icon: DollarSign, 
      change: "سيتم خصمها من الراتب القادم",
      isPositive: false,
      color: "text-amber-600 dark:text-amber-400",
      sparkline: (
        <svg className="h-6 w-16 text-amber-500" viewBox="0 0 100 30" fill="none">
          <path d="M0 5 L15 10 L30 8 L45 15 L60 12 L75 22 L90 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      link: "/dashboard/advances"
    },
    { 
      name: "الأدوات والمعدات المستلمة", 
      value: `${assignedAssetsCount || 0} عهدة`, 
      icon: Package2, 
      change: "عهد موزعة ومقيدة بالكامل",
      isPositive: true,
      color: "text-zinc-600 dark:text-zinc-400",
      sparkline: (
        <svg className="h-6 w-16 text-zinc-400" viewBox="0 0 100 30" fill="none">
          <path d="M0 20 L20 18 L40 22 L60 15 L80 16 L100 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      link: "/dashboard/assets"
    },
  ];

  return (
    <div className="space-y-6 font-sans rtl text-right">
      
      {/* Page Title & Breadcrumb Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-100 dark:border-zinc-850 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">لوحة القيادة والمؤشرات الرئيسية</h1>
          <p className="text-xs text-zinc-500 mt-1 font-sans">ملخص حي لأعداد القوى العاملة، ومستويات الإنتاجية اليومية، وحركات العهد والسلف.</p>
        </div>
        <div className="text-[10px] font-bold bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-600 dark:text-zinc-400 px-3 py-1.5 rounded-lg">
          تاريخ اليوم: {new Date().toLocaleDateString("ar-EG", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.link}
            className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-5 flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-600 transition-all cursor-pointer shadow-xs hover:shadow-sm duration-150"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">{stat.name}</span>
              <stat.icon className="h-4.5 w-4.5 text-zinc-400 dark:text-zinc-600" />
            </div>
            
            <div className="mt-4 flex items-end justify-between">
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white font-mono">{stat.value}</span>
                <span className="text-[9px] text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-1 font-medium">
                  {stat.isPositive ? (
                    <TrendingUp className="h-3 w-3 text-green-500 inline" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-amber-500 inline" />
                  )}
                  {stat.change}
                </span>
              </div>
              <div className="opacity-90">{stat.sparkline}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts & Actions Row */}
      <DashboardCharts 
        attendanceData={attendanceTrend}
        productionData={productionTrend}
        payrollData={payrollSummary}
        assetsData={assetsDistribution}
      />

      {/* Activity Timeline Feed */}
      <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-850">
          <Activity className="h-4 w-4 text-zinc-500" />
          <h2 className="text-xs font-bold text-zinc-900 dark:text-white">أحدث نشاطات وحركات النظام</h2>
        </div>

        {activities.length === 0 ? (
          <div className="h-28 flex flex-col items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-400 dark:text-zinc-600 text-xs gap-1.5">
            <span>لا توجد حركات مسجلة مؤخراً بقاعدة البيانات.</span>
            <span className="text-[10px]">سيتم عرض النشاطات بمجرد إضافة عمال أو تسجيل السلف.</span>
          </div>
        ) : (
          <div className="relative border-r-2 border-zinc-100 dark:border-zinc-850 pr-4 mr-2 space-y-4">
            {activities.map((act) => {
              const Icon = act.icon;
              return (
                <div key={act.id} className="relative flex items-start justify-between gap-4">
                  {/* Timeline point dot */}
                  <span className="absolute -right-[21px] top-1.5 w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-100 ring-4 ring-white dark:ring-zinc-950" />
                  
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{act.message}</span>
                  </div>

                  <span className="text-[10px] text-zinc-400 font-mono">
                    {act.date.toLocaleDateString("ar-EG")} | {act.date.toLocaleTimeString("ar-EG", { hour: '2-digit', minute: '2-digit' })}
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
