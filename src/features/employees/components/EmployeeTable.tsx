"use client";

import { useState, useMemo } from "react";
import { Employee } from "../types";
import { Edit2, Archive, RotateCcw, Search, Plus } from "lucide-react";
import EmployeeForm from "./EmployeeForm";
import ArchiveDialog from "./ArchiveDialog";

interface EmployeeTableProps {
  initialEmployees: Employee[];
}

export default function EmployeeTable({ initialEmployees }: EmployeeTableProps) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Dialog triggers
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState<{ employee: Employee; mode: "archive" | "restore" } | null>(null);

  // Status mapping to localized badges
  const statusBadges: Record<string, string> = {
    Active: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50",
    Vacation: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50",
    Suspended: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
    Resigned: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
  };

  const statusTranslations: Record<string, string> = {
    Active: "نشط",
    Vacation: "إجازة",
    Suspended: "موقوف",
    Resigned: "مستقيل / مؤرشف",
  };

  // Filtered employees list
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch = 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.phone.includes(searchTerm) ||
        emp.national_id.includes(searchTerm);

      const matchesStatus = 
        statusFilter === "All" || 
        (statusFilter === "Archived" && emp.deleted_at !== null) ||
        (statusFilter !== "Archived" && emp.status === statusFilter && emp.deleted_at === null);

      return matchesSearch && matchesStatus;
    });
  }, [employees, searchTerm, statusFilter]);

  // Refresh page data placeholder (in reality Next revalidates, we sync local state on callback)
  const handleRefresh = async () => {
    // In production Next.js revalidates path; for Client UI responsiveness we reload window or fetch
    window.location.reload();
  };

  return (
    <div className="space-y-6 rtl text-right">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">إدارة الموظفين</h1>
          <p className="text-sm text-zinc-500">إضافة وتعديل بيانات الموظفين وتتبع حالتهم الوظيفية ورواتبهم.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 shrink-0"
        >
          <Plus className="h-4 w-4" />
          إضافة موظف
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
        
        {/* Search */}
        <div className="relative w-full sm:flex-1">
          <span className="absolute inset-y-0 right-3 flex items-center text-zinc-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="search"
            placeholder="بحث بالاسم، الهاتف، أو الرقم القومي..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 py-1.5 pl-3 pr-10 text-sm focus:border-zinc-900 focus:outline-none dark:focus:border-white text-right"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none dark:focus:border-white text-right"
          >
            <option value="All">كل الموظفين (النشطين)</option>
            <option value="Active">نشط</option>
            <option value="Vacation">في إجازة</option>
            <option value="Suspended">موقوف</option>
            <option value="Archived">المستقيلين والمؤرشفين</option>
          </select>
        </div>

      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-right text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-medium border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-3">الاسم</th>
                <th className="px-6 py-3">رقم الهاتف</th>
                <th className="px-6 py-3">الرقم القومي</th>
                <th className="px-6 py-3">الراتب الأساسي</th>
                <th className="px-6 py-3">تاريخ التعيين</th>
                <th className="px-6 py-3">الحالة</th>
                <th className="px-6 py-3 text-left">العمليات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-400">
                    لا توجد سجلات للموظفين مطابقة للبحث.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr 
                    key={emp.id}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                      {emp.name}
                    </td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300 font-mono">
                      {emp.phone}
                    </td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300 font-mono">
                      {emp.national_id}
                    </td>
                    <td className="px-6 py-4 text-zinc-900 dark:text-white font-semibold">
                      {Number(emp.base_salary).toLocaleString("ar-EG")} ج.م
                    </td>
                    <td className="px-6 py-4 text-zinc-500 font-mono">
                      {emp.hiring_date}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border ${statusBadges[emp.status]}`}>
                        {statusTranslations[emp.status] || emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-left">
                      <div className="flex items-center justify-end gap-2">
                        {emp.deleted_at ? (
                          <button
                            onClick={() => setArchiveTarget({ employee: emp, mode: "restore" })}
                            className="p-1 text-zinc-500 hover:text-zinc-800 dark:hover:text-white rounded hover:bg-zinc-100 dark:hover:bg-zinc-900"
                            title="استعادة الموظف"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingEmployee(emp)}
                              className="p-1 text-zinc-500 hover:text-zinc-800 dark:hover:text-white rounded hover:bg-zinc-100 dark:hover:bg-zinc-900"
                              title="تعديل"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setArchiveTarget({ employee: emp, mode: "archive" })}
                              className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50 dark:hover:bg-red-950/20"
                              title="أرشفة / استقالة"
                            >
                              <Archive className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Form Dialog */}
      {showAddForm && (
        <EmployeeForm 
          onClose={() => setShowAddForm(false)}
          onSuccess={handleRefresh}
        />
      )}

      {/* Edit Form Dialog */}
      {editingEmployee && (
        <EmployeeForm 
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onSuccess={handleRefresh}
        />
      )}

      {/* Archive / Restore Dialog */}
      {archiveTarget && (
        <ArchiveDialog 
          employee={archiveTarget.employee}
          mode={archiveTarget.mode}
          onClose={() => setArchiveTarget(null)}
          onSuccess={handleRefresh}
        />
      )}

    </div>
  );
}
