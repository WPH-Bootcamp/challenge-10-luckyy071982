"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2, KeyRound } from "lucide-react";
import { authService } from "@/services/auth.service";
import { toast } from "react-hot-toast";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Password lama wajib diisi"),
    password: z.string().min(8, "Password baru minimal 8 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password baru tidak cocok",
    path: ["confirmPassword"],
  });

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // State baru untuk konfirmasi

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordValues) => {
    setIsLoading(true);
    try {
      const payload = {
        currentPassword: data.currentPassword,
        newPassword: data.password,
        confirmPassword: data.confirmPassword,
      };

      await authService.changePassword(payload);

      toast.success("Password berhasil diperbarui!");
      reset();
    } catch (error: any) {
      const responseData = error.response?.data;
      const errorMessage =
        responseData?.message ||
        responseData?.details?.errors?.[0] ||
        "Gagal memperbarui password";

      toast.error(errorMessage);

      if (process.env.NODE_ENV === "development") {
        console.error("API Error Detail:", responseData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-6 text-slate-800">
        <div className="p-2 bg-[#0093DD]/10 rounded-lg">
          <KeyRound className="text-[#0093DD]" size={20} />
        </div>
        <h2 className="font-bold text-lg">Ganti Password</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Current Password Field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Password Saat Ini
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              {...register("currentPassword")}
              className={`w-full p-3 bg-slate-50 border ${
                errors.currentPassword ? "border-red-500" : "border-slate-200"
              } rounded-xl outline-none focus:ring-2 focus:ring-[#0093DD]/20 text-sm transition-all`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-xs text-red-500 mt-1">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* New Password Field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Password Baru
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              {...register("password")}
              className={`w-full p-3 bg-slate-50 border ${
                errors.password ? "border-red-500" : "border-slate-200"
              } rounded-xl outline-none focus:ring-2 focus:ring-[#0093DD]/20 text-sm transition-all`}
              placeholder="Min. 8 karakter"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Konfirmasi Password Baru
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              {...register("confirmPassword")}
              className={`w-full p-3 bg-slate-50 border ${
                errors.confirmPassword ? "border-red-500" : "border-slate-200"
              } rounded-xl outline-none focus:ring-2 focus:ring-[#0093DD]/20 text-sm transition-all`}
              placeholder="Ulangi password baru"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#0093DD] hover:bg-[#007bbd] text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4 shadow-md active:scale-95"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Memproses...</span>
            </>
          ) : (
            "Update Password"
          )}
        </button>
      </form>
    </div>
  );
}
