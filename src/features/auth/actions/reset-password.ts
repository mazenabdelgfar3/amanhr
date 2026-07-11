"use server";

import { createClient } from "@/lib/supabase/server";
import { 
  forgotPasswordSchema, 
  resetPasswordSchema 
} from "../schema/auth-schema";
import { ActionResponse } from "@/types/actions";

export async function requestPasswordReset(rawInput: unknown): Promise<ActionResponse> {
  const parsed = forgotPasswordSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: {
        message: "البريد الإلكتروني غير صحيح.",
        fields: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      },
    };
  }

  try {
    const supabase = await createClient();
    const { email } = parsed.data;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password`,
    });

    if (error) {
      console.error("Forgot password link request failure:", error.message);
      return {
        success: false,
        error: { message: "فشل إرسال رابط استعادة كلمة المرور. تأكد من صحة البريد الإلكتروني." },
      };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected request password reset error:", err);
    return {
      success: false,
      error: { message: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقاً." },
    };
  }
}

export async function updatePassword(rawInput: unknown): Promise<ActionResponse> {
  const parsed = resetPasswordSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: {
        message: "بيانات الإدخال غير صالحة.",
        fields: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      },
    };
  }

  try {
    const supabase = await createClient();
    const { password } = parsed.data;

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      console.error("Update password failure:", error.message);
      return {
        success: false,
        error: { message: "فشل تحديث كلمة المرور. قد يكون الرابط قد انتهت صلاحيته." },
      };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected update password error:", err);
    return {
      success: false,
      error: { message: "حدث خطأ غير متوقع أثناء تحديث كلمة المرور." },
    };
  }
}
