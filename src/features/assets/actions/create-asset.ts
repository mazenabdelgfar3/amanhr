"use server";

import { createClient } from "@/lib/supabase/server";
import { assetSchema } from "../schema/asset-schema";
import { ActionResponse } from "@/types/actions";
import { revalidatePath } from "next/cache";
import { Asset } from "../types";

export async function createAsset(rawInput: unknown): Promise<ActionResponse<Asset>> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: { message: "غير مصرح لك بإجراء هذه العملية. يرجى تسجيل الدخول." },
    };
  }

  const parsed = assetSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: {
        message: "بيانات العهدة غير صالحة.",
        fields: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      },
    };
  }

  const { name, serialNumber, status } = parsed.data;

  try {
    const { data, error } = await supabase
      .from("assets")
      .insert({
        name,
        serial_number: serialNumber,
        status,
      })
      .select()
      .single();

    if (error) {
      console.error("Database insert error:", error.message);
      if (error.code === "23505") {
        return {
          success: false,
          error: { message: "الرقم التسلسلي مسجل بالفعل لعهدة أخرى." },
        };
      }
      return {
        success: false,
        error: { message: "فشل حفظ العهدة في قاعدة البيانات." },
      };
    }

    revalidatePath("/dashboard/assets");

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error("Unexpected createAsset error:", err);
    return {
      success: false,
      error: { message: "حدث خطأ غير متوقع أثناء تسجيل العهدة." },
    };
  }
}
