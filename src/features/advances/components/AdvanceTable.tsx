"use client";

import { useState, useTransition, useMemo } from "react";
import { Advance } from "../types";
import { updateAdvanceStatus, deleteAdvance } from "../actions/update-advance-status";
import { Check, X, Trash, Search, Plus, DollarSign, RefreshCw } from "lucide-react";
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
    Pending: "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40",
    Approved: "bg-green-50 text-green-700 border-green-200/60 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/40",
    Deducted: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800/40 dark:text-zinc-400 dark:border-zinc-700/60",
    Rejected: "bg-red-50 text-red-700 border-red-200/60 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/40",
  };

  const statusTranslations: Record<string, string> = {
    Pending: "قيد المراجعة",
    Approved: "موافَق عليها",
    Deducted: "مخصومة ومسددة",
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
    <div className="space-y-6 rtl text-right font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">إدارة السلف والمدفوعات المقدمة</h1>
          <p className="text-xs text-zinc-500 mt-1 font-sans">تتبع وتسجيل السلف المالية المخصومة من مرتبات الموظفين الشهرية.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 px-4 py-2 text-xs font-semibold text-white dark:text-zinc-950 transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" />
          طلب تسجيل سلفة جديدة
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
        
        {/* Search Input Box */}
        <div className="relative w-full sm:flex-1">
          <span className="absolute inset-y-0 right-3 flex items-center text-zinc-400 dark:text-zinc-500">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="search"
            placeholder="بحث باسم الموظف أو الملاحظات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 py-1.5 pl-3 pr-10 text-xs focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white focus:outline-none transition-all text-right"
          />
        </div>

        {/* Status Filter Dropdown */}
        <div className="w-full sm:w-52">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-3 py-1.5 text-xs focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white focus:outline-none transition-all text-right font-medium"
          >
            <option value="All">جميع طلبات السلف</option>
            <option value="Pending">حالة: قيد المراجعة</option>
            <option value="Approved">حالة: معتمدة بانتظار الخصم</option>
            <option value="Deducted">حالة: مخصومة ومسددة</option>
            <option value="Rejected">حالة: مرفوضة</option>
          </select>
        </div>
      </div>

      {/* Grid List Table */}
      <div className="overflow-hidden rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 shadow-xs">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full border-collapse text-right text-xs">
            <thead className="sticky top-0 bg-zinc-50/95 dark:bg-zinc-900/95 backdrop-blur-xs text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800 z-5">
              <tr>
                <th className="px-6 py-3.5">اسم الموظف</th>
                <th className="px-6 py-3.5 w-40">المبلغ المطلوب</th>
                <th className="px-6 py-3.5 w-44">تاريخ الاستلام</th>
                <th className="px-6 py-3.5 w-44">حالة الطلب</th>
                <th className="px-6 py-3.5">ملاحظات إضافية</th>
                <th className="px-6 py-3.5 text-left w-44">العمليات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filteredAdvances.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16">
                    <div className="flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto">
                      <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 dark:text-zinc-500">
                        <DollarSign className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white">لا توجد سلف مالية</h3>
                        <p className="text-xs text-zinc-500 mt-1">لا توجد طلبات سلف مسجلة مطابقة للفلاتر النشطة حالياً.</p>
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
                          طلب سلفة جديدة
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAdvances.map((adv) => (
                  <tr 
                    key={adv.id} 
                    className="hover:bg-zinc-55/30 dark:hover:bg-zinc-900/30 transition-colors duration-150"
                  >
                    <td className="px-6 py-3.5 font-semibold text-zinc-900 dark:text-white">
                      {adv.employee_name}
                    </td>
                    <td className="px-6 py-3.5 text-zinc-900 dark:text-white font-bold font-mono">
                      {Number(adv.amount).toLocaleString()} ج.م
                    </td>
                    <td className="px-6 py-3.5 font-mono text-zinc-400">
                      {adv.date}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium border ${statusBadges[adv.status]}`}>
                        {statusTranslations[adv.status]}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-zinc-500 max-w-xs truncate">
                      {adv.notes || "-"}
                    </td>
                    <td className="px-6 py-3.5 text-left">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Process buttons for Pending status */}
                        {adv.status === "Pending" && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleUpdateStatus(adv.id, "Approved")}
                              disabled={isPending}
                              className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 rounded-md transition-colors"
                              title="قبول واعتماد السلفة"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(adv.id, "Rejected")}
                              disabled={isPending}
                              className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors"
                              title="رفض السلفة"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(adv.id)}
                              disabled={isPending}
                              className="p-1 text-zinc-400 hover:text-red-650 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-md transition-colors"
                              title="حذف الطلب نهائياً"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        )}

                        {/* Deduct trigger for approved advances */}
                        {adv.status === "Approved" && (
                          <button
                            onClick={() => handleUpdateStatus(adv.id, "Deducted")}
                            disabled={isPending}
                            className="text-[10px] font-bold px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-md border border-zinc-250 dark:border-zinc-700 transition-colors"
                          >
                            تحديد كـ "تم الخصم"
                          </button>
                        )}

                        {/* Lock message for Deducted or Rejected */}
                        {(adv.status === "Deducted" || adv.status === "Rejected") && (
                          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 select-none px-2">
                            حالة منتهية
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
