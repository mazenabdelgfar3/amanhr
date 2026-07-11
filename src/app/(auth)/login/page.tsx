"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/features/auth/schema/auth-schema";
import { login } from "@/features/auth/actions/login";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginInput) => {
    setServerError(null);
    startTransition(async () => {
      const response = await login(data);
      if (response.success && response.data?.redirectUrl) {
        router.push(response.data.redirectUrl);
        router.refresh();
      } else {
        setServerError(response.error?.message || "فشل تسجيل الدخول");
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
            نظام أمان لإدارة القوى العاملة
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-500">
            سجل الدخول للمتابعة وإدارة أعمالك اليومية
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {serverError && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 text-right">
              {serverError}
            </div>
          )}

          <div className="space-y-4">
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

            <div className="flex flex-col text-right relative">
              <label htmlFor="password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  autoComplete="current-password"
                  className="block w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 pl-10 pr-3 py-2 text-sm placeholder-zinc-400 focus:border-zinc-900 focus:outline-none dark:focus:border-white text-right"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-3 flex items-center text-zinc-400 hover:text-zinc-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <span className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.password.message}</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link
              href="/forgot-password"
              className="font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full justify-center items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري الدخول...
              </>
            ) : (
              "تسجيل الدخول"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
