"use client";

import { Bell, Search, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();

  // Initialize theme from document class
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDarkMode(document.documentElement.classList.contains("dark"));
    }
  }, []);

  // Map pathnames to Arabic friendly breadcrumbs
  const getBreadcrumb = () => {
    if (pathname.endsWith("/dashboard")) return "لوحة التحكم";
    if (pathname.includes("/employees")) return "إدارة الموظفين";
    if (pathname.includes("/daily-work")) return "اليومية والحضور";
    if (pathname.includes("/payroll")) return "كشوف الرواتب";
    if (pathname.includes("/advances")) return "السلف المالية";
    if (pathname.includes("/assets")) return "العهد والمعدات";
    if (pathname.includes("/reports")) return "التقارير الشاملة";
    if (pathname.includes("/settings")) return "الإعدادات العامة";
    return "لوحة التحكم";
  };

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md px-6 rtl text-right">
      {/* Page Path Indicator */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 font-sans">الرئيسية</span>
        <span className="text-zinc-300 dark:text-zinc-700 text-xs">/</span>
        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 font-sans">{getBreadcrumb()}</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Search Input Box */}
        <div className="relative hidden sm:block">
          <span className="absolute inset-y-0 right-3 flex items-center text-zinc-400 dark:text-zinc-500">
            <Search className="h-3.5 w-3.5" />
          </span>
          <input
            type="search"
            placeholder="بحث سريع... (⌘K)"
            className="w-56 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 py-1.5 pl-3 pr-9 text-xs focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white focus:outline-none transition-all text-right"
          />
        </div>

        {/* Theme Toggle Button */}
        <button 
          onClick={() => {
            const nextMode = !darkMode;
            setDarkMode(nextMode);
            if (nextMode) {
              document.documentElement.classList.add("dark");
              localStorage.setItem("theme", "dark");
            } else {
              document.documentElement.classList.remove("dark");
              localStorage.setItem("theme", "light");
            }
          }}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          title={darkMode ? "الوضع المضيء" : "الوضع المظلم"}
        >
          {darkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        {/* Notifications Icon Button */}
        <button 
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 relative transition-colors"
          title="التنبيهات"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-zinc-850 dark:bg-white"></span>
        </button>
      </div>
    </header>
  );
}
