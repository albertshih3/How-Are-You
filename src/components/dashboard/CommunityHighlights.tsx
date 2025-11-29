"use client";

import { Card, CardBody, Chip, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, ArrowRight, Users } from "lucide-react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { POST_CATEGORIES } from "@/lib/constants/posts";
import { scaleFadeVariants, hoverLift } from "@/lib/animations";

export function CommunityHighlights() {
  const recentPosts = useQuery(api.posts.getRecentHighlights);

  if (!recentPosts || recentPosts.length === 0) {
    return null;
  }

  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={scaleFadeVariants}
      className="w-full"
    >
      <Card className="w-full rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <CardBody className="flex flex-col gap-6 p-6 xl:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Community Highlights
              </h2>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Recent Posts
              </p>
            </div>
            <Link href="/community">
              <Button
                size="sm"
                variant="flat"
                color="primary"
                endContent={<ArrowRight className="h-4 w-4" />}
                className="rounded-full"
              >
                View All
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.slice(0, 3).map((post, index) => {
              const category = POST_CATEGORIES[post.category];
              const contentPreview = stripHtml(post.content).substring(0, 80);

              return (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={hoverLift}
                >
                  <Link href={`/community/${post._id}`}>
                    <Card className="h-full cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 transition-all hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-900">
                      <CardBody className="flex flex-col gap-3 p-4">
                        <Chip
                          size="sm"
                          variant="flat"
                          className={`self-start bg-${category.color}-50 text-${category.color}-700 dark:bg-${category.color}-500/10 dark:text-${category.color}-400`}
                          startContent={<span className="text-xs">{category.icon}</span>}
                        >
                          {category.label}
                        </Chip>

                        <h3 className="line-clamp-2 text-sm font-bold leading-tight text-slate-900 dark:text-white">
                          {post.title}
                        </h3>

                        <p className="line-clamp-2 text-xs text-slate-600 dark:text-slate-400">
                          {contentPreview}
                          {stripHtml(post.content).length > 80 && "..."}
                        </p>

                        <div className="mt-auto flex items-center gap-3 border-t border-slate-200 pt-3 dark:border-slate-800">
                          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <Heart className="h-3 w-3" />
                            <span>{post.supportCount}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <MessageCircle className="h-3 w-3" />
                            <span>{post.responseCount}</span>
                          </div>
                          <span className="ml-auto text-xs font-medium text-slate-500 dark:text-slate-400">
                            {post.authorDisplayName}
                          </span>
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-2 rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/50">
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
              <div>
                <h4 className="mb-1 text-sm font-semibold text-blue-900 dark:text-blue-100">
                  Join the conversation
                </h4>
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  Share your experiences, offer support, and connect with others on their wellness
                  journey.
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
