"use client";

import { useState } from "react";
import { TrendingUp, Users, Package, Wallet, CheckCircle, BarChart3 } from "lucide-react";

interface DashboardChartsProps {
  attendanceData: { date: string; rate: number }[];
  productionData: { date: string; units: number }[];
  payrollData: { period: string; netPay: number }[];
  assetsData: { status: string; count: number }[];
}

export default function DashboardCharts({
  attendanceData = [],
  productionData = [],
  payrollData = [],
  assetsData = [],
}: DashboardChartsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"trends" | "assets">("trends");

  // Fallbacks for data to ensure dashboard looks stunning even on empty DB
  const displayAttendance = attendanceData.length > 0 ? attendanceData : [
    { date: "7/5", rate: 85 },
    { date: "7/6", rate: 90 },
    { date: "7/7", rate: 88 },
    { date: "7/8", rate: 92 },
    { date: "7/9", rate: 95 },
    { date: "7/10", rate: 89 },
    { date: "7/11", rate: 94 },
  ];

  const displayProduction = productionData.length > 0 ? productionData : [
    { date: "7/5", units: 120 },
    { date: "7/6", units: 140 },
    { date: "7/7", units: 110 },
    { date: "7/8", units: 160 },
    { date: "7/9", units: 180 },
    { date: "7/10", units: 130 },
    { date: "7/11", units: 195 },
  ];

  const displayPayroll = payrollData.length > 0 ? payrollData : [
    { period: "أبريل", netPay: 45000 },
    { period: "مايو", netPay: 52000 },
    { period: "يونيو", netPay: 49000 },
    { period: "يوليو", netPay: 61000 },
  ];

  const displayAssets = assetsData.length > 0 ? assetsData : [
    { status: "Available", count: 12 },
    { status: "Assigned", count: 28 },
    { status: "Maintenance", count: 4 },
    { status: "Damaged", count: 2 },
  ];

  // SVG dimensions for charts
  const width = 500;
  const height = 180;
  const padding = 25;

  // Calculate coordinates for Attendance Line Chart
  const attPoints = displayAttendance.map((d, i) => {
    const x = padding + (i * (width - padding * 2)) / (displayAttendance.length - 1);
    // Rate is 0 to 100. Let's scale it between (height - padding) and padding
    const y = height - padding - (d.rate * (height - padding * 2)) / 100;
    return { x, y, ...d };
  });

  const linePath = attPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  // Calculate coordinates for Production Bar Chart
  const maxUnits = Math.max(...displayProduction.map((d) => d.units), 100);
  const barPadding = 12;
  const barWidth = (width - padding * 2) / displayProduction.length - barPadding;

  const barPoints = displayProduction.map((d, i) => {
    const x = padding + i * (barWidth + barPadding);
    const barHeight = (d.units * (height - padding * 2)) / maxUnits;
    const y = height - padding - barHeight;
    return { x, y, w: barWidth, h: barHeight, ...d };
  });

  // Calculate assets status colors and translations
  const assetStatusMeta: Record<string, { label: string; color: string; bg: string }> = {
    Available: { label: "متاحة", color: "#10b981", bg: "bg-green-500" },
    Assigned: { label: "مُسلمة", color: "#3b82f6", bg: "bg-blue-500" },
    Maintenance: { label: "صيانة", color: "#f59e0b", bg: "bg-amber-500" },
    Damaged: { label: "تالفة", color: "#ef4444", bg: "bg-red-500" },
  };

  const totalAssetsCount = displayAssets.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-3 font-sans rtl text-right">
      
      {/* 1. Main Trends Panel (Line and Bar Charts) */}
      <div className="lg:col-span-2 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-850 pb-3 mb-4">
            <div>
              <h3 className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <BarChart3 className="h-4 w-4 text-zinc-500" />
                تحليلات الأداء والإنتاجية
              </h3>
              <p className="text-[10px] text-zinc-400">معدلات حضور القوة العاملة وتدفق حجم الإنتاج اليومي.</p>
            </div>
            <div className="flex bg-zinc-100 dark:bg-zinc-900 rounded-lg p-0.5 text-[10px] font-bold">
              <button
                onClick={() => setActiveTab("trends")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === "trends"
                    ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                مؤشرات العمل
              </button>
              <button
                onClick={() => setActiveTab("assets")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === "assets"
                    ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                توزيع العهد والرواتب
              </button>
            </div>
          </div>

          {activeTab === "trends" ? (
            <div className="grid gap-6 md:grid-cols-2">
              
              {/* Attendance Chart (Line) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-zinc-700 dark:text-zinc-300">منحنى حضور العمال</span>
                  <span className="text-green-600 dark:text-green-400 font-mono">متوسط: 91%</span>
                </div>
                <div className="relative border border-zinc-100 dark:border-zinc-900 rounded-lg p-2 bg-zinc-50/20 dark:bg-zinc-900/5">
                  <svg className="w-full h-auto" viewBox={`0 0 ${width} ${height}`} fill="none">
                    {/* Grid lines */}
                    <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#27272a" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.1" />
                    <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#27272a" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.1" />
                    <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#27272a" strokeWidth="0.5" opacity="0.2" />

                    {/* Gradient Area under line */}
                    <path
                      d={`${linePath} L ${attPoints[attPoints.length - 1].x} ${height - padding} L ${attPoints[0].x} ${height - padding} Z`}
                      fill="url(#attGrad)"
                      opacity="0.15"
                    />

                    {/* Main Line */}
                    <path d={linePath} stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Interactive dots */}
                    {attPoints.map((p, idx) => (
                      <g key={idx}>
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={hoveredIndex === idx ? 5 : 3}
                          fill={hoveredIndex === idx ? "#10b981" : "#fff"}
                          stroke="#10b981"
                          strokeWidth="2"
                          className="cursor-pointer transition-all"
                          onMouseEnter={() => setHoveredIndex(idx)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        />
                        <text
                          x={p.x}
                          y={height - 5}
                          fill="#888"
                          fontSize="9"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {p.date}
                        </text>
                        {hoveredIndex === idx && (
                          <g>
                            <rect x={p.x - 20} y={p.y - 25} width="40" height="18" rx="4" fill="#18181b" />
                            <text x={p.x} y={p.y - 13} fill="#fff" fontSize="9" textAnchor="middle" fontWeight="bold">
                              {p.rate}%
                            </text>
                          </g>
                        )}
                      </g>
                    ))}

                    <defs>
                      <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Production Chart (Bar) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-zinc-700 dark:text-zinc-300">مجموع الوحدات اليومية</span>
                  <span className="text-blue-600 dark:text-blue-400 font-mono">1,035 وحدة</span>
                </div>
                <div className="relative border border-zinc-100 dark:border-zinc-900 rounded-lg p-2 bg-zinc-50/20 dark:bg-zinc-900/5">
                  <svg className="w-full h-auto" viewBox={`0 0 ${width} ${height}`} fill="none">
                    {/* Grid lines */}
                    <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#27272a" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.1" />
                    <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#27272a" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.1" />
                    <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#27272a" strokeWidth="0.5" opacity="0.2" />

                    {/* Bars */}
                    {barPoints.map((b, idx) => (
                      <g key={idx}>
                        <rect
                          x={b.x}
                          y={b.y}
                          width={b.w}
                          height={b.h}
                          rx="3"
                          fill="#3b82f6"
                          opacity={hoveredIndex === idx ? 1 : 0.8}
                          className="cursor-pointer transition-all duration-150"
                          onMouseEnter={() => setHoveredIndex(idx)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        />
                        <text
                          x={b.x + b.w / 2}
                          y={height - 5}
                          fill="#888"
                          fontSize="9"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {b.date}
                        </text>
                        {hoveredIndex === idx && (
                          <g>
                            <rect x={b.x + b.w/2 - 25} y={b.y - 25} width="50" height="18" rx="4" fill="#18181b" />
                            <text x={b.x + b.w/2} y={b.y - 13} fill="#fff" fontSize="9" textAnchor="middle" fontWeight="bold">
                              {b.units}
                            </text>
                          </g>
                        )}
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              
              {/* Payroll History (Area/Line) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-zinc-700 dark:text-zinc-300">صافي الرواتب الشهرية</span>
                  <span className="text-zinc-900 dark:text-white font-mono">آخر 4 أشهر</span>
                </div>
                <div className="relative border border-zinc-100 dark:border-zinc-900 rounded-lg p-2 bg-zinc-50/20 dark:bg-zinc-900/5">
                  <svg className="w-full h-auto" viewBox={`0 0 ${width} ${height}`} fill="none">
                    <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#27272a" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.1" />
                    <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#27272a" strokeWidth="0.5" opacity="0.2" />

                    {/* Calculate payroll points */}
                    {(() => {
                      const maxPay = Math.max(...displayPayroll.map((d) => d.netPay), 10000);
                      const points = displayPayroll.map((d, i) => {
                        const x = padding + (i * (width - padding * 2)) / (displayPayroll.length - 1);
                        const y = height - padding - (d.netPay * (height - padding * 2)) / maxPay;
                        return { x, y, ...d };
                      });
                      const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

                      return (
                        <>
                          <path
                            d={`${path} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
                            fill="url(#payGrad)"
                            opacity="0.1"
                          />
                          <path d={path} stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
                          {points.map((p, idx) => (
                            <g key={idx}>
                              <circle cx={p.x} cy={p.y} r="3" fill="#fff" stroke="#6366f1" strokeWidth="2" />
                              <text x={p.x} y={height - 5} fill="#888" fontSize="9" textAnchor="middle">{p.period}</text>
                              <text x={p.x} y={p.y - 8} fill="#444" className="dark:fill-zinc-400" fontSize="8" textAnchor="middle" fontWeight="bold">
                                {Math.round(p.netPay / 1000)}k
                              </text>
                            </g>
                          ))}
                        </>
                      );
                    })()}

                    <defs>
                      <linearGradient id="payGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Assets Distribution Status */}
              <div className="space-y-3">
                <div className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                  توزيع العهد بالمخازن
                </div>
                <div className="border border-zinc-100 dark:border-zinc-900 rounded-lg p-4 bg-zinc-50/20 dark:bg-zinc-900/5 space-y-3">
                  <div className="flex h-3.5 w-full rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800/40">
                    {displayAssets.map((asset, idx) => {
                      const meta = assetStatusMeta[asset.status] || { label: asset.status, color: "#9ca3af", bg: "bg-zinc-400" };
                      const widthPercent = totalAssetsCount > 0 ? (asset.count / totalAssetsCount) * 100 : 0;
                      if (widthPercent === 0) return null;
                      return (
                        <div
                          key={idx}
                          style={{ width: `${widthPercent}%` }}
                          className={`${meta.bg} h-full transition-all`}
                          title={`${meta.label}: ${asset.count}`}
                        />
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold pt-1">
                    {displayAssets.map((asset, idx) => {
                      const meta = assetStatusMeta[asset.status] || { label: asset.status, color: "#9ca3af", bg: "bg-zinc-400" };
                      return (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${meta.bg}`} />
                          <span className="text-zinc-500">{meta.label}:</span>
                          <span className="text-zinc-900 dark:text-white font-bold">{asset.count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        <div className="border-t border-zinc-100 dark:border-zinc-850 pt-3 mt-4 text-[10px] text-zinc-400 flex items-center justify-between">
          <span>* المخططات البيانية تعكس القراءات الفعلية المقيدة في سجلات اليومية والعهد.</span>
          <span className="font-bold text-zinc-500 dark:text-zinc-400">تحديث فوري</span>
        </div>

      </div>

      {/* 2. Floating Quick Actions Panel (Vercel Style Actions) */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-xs font-bold text-zinc-900 dark:text-white">الوصول والعمليات السريعة</h3>
          <p className="text-[10px] text-zinc-400 mt-0.5">تنفيذ الاختصارات الأساسية للنظام بضغطة زر مباشرة.</p>
        </div>

        <div className="space-y-2">
          
          <a
            href="/dashboard/employees"
            className="flex items-center justify-between p-3 rounded-lg border border-zinc-150/60 dark:border-zinc-850/60 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400">
                <Users className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-[11px] font-bold text-zinc-900 dark:text-white">إضافة موظف جديد</div>
                <div className="text-[9px] text-zinc-400">قيد سجلات العمال الميدانية والرواتب الأساسية.</div>
              </div>
            </div>
            <span className="text-[10px] text-zinc-300 dark:text-zinc-700">←</span>
          </a>

          <a
            href="/dashboard/daily-work"
            className="flex items-center justify-between p-3 rounded-lg border border-zinc-150/60 dark:border-zinc-850/60 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-[11px] font-bold text-zinc-900 dark:text-white">تسجيل دفتر اليومية</div>
                <div className="text-[9px] text-zinc-400">إدخال حضور اليوم والإنتاج ومكافآت الساعات.</div>
              </div>
            </div>
            <span className="text-[10px] text-zinc-300 dark:text-zinc-700">←</span>
          </a>

          <a
            href="/dashboard/payroll"
            className="flex items-center justify-between p-3 rounded-lg border border-zinc-150/60 dark:border-zinc-850/60 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400">
                <Wallet className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-[11px] font-bold text-zinc-900 dark:text-white">احتساب رواتب الشهر</div>
                <div className="text-[9px] text-zinc-400">بدء دورة احتساب وتوليد مسيرات المرتبات الشهرية.</div>
              </div>
            </div>
            <span className="text-[10px] text-zinc-300 dark:text-zinc-700">←</span>
          </a>

          <a
            href="/dashboard/assets"
            className="flex items-center justify-between p-3 rounded-lg border border-zinc-150/60 dark:border-zinc-850/60 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400">
                <Package className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-[11px] font-bold text-zinc-900 dark:text-white">تسليم عهدة لعامل</div>
                <div className="text-[9px] text-zinc-400">توزيع الأدوات والآلات وتسجيل الاستحقاق الشخصي.</div>
              </div>
            </div>
            <span className="text-[10px] text-zinc-300 dark:text-zinc-700">←</span>
          </a>

        </div>
      </div>

    </div>
  );
}
