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
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8 font-sans rtl overflow-hidden">
      
      {/* Premium Backdrop Glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-zinc-200/40 dark:bg-zinc-900/20 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-zinc-300/30 dark:bg-zinc-900/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-md relative z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center">
          <div className="rounded-lg bg-zinc-950 dark:bg-white p-3 text-white dark:text-zinc-950 shadow-xs">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-zinc-950 dark:text-white leading-relaxed">
            منظومة Aman HR الذكية
          </h2>
          <p className="mt-2 text-center text-sm font-semibold text-zinc-550 leading-relaxed">
            سجل الدخول للمتابعة وإدارة شؤون الموظفين والرواتب والعهد.
          </p>
        </div>

        {/* Form Body */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          
          {serverError && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-3.5 text-sm font-bold text-red-650 dark:text-red-400 border border-red-200/60 dark:border-red-900/40 text-right">
              {serverError}
            </div>
          )}

          <div className="space-y-4">
            
            {/* Email Field */}
            <div className="flex flex-col text-right">
              <label htmlFor="email" className="text-sm font-bold text-zinc-700 dark:text-zinc-350 mb-1.5">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                autoComplete="email"
                className="block w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-4 py-2.5 text-sm placeholder-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white focus:outline-none transition-all text-right font-medium"
                placeholder="owner@amanhr.com"
              />
              {errors.email && (
                <span className="text-sm font-semibold text-red-650 dark:text-red-400 mt-1">{errors.email.message}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col text-right relative">
              <label htmlFor="password" className="text-sm font-bold text-zinc-700 dark:text-zinc-350 mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  autoComplete="current-password"
                  className="block w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 pl-11 pr-4 py-2.5 text-sm placeholder-zinc-450 focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white focus:outline-none transition-all text-right font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-3 flex items-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
              {errors.password && (
                <span className="text-sm font-semibold text-red-650 dark:text-red-400 mt-1">{errors.password.message}</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link
              href="/forgot-password"
              className="font-semibold text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full justify-center items-center gap-2.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 px-6 py-2.5 text-sm font-bold text-white dark:text-zinc-950 disabled:opacity-50 transition-colors shadow-xs"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                جاري تسجيل الدخول...
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
