"use server";

import { createClient } from "@/lib/supabase/server";
import { employeeSchema } from "../schema/employee-schema";
import { ActionResponse } from "@/types/actions";
import { revalidatePath } from "next/cache";
import { Employee } from "../types";

export async function createEmployee(rawInput: unknown): Promise<ActionResponse<Employee>> {
  // 1. Authenticate user
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: { message: "غير مصرح لك بإجراء هذه العملية. يرجى تسجيل الدخول." },
    };
  }

  // 2. Validate input with Zod
  const parsed = employeeSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: {
        message: "بيانات الموظف غير صالحة.",
        fields: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      },
    };
  }

  try {
    const { name, phone, nationalId, baseSalary, hiringDate, status } = parsed.data;

    // 3. Insert record mapped to DB snake_case columns
    const { data, error } = await supabase
      .from("employees")
      .insert({
        name,
        phone,
        national_id: nationalId,
        base_salary: baseSalary,
        hiring_date: hiringDate,
        status,
        created_by: user.id,
        updated_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Database insert error:", error.message);
      // Handle unique key constraint conflicts gracefully
      if (error.code === "23505") {
        if (error.message.includes("national_id")) {
          return {
            success: false,
            error: { message: "الرقم القومي مسجل بالفعل لموظف آخر." },
          };
        }
        if (error.message.includes("phone")) {
          return {
            success: false,
            error: { message: "رقم الهاتف مسجل بالفعل لموظف آخر." },
          };
        }
      }
      return {
        success: false,
        error: { message: "فشل حفظ بيانات الموظف في قاعدة البيانات." },
      };
    }

    // 4. Revalidate cache
    revalidatePath("/dashboard/employees");

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error("Unexpected create employee error:", err);
    return {
      success: false,
      error: { message: "حدث خطأ غير متوقع أثناء إضافة الموظف." },
    };
  }
}
