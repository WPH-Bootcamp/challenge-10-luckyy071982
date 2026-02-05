import { postService } from "@/services/post.service";
import { ArticleCard } from "@/components/ArticleCard";
import { User, FileText } from "lucide-react";

// Definisikan tipe params sebagai Promise
interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  // AWAIT params di sini
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) {
    return (
      <div className="p-10 text-center text-red-500">
        Error: ID parameter is missing
      </div>
    );
  }

  try {
    // Panggil service
    const profileData = await postService.getPostsByUserId(id);
    const user = profileData?.user;
    const posts = profileData?.data || [];

    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500 font-medium">User not found</p>
        </div>
      );
    }

    return (
      <main className="min-h-screen bg-white px-2">
        {/* HEADER SECTION */}
        <div className="border-b-2 border-gray-100">
          <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10">
            <div className="flex items-center flex-row text-left gap-8">
              <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-white border-4 border-white shadow-sm mb-4 sm:mb-0">
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <User size={30} className="text-gray-400" />
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#181D27] mb-1">
                  {user.name}
                </h1>
                <p className="text-[#535862] text-[14px] sm:text-[16px] max-w-2xl">
                  {user.headline || "No bio available"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-[24px] sm:text-[36px] font-bold text-[#181D27]">
              {profileData.total || 0} Posts
            </h2>
          </div>

          {posts.length > 0 ? (
            <div className="flex flex-col">
              {posts.map((post: any) => (
                <ArticleCard key={post.id} post={post} variant="recommend" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FileText size={48} className="text-gray-200 mb-4" />
              <h3 className="text-lg font-bold">No posts yet</h3>
              <p className="text-gray-500">
                This user hasn&apos;t published any articles.
              </p>
            </div>
          )}
        </div>
      </main>
    );
  } catch (error) {
    console.error("Fetch error:", error);
    return (
      <div className="p-10 text-center">
        <p className="text-red-500 font-bold">Failed to load profile.</p>
        <p className="text-sm text-gray-400">
          Please check your connection or API status.
        </p>
      </div>
    );
  }
}
