"use client";

import { Card, CardBody, Button, Chip } from "@nextui-org/react";
import Link from "next/link";
import Image from "next/image";
import { BookMarked } from "lucide-react";

interface Article {
  _id: string;
  _creationTime: number;
  title: string;
  description: string;
  imageUrl?: string;
  externalLink: string;
  tags: string[];
  category: string;
}

interface ArticlesSectionProps {
  articles: Article[];
  moodLabel?: string;
}

export function ArticlesSection({ articles, moodLabel }: ArticlesSectionProps) {
  if (articles.length === 0) {
    return (
      <Card className="w-full rounded-[24px] border border-transparent bg-white/90 shadow-[0_18px_32px_-18px_rgba(15,23,42,0.25)] backdrop-blur dark:border-white/5 dark:bg-slate-900/75 min-h-[240px] sm:min-h-[260px] lg:min-h-[280px]">
        <CardBody className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <BookMarked className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-semibold">Curated Resources</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Once you start logging, we&apos;ll surface fresh reads tailored to your current focus.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full rounded-[24px] border border-transparent bg-white/90 shadow-[0_18px_32px_-18px_rgba(15,23,42,0.25)] backdrop-blur dark:border-white/5 dark:bg-slate-900/75 min-h-[240px] sm:min-h-[260px] lg:min-h-[280px]">
      <CardBody className="flex h-full flex-col gap-4 p-5 sm:p-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                Ritual picks
              </p>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Curated Resources
              </h2>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              For you
            </div>
          </div>
          {moodLabel && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Inspired by how you recently felt: <span className="font-medium text-slate-700 dark:text-slate-200">{moodLabel}</span>
            </p>
          )}
        </div>

        <div className="flex-1 space-y-4">
          {articles.map((article) => (
            <div
              key={article._id}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-[0_15px_30px_-18px_rgba(15,23,42,0.25)] transition duration-200 hover:-translate-y-1 hover:border-slate-300/90 hover:shadow-[0_25px_45px_-20px_rgba(30,64,175,0.45)] dark:border-slate-700/60 dark:bg-slate-900/80 dark:hover:border-slate-600"
            >
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-slate-100/80 via-white/20 to-transparent opacity-0 transition duration-300 group-hover:opacity-100 dark:from-slate-800/70" />

              <div className="relative z-10 flex flex-col gap-4">
                {article.imageUrl && (
                  <div className="relative overflow-hidden rounded-xl border border-slate-200/70 bg-slate-100/60 dark:border-slate-700/60 dark:bg-slate-800/70">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      width={640}
                      height={320}
                      className="h-36 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                      unoptimized
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {article.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {article.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {article.tags.slice(0, 3).map((tag) => (
                      <Chip
                        key={tag}
                        size="sm"
                        variant="flat"
                        radius="full"
                        className="bg-slate-100/80 text-xs font-medium text-slate-600 dark:bg-slate-800/80 dark:text-slate-300"
                      >
                        {tag}
                      </Chip>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                      {article.category}
                    </span>
                    <Button
                      as={Link}
                      href={article.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="sm"
                      variant="flat"
                      color="primary"
                      className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-[0_10px_25px_-12px_rgba(59,130,246,0.65)] transition duration-200 hover:from-blue-400 hover:to-indigo-400"
                    >
                      Read more
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
