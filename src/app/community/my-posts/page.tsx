"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Button, Card, CardBody, Chip } from "@nextui-org/react";
import { ArrowLeft, FileText, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { POST_CATEGORIES } from "@/lib/constants/posts";
import { PostCard } from "@/components/community/PostCard";
import { scaleFadeVariants } from "@/lib/animations";
import { toast } from "sonner";
import { Id } from "@convex/_generated/dataModel";

export default function MyPostsPage() {
  const [deletingId, setDeletingId] = useState<Id<"posts"> | null>(null);

  const userPosts = useQuery(api.posts.getUserPosts);
  const deletePost = useMutation(api.posts.deletePost);

  const handleDeletePost = async (postId: Id<"posts">) => {
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return;
    }

    setDeletingId(postId);

    try {
      await deletePost({ postId });
      toast.success("Post deleted successfully");
    } catch (error: any) {
      console.error("Failed to delete post:", error);
      toast.error(error.message || "Failed to delete post");
    } finally {
      setDeletingId(null);
    }
  };

  const publishedPosts = userPosts?.filter((p) => p.status === "published") || [];
  const draftPosts = userPosts?.filter((p) => p.status === "draft") || [];

  const totalSupport = publishedPosts.reduce((sum, post) => sum + post.supportCount, 0);
  const totalResponses = publishedPosts.reduce((sum, post) => sum + post.responseCount, 0);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col gap-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/community">
              <Button
                variant="light"
                startContent={<ArrowLeft className="h-4 w-4" />}
                className="mb-2 rounded-full"
              >
                Back to Community
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">My Posts</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              View and manage all your community posts
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        {publishedPosts.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-800">
              <CardBody className="p-6">
                <p className="text-sm text-slate-600 dark:text-slate-400">Published Posts</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {publishedPosts.length}
                </p>
              </CardBody>
            </Card>
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-800">
              <CardBody className="p-6">
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Support</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {totalSupport}
                </p>
              </CardBody>
            </Card>
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-800">
              <CardBody className="p-6">
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Responses</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {totalResponses}
                </p>
              </CardBody>
            </Card>
          </div>
        )}
      </motion.div>

      {/* Draft Posts Section */}
      {draftPosts.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
            Drafts ({draftPosts.length})
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {draftPosts.map((post) => {
              const category = POST_CATEGORIES[post.category];
              return (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
                    <CardBody className="flex flex-col gap-4 p-6">
                      <Chip size="sm" variant="flat">
                        <span className="mr-1">{category.icon}</span>
                        {category.label}
                      </Chip>
                      <h3 className="line-clamp-2 font-bold text-slate-900 dark:text-white">
                        {post.title}
                      </h3>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="light"
                          onPress={() => handleDeletePost(post._id)}
                          isLoading={deletingId === post._id}
                          startContent={<Trash2 className="h-3.5 w-3.5" />}
                          className="text-red-600"
                        >
                          Delete
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Published Posts Section */}
      {publishedPosts.length > 0 ? (
        <div>
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
            Published ({publishedPosts.length})
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {publishedPosts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="relative">
                  <PostCard post={post} />
                  <div className="absolute right-4 top-4 z-10">
                    <Button
                      size="sm"
                      isIconOnly
                      variant="flat"
                      color="danger"
                      onPress={() => handleDeletePost(post._id)}
                      isLoading={deletingId === post._id}
                      className="rounded-full"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <motion.div initial="hidden" animate="visible" variants={scaleFadeVariants}>
          <Card className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
            <CardBody className="flex flex-col items-center justify-center gap-4 p-16 text-center">
              <FileText className="h-16 w-16 text-slate-400" />
              <div>
                <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                  No posts yet
                </h3>
                <p className="mb-6 text-slate-600 dark:text-slate-400">
                  Start sharing your experiences and connect with the community.
                </p>
                <Link href="/community">
                  <Button
                    size="lg"
                    color="primary"
                    className="rounded-full bg-blue-600 font-medium text-white hover:bg-blue-700"
                  >
                    Create Your First Post
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
