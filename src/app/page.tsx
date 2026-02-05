import { ArticleCard } from "@/components/ArticleCard";
import { postService } from "@/services/post.service";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  // Ambil parameter halaman
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const limit = 5; // Sesuaikan limit sesuai keinginan (misal: 2 atau 5)

  // Ambil data untuk kalkulasi pagination
  const allPostsForCalculation = await postService.getAllPosts(1, 100);
  const totalArticles = allPostsForCalculation.length;

  // Hitung total halaman
  const totalPages = Math.ceil(totalArticles / limit);

  // Ambil data untuk halaman aktif
  const recommendedPosts = await postService.getAllPosts(currentPage, limit);

  // Ambil data untuk sidebar (Most Liked)
  const mostLikedPosts = allPostsForCalculation.slice(0, 3);

  return (
    <main className="min-h-screen bg-white">
      {/* Container utama dengan padding yang adaptif */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* KOLOM UTAMA (Recommend For You) */}
          <section className="lg:col-span-8">
            <h2 className="text-[24px] md:text-[30px] font-bold text-[#181D27] mb-8 md:mb-10 tracking-tight">
              Recommend For You
            </h2>

            <div className="flex flex-col">
              {recommendedPosts.length > 0 ? (
                recommendedPosts.map((post) => (
                  <ArticleCard key={post.id} post={post} variant="recommend" />
                ))
              ) : (
                <p className="text-gray-400 py-10">No articles available.</p>
              )}
            </div>

            {/* PAGINATION SYSTEM - Style sesuai Gambar 2 */}
            {totalPages > 1 && (
              <div className="mt-12 pt-6 border-t border-gray-200 flex items-center justify-center gap-2">
                {/* Previous */}
                <Link
                  href={`/?page=${Math.max(1, currentPage - 1)}`}
                  className={`group flex items-center gap-2 text-[14px] font-semibold transition-colors ${
                    currentPage === 1
                      ? "text-gray-300 pointer-events-none"
                      : "text-gray-600 hover:text-[#0093DD]"
                  }`}
                >
                  <ChevronLeft size={20} />
                  <span>Previous</span>
                </Link>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Link
                        key={page}
                        href={`/?page=${page}`}
                        className={`w-10 h-10 flex items-center justify-center rounded-4xl text-sm font-medium transition-all ${
                          currentPage === page
                            ? "bg-[#0093DD] text-white"
                            : "text-gray-500 hover:text-[#0093DD]"
                        }`}
                      >
                        {page}
                      </Link>
                    ),
                  )}
                </div>

                {/* Next */}
                <Link
                  href={`/?page=${Math.min(totalPages, currentPage + 1)}`}
                  className={`group flex items-center gap-2 text-[14px] font-semibold transition-colors ${
                    currentPage === totalPages
                      ? "text-gray-300 pointer-events-none"
                      : "text-gray-600 hover:text-[#0093DD]"
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight size={20} />
                </Link>
              </div>
            )}
          </section>

          {/* KOLOM SIDEBAR (Most Liked) */}
          <section className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <h2 className="text-[24px] md:text-[30px] font-bold text-[#181D27] mb-8 md:mb-10 tracking-tight">
                Most Liked
              </h2>

              <div className="flex flex-col gap-2">
                {mostLikedPosts.map((post) => (
                  <ArticleCard key={post.id} post={post} variant="most-liked" />
                ))}
              </div>

              {/* Tagline Footer Sidebar */}
              <div className="mt-12 pt-8 border-t border-slate-100 hidden lg:block">
                <p className="text-[13px] text-slate-400 leading-relaxed">
                  Discover the most popular stories from our community members.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
