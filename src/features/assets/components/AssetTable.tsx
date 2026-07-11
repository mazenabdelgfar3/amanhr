"use client";

import { useState, useMemo, useTransition } from "react";
import { Asset } from "../types";
import { returnAsset } from "../actions/return-asset";
import { Search, Plus, Wrench, CheckCircle, Clock, AlertCircle, ArrowLeftRight, CornerDownLeft } from "lucide-react";
import AssetForm from "./AssetForm";
import AllocateAssetDialog from "./AllocateAssetDialog";

interface EmployeeLookup {
  id: string;
  name: string;
}

interface AssetTableProps {
  initialAssets: Asset[];
  employees: EmployeeLookup[];
}

export default function AssetTable({ initialAssets, employees }: AssetTableProps) {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showAddForm, setShowAddForm] = useState(false);
  const [allocationTarget, setAllocationTarget] = useState<Asset | null>(null);
  const [isPending, startTransition] = useTransition();

  const statusBadges: Record<string, string> = {
    Available: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50",
    Assigned: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50",
    Damaged: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50",
    Maintenance: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
  };

  const statusTranslations: Record<string, string> = {
    Available: "متاحة",
    Assigned: "مُسلمة لموظف",
    Damaged: "تالفة",
    Maintenance: "تحت الصيانة",
  };

  const handleReturnAsset = (allocationId: string, assetId: string) => {
    if (!confirm("هل أنت متأكد من استرجاع هذه العهدة وإعادتها للمخزن؟")) return;
    startTransition(async () => {
      const res = await returnAsset(allocationId, assetId);
      if (res.success) {
        window.location.reload();
      }
    });
  };

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch = 
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.current_employee_name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "All" || asset.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [assets, searchTerm, statusFilter]);

  return (
    <div className="space-y-6 rtl text-right">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white">كشف العهد والمعدات</h1>
          <p className="text-sm text-zinc-500">متابعة الأدوات والعهد الخاصة بالشركة، وتوزيعها واسترجاعها من العمال.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 shrink-0"
        >
          <Plus className="h-4 w-4" />
          إضافة عهدة
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
            placeholder="بحث باسم العهدة، رقم تسلسلي، أو المستلم الحالي..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 py-1.5 pl-3 pr-10 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white text-right"
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
            <option value="Available">متاحة</option>
            <option value="Assigned">مُسلمة لموظف</option>
            <option value="Damaged">تالفة</option>
            <option value="Maintenance">تحت الصيانة</option>
          </select>
        </div>

      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-right text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 font-medium">
              <tr>
                <th className="px-6 py-3">اسم العهدة / الأداة</th>
                <th className="px-6 py-3 w-40">رقم تسلسلي (S/N)</th>
                <th className="px-6 py-3 w-32">الحالة الحالية</th>
                <th className="px-6 py-3">المستلم الحالي</th>
                <th className="px-6 py-3 w-40">تاريخ التسليم</th>
                <th className="px-6 py-3 text-left w-40">التحكم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-400">
                    لا توجد عهد أو أدوات مسجلة مطابقة للبحث.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr 
                    key={asset.id} 
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-zinc-950 dark:text-white">
                      {asset.name}
                    </td>
                    <td className="px-6 py-4 font-mono text-zinc-500">
                      {asset.serial_number || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border ${statusBadges[asset.status]}`}>
                        {statusTranslations[asset.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-900 dark:text-white font-medium">
                      {asset.current_employee_name || (
                        <span className="text-xs text-zinc-400 select-none">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-zinc-500">
                      {asset.allocated_at ? new Date(asset.allocated_at).toLocaleDateString("ar-EG") : "-"}
                    </td>
                    <td className="px-6 py-4 text-left">
                      <div className="flex items-center justify-end gap-2">
                        
                        {/* Allocate Action */}
                        {asset.status === "Available" && (
                          <button
                            onClick={() => setAllocationTarget(asset)}
                            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 rounded hover:opacity-90"
                          >
                            <ArrowLeftRight className="h-3 w-3" />
                            تسليم لموظف
                          </button>
                        )}

                        {/* Return Action */}
                        {asset.status === "Assigned" && asset.allocation_id && (
                          <button
                            onClick={() => handleReturnAsset(asset.allocation_id!, asset.id)}
                            disabled={isPending}
                            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded hover:bg-zinc-200 border border-zinc-200 dark:border-zinc-700"
                          >
                            <CornerDownLeft className="h-3 w-3" />
                            استرجاع للمخزن
                          </button>
                        )}

                        {/* Lock message for Maintenance or Damaged */}
                        {(asset.status === "Damaged" || asset.status === "Maintenance") && (
                          <span className="text-xs text-zinc-400 select-none">
                            غير متاحة
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
        <AssetForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => window.location.reload()}
        />
      )}

      {/* Allocate Dialog */}
      {allocationTarget && (
        <AllocateAssetDialog
          asset={allocationTarget}
          employees={employees}
          onClose={() => setAllocationTarget(null)}
          onSuccess={() => window.location.reload()}
        />
      )}

    </div>
  );
}
