"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/actions";
import { DailyWorkRow } from "../types";

export async function getDailySheet(dateStr: string): Promise<ActionResponse<DailyWorkRow[]>> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: { message: "غير مصرح لك بإجراء هذه العملية. يرجى تسجيل الدخول." },
    };
  }

  try {
    // 1. Fetch all active employees (not soft-deleted)
    const { data: employees, error: empError } = await supabase
      .from("employees")
      .select("id, name, status")
      .is("deleted_at", null)
      .order("name");

    if (empError) {
      console.error("Error loading employees list:", empError.message);
      return {
        success: false,
        error: { message: "فشل تحميل قائمة الموظفين." },
      };
    }

    // 2. Fetch existing daily attendance for the selected date
    const { data: attendanceList, error: attError } = await supabase
      .from("attendance")
      .select("id, employee_id, status")
      .eq("date", dateStr);

    if (attError) {
      console.error("Error loading daily attendance:", attError.message);
      return {
        success: false,
        error: { message: "فشل تحميل بيانات الحضور اليومية." },
      };
    }

    // 3. Fetch existing daily production/work metrics for the selected date
    const { data: workList, error: workError } = await supabase
      .from("daily_work")
      .select("id, employee_id, production, overtime_hours, notes")
      .eq("date", dateStr);

    if (workError) {
      console.error("Error loading daily work metrics:", workError.message);
      return {
        success: false,
        error: { message: "فشل تحميل إحصائيات العمل اليومية." },
      };
    }

    // Map logs to maps for O(1) lookups
    const attendanceMap = new Map(attendanceList.map((a) => [a.employee_id, a]));
    const workMap = new Map(workList.map((w) => [w.employee_id, w]));

    // 4. Merge data
    const rows: DailyWorkRow[] = employees.map((emp) => {
      const attRecord = attendanceMap.get(emp.id);
      const workRecord = workMap.get(emp.id);

      return {
        employeeId: emp.id,
        name: emp.name,
        attendance: (attRecord?.status as any) || (emp.status === "Active" ? "Present" : "Absent"),
        production: workRecord ? Number(workRecord.production) : 0,
        overtimeHours: workRecord ? Number(workRecord.overtime_hours) : 0,
        notes: workRecord?.notes || "",
        attendanceId: attRecord?.id,
        dailyWorkId: workRecord?.id,
      };
    });

    return {
      success: true,
      data: rows,
    };
  } catch (err) {
    console.error("Unexpected getDailySheet error:", err);
    return {
      success: false,
      error: { message: "حدث خطأ غير متوقع أثناء جلب كشف اليومية." },
    };
  }
}
