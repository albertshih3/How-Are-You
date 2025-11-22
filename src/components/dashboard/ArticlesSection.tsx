"use client";

import { Card, CardBody, Button, Chip } from "@nextui-org/react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BookMarked, ArrowUpRight, Sparkles } from "lucide-react";
import {
  scaleFadeVariants,
  hoverLift,
  getStaggerDelay
} from "@/lib/animations";

interface Article {
  _id: string;
  _creationTime: number;
  title: string;
  description: string;
  imageUrl?: string;
  externalLink?: string;
  tags: string[];
  category: string;
  // Internal article fields
  isInternal: boolean;
  authorType?: "admin" | "student";
  authorName?: string;
  content?: string;
  publishedAt: number;
  status: "draft" | "published";
}

interface ArticlesSectionProps {
  articles: Article[];
  moodLabel?: string;
}

export function ArticlesSection({ articles, moodLabel }: ArticlesSectionProps) {
  if (articles.length === 0) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={scaleFadeVariants}
        whileHover={hoverLift}
      >
        <Card className="w-full rounded-[24px] border border-transparent bg-white/90 shadow-[0_18px_32px_-18px_rgba(15,23,42,0.25)] backdrop-blur transition-shadow duration-300 hover:shadow-[0_25px_50px_-12px_rgba(15,23,42,0.35)] dark:border-white/5 dark:bg-slate-900/75">
          <CardBody className="flex h-full flex-col items-center justify-center gap-6 p-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <BookMarked className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-semibold">Curated Resources</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Once you start logging, we&apos;ll surface fresh reads tailored to your current focus.
            </p>
          </CardBody>
        </Card>
      </motion.div>
    );
  }

  // Separate featured (first) article from regular articles
  const [featuredArticle, ...regularArticles] = articles;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={scaleFadeVariants}
    >
      <Card className="w-full rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
        <CardBody className="flex h-full flex-col gap-6 p-6 xl:p-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Ritual picks
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                  Curated Resources
                </h2>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <Sparkles className="h-3.5 w-3.5" />
                For you
              </div>
            </div>
            {moodLabel && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-slate-500 dark:text-slate-400"
              >
                Inspired by how you recently felt: <span className="font-semibold text-slate-700 dark:text-slate-200">{moodLabel}</span>
              </motion.p>
            )}
          </div>

          <div className="flex-1 space-y-6">
            {/* Featured Article (First One) - Larger, Prominent */}
            {featuredArticle && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: getStaggerDelay(0, 0.12) }}
                whileHover={{ y: -2 }}
              >
                <Link
                  href={featuredArticle.isInternal ? `/articles/${featuredArticle._id}` : featuredArticle.externalLink || "#"}
                  target={featuredArticle.isInternal ? undefined : "_blank"}
                  rel={featuredArticle.isInternal ? undefined : "noopener noreferrer"}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition-all duration-300 hover:border-slate-300 hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-700 dark:hover:bg-slate-800">
                    {/* Image with zoom effect */}
                    {featuredArticle.imageUrl && (
                      <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.4 }}
                          className="h-full w-full"
                        >
                          <Image
                            src={featuredArticle.imageUrl || ""}
                            alt={featuredArticle.title}
                            width={800}
                            height={400}
                            className="h-full w-full object-cover"
                            unoptimized
                          />
                        </motion.div>

                        {/* Category badge on image */}
                        <div className="absolute left-4 top-4">
                          <div className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-900 backdrop-blur-sm dark:bg-slate-900/90 dark:text-white">
                            {featuredArticle.category}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="relative z-10 space-y-4 p-6">
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold leading-tight text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                          {featuredArticle.title}
                        </h3>
                        <p className="line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {featuredArticle.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {featuredArticle.tags.slice(0, 3).map((tag, index) => (
                          <Chip
                            key={tag}
                            size="sm"
                            variant="flat"
                            radius="full"
                            className="h-6 bg-white px-2 text-[10px] font-medium text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400"
                          >
                            {tag}
                          </Chip>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {featuredArticle.isInternal && featuredArticle.authorName && (
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            By {featuredArticle.authorName}
                          </span>
                        )}
                        <div className="ml-auto flex items-center gap-1 text-xs font-bold text-blue-600 transition-colors group-hover:text-blue-700 dark:text-blue-400 dark:group-hover:text-blue-300">
                          {featuredArticle.isInternal ? "Read article" : "Read more"}
                          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Regular Articles - Smaller cards */}
            {regularArticles.length > 0 && (
              <div className="space-y-4">
                {regularArticles.map((article, index) => (
                  <motion.div
                    key={article._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: getStaggerDelay(index + 1, 0.12) }}
                    whileHover={{ y: -2 }}
                  >
                    <Link
                      href={article.isInternal ? `/articles/${article._id}` : article.externalLink || "#"}
                      target={article.isInternal ? undefined : "_blank"}
                      rel={article.isInternal ? undefined : "noopener noreferrer"}
                      className="group block"
                    >
                      <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all duration-300 hover:border-slate-200 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-slate-700 dark:hover:bg-slate-900/50">
                        <div className="relative z-10 flex gap-4 p-4">
                          {/* Compact image on the side */}
                          {article.imageUrl && (
                            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                              <Image
                                src={article.imageUrl || ""}
                                alt={article.title}
                                width={160}
                                height={160}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                unoptimized
                              />
                            </div>
                          )}

                          {/* Content */}
                          <div className="flex flex-1 flex-col gap-2">
                            <div className="space-y-1">
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                  {article.category}
                                </span>
                              </div>
                              <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                {article.title}
                              </h3>
                            </div>

                            <div className="mt-auto flex items-center justify-between">
                              <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 transition-colors group-hover:text-blue-700 dark:text-blue-400 dark:group-hover:text-blue-300">
                                {article.isInternal ? "Read" : "View"}
                                <ArrowUpRight className="h-2.5 w-2.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
