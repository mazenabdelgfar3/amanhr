"use server";

import { createClient } from "@/lib/supabase/server";
import { saveDailySheetSchema } from "../schema/daily-work-schema";
import { ActionResponse } from "@/types/actions";
import { revalidatePath } from "next/cache";

export async function saveDailySheet(rawInput: unknown): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: { message: "غير مصرح لك بإجراء هذه العملية. يرجى تسجيل الدخول." },
    };
  }

  // Validate request
  const parsed = saveDailySheetSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: {
        message: "البيانات المدخلة في كشف اليومية غير صالحة.",
        fields: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      },
    };
  }

  const { date, rows } = parsed.data;

  try {
    // 1. Prepare data for batch upserts
    const attendanceUpsert = rows.map((row) => ({
      employee_id: row.employeeId,
      date: date,
      status: row.attendance,
      created_by: user.id,
      updated_by: user.id,
    }));

    const dailyWorkUpsert = rows.map((row) => {
      // Rule: If absent/vacation/permission, production and overtime must be 0
      const isPresent = row.attendance === "Present";
      return {
        employee_id: row.employeeId,
        date: date,
        production: isPresent ? row.production : 0,
        overtime_hours: isPresent ? row.overtimeHours : 0,
        notes: row.notes || null,
        created_by: user.id,
        updated_by: user.id,
      };
    });

    // 2. Perform upsert operations
    // Note: Upsert matches on the UNIQUE constraints: (employee_id, date)
    const { error: attError } = await supabase
      .from("attendance")
      .upsert(attendanceUpsert, { onConflict: "employee_id,date" });

    if (attError) {
      console.error("Attendance upsert error:", attError.message);
      return {
        success: false,
        error: { message: "فشل حفظ كشف حضور الموظفين." },
      };
    }

    const { error: workError } = await supabase
      .from("daily_work")
      .upsert(dailyWorkUpsert, { onConflict: "employee_id,date" });

    if (workError) {
      console.error("Daily work upsert error:", workError.message);
      return {
        success: false,
        error: { message: "فشل حفظ إنتاجية وساعات إضافي الموظفين." },
      };
    }

    // 3. Revalidate dashboard and daily sheets caches
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/daily-work");

    return {
      success: true,
    };
  } catch (err) {
    console.error("Unexpected saveDailySheet error:", err);
    return {
      success: false,
      error: { message: "حدث خطأ غير متوقع أثناء حفظ كشف اليومية." },
    };
  }
}
