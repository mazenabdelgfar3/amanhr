import { createClient } from "@/lib/supabase/server";
import ReportsDashboard from "@/features/reports/components/ReportsDashboard";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const supabase = await createClient();

  // Fetch only active, non-archived employees for select filter options
  const { data: employees, error } = await supabase
    .from("employees")
    .select("id, name")
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error loading employees list for reports:", error.message);
    return (
      <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-6 text-center text-red-600 dark:text-red-400 font-sans rtl text-right">
        <h2 className="text-lg font-bold mb-2">فشل تحميل قائمة الموظفين</h2>
        <p className="text-sm">حدث خطأ أثناء جلب قائمة الموظفين من قاعدة البيانات. يرجى إعادة المحاولة لاحقاً.</p>
      </div>
    );
  }

  return <ReportsDashboard employees={employees || []} />;
}
