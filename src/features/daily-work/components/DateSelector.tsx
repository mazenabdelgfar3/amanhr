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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 rtl text-right">
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-zinc-100 dark:bg-zinc-900 p-2 text-zinc-600 dark:text-zinc-400">
          <Calendar className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-zinc-950 dark:text-white">كشف تسجيل العمل اليومي</h2>
          <p className="text-xs text-zinc-500">اختر التاريخ لتسجيل حضور وإنتاجية وساعات الموظفين الإضافية.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 font-mono">
        <button
          onClick={() => adjustDate(-1)}
          disabled={disabled}
          className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 disabled:opacity-50"
          title="اليوم السابق"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <input
          type="date"
          value={selectedDate}
          max={new Date().toISOString().split("T")[0]}
          disabled={disabled}
          onChange={(e) => onDateChange(e.target.value)}
          className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-sm font-semibold focus:outline-none focus:border-zinc-900 dark:focus:border-white text-center"
        />

        <button
          onClick={() => adjustDate(1)}
          disabled={disabled || isTodaySelected()}
          className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 disabled:opacity-50"
          title="اليوم التالي"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
