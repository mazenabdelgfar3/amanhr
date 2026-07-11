"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  CalendarRange, 
  Wallet, 
  Package, 
  FileBarChart, 
  Settings,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "لوحة التحكم", href: "/dashboard", icon: LayoutDashboard },
  { name: "الموظفون", href: "/dashboard/employees", icon: Users },
  { name: "اليومية والعمل", href: "/dashboard/daily-work", icon: CalendarRange },
  { name: "الرواتب", href: "/dashboard/payroll", icon: Wallet },
  { name: "العهد والمعدات", href: "/dashboard/assets", icon: Package },
  { name: "التقارير", href: "/dashboard/reports", icon: FileBarChart },
  { name: "الإعدادات", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [companyName, setCompanyName] = useState("Aman HR");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("aman_company_name");
      if (storedName) {
        setCompanyName(storedName);
      }
    }
  }, []);

  return (
    <aside className="fixed inset-y-0 right-0 z-20 hidden w-64 flex-col border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-4 lg:flex rtl">
      <div className="flex h-14 items-center px-2 gap-2 border-b border-zinc-200 dark:border-zinc-800">
        <ShieldCheck className="h-6 w-6 text-zinc-900 dark:text-white" />
        <span className="text-lg font-bold text-zinc-900 dark:text-white">{companyName}</span>
      </div>
      <nav className="flex-1 space-y-1 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
        <div className="flex items-center gap-3 px-2">
          <div className="h-9 w-9 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-300">
            م
          </div>
          <div className="flex flex-col text-right">
            <span className="text-sm font-medium text-zinc-900 dark:text-white">المدير العام</span>
            <span className="text-xs text-zinc-500">owner@aman.com</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
