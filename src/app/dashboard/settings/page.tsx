"use client";

import { useState, useEffect } from "react";
import { Settings, Save, RefreshCw, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState("Aman HR");
  const [overtimeMultiplier, setOvertimeMultiplier] = useState(1.5);
  const [workingDays, setWorkingDays] = useState(26);
  const [workingHours, setWorkingHours] = useState(8);
  const [productionUnitRate, setProductionUnitRate] = useState(5);

  const [message, setMessage] = useState<string | null>(null);

  // Load settings on component mount (client-side)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCompanyName(localStorage.getItem("aman_company_name") || "Aman HR");
      setOvertimeMultiplier(Number(localStorage.getItem("aman_overtime_multiplier") || "1.5"));
      setWorkingDays(Number(localStorage.getItem("aman_working_days") || "26"));
      setWorkingHours(Number(localStorage.getItem("aman_working_hours") || "8"));
      setProductionUnitRate(Number(localStorage.getItem("aman_production_unit_rate") || "5"));
    }
  }, []);

  // Save changes to localStorage
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("aman_company_name", companyName);
      localStorage.setItem("aman_overtime_multiplier", String(overtimeMultiplier));
      localStorage.setItem("aman_working_days", String(workingDays));
      localStorage.setItem("aman_working_hours", String(workingHours));
      localStorage.setItem("aman_production_unit_rate", String(productionUnitRate));

      setMessage("تم حفظ الإعدادات بنجاح!");
      setTimeout(() => setMessage(null), 3000);
      
      // Force reload sidebar branding
      window.location.reload();
    }
  };

  // Reset to default settings
  const handleReset = () => {
    setCompanyName("Aman HR");
    setOvertimeMultiplier(1.5);
    setWorkingDays(26);
    setWorkingHours(8);
    setProductionUnitRate(5);

    if (typeof window !== "undefined") {
      localStorage.setItem("aman_company_name", "Aman HR");
      localStorage.setItem("aman_overtime_multiplier", "1.5");
      localStorage.setItem("aman_working_days", "26");
      localStorage.setItem("aman_working_hours", "8");
      localStorage.setItem("aman_production_unit_rate", "5");
      
      setMessage("تم إعادة الإعدادات الافتراضية للمنظومة.");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6 text-right rtl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white font-sans flex items-center gap-2">
          <Settings className="h-6 w-6 text-zinc-500" />
          الإعدادات العامة للنظام
        </h1>
        <p className="text-sm text-zinc-500 font-sans">تحكم في ثوابت احتساب الرواتب والعمل الإضافي والمعايير الافتراضية للمنشأة.</p>
      </div>

      {message && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 dark:bg-green-950/30 p-4 text-sm text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900/50">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm max-w-3xl space-y-6">
        <h3 className="text-md font-bold text-zinc-800 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-850 pb-2">ثوابت الحسابات والرواتب</h3>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Company Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">اسم المنشأة / النظام</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm focus:border-zinc-950 focus:outline-none dark:focus:border-white text-right"
              required
            />
          </div>

          {/* Overtime Multiplier */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">معامل الساعة الإضافية (Multiplier)</label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="5"
              value={overtimeMultiplier}
              onChange={(e) => setOvertimeMultiplier(Number(e.target.value))}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm focus:border-zinc-950 focus:outline-none dark:focus:border-white text-right font-mono"
              required
            />
            <span className="text-xs text-zinc-400">القيمة الافتراضية هي 1.5 (أي ساعة ونصف عن كل ساعة عمل إضافي).</span>
          </div>

          {/* Working Days per Month */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">عدد أيام العمل الافتراضية شهرياً</label>
            <input
              type="number"
              min="10"
              max="31"
              value={workingDays}
              onChange={(e) => setWorkingDays(Number(e.target.value))}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm focus:border-zinc-950 focus:outline-none dark:focus:border-white text-right font-mono"
              required
            />
            <span className="text-xs text-zinc-400">تستخدم لحساب الأجر اليومي للموظف من الراتب الأساسي (الافتراضي: 26 يوماً).</span>
          </div>

          {/* Standard Working Hours */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">ساعات العمل القياسية يومياً</label>
            <input
              type="number"
              min="4"
              max="16"
              value={workingHours}
              onChange={(e) => setWorkingHours(Number(e.target.value))}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm focus:border-zinc-950 focus:outline-none dark:focus:border-white text-right font-mono"
              required
            />
            <span className="text-xs text-zinc-400">عدد الساعات اليومية لتقسيم أجر اليوم وحساب قيمة أجر الساعة (الافتراضي: 8 ساعات).</span>
          </div>

          {/* Production Unit Rate */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">فئة الحافز المالي لكل وحدة إنتاج</label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={productionUnitRate}
              onChange={(e) => setProductionUnitRate(Number(e.target.value))}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm focus:border-zinc-950 focus:outline-none dark:focus:border-white text-right font-mono"
              required
            />
            <span className="text-xs text-zinc-400">المبلغ المدفوع بالجنيه المصري عن كل وحدة إنتاج يسجلها العامل (الافتراضي: 5 ج.م).</span>
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-zinc-150 dark:border-zinc-800 pt-4">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            استعادة الافتراضي
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 px-6 py-2.5 text-sm font-semibold text-white dark:text-zinc-950 transition-colors"
          >
            <Save className="h-4 w-4" />
            حفظ التغييرات
          </button>
        </div>
      </form>
    </div>
  );
}
