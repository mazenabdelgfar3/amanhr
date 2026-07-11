import { createClient } from "@/lib/supabase/server";
import PayrollTable from "@/features/payroll/components/PayrollTable";

export const dynamic = "force-dynamic";

export default async function PayrollPage() {
  const supabase = await createClient();

  // Fetch all payroll items joining employee names
  const { data: payroll, error } = await supabase
    .from("payroll")
    .select(`
      *,
      employees (
        name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading payroll records:", error.message);
    return (
      <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-6 text-center text-red-600 dark:text-red-400 font-sans rtl text-right">
        <h2 className="text-lg font-bold mb-2">فشل تحميل كشوفات الرواتب</h2>
        <p className="text-sm">حدث خطأ أثناء جلب مسيرات الرواتب من الخادم. يرجى مراجعة إعدادات قاعدة البيانات وجدول الرواتب.</p>
      </div>
    );
  }

  // Format data payload
  const formattedPayroll = (payroll || []).map((pay: any) => ({
    ...pay,
    employee_name: pay.employees?.name || "موظف مؤرشف",
  }));

  return (
    <div className="space-y-6">
      <PayrollTable initialPayroll={formattedPayroll} />
    </div>
  );
}
