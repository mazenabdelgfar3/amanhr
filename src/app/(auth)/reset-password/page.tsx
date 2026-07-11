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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8 font-sans rtl">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex flex-col items-center">
          <div className="rounded-lg bg-zinc-900 dark:bg-zinc-100 p-3 text-white dark:text-zinc-950">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            تعيين كلمة المرور الجديدة
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-500">
            أدخل كلمة المرور الجديدة لتحديث حسابك
          </p>
        </div>

        {successMsg ? (
          <div className="rounded-lg bg-green-50 dark:bg-green-950/30 p-4 text-sm text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900/50 text-right">
            {successMsg}
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {serverError && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 text-right">
                {serverError}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex flex-col text-right">
                <label htmlFor="password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  كلمة المرور الجديدة
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  className="block w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm placeholder-zinc-400 focus:border-zinc-900 focus:outline-none dark:focus:border-white text-right"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <span className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.password.message}</span>
                )}
              </div>

              <div className="flex flex-col text-right">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  تأكيد كلمة المرور الجديدة
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  className="block w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm placeholder-zinc-400 focus:border-zinc-900 focus:outline-none dark:focus:border-white text-right"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <span className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.confirmPassword.message}</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="flex w-full justify-center items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ كلمة المرور"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
