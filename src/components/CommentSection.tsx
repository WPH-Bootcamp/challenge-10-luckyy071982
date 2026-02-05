"use client";

import { useState, useEffect } from "react";
import { Comment } from "@/types";
import { postService } from "@/services/post.service";
import { User, X, ChevronDown } from "lucide-react";

interface CommentSectionProps {
  postId: number;
  initialComments: Comment[];
}

export const CommentSection = ({
  postId,
  initialComments,
}: CommentSectionProps) => {
  // --- KONFIGURASI ---
  const COMMENT_LIMIT = 10; // Simpan batas jumlah di sini

  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await postService.createComment(postId, newComment);
      setComments((prev) => [response, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Gagal mengirim komentar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Gunakan variabel COMMENT_LIMIT untuk memotong array
  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const previewComments = sortedComments.slice(0, COMMENT_LIMIT);

  return (
    <div className="py-8 border-t-2 border-gray-100">
      <h3 className="text-[20px] font-bold text-[#181D27] mb-6">
        Comments ({comments.length})
      </h3>

      {isLoggedIn && (
        <form onSubmit={handleSubmit} className="mb-10">
          <textarea
            className="w-full border border-gray-200 rounded-xl p-4 text-[14px] focus:ring-2 focus:ring-[#0093DD] focus:border-transparent outline-none transition-all disabled:bg-gray-50"
            placeholder="Add a comment..."
            rows={3}
            value={newComment}
            disabled={isSubmitting}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="bg-[#0093DD] text-white px-6 py-2 rounded-full font-semibold text-[14px] hover:bg-[#007bbd] transition-colors"
            >
              {isSubmitting ? "Sending..." : "Post Comment"}
            </button>
          </div>
        </form>
      )}

      {/* Preview Komentar */}
      <div className="space-y-8">
        {previewComments.length > 0 ? (
          previewComments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-100">
                <User size={20} className="text-gray-400" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-[14px] text-[#181D27]">
                    {comment.author.name}
                  </span>
                  <span className="text-[12px] text-gray-400">
                    • {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-[15px] text-[#535862] leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center py-5">No comments yet.</p>
        )}

        {/* Gunakan COMMENT_LIMIT untuk pengecekan tombol */}
        {comments.length > COMMENT_LIMIT && (
          <div className="flex justify-center pt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 text-[#0093DD] font-bold text-[14px] hover:underline"
            >
              View all comments
              <ChevronDown size={16} />
            </button>
          </div>
        )}
      </div>

      {/* MODAL POP-UP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
              <h3 className="text-[18px] font-bold text-[#181D27]">
                All Comments ({comments.length})
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow space-y-8 bg-gray-50/20">
              {sortedComments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center">
                    <User size={20} className="text-gray-400" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[14px] text-[#181D27]">
                        {comment.author.name}
                      </span>
                      <span className="text-[12px] text-gray-400">
                        • {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-[15px] text-[#535862] leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {isLoggedIn && (
              <div className="p-4 border-t border-gray-100 bg-white">
                <form onSubmit={handleSubmit} className="flex gap-3 items-end">
                  <textarea
                    className="flex-grow border border-gray-200 rounded-xl p-3 text-[14px] focus:ring-2 focus:ring-[#0093DD] outline-none resize-none"
                    placeholder="Add a comment..."
                    rows={2}
                    value={newComment}
                    disabled={isSubmitting}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !newComment.trim()}
                    className="bg-[#0093DD] text-white px-5 py-2.5 rounded-xl font-semibold text-[14px] h-[48px]"
                  >
                    {isSubmitting ? "..." : "Send"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
