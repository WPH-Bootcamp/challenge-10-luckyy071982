"use client";

import { useState, useEffect } from "react";
import { User, FileText, Loader2, Camera } from "lucide-react";
import { authService } from "@/services/auth.service";
import ChangePasswordForm from "@/components/ChangePasswordForm";

export default function MyProfilePage() {
  const [activeTab, setActiveTab] = useState<"posts" | "security">("posts");
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authService.getMyProfile();

        // Logika Unwrapping Data sesuai response axiosInstance
        // Jika service return response.data, maka strukturnya biasanya res.data atau res langsung
        if (res && res.data) {
          setUserData(res.data);
        } else {
          setUserData(res);
        }
      } catch (err) {
        console.error("Gagal ambil data profil:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-[#0093DD]" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-20">
      {/* PROFILE HEADER */}
      <div className="flex flex-col items-center pt-10 pb-6 px-4 bg-slate-50/30">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-200 flex items-center justify-center">
            {userData?.avatarUrl ? (
              <img
                src={userData.avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={40} className="text-slate-400" />
            )}
          </div>
          {/* Tombol Upload Gambar (Bisa dikembangkan nanti) */}
          <button className="absolute bottom-0 right-0 bg-[#0093DD] p-2 rounded-full border-2 border-white text-white shadow-md active:scale-90 transition-transform hover:bg-[#007bbd]">
            <Camera size={14} />
          </button>
        </div>

        <h2 className="text-xl font-bold text-slate-900">
          {userData?.name || "No Name"}
        </h2>
        <p className="text-[#0093DD] font-medium text-sm">
          @{userData?.username || "username"}
        </p>
        <p className="text-slate-500 text-sm mt-2 text-center px-6 leading-relaxed">
          {userData?.headline || "No headline yet."}
        </p>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex border-b border-slate-100 sticky top-0 bg-white z-10">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex-1 py-4 text-sm font-bold transition-all ${
            activeTab === "posts"
              ? "text-[#0093DD] border-b-2 border-[#0093DD]"
              : "text-slate-400"
          }`}
        >
          My Posts
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`flex-1 py-4 text-sm font-bold transition-all ${
            activeTab === "security"
              ? "text-[#0093DD] border-b-2 border-[#0093DD]"
              : "text-slate-400"
          }`}
        >
          Security
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="p-6">
        {activeTab === "posts" ? (
          /* MY POSTS TAB */
          <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <FileText className="text-slate-200" size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              No posts yet
            </h3>
            <p className="text-slate-400 text-sm mb-8">
              You haven't posted anything yet.
            </p>
            <button className="w-full bg-[#0093DD] text-white py-3 rounded-full font-bold text-sm shadow-lg active:scale-[0.98] transition-all hover:bg-[#007bbd]">
              Create New Post
            </button>
          </div>
        ) : (
          /* SECURITY TAB - Memanggil Komponen Yang Baru Dibuat */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ChangePasswordForm />
          </div>
        )}
      </div>
    </div>
  );
}
