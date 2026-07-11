"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/actions";
import { revalidatePath } from "next/cache";

export async function updatePayrollSheetStatus(
  month: number,
  year: number,
  nextStatus: "Approved" | "Paid"
): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: { message: "غير مصرح لك بإجراء هذه العملية. يرجى تسجيل الدخول." },
    };
  }

  try {
    // 1. Fetch current sheet records
    const { data: sheetRecords, error: fetchErr } = await supabase
      .from("payroll")
      .select("id, employee_id, status")
      .eq("month", month)
      .eq("year", year);

    if (fetchErr || !sheetRecords || sheetRecords.length === 0) {
      return {
        success: false,
        error: { message: "كشف الرواتب المطلوب غير موجود." },
      };
    }

    // Guard rules
    const firstStatus = sheetRecords[0].status;
    if (nextStatus === "Approved" && firstStatus !== "Draft") {
      return { success: false, error: { message: "يمكن فقط اعتماد الكشوفات المسودة." } };
    }
    if (nextStatus === "Paid" && firstStatus !== "Approved") {
      return { success: false, error: { message: "يجب اعتماد الكشف أولاً قبل صرف الرواتب." } };
    }

    // 2. Update status of all payroll records in this month
    const { error: updateErr } = await supabase
      .from("payroll")
      .update({ status: nextStatus, updated_by: user.id })
      .eq("month", month)
      .eq("year", year);

    if (updateErr) {
      console.error("Payroll status update error:", updateErr.message);
      return {
        success: false,
        error: { message: "فشل تحديث حالة كشف الرواتب." },
      };
    }

    // 3. CRITICAL BUSINESS RULE: If status is updated to Paid, settle all associated advances
    if (nextStatus === "Paid") {
      const endDate = `${year}-${String(month).padStart(2, "0")}-${new Date(year, month, 0).getDate()}`;
      
      for (const record of sheetRecords) {
        // Find and update all Approved advances issued on or before the month's end date for this employee
        const { error: advError } = await supabase
          .from("advances")
          .update({ status: "Deducted", updated_by: user.id })
          .eq("employee_id", record.employee_id)
          .eq("status", "Approved")
          .lte("date", endDate);

        if (advError) {
          console.error(`Failed to settle advances for employee ${record.employee_id}:`, advError.message);
          // We log and continue so we don't break the entire flow, since DB is updated
        }
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/payroll");
    revalidatePath("/dashboard/advances");

    return { success: true };
  } catch (err) {
    console.error("Unexpected updatePayrollSheetStatus error:", err);
    return {
      success: false,
      error: { message: "حدث خطأ غير متوقع أثناء تحديث كشف الرواتب." },
    };
  }
}
