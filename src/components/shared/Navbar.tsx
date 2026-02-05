"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Menu, X, User, LogOut, SquarePen } from "lucide-react";
import axiosInstance from "@/lib/axios";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userData, setUserData] = useState<{
    name: string;
    avatar?: string;
    username?: string;
  } | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      setIsLoggedIn(true);
      fetchUserProfile();
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        const user = response.data.data || response.data;
        setUserData({
          name: user.name || user.username || "User",
          username: user.username,
          avatar: user.avatarUrl || user.image,
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-100">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* LEFT: LOGO */}
        <Link href="/" className="flex items-center shrink-0">
          <div className="relative w-[25px] h-[25px]">
            <Image
              src="/images/Web Logo.svg"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="ml-2 font-bold text-lg text-slate-900">
            WPH Rendang <span className="text-[#0093DD]">Blog</span>
          </span>
        </Link>

        {/* MIDDLE: SEARCH (DESKTOP) */}
        <form
          onSubmit={handleSearch}
          className="hidden sm:flex flex-grow max-w-sm relative"
        >
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#0093DD]/20"
          />
        </form>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Icon - HIDDEN IF LOGGED IN */}
          {!isLoggedIn && (
            <button
              onClick={() => router.push("/search")}
              className="p-2 text-slate-600 sm:hidden"
            >
              <Search size={22} />
            </button>
          )}

          {!isLoggedIn ? (
            /* GUEST STATE */
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-[#0093DD]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 text-sm font-medium bg-[#0093DD] text-white rounded-full hover:bg-[#007bbd] transition-colors"
              >
                Register
              </Link>
            </div>
          ) : (
            /* AUTH STATE */
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Write Post (Desktop Only) */}
              <Link
                href="/create-post"
                className="hidden sm:flex items-center gap-2 text-slate-600 hover:text-[#0093DD] transition-colors font-medium text-sm"
              >
                <SquarePen size={20} />
                <span>Write Post</span>
              </Link>

              {/* User Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-3 p-1 pr-2 rounded-full hover:bg-slate-50 transition-all border border-transparent sm:border-slate-100"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 flex items-center justify-center bg-slate-100 shrink-0">
                    {userData?.avatar ? (
                      <img
                        src={userData.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={18} className="text-slate-400" />
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-semibold text-slate-700 max-w-[100px] truncate">
                    {userData?.name?.split(" ")[0] || "User"}
                  </span>
                </button>

                {isOpen && (
                  <div className="absolute right-0 top-12 w-52 bg-white border border-slate-100 rounded-xl shadow-xl py-2 animate-in fade-in zoom-in duration-150">
                    <div className="px-4 py-3 border-b border-slate-50">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {userData?.name}
                      </p>
                      <p className="text-xs text-[#0093DD] truncate">
                        @{userData?.username}
                      </p>
                    </div>
                    {/* Menu Tambahan untuk Mobile di dalam Dropdown saat Login */}
                    <Link
                      href="/create-post"
                      onClick={() => setIsOpen(false)}
                      className="flex sm:hidden items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <SquarePen size={16} /> Write Post
                    </Link>
                    <Link
                      href="/my-profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <User size={16} /> My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 text-left"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Hamburger Menu - HIDDEN IF LOGGED IN */}
          {!isLoggedIn && (
            <button
              className="sm:hidden p-2 text-slate-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          )}
        </div>
      </div>

      {/* MOBILE GUEST NAV - ONLY SHOW IF NOT LOGGED IN */}
      {!isLoggedIn && isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-slate-100 p-4 space-y-3">
          <div className="flex flex-col gap-2">
            <Link
              href="/login"
              className="w-full py-2 text-center text-[#0093DD] border border-[#0093DD] rounded-lg"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="w-full py-2 text-center bg-[#0093DD] text-white rounded-lg"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
