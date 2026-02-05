import { Post } from "@/types";
import { User } from "lucide-react";
import Link from "next/link";

interface ArticleCardProps {
  post: Post;
  variant?: "recommend" | "most-liked";
}

export const ArticleCard = ({
  post,
  variant = "recommend",
}: ArticleCardProps) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (variant === "most-liked") {
    return (
      <div className="group border-b border-gray-100 pb-6 last:border-0 transition-all">
        <div className="flex flex-col gap-2">
          <Link href={`/posts/${post.id}`}>
            <h3 className="font-bold text-[16px] sm:text-[20px] text-[#181D27] line-clamp-2 group-hover:text-[#0093DD] transition-colors cursor-pointer">
              {post.title}
            </h3>
          </Link>
          <p className="font-normal text-[12px] sm:text-[14px] text-[#181D27] line-clamp-2">
            {post.content.replace(/<[^>]*>/g, "")}
          </p>
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center gap-1.5 text-gray-400 cursor-pointer">
              <img
                src="/icons/Like Icon.svg"
                alt="Like"
                className="w-[14px] h-[14px]"
              />
              <span className="text-xs font-bold">{post.likes}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400 cursor-pointer">
              <img
                src="/icons/Comment Icon.svg"
                alt="Comment"
                className="w-[14px] h-[14px]"
              />
              <span className="text-xs font-bold">{post.comments}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col sm:flex-row gap-6 py-6 border-b border-gray-100 last:border-0 transition-all">
      {/* Thumbnail */}
      <Link
        href={`/posts/${post.id}`}
        className="hidden sm:flex sm:w-[340px] sm:h-[260px] flex-shrink-0 overflow-hidden rounded-2xl bg-gray-50 cursor-pointer"
      >
        <img
          src={post.imageUrl || "/placeholder.png"}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </Link>

      {/* Content Area */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <Link href={`/posts/${post.id}`}>
            <h3 className="font-bold text-[16px] sm:text-[20px] text-[#181D27] leading-tight mb-3 group-hover:text-[#0093DD] transition-colors cursor-pointer">
              {post.title}
            </h3>
          </Link>

          <div className="flex gap-2 mb-4">
            {post.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 border font-normal text-[12px] text-[#181D27] rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="font-normal text-[12px] sm:text-[14px] text-[#181D27] line-clamp-3 mb-6">
            {post.content.replace(/<[^>]*>/g, "")}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 text-gray-400">
            {/* Bagian yang diubah: Nama & Icon Author sekarang bisa diklik */}
            <Link 
              href={`/profile/${post.author.id}`}
              className="flex items-center gap-2 cursor-pointer text-[#181D27] hover:text-[#0093DD] transition-colors"
            >
              <User size={14} className="text-gray-400" />
              <span className="font-normal text-[12px] sm:text-[14px]">
                {post.author.name}
              </span>
            </Link>
            
            <div className="flex items-center gap-2">
              <span className="font-normal text-[12px] sm:text-[14px] text-[#535862]">
                {formatDate(post.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 cursor-pointer">
                <img
                  src="/icons/Like Icon.svg"
                  alt="Like"
                  className="w-[18px] h-[18px]"
                />
                <span className="font-normal text-[12px] sm:text-[14px] text-[#535862]">
                  {post.likes}
                </span>
              </div>
              <div className="flex items-center gap-2 cursor-pointer">
                <img
                  src="/icons/Comment Icon.svg"
                  alt="Comment"
                  className="w-[18px] h-[18px]"
                />
                <span className="font-normal text-[12px] sm:text-[14px] text-[#535862]">
                  {post.comments}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};