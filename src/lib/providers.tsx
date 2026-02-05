"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Toaster } from "react-hot-toast"; // 1. Import Toaster

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 2. Tambahkan komponen Toaster di sini agar bisa digunakan di seluruh aplikasi */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            fontSize: "14px",
            borderRadius: "12px",
            background: "#333",
            color: "#fff",
          },
        }}
      />
    </QueryClientProvider>
  );
}
