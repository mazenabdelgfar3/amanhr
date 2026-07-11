import { Hourglass, LogIn } from "lucide-react";
import Link from "next/link";

export default function SessionExpiredPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 text-center font-sans rtl">
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex flex-col items-center">
          <div className="rounded-lg bg-zinc-100 dark:bg-zinc-850 p-3 text-zinc-600 dark:text-zinc-400">
            <Hourglass className="h-10 w-10" />
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
            انتهت صلاحية الجلسة
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            لقد تم تسجيل خروجك بسبب عدم النشاط أو انتهاء صلاحية الجلسة الأمنية. يرجى تسجيل الدخول مرة أخرى.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/login"
            className="flex w-full justify-center items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            <LogIn className="h-4 w-4" />
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
