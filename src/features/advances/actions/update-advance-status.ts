"use server";

import { createClient } from "@/lib/supabase/server";
import { advanceStatusEnum, type AdvanceStatus } from "../schema/advance-schema";
import { ActionResponse } from "@/types/actions";
import { revalidatePath } from "next/cache";

export async function updateAdvanceStatus(
  advanceId: string,
  rawStatus: unknown
): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: { message: "غير مصرح لك بإجراء هذه العملية. يرجى تسجيل الدخول." },
    };
  }

  const parsed = advanceStatusEnum.safeParse(rawStatus);
  if (!parsed.success) {
    return {
      success: false,
      error: { message: "حالة السلفة المدخلة غير صالحة." },
    };
  }

  const status = parsed.data;

  try {
    const { error } = await supabase
      .from("advances")
      .update({
        status,
        updated_by: user.id,
      })
      .eq("id", advanceId);

    if (error) {
      console.error("Database update error:", error.message);
      return {
        success: false,
        error: { message: "فشل تحديث حالة السلفة." },
      };
    }

    revalidatePath("/dashboard/advances");

    return { success: true };
  } catch (err) {
    console.error("Unexpected updateAdvanceStatus error:", err);
    return {
      success: false,
      error: { message: "حدث خطأ غير متوقع أثناء تحديث السلفة." },
    };
  }
}
export async function deleteAdvance(advanceId: string): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: { message: "غير مصرح لك بإجراء هذه العملية. يرجى تسجيل الدخول." },
    };
  }

  try {
    // Only allow deleting Pending advances
    const { data: adv, error: fetchErr } = await supabase
      .from("advances")
      .select("status")
      .eq("id", advanceId)
      .single();

    if (fetchErr || !adv) {
      return {
        success: false,
        error: { message: "السلفة غير موجودة." },
      };
    }

    if (adv.status !== "Pending") {
      return {
        success: false,
        error: { message: "لا يمكن حذف السلفة بعد مراجعتها أو تسويتها." },
      };
    }

    const { error } = await supabase
      .from("advances")
      .delete()
      .eq("id", advanceId);

    if (error) {
      console.error("Database delete error:", error.message);
      return {
        success: false,
        error: { message: "فشل حذف السلفة." },
      };
    }

    revalidatePath("/dashboard/advances");

    return { success: true };
  } catch (err) {
    console.error("Unexpected deleteAdvance error:", err);
    return {
      success: false,
      error: { message: "حدث خطأ غير متوقع أثناء حذف السلفة." },
    };
  }
}
