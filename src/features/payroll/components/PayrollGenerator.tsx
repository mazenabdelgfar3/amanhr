"use client";

import { useState, useTransition } from "react";
import { generatePayroll } from "../actions/generate-payroll";
import { Calculator, Loader2, AlertCircle } from "lucide-react";

interface PayrollGeneratorProps {
  onSuccess: () => void;
}

export default function PayrollGenerator({ onSuccess }: PayrollGeneratorProps) {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const months = [
    { value: 1, label: "يناير (1)" },
    { value: 2, label: "فبراير (2)" },
    { value: 3, label: "مارس (3)" },
    { value: 4, label: "أبريل (4)" },
    { value: 5, label: "مايو (5)" },
    { value: 6, label: "يونيو (6)" },
    { value: 7, label: "يوليو (7)" },
    { value: 8, label: "أغسطس (8)" },
    { value: 9, label: "سبتمبر (9)" },
    { value: 10, label: "أكتوبر (10)" },
    { value: 11, label: "نوفمبر (11)" },
    { value: 12, label: "ديسمبر (12)" },
  ];

  const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - 2 + i);

  const handleGenerate = () => {
    setError(null);
    startTransition(async () => {
      let overtimeMultiplier = 1.5;
      let workingDays = 26;
      let workingHours = 8;
      let productionUnitRate = 5;

      if (typeof window !== "undefined") {
        const storedMultiplier = localStorage.getItem("aman_overtime_multiplier");
        const storedDays = localStorage.getItem("aman_working_days");
        const storedHours = localStorage.getItem("aman_working_hours");
        const storedRate = localStorage.getItem("aman_production_unit_rate");

        if (storedMultiplier) overtimeMultiplier = Number(storedMultiplier);
        if (storedDays) workingDays = Number(storedDays);
        if (storedHours) workingHours = Number(storedHours);
        if (storedRate) productionUnitRate = Number(storedRate);
      }

      const response = await generatePayroll({ 
        month, 
        year,
        overtimeMultiplier,
        workingDays,
        workingHours,
        productionUnitRate
      });
      if (response.success) {
        onSuccess();
      } else {
        setError(response.error?.message || "حدث خطأ أثناء احتساب الرواتب.");
      }
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-950 p-5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 space-y-4 rtl text-right shadow-xs font-sans">
      <div className="flex items-center gap-2.5">
        <div className="rounded-lg bg-zinc-100 dark:bg-zinc-900 p-2 text-zinc-900 dark:text-white border border-zinc-200/40 dark:border-zinc-800/40">
          <Calculator className="h-4.5 w-4.5" />
        </div>
        <div>
          <h2 className="text-xs font-bold text-zinc-900 dark:text-white">احتساب مسيرات الرواتب الجديدة تلقائياً</h2>
          <p className="text-[11px] text-zinc-400">يسحب ويحسب النظام نسب حضور عمال المقاولات ووحدات إنتاجهم وخصم سلفياتهم للشهر الحالي.</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/20 p-3 text-[11px] font-semibold text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-900/40">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:flex-1 grid grid-cols-2 gap-3">
          {/* Month */}
          <select
            value={month}
            disabled={isPending}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-3 py-1.5 text-xs focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white text-right font-medium"
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          {/* Year */}
          <select
            value={year}
            disabled={isPending}
            onChange={(e) => setYear(Number(e.target.value))}
            className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-3 py-1.5 text-xs focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white text-right font-mono"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isPending}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 px-5 py-2 text-xs font-bold text-white dark:text-zinc-950 disabled:opacity-50 transition-colors shadow-xs shrink-0"
        >
          {isPending ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              جاري الاحتساب...
            </>
          ) : (
            "بدء الاحتساب التلقائي"
          )}
        </button>
      </div>
    </div>
  );
}
