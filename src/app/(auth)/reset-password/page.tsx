"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordInput } from "@/features/auth/schema/auth-schema";
import { updatePassword } from "@/features/auth/actions/reset-password";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordInput) => {
    setServerError(null);
    setSuccessMsg(null);
    startTransition(async () => {
      const response = await updatePassword(data);
      if (response.success) {
        setSuccessMsg("تم تغيير كلمة المرور بنجاح. سيتم تحويلك لصفحة تسجيل الدخول.");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setServerError(response.error?.message || "فشل تحديث كلمة المرور.");
      }
    });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8 font-sans rtl overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-zinc-200/40 dark:bg-zinc-900/20 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-zinc-300/30 dark:bg-zinc-900/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-md relative z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center">
          <div className="rounded-lg bg-zinc-950 dark:bg-white p-3 text-white dark:text-zinc-950 shadow-xs">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-zinc-950 dark:text-white leading-relaxed">
            تعيين كلمة المرور الجديدة
          </h2>
          <p className="mt-2 text-center text-sm font-semibold text-zinc-550 leading-relaxed">
            أدخل كلمة المرور الجديدة والأرقام لتحديث وتأمين حسابك.
          </p>
        </div>

        {successMsg ? (
          <div className="rounded-lg bg-green-50 dark:bg-green-950/20 p-4.5 text-sm font-bold text-green-700 dark:text-green-400 border border-green-200/60 dark:border-green-900/40 text-right shadow-xs">
            {successMsg}
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {serverError && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-3.5 text-sm font-bold text-red-650 dark:text-red-400 border border-red-200/60 dark:border-red-900/40 text-right shadow-xs">
                {serverError}
              </div>
            )}

            <div className="space-y-4">
              
              {/* Password */}
              <div className="flex flex-col text-right">
                <label htmlFor="password" className="text-sm font-bold text-zinc-700 dark:text-zinc-350 mb-1.5">
                  كلمة المرور الجديدة
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  className="block w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-4 py-2.5 text-sm placeholder-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white focus:outline-none transition-all text-right font-medium"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <span className="text-sm font-semibold text-red-650 dark:text-red-400 mt-1">{errors.password.message}</span>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col text-right">
                <label htmlFor="confirmPassword" className="text-sm font-bold text-zinc-700 dark:text-zinc-350 mb-1.5">
                  تأكيد كلمة المرور الجديدة
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  className="block w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-4 py-2.5 text-sm placeholder-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white focus:outline-none transition-all text-right font-medium"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <span className="text-sm font-semibold text-red-650 dark:text-red-400 mt-1">{errors.confirmPassword.message}</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="flex w-full justify-center items-center gap-2.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 px-6 py-2.5 text-sm font-bold text-white dark:text-zinc-950 disabled:opacity-50 transition-colors shadow-xs h-10"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  جاري حفظ كلمة المرور...
                </>
              ) : (
                "حفظ وتعيين كلمة المرور"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
