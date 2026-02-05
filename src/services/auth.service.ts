import axiosInstance from "@/lib/axios";
import { AuthResponse, AuthRequest, RegisterRequest } from "@/types";

export const authService = {
  login: async (data: AuthRequest): Promise<AuthResponse> => {
    const res = await axiosInstance.post<AuthResponse>("/auth/login", data);
    return res.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await axiosInstance.post<AuthResponse>("/auth/register", data);
    return res.data;
  },

  // Ambil data user yang sedang login (Gambar 1)
  getMyProfile: async () => {
    const res = await axiosInstance.get("/users/me");
    return res.data;
  },

  // Update Nama & Headline (Gambar 4 - Pop up Edit Profile)
  updateProfile: async (data: { name: string; headline: string }) => {
    const res = await axiosInstance.patch("/users/me", data);
    return res.data;
  },

  changePassword: async (data: any) => {
    // data harus berisi: { currentPassword, newPassword, confirmPassword }
    const response = await axiosInstance.patch("/users/password", data);
    return response.data;
  },
};
