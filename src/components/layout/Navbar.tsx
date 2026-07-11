"use client";

import { Bell, Menu, Search, Sun, Moon } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 lg:px-6 rtl">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <button className="lg:hidden p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900">
          <Menu className="h-6 w-6" />
        </button>

        {/* Search bar */}
        <div className="relative hidden sm:block">
          <span className="absolute inset-y-0 right-3 flex items-center text-zinc-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="search"
            placeholder="بحث في النظام..."
            className="w-64 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 py-1.5 pl-3 pr-10 text-sm focus:border-zinc-900 focus:outline-none dark:focus:border-white text-right"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Dark Mode toggle */}
        <button 
          onClick={() => {
            setDarkMode(!darkMode);
            document.documentElement.classList.toggle("dark");
          }}
          className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 left-1.5 h-2 w-2 rounded-full bg-red-600"></span>
        </button>
      </div>
    </header>
  );
}
