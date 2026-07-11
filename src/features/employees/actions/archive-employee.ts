"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/actions";
import { revalidatePath } from "next/cache";

export async function archiveEmployee(employeeId: string): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: { message: "غير مصرح لك بإجراء هذه العملية. يرجى تسجيل الدخول." },
    };
  }

  try {
    // Soft Delete: Set deleted_at timestamp
    const { error } = await supabase
      .from("employees")
      .update({
        deleted_at: new Date().toISOString(),
        status: "Resigned", // Set status to Resigned upon soft-deletion
        updated_by: user.id,
      })
      .eq("id", employeeId);

    if (error) {
      console.error("Database archive error:", error.message);
      return {
        success: false,
        error: { message: "فشل أرشفة بيانات الموظف." },
      };
    }

    revalidatePath("/dashboard/employees");

    return { success: true };
  } catch (err) {
    console.error("Unexpected archive employee error:", err);
    return {
      success: false,
      error: { message: "حدث خطأ غير متوقع أثناء أرشفة الموظف." },
    };
  }
}

export async function restoreEmployee(employeeId: string): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: { message: "غير مصرح لك بإجراء هذه العملية. يرجى تسجيل الدخول." },
    };
  }

  try {
    // Restore: Set deleted_at back to null and status to Active
    const { error } = await supabase
      .from("employees")
      .update({
        deleted_at: null,
        status: "Active",
        updated_by: user.id,
      })
      .eq("id", employeeId);

    if (error) {
      console.error("Database restore error:", error.message);
      return {
        success: false,
        error: { message: "فشل استعادة بيانات الموظف." },
      };
    }

    revalidatePath("/dashboard/employees");

    return { success: true };
  } catch (err) {
    console.error("Unexpected restore employee error:", err);
    return {
      success: false,
      error: { message: "حدث خطأ غير متوقع أثناء استعادة الموظف." },
    };
  }
}
