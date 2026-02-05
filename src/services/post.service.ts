import axiosInstance from "@/lib/axios";
import { Post, Comment } from "@/types";

export const postService = {
  // Ambil semua post (sesuai URL yang Anda tes tadi)
  getAllPosts: async (page = 1, limit = 10): Promise<Post[]> => {
    try {
      // Kita tambahkan query params karena /posts saja 404
      const res = await axiosInstance.get(
        `/posts/most-liked?limit=${limit}&page=${page}`,
      );

      // Karena response-nya {"data": [...], "total": 6}, kita ambil .data
      return res.data.data || [];
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  },

  getPostById: async (id: number): Promise<Post | null> => {
    try {
      const res = await axiosInstance.get(`/posts/${id}`);
      // Asumsi API mengembalikan data langsung atau di dalam property .data
      return res.data || null;
    } catch (error) {
      console.error(`Error fetching post with id ${id}:`, error);
      return null;
    }
  },

  searchPosts: async (query: string): Promise<Post[]> => {
    try {
      const res = await axiosInstance.get(
        `/posts/search?query=${encodeURIComponent(query)}`,
      );
      return res.data.data || [];
    } catch (error: any) {
      console.error("Search Error:", error.config?.url);
      return [];
    }
  },

  getCommentsByPostId: async (id: number): Promise<Comment[]> => {
    try {
      const res = await axiosInstance.get(`/posts/${id}/comments`);
      // Biasanya API mengembalikan { data: [...] } atau langsung [...]
      return res.data.data || res.data || [];
    } catch (error) {
      console.error(`Error fetching comments for post ${id}:`, error);
      return [];
    }
  },

  async createComment(postId: number, content: string): Promise<Comment> {
    // Sesuai gambar: /comments/{postId}
    const response = await axiosInstance.post(`/comments/${postId}`, {
      content: content, // Payload body tetap content
    });

    // Pastikan mengambil data sesuai struktur response API Anda
    // Jika API langsung mengembalikan objek comment, gunakan response.data
    // Jika dibungkus 'data', gunakan response.data.data
    return response.data.data || response.data;
  },

  async getPostsByUserId(userId: any) {
    // Pastikan userId dikonversi ke Number
    const id = Number(userId);

    if (isNaN(id)) {
      throw new Error("Invalid User ID");
    }

    try {
      const response = await axiosInstance.get(`/posts/by-user/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching posts by userId:", error);
      throw error;
    }
  },
};
