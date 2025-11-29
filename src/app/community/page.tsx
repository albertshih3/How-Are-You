"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Button, Chip, Card, CardBody } from "@nextui-org/react";
import { Plus, BookOpen, Users, BookMarked } from "lucide-react";
import { POST_CATEGORIES } from "@/lib/constants/posts";
import { PostCard } from "@/components/community/PostCard";
import { CreatePostDialog } from "@/components/community/CreatePostDialog";
import { CommunityGuidelines } from "@/components/community/CommunityGuidelines";
import { ArticlesSection } from "@/components/dashboard/ArticlesSection";
import { scaleFadeVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";

type ViewType = "posts" | "articles";
type CategoryType = "wins" | "support" | "coping" | "resources" | "questions" | "reflections" | null;

const POSTS_PER_PAGE = 12;

export default function CommunityPage() {
  const [currentView, setCurrentView] = useState<ViewType>("posts");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);

  const { results, status, loadMore } = usePaginatedQuery(
    api.posts.getCommunityPosts,
    selectedCategory ? { category: selectedCategory } : {},
    { initialNumItems: POSTS_PER_PAGE }
  );

  const articles = useQuery(api.articles.getAllArticles);

  const handleCategoryClick = (category: CategoryType) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 flex flex-col gap-8"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Community
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              A safe space for intentional sharing, mutual support, and wellness resources.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="light"
              onPress={() => setShowGuidelines(true)}
              startContent={<BookOpen className="h-4 w-4" />}
              className="font-medium text-slate-600 dark:text-slate-400"
            >
              Guidelines
            </Button>
            {currentView === "posts" && (
              <Button
                color="primary"
                onPress={() => setShowCreateDialog(true)}
                startContent={<Plus className="h-5 w-5" />}
                className="rounded-full bg-slate-900 px-6 font-medium text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:shadow-white/10 dark:hover:bg-slate-100"
              >
                Create Post
              </Button>
            )}
          </div>
        </div>

        {/* View Selector & Filters */}
        <div className="flex flex-col gap-6">
          {/* View Selector */}
          <div className="flex gap-1 rounded-full bg-slate-100 p-1 dark:bg-slate-800/50 w-fit">
            <button
              onClick={() => {
                setCurrentView("posts");
                setSelectedCategory(null);
              }}
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all",
                currentView === "posts"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              )}
            >
              <Users className="h-4 w-4" />
              Community Posts
            </button>
            <button
              onClick={() => setCurrentView("articles")}
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all",
                currentView === "articles"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              )}
            >
              <BookMarked className="h-4 w-4" />
              Curated Articles
            </button>
          </div>

          {/* Category Filter Tabs - Only show for posts view */}
          {currentView === "posts" && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  selectedCategory === null
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
                )}
              >
                All
              </button>
              {Object.entries(POST_CATEGORIES).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => handleCategoryClick(key as CategoryType)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    selectedCategory === key
                      ? `bg-${category.color}-100 text-${category.color}-700 dark:bg-${category.color}-900/30 dark:text-${category.color}-300`
                      : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
                  )}
                >
                  <span>{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Content - Posts or Articles */}
      {currentView === "posts" ? (
        // Posts Grid
        status === "LoadingFirstPage" ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <Users className="mx-auto mb-4 h-12 w-12 animate-pulse text-slate-400" />
              <p className="text-slate-500 dark:text-slate-400">Loading posts...</p>
            </div>
          </div>
        ) : results && results.length > 0 ? (
          <div className="flex flex-col gap-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </div>

            {/* Load More Button */}
            {status === "CanLoadMore" && (
              <div className="flex justify-center">
                <Button
                  size="lg"
                  variant="bordered"
                  onPress={() => loadMore(POSTS_PER_PAGE)}
                  className="rounded-full"
                >
                  Load More
                </Button>
              </div>
            )}

            {status === "LoadingMore" && (
              <div className="flex justify-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">Loading more posts...</p>
              </div>
            )}
          </div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={scaleFadeVariants}>
            <Card className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
              <CardBody className="flex flex-col items-center justify-center gap-4 p-16 text-center">
                <Users className="h-16 w-16 text-slate-400" />
                <div>
                  <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                    {selectedCategory
                      ? `No posts in ${POST_CATEGORIES[selectedCategory].label.toLowerCase()} yet`
                      : "No posts yet"}
                  </h3>
                  <p className="mb-6 text-slate-600 dark:text-slate-400">
                    Be the first to share in this category and start the conversation.
                  </p>
                  <Button
                    size="lg"
                    color="primary"
                    onPress={() => setShowCreateDialog(true)}
                    startContent={<Plus className="h-5 w-5" />}
                    className="rounded-full bg-blue-600 font-medium text-white hover:bg-blue-700"
                  >
                    Create First Post
                  </Button>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )
      ) : (
        // Articles View
        <div className="mx-auto max-w-4xl">
          {articles === undefined ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <BookMarked className="mx-auto mb-4 h-12 w-12 animate-pulse text-slate-400" />
                <p className="text-slate-500 dark:text-slate-400">Loading articles...</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              {articles.map((article, index) => (
                <motion.div
                  key={article._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ArticlesSection articles={[article]} />
                </motion.div>
              ))}
              {articles.length === 0 && (
                <Card className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
                  <CardBody className="flex flex-col items-center justify-center gap-4 p-16 text-center">
                    <BookMarked className="h-16 w-16 text-slate-400" />
                    <div>
                      <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                        No articles yet
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Check back soon for curated wellness resources and tips.
                      </p>
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>
          )}
        </div>
      )}

      {/* Dialogs */}
      <CreatePostDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={() => {
          // Posts will auto-refresh via Convex reactivity
        }}
      />

      <CommunityGuidelines isOpen={showGuidelines} onClose={() => setShowGuidelines(false)} />
    </div>
  );
}
