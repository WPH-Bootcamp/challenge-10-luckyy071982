"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { RegisterRequest } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [localErrors, setLocalErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const mutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error: any) => {
      const responseData = error.response?.data;
      const serverMessage = Array.isArray(responseData?.message)
        ? responseData.message[0]
        : responseData?.message || "Registration failed";

      const msg = serverMessage.toLowerCase();
      const newErrors = {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      };

      // Mapping error ke field berdasarkan konten pesan dari server
      if (msg.includes("name")) newErrors.name = serverMessage;
      else if (
        msg.includes("email") ||
        msg.includes("taken") ||
        msg.includes("exists")
      )
        newErrors.email = serverMessage;
      else if (msg.includes("password")) newErrors.password = serverMessage;
      else newErrors.email = serverMessage;

      setLocalErrors(newErrors);
    },
  });

  const validate = () => {
    let isValid = true;
    const err = { name: "", email: "", password: "", confirmPassword: "" };

    if (!formData.name.trim()) {
      err.name = "Name is required";
      isValid = false;
    }

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

    if (!formData.confirmPassword) {
      err.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      err.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setLocalErrors(err);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Logic: Generate username otomatis dari email untuk memenuhi RegisterRequest
      const emailPrefix = formData.email
        .split("@")[0]
        .replace(/[^a-zA-Z0-9]/g, "");
      const generatedUsername = `${emailPrefix}${Math.floor(100 + Math.random() * 900)}`;

      const submitData: RegisterRequest = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        username: generatedUsername,
      };

      mutation.mutate(submitData);
    }
  };

  const inputStyles = (error: string) => `
    w-full px-4 py-3 rounded-xl border transition-all outline-none text-gray-700 placeholder:text-gray-400 text-sm
    ${error ? "border-red-400 " : "border-gray-200 focus:border-[#0093DD] focus:ring-1 focus:ring-[#0093DD]"}
  `;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#FDFDF5] flex items-center justify-center p-4 overflow-y-auto font-sans text-left">
      <div className="w-full max-w-[420px] bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-gray-100/50 my-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Register</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-800 ml-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter your Name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (localErrors.name)
                  setLocalErrors({ ...localErrors, name: "" });
              }}
              className={inputStyles(localErrors.name)}
            />
            {localErrors.name && (
              <p className="text-[11px] text-red-500 font-medium ml-1">
                {localErrors.name}
              </p>
            )}
          </div>

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
              <p className="text-[11px] text-red-500 font-medium ml-1">
                {localErrors.email}
              </p>
            )}
          </div>

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
              <p className="text-[11px] text-red-500 font-medium ml-1">
                {localErrors.password}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-800 ml-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  if (localErrors.confirmPassword)
                    setLocalErrors({ ...localErrors, confirmPassword: "" });
                }}
                className={inputStyles(localErrors.confirmPassword)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0093DD] transition-colors p-1"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {localErrors.confirmPassword && (
              <p className="text-[11px] text-red-500 font-medium ml-1">
                {localErrors.confirmPassword}
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
                <span>Processing...</span>
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-gray-500">Already have an account? </span>
          <button
            type="button"
            className="text-[#0093DD] font-bold hover:underline cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
