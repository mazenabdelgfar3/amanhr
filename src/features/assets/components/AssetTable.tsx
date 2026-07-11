"use client";

import { useState, useMemo, useTransition } from "react";
import { Asset } from "../types";
import { returnAsset } from "../actions/return-asset";
import { Search, Plus, Package, ArrowLeftRight, CornerDownLeft, RefreshCw } from "lucide-react";
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
    Available: "bg-green-50 text-green-700 border-green-200/60 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/40",
    Assigned: "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/40",
    Damaged: "bg-red-50 text-red-700 border-red-200/60 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/40",
    Maintenance: "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40",
  };

  const statusTranslations: Record<string, string> = {
    Available: "متاحة في المخزن",
    Assigned: "مُسلمة لعامل",
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
    <div className="space-y-6 rtl text-right font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">إدارة العهد والأدوات والآلات</h1>
          <p className="text-xs text-zinc-500 mt-1 font-sans">تتبع الأصول والعدد اليدوية والآلات المسلمة للعهدة الشخصية للعمال والموظفين.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 px-4 py-2 text-xs font-semibold text-white dark:text-zinc-950 transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" />
          إضافة أداة / عهدة جديدة
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
            placeholder="بحث باسم العهدة، الرقم التسلسلي، أو اسم المستلم الحالي..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 py-1.5 pl-3 pr-10 text-xs focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white focus:outline-none transition-all text-right"
          />
        </div>

        {/* Status selection filter */}
        <div className="w-full sm:w-52">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-3 py-1.5 text-xs focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white focus:outline-none transition-all text-right font-medium"
          >
            <option value="All">جميع العهد والمعدات</option>
            <option value="Available">حالة: متاحة للاستعمال</option>
            <option value="Assigned">حالة: مسلّمة لموظف</option>
            <option value="Damaged">حالة: تالفة أو مفقودة</option>
            <option value="Maintenance">حالة: تحت الصيانة</option>
          </select>
        </div>
      </div>

      {/* Table Card (Minimalist Dense layout) */}
      <div className="overflow-hidden rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 shadow-xs">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full border-collapse text-right text-xs">
            <thead className="sticky top-0 bg-zinc-50/95 dark:bg-zinc-900/95 backdrop-blur-xs text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800 z-5">
              <tr>
                <th className="px-6 py-3.5">اسم العهدة / الأداة والموديل</th>
                <th className="px-6 py-3.5 w-48">الرقم التسلسلي (S/N)</th>
                <th className="px-6 py-3.5 w-36">حالة العهدة الحالية</th>
                <th className="px-6 py-3.5">المستلم الحالي</th>
                <th className="px-6 py-3.5 w-44">تاريخ التسليم</th>
                <th className="px-6 py-3.5 text-left w-44">العمليات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16">
                    <div className="flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto">
                      <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 dark:text-zinc-500">
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white">لا توجد عهد مسجلة</h3>
                        <p className="text-xs text-zinc-500 mt-1">لا توجد عهد أو أدوات مسجلة مطابقة للبحث أو الفلترة الحالية.</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setSearchTerm(""); setStatusFilter("All"); }}
                          className="flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white hover:bg-zinc-55 dark:bg-zinc-950 dark:hover:bg-zinc-900 px-3 py-1.5 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 transition-colors"
                        >
                          <RefreshCw className="h-3 w-3" />
                          إعادة تعيين الفلاتر
                        </button>
                        <button
                          onClick={() => setShowAddForm(true)}
                          className="rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 px-3 py-1.5 text-[11px] font-semibold text-white dark:text-zinc-950 transition-colors"
                        >
                          إضافة أداة جديدة
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr 
                    key={asset.id} 
                    className="hover:bg-zinc-55/30 dark:hover:bg-zinc-900/30 transition-colors duration-150"
                  >
                    <td className="px-6 py-3.5 font-semibold text-zinc-900 dark:text-white">
                      {asset.name}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-zinc-400">
                      {asset.serial_number || "-"}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium border ${statusBadges[asset.status]}`}>
                        {statusTranslations[asset.status]}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-zinc-900 dark:text-white">
                      {asset.current_employee_name || (
                        <span className="text-xs text-zinc-400 select-none">-</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-zinc-500">
                      {asset.allocated_at ? new Date(asset.allocated_at).toLocaleDateString("ar-EG") : "-"}
                    </td>
                    <td className="px-6 py-3.5 text-left">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Allocate Action */}
                        {asset.status === "Available" && (
                          <button
                            onClick={() => setAllocationTarget(asset)}
                            className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 rounded-md transition-colors shadow-xs"
                          >
                            <ArrowLeftRight className="h-3 w-3" />
                            تسليم لعامل
                          </button>
                        )}

                        {/* Return Action */}
                        {asset.status === "Assigned" && asset.allocation_id && (
                          <button
                            onClick={() => handleReturnAsset(asset.allocation_id!, asset.id)}
                            disabled={isPending}
                            className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-850 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-300 rounded-md border border-zinc-250 dark:border-zinc-700 transition-colors"
                          >
                            <CornerDownLeft className="h-3 w-3" />
                            استرجاع للمخزن
                          </button>
                        )}

                        {/* Lock message for Maintenance or Damaged */}
                        {(asset.status === "Damaged" || asset.status === "Maintenance") && (
                          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 select-none px-3 py-1">
                            خارج الخدمة
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
