"use client";

import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  disabled?: boolean;
}

export default function DateSelector({ selectedDate, onDateChange, disabled }: DateSelectorProps) {
  const adjustDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    
    // Do not allow navigating to the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (d > today) return;

    onDateChange(d.toISOString().split("T")[0]);
  };

  const isTodaySelected = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    return selectedDate === todayStr;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 rtl text-right font-sans shadow-xs">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-zinc-100 dark:bg-zinc-900 p-2.5 text-zinc-700 dark:text-zinc-300 border border-zinc-200/40 dark:border-zinc-800/40">
          <Calendar className="h-5.5 w-5.5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-zinc-950 dark:text-white leading-relaxed">تسجيل كشف العمل اليومي</h2>
          <p className="text-xs text-zinc-500 font-sans mt-0.5">اختر تاريخ اليومية لإثبات تفاصيل حضور وإنتاج عمال وموظفي الشركة.</p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 font-mono">
        <button
          onClick={() => adjustDate(-1)}
          disabled={disabled}
          className="rounded-lg border border-zinc-200 dark:border-zinc-850 p-2.5 bg-white hover:bg-zinc-55 dark:bg-zinc-950 dark:hover:bg-zinc-900 disabled:opacity-50 transition-colors shadow-xs"
          title="اليوم السابق"
        >
          <ChevronRight className="h-4.5 w-4.5" />
        </button>

        <input
          type="date"
          value={selectedDate}
          max={new Date().toISOString().split("T")[0]}
          disabled={disabled}
          onChange={(e) => onDateChange(e.target.value)}
          className="rounded-lg border border-zinc-200 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/50 px-4 py-2 text-sm font-semibold focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white focus:outline-none transition-all text-center h-10"
        />

        <button
          onClick={() => adjustDate(1)}
          disabled={disabled || isTodaySelected()}
          className="rounded-lg border border-zinc-200 dark:border-zinc-850 p-2.5 bg-white hover:bg-zinc-55 dark:bg-zinc-950 dark:hover:bg-zinc-900 disabled:opacity-50 transition-colors shadow-xs"
          title="اليوم التالي"
        >
          <ChevronLeft className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
}
