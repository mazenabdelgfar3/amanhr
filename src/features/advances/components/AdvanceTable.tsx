"use client";

import { useState, useTransition, useMemo } from "react";
import { Advance } from "../types";
import { updateAdvanceStatus, deleteAdvance } from "../actions/update-advance-status";
import { Check, X, Trash, Search, Plus, Calendar, AlertCircle } from "lucide-react";
import AdvanceForm from "./AdvanceForm";

interface EmployeeLookup {
  id: string;
  name: string;
}

interface AdvanceTableProps {
  initialAdvances: Advance[];
  employees: EmployeeLookup[];
}

export default function AdvanceTable({ initialAdvances, employees }: AdvanceTableProps) {
  const [advances, setAdvances] = useState<Advance[]>(initialAdvances);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const statusBadges: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
    Approved: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50",
    Deducted: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50",
    Rejected: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50",
  };

  const statusTranslations: Record<string, string> = {
    Pending: "قيد المراجعة",
    Approved: "موافَق عليها",
    Deducted: "تم خصمها من الراتب",
    Rejected: "مرفوضة",
  };

  const handleUpdateStatus = (id: string, nextStatus: string) => {
    startTransition(async () => {
      const res = await updateAdvanceStatus(id, nextStatus);
      if (res.success) {
        window.location.reload();
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف طلب السلفة هذا؟")) return;
    startTransition(async () => {
      const res = await deleteAdvance(id);
      if (res.success) {
        window.location.reload();
      }
    });
  };

  const filteredAdvances = useMemo(() => {
    return advances.filter((adv) => {
      const name = adv.employee_name || "";
      const matchesSearch = 
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        adv.notes?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "All" || adv.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [advances, searchTerm, statusFilter]);

  return (
    <div className="space-y-6 rtl text-right">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white">جدول السلف المالية</h1>
          <p className="text-sm text-zinc-500">تسجيل ومراجعة طلبات سلف العاملين وتسويتها لاحقاً مع الرواتب.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 shrink-0"
        >
          <Plus className="h-4 w-4" />
          تسجيل سلفة
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
        
        {/* Search */}
        <div className="relative w-full sm:flex-1">
          <span className="absolute inset-y-0 right-3 flex items-center text-zinc-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="search"
            placeholder="بحث باسم العامل أو الملاحظات..."
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
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white text-right"
          >
            <option value="All">جميع الحالات</option>
            <option value="Pending">قيد المراجعة</option>
            <option value="Approved">موافَق عليها</option>
            <option value="Deducted">تم خصمها</option>
            <option value="Rejected">مرفوضة</option>
          </select>
        </div>

      </div>

      {/* Grid List */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-right text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 font-medium">
              <tr>
                <th className="px-6 py-3">اسم العامل</th>
                <th className="px-6 py-3 w-32">المبلغ</th>
                <th className="px-6 py-3 w-36">تاريخ الاستلام</th>
                <th className="px-6 py-3 w-36">الحالة</th>
                <th className="px-6 py-3">الملاحظات</th>
                <th className="px-6 py-3 text-left w-36">التحكم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filteredAdvances.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-400">
                    لا توجد طلبات سلف مسجلة مطابقة للفلترة.
                  </td>
                </tr>
              ) : (
                filteredAdvances.map((adv) => (
                  <tr 
                    key={adv.id} 
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-zinc-950 dark:text-white">
                      {adv.employee_name}
                    </td>
                    <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-white font-mono">
                      {Number(adv.amount).toLocaleString("ar-EG")} ج.م
                    </td>
                    <td className="px-6 py-4 font-mono text-zinc-500">
                      {adv.date}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border ${statusBadges[adv.status]}`}>
                        {statusTranslations[adv.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 max-w-xs truncate">
                      {adv.notes || "-"}
                    </td>
                    <td className="px-6 py-4 text-left">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Process buttons for Pending status */}
                        {adv.status === "Pending" && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(adv.id, "Approved")}
                              disabled={isPending}
                              className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 rounded"
                              title="قبول السلفة"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(adv.id, "Rejected")}
                              disabled={isPending}
                              className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded"
                              title="رفض السلفة"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(adv.id)}
                              disabled={isPending}
                              className="p-1 text-zinc-500 hover:text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded"
                              title="حذف الطلب"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </>
                        )}

                        {/* Deduct trigger for approved advances */}
                        {adv.status === "Approved" && (
                          <button
                            onClick={() => handleUpdateStatus(adv.id, "Deducted")}
                            disabled={isPending}
                            className="text-xs font-semibold px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded hover:bg-zinc-200 border border-zinc-200 dark:border-zinc-700"
                          >
                            تحديد كـ "تم الخصم"
                          </button>
                        )}

                        {/* Lock message for Deducted or Rejected */}
                        {(adv.status === "Deducted" || adv.status === "Rejected") && (
                          <span className="text-xs text-zinc-400 select-none">
                            تمت التسوية
                          </span>
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
        <AdvanceForm
          employees={employees}
          onClose={() => setShowAddForm(false)}
          onSuccess={() => window.location.reload()}
        />
      )}

    </div>
  );
}
