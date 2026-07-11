import { createClient } from "@/lib/supabase/server";
import AdvanceTable from "@/features/advances/components/AdvanceTable";

export const dynamic = "force-dynamic";

export default async function AdvancesPage() {
  const supabase = await createClient();

  // 1. Fetch active employees lookup for form dropdown
  const { data: employees } = await supabase
    .from("employees")
    .select("id, name")
    .is("deleted_at", null)
    .order("name");

  // 2. Fetch all advances with employee name join
  const { data: advances, error } = await supabase
    .from("advances")
    .select(`
      *,
      employees (
        name
      )
    `)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error loading advances list:", error.message);
    return (
      <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-6 text-center text-red-600 dark:text-red-400 font-sans rtl text-right">
        <h2 className="text-lg font-bold mb-2">فشل تحميل كشف السلف</h2>
        <p className="text-sm">حدث خطأ أثناء جلب البيانات من الخادم. يرجى مراجعة إعدادات قاعدة البيانات وجدول السلف.</p>
      </div>
    );
  }

  // Format response to flat object
  const formattedAdvances = (advances || []).map((adv: any) => ({
    ...adv,
    employee_name: adv.employees?.name || "موظف مؤرشف",
  }));

  return (
    <div className="space-y-6">
      <AdvanceTable 
        initialAdvances={formattedAdvances} 
        employees={employees || []} 
      />
    </div>
  );
}
