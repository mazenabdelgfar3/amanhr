"use server";

import { createClient } from "@/lib/supabase/server";
import { generatePayrollSchema } from "../schema/payroll-schema";
import { ActionResponse } from "@/types/actions";
import { revalidatePath } from "next/cache";

export async function generatePayroll(rawInput: unknown): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: { message: "غير مصرح لك بإجراء هذه العملية. يرجى تسجيل الدخول." },
    };
  }

  const parsed = generatePayrollSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: { message: "تاريخ الاحتساب غير صحيح." },
    };
  }

  const { 
    month, 
    year,
    overtimeMultiplier = 1.5,
    workingDays = 26,
    workingHours = 8,
    productionUnitRate = 5
  } = parsed.data;

  try {
    // 1. Check if there is already a lock (Approved or Paid payroll) for this month/year
    const { data: existingLocked, error: lockErr } = await supabase
      .from("payroll")
      .select("status")
      .eq("month", month)
      .eq("year", year)
      .neq("status", "Draft")
      .limit(1);

    if (lockErr) {
      console.error("Lock check error:", lockErr.message);
      return { success: false, error: { message: "فشل التحقق من حالة كشف الرواتب الحالية." } };
    }

    if (existingLocked && existingLocked.length > 0) {
      return {
        success: false,
        error: { message: "لا يمكن إعادة احتساب الكشف. كشف الرواتب لهذا الشهر تم اعتماده أو صرفه بالفعل." },
      };
    }

    // 2. Fetch all active employees
    const { data: employees, error: empErr } = await supabase
      .from("employees")
      .select("id, name, base_salary")
      .is("deleted_at", null);

    if (empErr || !employees) {
      console.error("Fetch employees error:", empErr?.message);
      return { success: false, error: { message: "فشل تحميل قائمة الموظفين." } };
    }

    // Date range boundaries for the target month
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

    // 3. For each employee, load attendance logs, daily production logs, and approved advances
    const payrollRecords = [];

    for (const emp of employees) {
      const baseSalary = Number(emp.base_salary);

      // A. Fetch attendance counts
      const { data: attData } = await supabase
        .from("attendance")
        .select("status")
        .eq("employee_id", emp.id)
        .gte("date", startDate)
        .lte("date", endDate);

      const daysPresent = attData?.filter((a) => a.status === "Present").length || 0;
      const daysAbsent = attData?.filter((a) => a.status === "Absent").length || 0;

      // B. Fetch total daily work logs (production units and overtime hours)
      const { data: workData } = await supabase
        .from("daily_work")
        .select("production, overtime_hours")
        .eq("employee_id", emp.id)
        .gte("date", startDate)
        .lte("date", endDate);

      const totalProduction = workData?.reduce((sum, w) => sum + Number(w.production || 0), 0) || 0;
      const totalOvertimeHours = workData?.reduce((sum, w) => sum + Number(w.overtime_hours || 0), 0) || 0;

      // C. Calculate wage elements
      // Daily Rate assumes configured working days
      const dailyRate = baseSalary / workingDays;
      const baseEarned = dailyRate * daysPresent;

      // Production pay
      const productionPay = totalProduction * productionUnitRate;

      // Overtime rate assumes workingDays * workingHours total monthly hours
      const totalWorkingHours = workingDays * workingHours;
      const overtimeRate = (baseSalary / totalWorkingHours) * overtimeMultiplier;
      const overtimePay = totalOvertimeHours * overtimeRate;

      // D. Fetch total approved cash advances issued on or before this month
      const { data: advData } = await supabase
        .from("advances")
        .select("id, amount")
        .eq("employee_id", emp.id)
        .eq("status", "Approved")
        .lte("date", endDate);

      const totalApprovedAdvances = advData?.reduce((sum, a) => sum + Number(a.amount || 0), 0) || 0;

      // Capping advances deduction to ensure worker doesn't end up with negative net salary
      const grossEarned = baseEarned + productionPay + overtimePay;
      const advancesDeducted = Math.min(totalApprovedAdvances, grossEarned);

      const netSalary = grossEarned - advancesDeducted;

      payrollRecords.push({
        employee_id: emp.id,
        month,
        year,
        days_present: daysPresent,
        days_absent: daysAbsent,
        total_production: totalProduction,
        total_overtime_hours: totalOvertimeHours,
        base_salary_captured: baseSalary,
        production_pay: Math.round(productionPay * 100) / 100,
        overtime_pay: Math.round(overtimePay * 100) / 100,
        advances_deducted: Math.round(advancesDeducted * 100) / 100,
        bonuses: 0,
        deductions: 0,
        net_salary: Math.round(netSalary * 100) / 100,
        status: "Draft",
        created_by: user.id,
        updated_by: user.id,
      });
    }

    // 4. Batch upsert into payroll table
    if (payrollRecords.length > 0) {
      const { error: upsertErr } = await supabase
        .from("payroll")
        .upsert(payrollRecords, { onConflict: "employee_id,month,year" });

      if (upsertErr) {
        console.error("Payroll batch upsert error:", upsertErr.message);
        return { success: false, error: { message: "فشل حفظ مسيرات الرواتب المحتسبة." } };
      }
    }

    revalidatePath("/dashboard/payroll");

    return { success: true };
  } catch (err) {
    console.error("Unexpected generatePayroll error:", err);
    return {
      success: false,
      error: { message: "حدث خطأ غير متوقع أثناء احتساب الرواتب." },
    };
  }
}
