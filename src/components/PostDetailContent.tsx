import { Post } from "@/types";
import { User } from "lucide-react";

interface PostDetailContentProps {
  post: Post;
}

export const PostDetailContent = ({ post }: PostDetailContentProps) => {
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

  return (
    // <article className="max-w-[800px] mx-auto py-5 md:py-8">
    <article className="max-w-full mx-auto py-5 md:py-8">
      {/* 2. Title */}
      <h1 className="font-bold text-[28px] md:text-[40px] text-[#181D27] leading-tight mb-2">
        {post.title}
      </h1>
      {/* 1. Tags */}
      <div className="flex gap-2 mb-4">
        {post.tags?.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 border font-normal text-[12px] text-[#181D27] rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      {/* 3. Author & Date Info */}
      <div className="flex items-center gap-4 mb-2 pb-4 border-b-2 border-gray-100">
        <div className="flex items-center gap-2 text-[#181D27]">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <User size={20} className="text-gray-400" />
          </div>
          <div>
            <span className="font-bold text-[14px]">{post.author.name}</span>
          </div>
          <div>
            <span className="font-normal text-[12px] text-[#535862]">
              • {formatDate(post.createdAt)}
            </span>
          </div>
        </div>
      </div>{" "}
      {/* 6. Interaction Footer */}
      <div className="my-4 pb-4 border-b-2 border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <img
              src="/icons/Like Icon.svg"
              alt="Like"
              className="w-[20px] h-[20px]"
            />
            <span className="font-medium text-[14px] text-[#535862]">
              {post.likes}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <img
              src="/icons/Comment Icon.svg"
              alt="Comment"
              className="w-[20px] h-[20px]"
            />
            <span className="font-medium text-[14px] text-[#535862]">
              {post.comments}
            </span>
          </div>
        </div>
      </div>
      {/* 4. Main Image */}
      <div className="mt-6 w-full aspect-video md:aspect-[16/9] overflow-hidden rounded-2xl bg-gray-50 mb-10">
        <img
          src={post.imageUrl || "/placeholder.png"}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>
      {/* 5. Content Body */}
      <div
        className="font-normal text-[16px] md:text-[18px] text-[#181D27] leading-relaxed prose prose-slate max-w-none
          prose-p:mb-6 prose-strong:font-bold prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
};
