import { createClient } from "@/lib/supabase/server";
import AssetTable from "@/features/assets/components/AssetTable";

export const dynamic = "force-dynamic";

export default async function AssetsPage() {
  const supabase = await createClient();

  // 1. Fetch active employees lookup for assignment dropdown
  const { data: employees } = await supabase
    .from("employees")
    .select("id, name")
    .is("deleted_at", null)
    .order("name");

  // 2. Fetch assets joining their allocations history to get the current assignment
  const { data: assets, error } = await supabase
    .from("assets")
    .select(`
      *,
      asset_allocations (
        id,
        employee_id,
        allocated_at,
        returned_at,
        employees (
          name
        )
      )
    `)
    .order("name");

  if (error) {
    console.error("Error loading assets list:", error.message);
    return (
      <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-6 text-center text-red-600 dark:text-red-400 font-sans rtl text-right">
        <h2 className="text-lg font-bold mb-2">فشل تحميل كشف العهد والمعدات</h2>
        <p className="text-sm">حدث خطأ أثناء جلب البيانات من الخادم. يرجى مراجعة إعدادات قاعدة البيانات وجداول العهد.</p>
      </div>
    );
  }

  // Map to identify current allocation (returned_at IS NULL)
  const formattedAssets = (assets || []).map((asset: any) => {
    // Find active allocation (returned_at is null)
    const activeAlloc = asset.asset_allocations?.find((alloc: any) => alloc.returned_at === null);

    return {
      id: asset.id,
      name: asset.name,
      serial_number: asset.serial_number,
      status: asset.status,
      created_at: asset.created_at,
      updated_at: asset.updated_at,
      current_employee_name: activeAlloc?.employees?.name || null,
      current_employee_id: activeAlloc?.employee_id || null,
      allocated_at: activeAlloc?.allocated_at || null,
      allocation_id: activeAlloc?.id || null,
    };
  });

  return (
    <div className="space-y-6">
      <AssetTable 
        initialAssets={formattedAssets} 
        employees={employees || []} 
      />
    </div>
  );
}
