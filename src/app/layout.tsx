import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 1. Pastikan Path Benar. Jika file ada di src/components/shared/Navbar.tsx
import Providers from "@/lib/providers";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WPH Rendang Blog",
  description: "Challenge 10 - Mobile First Design",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-[#F8FAFC]`}
      >
        <Providers>
          {/* Komponen Navbar harus dipanggil seperti ini */}
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
