"use server";

import { createClient } from "@/lib/supabase/server";
import { payrollAdjustmentSchema } from "../schema/payroll-schema";
import { ActionResponse } from "@/types/actions";
import { revalidatePath } from "next/cache";

export async function updatePayrollItem(
  payrollId: string,
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

  const parsed = payrollAdjustmentSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: {
        message: "بيانات التعديلات غير صالحة.",
        fields: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      },
    };
  }

  const { bonuses, deductions, notes } = parsed.data;

  try {
    // 1. Fetch current payroll metrics
    const { data: pay, error: fetchErr } = await supabase
      .from("payroll")
      .select("days_present, base_salary_captured, production_pay, overtime_pay, advances_deducted, status")
      .eq("id", payrollId)
      .single();

    if (fetchErr || !pay) {
      return {
        success: false,
        error: { message: "سجل الراتب غير موجود." },
      };
    }

    if (pay.status !== "Draft") {
      return {
        success: false,
        error: { message: "لا يمكن تعديل قيم الراتب بعد اعتماده أو صرفه." },
      };
    }

    // 2. Recalculate net salary
    const baseEarned = (Number(pay.base_salary_captured) / 26) * Number(pay.days_present);
    const grossEarned = baseEarned + Number(pay.production_pay) + Number(pay.overtime_pay) + bonuses;
    const netSalary = grossEarned - deductions - Number(pay.advances_deducted);

    // 3. Update record
    const { error: updateErr } = await supabase
      .from("payroll")
      .update({
        bonuses,
        deductions,
        net_salary: Math.round(netSalary * 100) / 100,
        notes: notes || null,
        updated_by: user.id,
      })
      .eq("id", payrollId);

    if (updateErr) {
      console.error("Database update error:", updateErr.message);
      return {
        success: false,
        error: { message: "فشل تحديث بيانات الراتب." },
      };
    }

    revalidatePath("/dashboard/payroll");

    return { success: true };
  } catch (err) {
    console.error("Unexpected updatePayrollItem error:", err);
    return {
      success: false,
      error: { message: "حدث خطأ غير متوقع أثناء تحديث كشف الراتب." },
    };
  }
}
export async function deletePayrollSheet(month: number, year: number): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: { message: "غير مصرح لك بإجراء هذه العملية. يرجى تسجيل الدخول." },
    };
  }

  try {
    // Only allow deleting sheets that are fully in Draft status
    const { data: sheetRecords, error: fetchErr } = await supabase
      .from("payroll")
      .select("status")
      .eq("month", month)
      .eq("year", year);

    if (fetchErr) {
      console.error("Fetch payroll error:", fetchErr.message);
      return { success: false, error: { message: "فشل استرجاع بيانات كشف الراتب." } };
    }

    const hasLocked = sheetRecords?.some((r) => r.status !== "Draft");
    if (hasLocked) {
      return {
        success: false,
        error: { message: "لا يمكن حذف الكشف. بعض مسيرات الرواتب تم اعتمادها أو صرفها بالفعل." },
      };
    }

    const { error } = await supabase
      .from("payroll")
      .delete()
      .eq("month", month)
      .eq("year", year);

    if (error) {
      console.error("Delete payroll sheet error:", error.message);
      return { success: false, error: { message: "فشل حذف كشف الرواتب." } };
    }

    revalidatePath("/dashboard/payroll");

    return { success: true };
  } catch (err) {
    console.error("Unexpected deletePayrollSheet error:", err);
    return {
      success: false,
      error: { message: "حدث خطأ غير متوقع أثناء حذف الكشف." },
    };
  }
}
