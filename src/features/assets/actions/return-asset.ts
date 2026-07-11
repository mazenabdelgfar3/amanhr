"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/actions";
import { revalidatePath } from "next/cache";

export async function returnAsset(allocationId: string, assetId: string): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: { message: "غير مصرح لك بإجراء هذه العملية. يرجى تسجيل الدخول." },
    };
  }

  try {
    // 1. Update returned_at in the allocation log
    const { error: allocError } = await supabase
      .from("asset_allocations")
      .update({ returned_at: new Date().toISOString() })
      .eq("id", allocationId);

    if (allocError) {
      console.error("Allocation return update error:", allocError.message);
      return {
        success: false,
        error: { message: "فشل تحديث سجل تخصيص العهدة." },
      };
    }

    // 2. Set asset status back to Available
    const { error: assetError } = await supabase
      .from("assets")
      .update({ status: "Available" })
      .eq("id", assetId);

    if (assetError) {
      console.error("Asset status return error:", assetError.message);
      return {
        success: false,
        error: { message: "فشل تحديث حالة العهدة للإتاحة." },
      };
    }

    revalidatePath("/dashboard/assets");

    return { success: true };
  } catch (err) {
    console.error("Unexpected returnAsset error:", err);
    return {
      success: false,
      error: { message: "حدث خطأ غير متوقع أثناء إرجاع العهدة." },
    };
  }
}
