"use client";

import { Card, CardBody, Chip } from "@nextui-org/react";
import { NotebookPen, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { MOOD_TYPES, type MoodType } from "@/lib/constants/moods";

interface Entry {
  _id: string;
  _creationTime: number;
  userId: string;
  timestamp: number;
  moodType: string;
  moodIntensity: number;
  notes?: string;
  tags?: string[];
}

interface RecentEntriesListProps {
  entries: Entry[];
}

export function RecentEntriesList({ entries }: RecentEntriesListProps) {
  if (entries.length === 0) {
    return (
      <Card className="w-full rounded-[24px] border border-transparent bg-white/90 shadow-[0_18px_32px_-18px_rgba(15,23,42,0.25)] backdrop-blur dark:border-white/5 dark:bg-slate-900/75 min-h-[240px] sm:min-h-[260px] lg:min-h-[280px]">
        <CardBody className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <NotebookPen className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent entries</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Your story begins with the next check-in. Capture a moment to see it here.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full rounded-[24px] border border-transparent bg-white/90 shadow-[0_18px_32px_-18px_rgba(15,23,42,0.25)] backdrop-blur dark:border-white/5 dark:bg-slate-900/75 min-h-[240px] sm:min-h-[260px] lg:min-h-[280px]">
      <CardBody className="flex h-full flex-col gap-4 p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
              Journal feed
            </p>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Recent entries
            </h2>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <Sparkles className="h-4 w-4" />
            {entries.length} total
          </div>
        </div>

        <div className="flex-1 space-y-4">
          {entries.map((entry) => {
            const moodData = MOOD_TYPES[entry.moodType as MoodType];
            const timeAgo = formatDistanceToNow(new Date(entry.timestamp), {
              addSuffix: true,
            });

            return (
              <div
                key={entry._id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.45)] transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_35px_60px_-30px_rgba(37,99,235,0.45)] dark:border-slate-700/70 dark:bg-slate-900/80 dark:hover:border-slate-600"
              >
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-slate-100/80 via-white/20 to-transparent opacity-0 transition duration-300 group-hover:opacity-100 dark:from-slate-800/60" />
                <div className="relative z-10 flex items-start gap-4">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-3xl shadow-inner dark:bg-slate-800">
                    {moodData.emoji}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-semibold text-slate-900 dark:text-white">
                        {moodData.label}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        Intensity {entry.moodIntensity}/10
                      </span>
                      <span className="ml-auto text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                        {timeAgo}
                      </span>
                    </div>

                    {entry.notes && (
                      <p className="text-sm text-slate-600 transition duration-200 dark:text-slate-400">
                        {entry.notes}
                      </p>
                    )}

                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {entry.tags.map((tag) => (
                          <Chip
                            key={tag}
                            size="sm"
                            radius="full"
                            variant="flat"
                            className="bg-slate-100/80 text-xs font-medium text-slate-600 dark:bg-slate-800/80 dark:text-slate-300"
                          >
                            #{tag}
                          </Chip>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
