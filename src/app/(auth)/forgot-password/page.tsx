"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/features/auth/schema/auth-schema";
import { requestPasswordReset } from "@/features/auth/actions/reset-password";
import { useState, useTransition } from "react";
import { ShieldCheck, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordInput) => {
    setServerError(null);
    setSuccessMsg(null);
    startTransition(async () => {
      const response = await requestPasswordReset(data);
      if (response.success) {
        setSuccessMsg("تم إرسال رابط استعادة كلمة المرور بنجاح. تفقد بريدك الإلكتروني.");
      } else {
        setServerError(response.error?.message || "فشل إرسال الطلب.");
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8 font-sans rtl">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex flex-col items-center">
          <div className="rounded-lg bg-zinc-900 dark:bg-zinc-100 p-3 text-white dark:text-zinc-950">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            استعادة كلمة المرور
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-500">
            أدخل بريدك الإلكتروني لإرسال رابط تغيير كلمة المرور
          </p>
        </div>

        {successMsg ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-green-50 dark:bg-green-950/30 p-4 text-sm text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900/50 text-right">
              {successMsg}
            </div>
            <Link
              href="/login"
              className="flex w-full justify-center items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              العودة لتسجيل الدخول
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {serverError && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 text-right">
                {serverError}
              </div>
            )}

            <div className="flex flex-col text-right">
              <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                autoComplete="email"
                className="block w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm placeholder-zinc-400 focus:border-zinc-900 focus:outline-none dark:focus:border-white text-right"
                placeholder="owner@aman.com"
              />
              {errors.email && (
                <span className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.email.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={isPending}
                className="flex w-full justify-center items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    جاري الإرسال...
                  </>
                ) : (
                  "إرسال رابط الاستعادة"
                )}
              </button>

              <Link
                href="/login"
                className="flex items-center justify-center gap-1 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-white mt-2"
              >
                <span>العودة لتسجيل الدخول</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
