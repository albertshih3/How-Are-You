"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { api } from "@convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Button } from "@nextui-org/react";
import {
  CalendarDays,
  Clock3,
  Flame,
  Sparkles,
  TrendingUp,
  Lock,
} from "lucide-react";

import { MOOD_TYPES, type MoodType } from "@/lib/constants/moods";
import { StreakCard } from "./StreakCard";
import { LogEntryDialog } from "./LogEntryDialog";
import { RecentEntriesList } from "./RecentEntriesList";
import { ArticlesSection } from "./ArticlesSection";
import { InsightsCard } from "./InsightsCard";
import { useEncryption } from "@/contexts/EncryptionContext";
import { SetupEncryptionDialog } from "@/components/encryption/SetupEncryptionDialog";
import { UnlockEncryptionDialog } from "@/components/encryption/UnlockEncryptionDialog";

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

export function Dashboard() {
  const { user, isLoaded } = useUser();
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const { hasSetup, isUnlocked, isLoading: encryptionLoading } = useEncryption();

  const streakData = useQuery(api.streaks.getStreakData);
  const recentEntries = useQuery(api.entries.getRecentEntries, { limit: 8 });
  const articles = useQuery(api.articles.getRecommendedArticles, { limit: 3 });

  const { quickStats, heroMessage, lastCheckInMood } = useMemo(() => {
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const entries = (recentEntries ?? []) as Entry[];
    const weeklyEntries = entries.filter((entry) => entry.timestamp >= sevenDaysAgo);
    const averageIntensity =
      weeklyEntries.length > 0
        ? (
            weeklyEntries.reduce((sum, entry) => sum + entry.moodIntensity, 0) /
            weeklyEntries.length
          ).toFixed(1)
        : null;
    const lastEntry = entries[0];
    const lastEntryMood = lastEntry
      ? MOOD_TYPES[lastEntry.moodType as MoodType]
      : null;
    const lastCheckInDistance = lastEntry
      ? formatDistanceToNow(new Date(lastEntry.timestamp), { addSuffix: true })
      : null;

    const stats = [
      {
        id: "streak",
        label: "Current streak",
        value: `${streakData?.currentStreak ?? 0} days`,
        helper:
          (streakData?.currentStreak ?? 0) > 0
            ? "Momentum looks great."
            : "Start your first streak today.",
        icon: Flame,
      },
      {
        id: "weekly",
        label: "Entries this week",
        value: weeklyEntries.length > 0 ? weeklyEntries.length : "—",
        helper:
          weeklyEntries.length >= 5
            ? "You’ve checked in almost every day."
            : weeklyEntries.length > 0
              ? "Keep the habit going."
              : "Log a few entries to unlock insights.",
        icon: CalendarDays,
      },
      {
        id: "intensity",
        label: "Average intensity",
        value: averageIntensity ? `${averageIntensity}/10` : "—",
        helper:
          averageIntensity && Number(averageIntensity) >= 7
            ? "Big feelings lately—remember to recharge."
            : averageIntensity
              ? "Nice balance. Keep noticing the subtle shifts."
              : "Intensity trends appear after a few logs.",
        icon: TrendingUp,
      },
      {
        id: "last",
        label: "Last check-in",
        value: lastCheckInDistance ?? "No logs yet",
        helper: lastEntryMood ? lastEntryMood.label : "Tap the button below to begin.",
        icon: Clock3,
      },
    ];

    const message = lastEntryMood
      ? `You last felt ${lastEntryMood.label.toLowerCase()} ${lastCheckInDistance}.`
      : weeklyEntries.length >= 3
        ? "You’re building a mindful routine—keep going."
        : "Take a mindful moment and check in with yourself.";

    return {
      quickStats: stats,
      heroMessage: message,
      lastCheckInMood: lastEntryMood?.label,
    };
  }, [recentEntries, streakData]);

  if (!isLoaded || encryptionLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  const firstName = user?.firstName || "there";

  // Show setup dialog if encryption is not set up
  const shouldShowSetup = !hasSetup && isLoaded;

  // Show unlock dialog if encryption is set up but not unlocked
  const shouldShowUnlock = hasSetup && !isUnlocked;

  return (
    <>
      {/* Encryption Dialogs */}
      <SetupEncryptionDialog
        open={shouldShowSetup || showSetupDialog}
        onOpenChange={setShowSetupDialog}
      />
      <UnlockEncryptionDialog open={shouldShowUnlock} />

      <div className="relative isolate">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[10%] top-0 h-64 w-64 rounded-full bg-gradient-to-b from-sky-300/30 to-transparent blur-3xl dark:from-sky-500/20" />
        <div className="absolute right-[5%] top-24 h-72 w-72 rounded-full bg-gradient-to-t from-indigo-400/30 via-purple-400/20 to-transparent blur-3xl dark:from-indigo-500/20" />
        <div className="absolute bottom-0 left-1/2 h-64 w-[80%] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-300/20 via-cyan-200/10 to-transparent blur-3xl dark:from-blue-500/20" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-8 py-10 text-white shadow-[0_25px_60px_-20px_rgba(79,70,229,0.55)] dark:border-white/10 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff33_0,transparent_45%)] opacity-80" />
          <div className="absolute -right-24 top-0 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-32 left-16 h-64 w-64 rounded-full bg-purple-500/30 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-white/70">
                <Sparkles className="h-4 w-4" /> Daily pulse
              </span>
              <h1 className="text-3xl font-semibold sm:text-4xl">
                Hey {firstName}, ready for your next check-in?
              </h1>
              <p className="text-base text-white/80 sm:text-lg">{heroMessage}</p>
              {isUnlocked && (
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Lock className="h-3 w-3" />
                  <span>End-to-end encrypted</span>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <LogEntryDialog>
                  <Button
                    size="lg"
                    className="group flex items-center gap-2 rounded-2xl bg-white/20 px-6 py-6 text-base font-semibold text-white backdrop-blur transition duration-200 hover:bg-white/30"
                  >
                    <Sparkles className="h-5 w-5 transition-transform duration-200 group-hover:rotate-12" />
                    Log a check-in
                  </Button>
                </LogEntryDialog>
                <Button
                  as={Link}
                  href="/account"
                  variant="flat"
                  size="lg"
                  className="rounded-2xl border border-white/40 bg-white/10 px-6 py-6 text-base font-semibold text-white hover:bg-white/20"
                >
                  View profile
                </Button>
              </div>
            </div>

            <div className="grid w-full gap-4 sm:grid-cols-2">
              {quickStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.id}
                    className="group relative overflow-hidden rounded-2xl border border-white/25 bg-white/10 p-5 shadow-lg shadow-black/10 backdrop-blur transition duration-200 hover:border-white/40"
                  >
                    <div className="absolute inset-x-0 -top-24 h-48 bg-gradient-to-b from-white/50 via-white/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                    <div className="relative z-10 flex items-start gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="space-y-1">
                        <p className="text-xs font-medium uppercase tracking-wide text-white/70">
                          {stat.label}
                        </p>
                        <p className="text-lg font-semibold">{stat.value}</p>
                        <p className="text-xs text-white/70">{stat.helper}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="mt-12 grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-1">
            <StreakCard
              currentStreak={streakData?.currentStreak ?? 0}
              longestStreak={streakData?.longestStreak ?? 0}
            />
            <InsightsCard entries={(recentEntries ?? []) as Entry[]} />
          </div>

          <div className="xl:col-span-1">
            <RecentEntriesList entries={(recentEntries ?? []) as Entry[]} />
          </div>

          <div className="xl:col-span-1">
            <ArticlesSection articles={articles ?? []} moodLabel={lastCheckInMood} />
          </div>
        </div>
      </div>

      <div className="fixed bottom-5 right-5 z-50 lg:hidden">
        <LogEntryDialog>
          <Button
            isIconOnly
            size="lg"
            className="h-14 w-14 rounded-2xl bg-blue-600 text-2xl font-semibold text-white shadow-lg shadow-blue-500/40 transition duration-200 hover:bg-blue-500"
          >
            +
          </Button>
        </LogEntryDialog>
      </div>
    </div>
    </>
  );
}
