"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/actions";

export async function logout(): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failure technical log:", error.message);
      return {
        success: false,
        error: { message: "فشل تسجيل الخروج. يرجى المحاولة لاحقاً." },
      };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected logout error:", err);
    return {
      success: false,
      error: { message: "حدث خطأ غير متوقع أثناء تسجيل الخروج." },
    };
  }
}
