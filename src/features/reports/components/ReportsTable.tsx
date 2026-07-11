"use client";

interface ReportsTableProps {
  reportType: "attendance" | "production" | "payroll" | "advances";
  data: any[];
}

export default function ReportsTable({ reportType, data }: ReportsTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-950 p-12 text-center rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300 text-sm font-sans">
        لا توجد بيانات مطابقة لخيارات البحث. يرجى تعديل خيارات التصفية والمحاولة مرة أخرى.
      </div>
    );
  }

  // Renders different table layouts dynamically
  return (
    <div className="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs overflow-hidden text-right rtl font-sans">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
          <thead className="bg-zinc-50/70 dark:bg-zinc-900/50">
            {reportType === "attendance" && (
              <tr>
                <th className="px-6 py-4.5 text-right text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">اسم الموظف</th>
                <th className="px-6 py-4.5 text-right text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">رقم الهاتف</th>
                <th className="px-6 py-4.5 text-right text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">التاريخ</th>
                <th className="px-6 py-4.5 text-right text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">الحالة اليومية</th>
              </tr>
            )}

            {reportType === "production" && (
              <tr>
                <th className="px-6 py-4.5 text-right text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">اسم الموظف</th>
                <th className="px-6 py-4.5 text-right text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">التاريخ</th>
                <th className="px-6 py-4.5 text-right text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">قيمة الإنتاج اليومي</th>
                <th className="px-6 py-4.5 text-right text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">الساعات الإضافية</th>
                <th className="px-6 py-4.5 text-right text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">ملاحظات</th>
              </tr>
            )}

            {reportType === "payroll" && (
              <tr>
                <th className="px-6 py-4.5 text-right text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">الموظف</th>
                <th className="px-6 py-4.5 text-right text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">الفترة المالية</th>
                <th className="px-6 py-4.5 text-right text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">الراتب الأساسي</th>
                <th className="px-6 py-4.5 text-right text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">حوافز الإنتاج</th>
                <th className="px-6 py-4.5 text-right text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">أجر العمل الإضافي</th>
                <th className="px-6 py-4.5 text-right text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">خصم السلف</th>
                <th className="px-6 py-4.5 text-right text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">صافي المستحق</th>
                <th className="px-6 py-4.5 text-right text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">الحالة</th>
              </tr>
            )}

            {reportType === "advances" && (
              <tr>
                <th className="px-6 py-4.5 text-right text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">الموظف</th>
                <th className="px-6 py-4.5 text-right text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">رقم الهاتف</th>
                <th className="px-6 py-4.5 text-right text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">تاريخ الطلب</th>
                <th className="px-6 py-4.5 text-right text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">المبلغ المطلوب</th>
                <th className="px-6 py-4.5 text-right text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">الحالة</th>
                <th className="px-6 py-4.5 text-right text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">ملاحظات</th>
              </tr>
            )}
          </thead>

          <tbody className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80 bg-white dark:bg-zinc-950">
            {reportType === "attendance" &&
              data.map((row) => (
                <tr key={row.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-zinc-900 dark:text-white">{row.employees?.name || "موظف مؤرشف"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700 dark:text-zinc-300 font-mono">{row.employees?.phone || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700 dark:text-zinc-300 font-mono">{row.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        row.status === "Present"
                          ? "bg-green-150 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                          : row.status === "Absent"
                          ? "bg-red-150 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                          : "bg-amber-150 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                      }`}
                    >
                      {row.status === "Present" ? "حاضر" : row.status === "Absent" ? "غائب" : row.status === "Vacation" ? "إجازة" : "إذن"}
                    </span>
                  </td>
                </tr>
              ))}

            {reportType === "production" &&
              data.map((row) => (
                <tr key={row.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-zinc-900 dark:text-white">{row.employees?.name || "موظف مؤرشف"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700 dark:text-zinc-300 font-mono">{row.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-zinc-900 dark:text-white font-mono">{Number(row.production).toLocaleString()} ج.م</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700 dark:text-zinc-300 font-mono">{Number(row.overtime_hours)} ساعة</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700 dark:text-zinc-300 max-w-xs truncate">{row.notes || "-"}</td>
                </tr>
              ))}

            {reportType === "payroll" &&
              data.map((row) => (
                <tr key={row.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-zinc-900 dark:text-white">{row.employees?.name || "موظف مؤرشف"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700 dark:text-zinc-300 font-mono">
                    {row.period_start} إلى {row.period_end}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700 dark:text-zinc-300 font-mono">{Number(row.base_salary).toLocaleString()} ج.م</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700 dark:text-zinc-300 font-mono">{Number(row.total_production).toLocaleString()} ج.م</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700 dark:text-zinc-300 font-mono">{Number(row.total_overtime).toLocaleString()} ج.م</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-650 dark:text-red-400 font-mono">{Number(row.total_advances).toLocaleString()} ج.م</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-zinc-900 dark:text-white font-mono">{Number(row.net_salary).toLocaleString()} ج.م</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        row.status === "Approved"
                          ? "bg-green-150 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                          : "bg-amber-150 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                      }`}
                    >
                      {row.status === "Approved" ? "مصروفة" : "مسودة"}
                    </span>
                  </td>
                </tr>
              ))}

            {reportType === "advances" &&
              data.map((row) => (
                <tr key={row.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-zinc-900 dark:text-white">{row.employees?.name || "موظف مؤرشف"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700 dark:text-zinc-300 font-mono">{row.employees?.phone || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700 dark:text-zinc-300 font-mono">{row.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-zinc-900 dark:text-white font-mono">{Number(row.amount).toLocaleString()} ج.م</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        row.status === "Approved"
                          ? "bg-green-150 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                          : row.status === "Deducted"
                          ? "bg-zinc-150 text-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-400"
                          : row.status === "Pending"
                          ? "bg-amber-150 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                          : "bg-red-150 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                      }`}
                    >
                      {row.status === "Approved" ? "معتمدة" : row.status === "Deducted" ? "مسددة ومخصومة" : row.status === "Pending" ? "معلقة" : "مرفوضة"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700 dark:text-zinc-300 max-w-xs truncate">{row.notes || "-"}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
