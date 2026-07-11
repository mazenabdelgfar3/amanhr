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
  ShieldCheck,
  Menu,
  ChevronRight,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/features/auth/actions/logout";

const mainNavigation = [
  { name: "لوحة التحكم", href: "/dashboard", icon: LayoutDashboard },
  { name: "الموظفون", href: "/dashboard/employees", icon: Users },
  { name: "الحضور واليومية", href: "/dashboard/daily-work", icon: CalendarRange },
];

const financialNavigation = [
  { name: "مسيرات الرواتب", href: "/dashboard/payroll", icon: Wallet },
  { name: "السلف المالية", href: "/dashboard/advances", icon: Wallet },
  { name: "العهد والمعدات", href: "/dashboard/assets", icon: Package },
];

const systemNavigation = [
  { name: "التقارير الشاملة", href: "/dashboard/reports", icon: FileBarChart },
  { name: "الإعدادات العامة", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [companyName, setCompanyName] = useState("Aman HR");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("aman_company_name");
      if (storedName) {
        setCompanyName(storedName);
      }
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const renderNavLink = (item: typeof mainNavigation[0]) => {
    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
    return (
      <Link
        key={item.name}
        href={item.href}
        onClick={() => setIsMobileOpen(false)}
        className={cn(
          "group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200",
          isActive
            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm"
            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-white"
        )}
      >
        <div className="flex items-center gap-2.5">
          <item.icon className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105",
            isActive ? "text-white dark:text-zinc-950" : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-650 dark:group-hover:text-zinc-300"
          )} />
          <span>{item.name}</span>
        </div>
        {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-60 ml-0.5" />}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-3 right-4 z-40 lg:hidden p-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-950"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-30 bg-zinc-900/20 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside className={cn(
        "fixed inset-y-0 right-0 z-35 flex w-64 flex-col border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/80 backdrop-blur-md p-4 transition-all duration-300 lg:flex rtl font-sans",
        isMobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      )}>
        {/* Brand Header */}
        <div className="flex h-14 items-center px-2 gap-2.5 border-b border-zinc-200/60 dark:border-zinc-800/60 mb-4">
          <div className="h-8 w-8 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center shadow-xs">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">{companyName}</span>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 space-y-6 overflow-y-auto py-2 pr-1 pl-1">
          {/* Main Group */}
          <div className="space-y-1.5">
            <h4 className="px-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">العامة</h4>
            <div className="space-y-0.5">{mainNavigation.map(renderNavLink)}</div>
          </div>

          {/* Financial Group */}
          <div className="space-y-1.5">
            <h4 className="px-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">المالية والحسابات</h4>
            <div className="space-y-0.5">{financialNavigation.map(renderNavLink)}</div>
          </div>

          {/* Reports & Settings */}
          <div className="space-y-1.5">
            <h4 className="px-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">التحليلات والنظام</h4>
            <div className="space-y-0.5">{systemNavigation.map(renderNavLink)}</div>
          </div>
        </div>

        {/* Footer Account Section */}
        <div className="border-t border-zinc-200/60 dark:border-zinc-800/60 pt-4 mt-auto">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-700 dark:text-zinc-300">
                أ
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xs font-semibold text-zinc-900 dark:text-white">المدير العام</span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500">owner@aman.com</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              title="تسجيل الخروج"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
