"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { postService } from "@/services/post.service";
import Image from "next/image";
import { Search, ArrowLeft } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { useState, useEffect } from "react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  // State untuk input lokal agar user bisa mengetik di mobile
  const [localQuery, setLocalQuery] = useState(query);

  // Sinkronisasi input lokal jika query di URL berubah
  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["searchPosts", query],
    queryFn: () => postService.searchPosts(query),
    enabled: !!query,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(localQuery)}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 min-h-[70vh]">
      {/* 1. Mobile Search Bar (Hanya muncul di Mobile) */}
      <div className="sm:hidden mb-6">
        <form
          onSubmit={handleSearch}
          className="relative flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </form>
      </div>

      {/* 2. Desktop Title (Tetap seperti sebelumnya) */}
      <div className="mb-8 hidden sm:flex">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          {query ? `Results for "${query}"` : "Search Posts"}
        </h1>
      </div>

      {/* 3. Loading State */}
      {isLoading && (
        <div className="flex flex-col gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-slate-100 h-32 rounded-2xl w-full"
            />
          ))}
        </div>
      )}

      {/* 4. Results Found */}
      {!isLoading && posts && posts.length > 0 && (
        <div className="flex flex-col gap-2">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} variant="recommend" />
          ))}
        </div>
      )}

      {/* 5. No Results Found */}
      {!isLoading && query && posts?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="relative w-40 h-40 mb-6">
            <Image
              src="/icons/No Post Icon.svg"
              alt="No posts found"
              fill
              className="object-contain"
            />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No results found</h3>
          <p className="text-slate-500 mt-2 max-w-xs">
            Try using different keywords for <b>"{query}"</b>
          </p>
        </div>
      )}

      {/* 6. Initial Empty State (Saat baru buka halaman tanpa query) */}
      {!query && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-300">
          <Search size={80} strokeWidth={1} />
          <p className="mt-4 font-medium text-slate-400">
            Type something to search...
          </p>
        </div>
      )}
    </div>
  );
}
