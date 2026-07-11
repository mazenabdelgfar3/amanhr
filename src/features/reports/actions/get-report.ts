"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/actions";

export interface ReportFilterInput {
  reportType: "attendance" | "production" | "payroll" | "advances";
  startDate?: string;
  endDate?: string;
  employeeId?: string;
}

export async function getReportData(filters: ReportFilterInput): Promise<ActionResponse<any[]>> {
  try {
    const supabase = await createClient();
    const { reportType, startDate, endDate, employeeId } = filters;

    if (reportType === "attendance") {
      let query = supabase
        .from("attendance")
        .select(`
          *,
          employees (
            name,
            phone
          )
        `)
        .order("date", { ascending: false });

      if (startDate) query = query.gte("date", startDate);
      if (endDate) query = query.lte("date", endDate);
      if (employeeId && employeeId !== "all") query = query.eq("employee_id", employeeId);

      const { data, error } = await query;
      if (error) throw error;
      return { success: true, data: data || [] };
    } 
    
    if (reportType === "production") {
      let query = supabase
        .from("daily_work")
        .select(`
          *,
          employees (
            name,
            phone
          )
        `)
        .order("date", { ascending: false });

      if (startDate) query = query.gte("date", startDate);
      if (endDate) query = query.lte("date", endDate);
      if (employeeId && employeeId !== "all") query = query.eq("employee_id", employeeId);

      const { data, error } = await query;
      if (error) throw error;
      return { success: true, data: data || [] };
    } 
    
    if (reportType === "payroll") {
      let query = supabase
        .from("payroll")
        .select(`
          *,
          employees (
            name,
            phone
          )
        `)
        .order("created_at", { ascending: false });

      if (startDate) query = query.gte("period_start", startDate);
      if (endDate) query = query.lte("period_end", endDate);
      if (employeeId && employeeId !== "all") query = query.eq("employee_id", employeeId);

      const { data, error } = await query;
      if (error) throw error;
      return { success: true, data: data || [] };
    } 
    
    if (reportType === "advances") {
      let query = supabase
        .from("advances")
        .select(`
          *,
          employees (
            name,
            phone
          )
        `)
        .order("date", { ascending: false });

      if (startDate) query = query.gte("date", startDate);
      if (endDate) query = query.lte("date", endDate);
      if (employeeId && employeeId !== "all") query = query.eq("employee_id", employeeId);

      const { data, error } = await query;
      if (error) throw error;
      return { success: true, data: data || [] };
    }

    return { success: true, data: [] };
  } catch (error: any) {
    console.error("Error generating report statistics:", error.message);
    return {
      success: false,
      error: {
        message: "حدث خطأ أثناء جلب تفاصيل التقرير. يرجى المحاولة لاحقاً.",
      },
    };
  }
}
