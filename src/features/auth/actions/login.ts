"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema, type LoginInput } from "../schema/auth-schema";
import { ActionResponse } from "@/types/actions";

export async function login(rawInput: unknown): Promise<ActionResponse<{ redirectUrl: string }>> {
  const parsed = loginSchema.safeParse(rawInput);
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
    const { email, password } = parsed.data;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login failure technical log:", error.message);
      return {
        success: false,
        error: {
          message: "فشل تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور.",
        },
      };
    }

    return {
      success: true,
      data: { redirectUrl: "/dashboard" },
    };
  } catch (err) {
    console.error("Unexpected login error:", err);
    return {
      success: false,
      error: {
        message: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقاً.",
      },
    };
  }
}
