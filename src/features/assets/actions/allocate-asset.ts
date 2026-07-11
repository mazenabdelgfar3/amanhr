"use server";

import { createClient } from "@/lib/supabase/server";
import { allocateAssetSchema } from "../schema/asset-schema";
import { ActionResponse } from "@/types/actions";
import { revalidatePath } from "next/cache";

export async function allocateAsset(
  assetId: string,
  rawInput: unknown
): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: { message: "غير مصرح لك بإجراء هذه العملية. يرجى تسجيل الدخول." },
    };
  }

  const parsed = allocateAssetSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: {
        message: "بيانات التخصيص غير صالحة.",
        fields: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      },
    };
  }

  const { employeeId, notes } = parsed.data;

  try {
    // 1. Fetch asset status
    const { data: asset, error: fetchErr } = await supabase
      .from("assets")
      .select("status")
      .eq("id", assetId)
      .single();

    if (fetchErr || !asset) {
      return {
        success: false,
        error: { message: "العهدة المطلوبة غير موجودة." },
      };
    }

    if (asset.status !== "Available") {
      return {
        success: false,
        error: { message: "العهدة غير متاحة للتخصيص حالياً." },
      };
    }

    // 2. Update asset status to Assigned
    const { error: updateErr } = await supabase
      .from("assets")
      .update({ status: "Assigned" })
      .eq("id", assetId);

    if (updateErr) {
      console.error("Asset status update error:", updateErr.message);
      return {
        success: false,
        error: { message: "فشل تحديث حالة العهدة." },
      };
    }

    // 3. Log allocation record
    const { error: logErr } = await supabase
      .from("asset_allocations")
      .insert({
        asset_id: assetId,
        employee_id: employeeId,
        notes,
        created_by: user.id,
      });

    if (logErr) {
      console.error("Allocation log insert error:", logErr.message);
      // Rollback asset status
      await supabase.from("assets").update({ status: "Available" }).eq("id", assetId);
      return {
        success: false,
        error: { message: "فشل تسجيل تخصيص العهدة." },
      };
    }

    revalidatePath("/dashboard/assets");

    return { success: true };
  } catch (err) {
    console.error("Unexpected allocateAsset error:", err);
    return {
      success: false,
      error: { message: "حدث خطأ غير متوقع أثناء تخصيص العهدة." },
    };
  }
}
