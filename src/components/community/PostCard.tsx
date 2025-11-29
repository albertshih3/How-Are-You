"use client";

import { Card, CardBody, Chip } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { POST_CATEGORIES } from "@/lib/constants/posts";
import { hoverLift, scaleFadeVariants } from "@/lib/animations";
import { Id } from "@convex/_generated/dataModel";

interface PostCardProps {
  post: {
    _id: Id<"posts">;
    title: string;
    content: string;
    category: "wins" | "support" | "coping" | "resources" | "questions" | "reflections";
    authorDisplayName: string;
    isAnonymous: boolean;
    tags: string[];
    contentWarning?: string;
    supportCount: number;
    responseCount: number;
    createdAt: number;
  };
}

export function PostCard({ post }: PostCardProps) {
  const category = POST_CATEGORIES[post.category];

  // Strip HTML tags for preview
  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const contentPreview = stripHtml(post.content).substring(0, 150);
  const timeAgo = getTimeAgo(post.createdAt);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={scaleFadeVariants}
      whileHover={hoverLift}
    >
      <Link href={`/community/${post._id}`}>
        <Card className="h-full w-full cursor-pointer rounded-3xl border-none bg-white/50 shadow-sm transition-all hover:bg-white hover:shadow-md dark:bg-slate-900/50 dark:hover:bg-slate-900">
          <CardBody className="flex flex-col gap-4 p-6">
            {/* Header with category and content warning */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className={`rounded-full bg-${category.color}-100 p-2 text-${category.color}-600 dark:bg-${category.color}-900/30 dark:text-${category.color}-400`}>
                  <span className="text-lg">{category.icon}</span>
                </div>
                <span className={`text-sm font-medium text-${category.color}-700 dark:text-${category.color}-300`}>
                  {category.label}
                </span>
              </div>

              {post.contentWarning && (
                <Chip
                  size="sm"
                  variant="flat"
                  className="bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                  startContent={<AlertTriangle className="h-3 w-3" />}
                >
                  CW
                </Chip>
              )}
            </div>

            {/* Title */}
            <h3 className="line-clamp-2 text-xl font-bold leading-tight text-slate-900 dark:text-white">
              {post.title}
            </h3>

            {/* Content preview */}
            <p className="line-clamp-3 text-base text-slate-600 dark:text-slate-400">
              {contentPreview}
              {stripHtml(post.content).length > 150 && "..."}
            </p>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    +{post.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Footer with author, stats, and time */}
            <div className="mt-auto flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {post.authorDisplayName}
                </span>
                <span>•</span>
                <span>{timeAgo}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <Heart className="h-4 w-4" />
                  <span>{post.supportCount}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.responseCount}</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </Link>
    </motion.div>
  );
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;
  return `${Math.floor(seconds / 2592000)}mo ago`;
}
