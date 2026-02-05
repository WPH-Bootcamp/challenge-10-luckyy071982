import { postService } from "@/services/post.service";
import { PostDetailContent } from "@/components/PostDetailContent";
import { CommentSection } from "@/components/CommentSection";
import { notFound } from "next/navigation";

export default async function PostDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const postId = Number(id);

  // Fetch data secara paralel
  const [post, comments] = await Promise.all([
    postService.getPostById(postId),
    postService.getCommentsByPostId(postId),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Container Utama:
        - max-w-[1280px] dan mx-auto agar tetap di tengah pada layar lebar.
        - px-4 untuk mobile, sm:px-6 dan lg:px-8 untuk layar yang lebih besar.
      */}
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hapus grid-cols-12 dan section col-span-8 agar konten memanjang penuh */}
        <div className="w-full">
          {/* Konten Artikel */}
          <PostDetailContent post={post} />

          {/* Section Komentar */}
          <div className="mt-12 pb-20">
            <CommentSection postId={postId} initialComments={comments} />
          </div>
        </div>
      </div>
    </main>
  );
}
