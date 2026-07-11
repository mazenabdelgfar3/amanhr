"use client";

import { useState, useMemo } from "react";
import { Employee } from "../types";
import { Edit2, Archive, RotateCcw, Search, Plus, Users, RefreshCw } from "lucide-react";
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

  // Status mapping to localized badges (neutral tones with minimal accent)
  const statusBadges: Record<string, string> = {
    Active: "bg-green-50 text-green-700 border-green-200/60 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/40",
    Vacation: "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/40",
    Suspended: "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40",
    Resigned: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800/40 dark:text-zinc-400 dark:border-zinc-700/60",
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

  const handleRefresh = async () => {
    window.location.reload();
  };

  return (
    <div className="space-y-6 rtl text-right font-sans">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">إدارة شؤون الموظفين</h1>
          <p className="text-xs text-zinc-500 mt-1">تصفح الموظفين النشطين والمؤرشفين، وتعديل بياناتهم والرواتب الأساسية.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 px-4 py-2 text-xs font-semibold text-white dark:text-zinc-950 transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" />
          إضافة موظف جديد
        </button>
      </div>

      {/* Filters & Search - Stripe Style */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
        
        {/* Search Input Box */}
        <div className="relative w-full sm:flex-1">
          <span className="absolute inset-y-0 right-3 flex items-center text-zinc-400 dark:text-zinc-500">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="search"
            placeholder="البحث بالاسم، رقم الهاتف، أو الرقم القومي..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 py-1.5 pl-3 pr-10 text-xs focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white focus:outline-none transition-all text-right"
          />
        </div>

        {/* Status filter selection box */}
        <div className="w-full sm:w-52">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-3 py-1.5 text-xs focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white focus:outline-none transition-all text-right font-medium"
          >
            <option value="All">جميع الموظفين النشطين</option>
            <option value="Active">الحالة: نشط</option>
            <option value="Vacation">الحالة: في إجازة</option>
            <option value="Suspended">الحالة: موقوف مؤقتاً</option>
            <option value="Archived">المستقيلين والمؤرشفين</option>
          </select>
        </div>
      </div>

      {/* Table Card (High Density Minimal Table) */}
      <div className="overflow-hidden rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 shadow-xs">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full border-collapse text-right text-xs">
            <thead className="sticky top-0 bg-zinc-50/95 dark:bg-zinc-900/95 backdrop-blur-xs text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800 z-5">
              <tr>
                <th className="px-6 py-3.5">الاسم الكامل</th>
                <th className="px-6 py-3.5">رقم الهاتف</th>
                <th className="px-6 py-3.5">الرقم القومي</th>
                <th className="px-6 py-3.5">الراتب الأساسي</th>
                <th className="px-6 py-3.5">تاريخ التعيين</th>
                <th className="px-6 py-3.5">الحالة</th>
                <th className="px-6 py-3.5 text-left">العمليات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16">
                    <div className="flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto">
                      <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 dark:text-zinc-500">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white">لم يتم العثور على موظفين</h3>
                        <p className="text-xs text-zinc-500 mt-1">لا توجد سجلات مطابقة لخيارات الفلترة أو مصطلحات البحث الحالية.</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setSearchTerm(""); setStatusFilter("All"); }}
                          className="flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 px-3 py-1.5 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 transition-colors"
                        >
                          <RefreshCw className="h-3 w-3" />
                          إعادة تعيين الفلاتر
                        </button>
                        <button
                          onClick={() => setShowAddForm(true)}
                          className="rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 px-3 py-1.5 text-[11px] font-semibold text-white dark:text-zinc-950 transition-colors"
                        >
                          إضافة أول موظف
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr 
                    key={emp.id}
                    className="hover:bg-zinc-55/30 dark:hover:bg-zinc-900/30 transition-colors duration-150"
                  >
                    <td className="px-6 py-3 font-semibold text-zinc-900 dark:text-white">
                      {emp.name}
                    </td>
                    <td className="px-6 py-3 text-zinc-500 dark:text-zinc-400 font-mono">
                      {emp.phone}
                    </td>
                    <td className="px-6 py-3 text-zinc-500 dark:text-zinc-400 font-mono">
                      {emp.national_id}
                    </td>
                    <td className="px-6 py-3 text-zinc-900 dark:text-white font-semibold font-mono">
                      {Number(emp.base_salary).toLocaleString()} ج.م
                    </td>
                    <td className="px-6 py-3 text-zinc-400 font-mono">
                      {emp.hiring_date}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium border ${statusBadges[emp.status]}`}>
                        {statusTranslations[emp.status] || emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-left">
                      <div className="flex items-center justify-end gap-1.5">
                        {emp.deleted_at ? (
                          <button
                            onClick={() => setArchiveTarget({ employee: emp, mode: "restore" })}
                            className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                            title="استعادة الموظف"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingEmployee(emp)}
                              className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                              title="تعديل"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setArchiveTarget({ employee: emp, mode: "archive" })}
                              className="p-1 text-zinc-400 hover:text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                              title="أرشفة / استقالة"
                            >
                              <Archive className="h-3.5 w-3.5" />
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
