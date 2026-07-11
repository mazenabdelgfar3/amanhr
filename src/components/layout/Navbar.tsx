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
    if (pathname.includes("/employees")) return "شؤون الموظفين";
    if (pathname.includes("/daily-work")) return "اليومية والحضور";
    if (pathname.includes("/payroll")) return "مسيرات الرواتب";
    if (pathname.includes("/advances")) return "السلف والمدفوعات";
    if (pathname.includes("/assets")) return "إدارة العهد والمعدات";
    if (pathname.includes("/reports")) return "التقارير الشاملة";
    if (pathname.includes("/settings")) return "الإعدادات العامة";
    return "لوحة التحكم";
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md px-6 rtl text-right font-sans">
      
      {/* Page Path Indicator */}
      <div className="flex items-center gap-2 text-sm leading-relaxed">
        <span className="font-semibold text-zinc-400 dark:text-zinc-500">الرئيسية</span>
        <span className="text-zinc-350 dark:text-zinc-700 text-xs">/</span>
        <span className="font-bold text-zinc-900 dark:text-white">{getBreadcrumb()}</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Search Input Box */}
        <div className="relative hidden sm:flex items-center">
          <span className="absolute inset-y-0 right-3.5 flex items-center text-zinc-400 dark:text-zinc-500">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="search"
            placeholder="بحث سريع..."
            className="w-64 rounded-lg border border-zinc-250 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 py-1.5 pl-10 pr-10 text-sm focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white focus:outline-none transition-all text-right"
          />
          <span className="absolute left-3 px-1.5 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-400 dark:text-zinc-600 bg-white dark:bg-zinc-950 pointer-events-none select-none font-mono">
            ⌘K
          </span>
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
          className="p-2.5 rounded-lg text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          title={darkMode ? "الوضع المضيء" : "الوضع المظلم"}
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications Icon Button */}
        <button 
          className="p-2.5 rounded-lg text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 relative transition-colors"
          title="التنبيهات"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-zinc-950 dark:bg-white"></span>
        </button>
      </div>
    </header>
  );
}
