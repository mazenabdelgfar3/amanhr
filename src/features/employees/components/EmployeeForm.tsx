"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeSchema, type EmployeeInput } from "../schema/employee-schema";
import { createEmployee } from "../actions/create-employee";
import { updateEmployee } from "../actions/update-employee";
import { Employee } from "../types";
import { useTransition, useState } from "react";
import { X, Loader2 } from "lucide-react";

interface EmployeeFormProps {
  employee?: Employee;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EmployeeForm({ employee, onClose, onSuccess }: EmployeeFormProps) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeInput>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: employee?.name || "",
      phone: employee?.phone || "",
      nationalId: employee?.national_id || "",
      baseSalary: employee?.base_salary ? Number(employee.base_salary) : 0,
      hiringDate: employee?.hiring_date || new Date().toISOString().split("T")[0],
      status: employee?.status || "Active",
    },
  });

  const onSubmit = (data: EmployeeInput) => {
    setServerError(null);
    startTransition(async () => {
      let response;
      if (employee) {
        response = await updateEmployee(employee.id, data);
      } else {
        response = await createEmployee(data);
      }

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        setServerError(response.error?.message || "حدث خطأ أثناء حفظ البيانات.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 rtl">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-lg space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <h2 className="text-lg font-bold text-zinc-950 dark:text-white">
            {employee ? "تعديل بيانات الموظف" : "إضافة موظف جديد"}
          </h2>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white p-1 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 text-right">
            {serverError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            
            {/* Name */}
            <div className="flex flex-col text-right sm:col-span-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                الاسم بالكامل <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("name")}
                className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none dark:focus:border-white text-right"
                placeholder="أدخل الاسم ثلاثي أو رباعي"
              />
              {errors.name && (
                <span className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.name.message}</span>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col text-right">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                رقم الهاتف <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("phone")}
                className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none dark:focus:border-white text-right"
                placeholder="01xxxxxxxxx"
              />
              {errors.phone && (
                <span className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.phone.message}</span>
              )}
            </div>

            {/* National ID */}
            <div className="flex flex-col text-right">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                الرقم القومي (14 رقم) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("nationalId")}
                className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none dark:focus:border-white text-right"
                placeholder="290xxxxxxxxxxx"
              />
              {errors.nationalId && (
                <span className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.nationalId.message}</span>
              )}
            </div>

            {/* Base Salary */}
            <div className="flex flex-col text-right">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                الراتب الأساسي (ج.م) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                {...register("baseSalary", { valueAsNumber: true })}
                className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none dark:focus:border-white text-right"
                placeholder="0.00"
              />
              {errors.baseSalary && (
                <span className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.baseSalary.message}</span>
              )}
            </div>

            {/* Hiring Date */}
            <div className="flex flex-col text-right">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                تاريخ التعيين <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register("hiringDate")}
                className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none dark:focus:border-white text-right"
              />
              {errors.hiringDate && (
                <span className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.hiringDate.message}</span>
              )}
            </div>

            {/* Status */}
            <div className="flex flex-col text-right sm:col-span-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                حالة الموظف
              </label>
              <select
                {...register("status")}
                className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none dark:focus:border-white text-right"
              >
                <option value="Active">نشط (Active)</option>
                <option value="Vacation">إجازة (Vacation)</option>
                <option value="Suspended">موقوف مؤقتاً (Suspended)</option>
                <option value="Resigned">مستقيل (Resigned)</option>
              </select>
              {errors.status && (
                <span className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.status.message}</span>
              )}
            </div>

          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ البيانات"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
