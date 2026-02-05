"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { AuthRequest } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<AuthRequest>({
    email: "",
    password: "",
  });

  const [localErrors, setLocalErrors] = useState({
    email: "",
    password: "",
  });

  const mutation = useMutation({
    mutationFn: (data: AuthRequest) => authService.login(data),
    onSuccess: (data) => {
      if (data.token) {
        // 1. Simpan token ke localStorage
        localStorage.setItem("token", data.token);

        /** * 2. REDIRECT KE HOMEPAGE (/)
         * Kita gunakan window.location.href alih-alih router.push
         * agar halaman melakukan refresh total. Ini memastikan Navbar
         * mendeteksi token baru dan langsung berubah ke mode "Logged In".
         */
        window.location.href = "/";
      }
    },
    onError: (error: any) => {
      const responseData = error.response?.data;
      let serverMessage = "";

      if (responseData?.details && Array.isArray(responseData.details)) {
        serverMessage = responseData.details[0];
      } else if (Array.isArray(responseData?.message)) {
        serverMessage = responseData.message[0];
      } else {
        serverMessage = responseData?.message || "Invalid credentials";
      }

      const msg = serverMessage.toLowerCase();

      if (
        msg.includes("email") ||
        msg.includes("user") ||
        msg.includes("identifier") ||
        msg.includes("found")
      ) {
        setLocalErrors({ email: serverMessage, password: "" });
      } else {
        setLocalErrors({ email: "", password: serverMessage });
      }
    },
  });

  const validate = () => {
    let isValid = true;
    const err = { email: "", password: "" };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      err.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      err.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      err.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      err.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setLocalErrors(err);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      mutation.mutate(formData);
    }
  };

  const inputStyles = (error: string) => `
    w-full px-4 py-3 rounded-xl border transition-all outline-none text-gray-700 placeholder:text-gray-400 text-sm
    ${error ? "border-red-400" : "border-gray-200 focus:border-[#0093DD] focus:ring-1 focus:ring-[#0093DD]"}
  `;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#FDFDF5] flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="w-full max-w-[420px] bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-gray-100/50 my-auto text-left">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-800 ml-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your Email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (localErrors.email)
                  setLocalErrors({ ...localErrors, email: "" });
              }}
              className={inputStyles(localErrors.email)}
            />
            {localErrors.email && (
              <p className="text-[11px] text-red-500 font-medium ml-1 transition-all">
                {localErrors.email}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-800 ml-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (localErrors.password)
                    setLocalErrors({ ...localErrors, password: "" });
                }}
                className={inputStyles(localErrors.password)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0093DD] transition-colors p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {localErrors.password && (
              <p className="text-[11px] text-red-500 font-medium ml-1 transition-all">
                {localErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-[#0093DD] border border-[#0093DD] text-white font-bold py-3.5 rounded-full mt-4 shadow-sm transition-all hover:bg-white hover:text-[#0093DD] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                <span>Signing In...</span>
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-gray-500">Don't have an account? </span>
          <button
            type="button"
            className="text-[#0093DD] font-bold hover:underline cursor-pointer"
            onClick={() => router.push("/register")}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
