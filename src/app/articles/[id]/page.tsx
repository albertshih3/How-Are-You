import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User, Star } from "lucide-react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";

import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

// Helper function to calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Helper function to format date
function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    // Validate ID format (Convex IDs start with specific prefixes)
    if (!id || typeof id !== "string") {
      return {
        title: "Article Not Found",
      };
    }

    const article = await fetchQuery(api.articles.getArticleById, {
      articleId: id as Id<"articles">,
    });

    return {
      title: `${article.title} | How Are You`,
      description: article.description,
      openGraph: {
        title: article.title,
        description: article.description,
        type: "article",
        publishedTime: new Date(article.publishedAt).toISOString(),
        authors: [article.authorName || "How Are You Team"],
        tags: article.tags,
      },
    };
  } catch (error) {
    return {
      title: "Article Not Found",
    };
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;

  // Validate ID format
  if (!id || typeof id !== "string") {
    notFound();
  }

  let article;
  try {
    article = await fetchQuery(api.articles.getArticleById, {
      articleId: id as Id<"articles">,
    });
  } catch (error) {
    // Article not found or not published
    notFound();
  }

  // Double-check article exists and has content
  if (!article || !article.content || article.status !== "published") {
    notFound();
  }

  const readingTime = calculateReadingTime(article.content);
  const formattedDate = formatDate(article.publishedAt);
  const authorIcon = article.authorType === "admin" ? Star : User;
  const AuthorIcon = authorIcon;

  return (
    <div className="relative min-h-screen">
      {/* Background gradient effects */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[10%] top-0 h-64 w-64 rounded-full bg-gradient-to-b from-sky-300/20 to-transparent blur-3xl dark:from-sky-500/10" />
        <div className="absolute right-[5%] top-24 h-72 w-72 rounded-full bg-gradient-to-t from-indigo-400/20 via-purple-400/10 to-transparent blur-3xl dark:from-indigo-500/10" />
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back button and breadcrumb */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>

          <nav className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
            <Link
              href="/"
              className="transition-colors hover:text-gray-900 dark:hover:text-gray-300"
            >
              Home
            </Link>
            <span>/</span>
            <span>Articles</span>
            <span>/</span>
            <span className="truncate max-w-[200px]">{article.title}</span>
          </nav>
        </div>

        {/* Article header */}
        <header className="mb-12 space-y-6">
          {/* Category badge */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
              {article.category}
            </span>
          </div>

          {/* Title with gradient */}
          <h1 className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-4xl font-bold leading-tight text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 sm:text-5xl">
            {article.title}
          </h1>

          {/* Description */}
          <p className="text-xl leading-relaxed text-gray-600 dark:text-gray-400">
            {article.description}
          </p>

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-4 border-b border-gray-200 pb-6 dark:border-gray-800">
            {/* Author badge */}
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 backdrop-blur dark:border-gray-800 dark:bg-gray-900/30">
              <AuthorIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {article.authorName || "How Are You Team"}
              </span>
            </div>

            {/* Published date */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <time dateTime={new Date(article.publishedAt).toISOString()}>
                {formattedDate}
              </time>
            </div>

            {/* Reading time */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>{readingTime} min read</span>
            </div>
          </div>
        </header>

        {/* Article content with markdown rendering */}
        <main className="mb-16">
          <div className="rounded-2xl border border-white/20 bg-white/50 p-8 shadow-lg backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/30 sm:p-12">
            <MarkdownRenderer content={article.content} />
          </div>
        </main>

        {/* Footer section with tags */}
        {article.tags && article.tags.length > 0 && (
          <footer className="mb-12">
            <div className="rounded-2xl border border-white/20 bg-white/50 p-6 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/30">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Related Topics
              </h2>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-gray-300 bg-white/70 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-blue-500 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-300 dark:hover:border-blue-400 dark:hover:bg-blue-950/30"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        )}

        {/* Call to action */}
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 text-center shadow-lg dark:border-blue-900/30 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30">
          <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
            How are you feeling?
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Track your mental health journey with daily check-ins.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
