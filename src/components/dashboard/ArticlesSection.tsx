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
      <Card className="w-full rounded-[24px] border border-transparent bg-white/90 shadow-[0_18px_32px_-18px_rgba(15,23,42,0.25)] backdrop-blur dark:border-white/5 dark:bg-slate-900/75">
        <CardBody className="flex h-full flex-col gap-6 p-8 lg:p-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                Ritual picks
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                Curated Resources
              </h2>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 text-xs font-medium text-blue-700 dark:from-blue-500/20 dark:to-purple-500/20 dark:text-blue-300">
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
              whileHover={{ y: -6, scale: 1.01 }}
            >
              <Link
                href={featuredArticle.isInternal ? `/articles/${featuredArticle._id}` : featuredArticle.externalLink || "#"}
                target={featuredArticle.isInternal ? undefined : "_blank"}
                rel={featuredArticle.isInternal ? undefined : "noopener noreferrer"}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 shadow-[0_20px_45px_-20px_rgba(15,23,42,0.3)] transition-all duration-300 hover:border-blue-300/70 hover:shadow-[0_30px_60px_-20px_rgba(59,130,246,0.45)] dark:border-slate-700/60 dark:bg-slate-900/80 dark:hover:border-blue-600/50">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-blue-100/60 via-white/20 to-transparent opacity-0 transition duration-300 group-hover:opacity-100 dark:from-blue-900/40" />

                  {/* Image with zoom effect */}
                  {featuredArticle.imageUrl && (
                    <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                        className="h-full w-full"
                      >
                        <Image
                          src={featuredArticle.imageUrl}
                          alt={featuredArticle.title}
                          width={800}
                          height={400}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      </motion.div>
                      {/* Gradient overlay on image */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                      {/* Category badge on image */}
                      <div className="absolute left-6 top-6">
                        <div className="rounded-full border border-white/30 bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
                          {featuredArticle.category}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="relative z-10 space-y-5 p-7">
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold leading-tight text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                        {featuredArticle.title}
                      </h3>
                      <p className="line-clamp-2 text-base text-slate-600 dark:text-slate-400">
                        {featuredArticle.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {featuredArticle.tags.slice(0, 4).map((tag, index) => (
                        <motion.div
                          key={tag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                        >
                          <Chip
                            size="sm"
                            variant="flat"
                            radius="full"
                            className="bg-slate-100 text-xs font-medium text-slate-600 transition-colors hover:bg-blue-100 hover:text-blue-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-300"
                          >
                            {tag}
                          </Chip>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {featuredArticle.isInternal && featuredArticle.authorName && (
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          By {featuredArticle.authorName}
                        </span>
                      )}
                      <div className="ml-auto flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors group-hover:text-blue-700 dark:text-blue-400 dark:group-hover:text-blue-300">
                        {featuredArticle.isInternal ? "Read article" : "Read more"}
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Regular Articles - Smaller cards */}
          {regularArticles.length > 0 && (
            <div className="space-y-5">
              {regularArticles.map((article, index) => (
                <motion.div
                  key={article._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: getStaggerDelay(index + 1, 0.12) }}
                  whileHover={{ y: -4, scale: 1.005 }}
                >
                  <Link
                    href={article.isInternal ? `/articles/${article._id}` : article.externalLink || "#"}
                    target={article.isInternal ? undefined : "_blank"}
                    rel={article.isInternal ? undefined : "noopener noreferrer"}
                    className="group block"
                  >
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 shadow-[0_15px_30px_-18px_rgba(15,23,42,0.25)] transition-all duration-300 hover:border-slate-300/90 hover:shadow-[0_25px_45px_-20px_rgba(30,64,175,0.45)] dark:border-slate-700/60 dark:bg-slate-900/80 dark:hover:border-slate-600">
                      {/* Hover gradient overlay */}
                      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-100/80 via-white/20 to-transparent opacity-0 transition duration-300 group-hover:opacity-100 dark:from-slate-800/60" />

                      <div className="relative z-10 flex gap-5 p-5">
                        {/* Compact image on the side */}
                        {article.imageUrl && (
                          <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200/70 bg-slate-100 dark:border-slate-700/60 dark:bg-slate-800">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.3 }}
                              className="h-full w-full"
                            >
                              <Image
                                src={article.imageUrl}
                                alt={article.title}
                                width={160}
                                height={120}
                                className="h-full w-full object-cover"
                                unoptimized
                              />
                            </motion.div>
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex flex-1 flex-col gap-3">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-3">
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                {article.category}
                              </span>
                            </div>
                            <h3 className="line-clamp-2 text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                              {article.title}
                            </h3>
                            <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                              {article.description}
                            </p>
                          </div>

                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex flex-wrap gap-1.5">
                              {article.tags.slice(0, 2).map((tag, tagIndex) => (
                                <motion.div
                                  key={tag}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.3 + tagIndex * 0.05 }}
                                >
                                  <Chip
                                    size="sm"
                                    variant="flat"
                                    radius="full"
                                    className="bg-slate-100 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                  >
                                    {tag}
                                  </Chip>
                                </motion.div>
                              ))}
                            </div>

                            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 transition-colors group-hover:text-blue-700 dark:text-blue-400 dark:group-hover:text-blue-300">
                              {article.isInternal ? "Read" : "View"}
                              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
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
