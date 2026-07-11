"use server";

import { createClient } from "@/lib/supabase/server";
import { advanceSchema } from "../schema/advance-schema";
import { ActionResponse } from "@/types/actions";
import { revalidatePath } from "next/cache";
import { Advance } from "../types";

export async function createAdvance(rawInput: unknown): Promise<ActionResponse<Advance>> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: { message: "غير مصرح لك بإجراء هذه العملية. يرجى تسجيل الدخول." },
    };
  }

  const parsed = advanceSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: {
        message: "بيانات السلفة غير صالحة.",
        fields: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      },
    };
  }

  const { employeeId, date, amount, status, notes } = parsed.data;

  try {
    // 1. Fetch employee base salary to enforce the safety constraint
    const { data: employee, error: empError } = await supabase
      .from("employees")
      .select("base_salary, name")
      .eq("id", employeeId)
      .single();

    if (empError || !employee) {
      return {
        success: false,
        error: { message: "الموظف المحدد غير موجود." },
      };
    }

    const baseSalary = Number(employee.base_salary);
    // Business Rule check
    if (amount > baseSalary) {
      return {
        success: false,
        error: {
          message: `فشل تسجيل السلفة. قيمة السلفة (${amount} ج.م) لا يمكن أن تتجاوز الراتب الأساسي للموظف (${baseSalary} ج.م).`,
        },
      };
    }

    // 2. Insert record
    const { data, error } = await supabase
      .from("advances")
      .insert({
        employee_id: employeeId,
        date,
        amount,
        status,
        notes,
        created_by: user.id,
        updated_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Database insert error:", error.message);
      return {
        success: false,
        error: { message: "فشل حفظ السلفة في قاعدة البيانات." },
      };
    }

    revalidatePath("/dashboard/advances");

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error("Unexpected createAdvance error:", err);
    return {
      success: false,
      error: { message: "حدث خطأ غير متوقع أثناء تسجيل السلفة." },
    };
  }
}
