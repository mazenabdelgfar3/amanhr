import { createClient } from "@/lib/supabase/server";
import EmployeeTable from "@/features/employees/components/EmployeeTable";

export const dynamic = "force-dynamic";

export default async function EmployeesPage() {
  const supabase = await createClient();

  // Fetch all employees (including archived ones so they can be toggled/restored)
  const { data: employees, error } = await supabase
    .from("employees")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error loading employees list:", error.message);
    return (
      <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-6 text-center text-red-600 dark:text-red-400 font-sans rtl text-right">
        <h2 className="text-lg font-bold mb-2">فشل تحميل كشف الموظفين</h2>
        <p className="text-sm">حدث خطأ أثناء جلب البيانات من الخادم. يرجى مراجعة إعدادات قاعدة البيانات وجداول Supabase.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EmployeeTable initialEmployees={employees || []} />
    </div>
  );
}
