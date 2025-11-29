"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { api } from "@convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Button } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
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
import { CommunityHighlights } from "./CommunityHighlights";
import { useEncryption } from "@/contexts/EncryptionContext";
import { SetupEncryptionDialog } from "@/components/encryption/SetupEncryptionDialog";
import { UnlockEncryptionDialog } from "@/components/encryption/UnlockEncryptionDialog";
import {
  fadeUpVariants,
  containerVariants,
  getStaggerDelay,
  hoverLift,
  tapScale
} from "@/lib/animations";
import { Doc } from "@convex/_generated/dataModel";

import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { DashboardTour } from "@/components/tour/DashboardTour";

export function Dashboard() {
  const { user, isLoaded } = useUser();
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const { hasSetup, isUnlocked, isLoading: encryptionLoading } = useEncryption();

  const userProfile = useQuery(api.users.getProfile);
  const streakData = useQuery(api.streaks.getStreakData);
  const recentEntries = useQuery(api.entries.getRecentEntries, { limit: 5 });
  const articles = useQuery(api.articles.getRecommendedArticles, { limit: 3 });

  const { quickStats, heroMessage, lastCheckInMood } = useMemo(() => {
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const entries = (recentEntries ?? []) as Doc<"entries">[];
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

  // Onboarding Logic
  const showOnboarding = userProfile && !userProfile.onboardingCompleted;
  const showTour = userProfile && userProfile.onboardingCompleted && !userProfile.tourCompleted;

  return (
    <>
      {/* Onboarding & Tour */}
      <AnimatePresence>
        {showOnboarding && <OnboardingFlow onComplete={() => { }} />}
        {showTour && <DashboardTour onComplete={() => { }} />}
      </AnimatePresence>

      {/* Encryption Dialogs */}
      <SetupEncryptionDialog
        open={shouldShowSetup || showSetupDialog}
        onOpenChange={setShowSetupDialog}
      />
      <UnlockEncryptionDialog open={shouldShowUnlock} />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Hero Section with Grid Background */}
        <div className="relative">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_bottom,black_95%,transparent)]"></div>

          <motion.div
            className="relative mx-auto w-full max-w-[115rem] px-6 pt-12 sm:px-8 lg:px-12 2xl:px-16"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.section
              variants={fadeUpVariants}
              className="mb-16 grid gap-12 lg:grid-cols-12 lg:items-center"
            >
              <div className="space-y-6 lg:col-span-7 2xl:col-span-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                  <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                  <span>Daily pulse</span>
                </div>

                <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                  Hey {firstName},<br />
                  <span className="text-slate-500 dark:text-slate-400">ready to check in?</span>
                </h1>

                <p className="text-lg text-slate-600 dark:text-slate-400">{heroMessage}</p>

                {isUnlocked && (
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                    <Lock className="h-3 w-3" />
                    <span>End-to-end encrypted</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <LogEntryDialog>
                    <Button
                      id="tour-log-entry-btn"
                      size="lg"
                      className="group flex items-center gap-2 rounded-full bg-slate-900 px-8 py-6 text-base font-semibold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/30 dark:bg-white dark:text-slate-900 dark:shadow-white/10 dark:hover:bg-slate-100"
                    >
                      <Sparkles className="h-5 w-5 transition-transform duration-200 group-hover:rotate-12" />
                      Log a check-in
                    </Button>
                  </LogEntryDialog>
                  <Button
                    as={Link}
                    href="/account"
                    variant="light"
                    size="lg"
                    className="rounded-full px-8 py-6 text-base font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    View profile
                  </Button>
                </div>
              </div>

              <div className="grid w-full gap-4 sm:grid-cols-2 lg:col-span-5 2xl:col-span-4">
                {quickStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: getStaggerDelay(index, 0.1),
                        duration: 0.5,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      whileHover={{ y: -2 }}
                      className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            <Icon className="h-5 w-5" />
                          </span>
                          <span className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            {stat.label}
                          </span>
                        </div>

                        <div>
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{stat.helper}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          </motion.div>
        </div>

        {/* Content Section with Solid Background */}
        <div className="relative bg-slate-50 dark:bg-slate-950">
          <div className="mx-auto w-full max-w-[115rem] px-6 pb-24 sm:px-8 lg:px-12 2xl:px-16">
            {/* Divider */}
            <div className="mb-12 flex justify-center pb-4 pt-0">
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-[2px] w-full bg-gradient-to-r from-transparent via-slate-400 to-transparent blur-[0.5px] dark:via-slate-600"
              />
            </div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="grid grid-cols-1 gap-8 lg:gap-12 xl:[grid-template-columns:1fr_1.5fr_1fr] 2xl:gap-16"
            >
              <motion.div
                variants={fadeUpVariants}
                transition={{ delay: getStaggerDelay(0) }}
                className="space-y-8"
              >
                <StreakCard
                  currentStreak={streakData?.currentStreak ?? 0}
                  longestStreak={streakData?.longestStreak ?? 0}
                />
                <div id="tour-insights-card">
                  <InsightsCard entries={(recentEntries ?? []) as Doc<"entries">[]} />
                </div>
              </motion.div>

              <motion.div
                variants={fadeUpVariants}
                transition={{ delay: getStaggerDelay(1) }}
                id="tour-recent-entries"
              >
                <RecentEntriesList entries={(recentEntries ?? []) as Doc<"entries">[]} />
              </motion.div>

              <motion.div
                variants={fadeUpVariants}
                transition={{ delay: getStaggerDelay(2) }}
              >
                <ArticlesSection articles={articles ?? []} moodLabel={lastCheckInMood} />
              </motion.div>
            </motion.div>

            {/* Community Highlights Section */}
            <motion.div
              variants={fadeUpVariants}
              transition={{ delay: getStaggerDelay(3) }}
              className="mt-8"
            >
              <CommunityHighlights />
            </motion.div>
          </div>
        </div>

        <div className="fixed bottom-6 right-6 z-50 lg:hidden">
          <LogEntryDialog>
            <Button
              isIconOnly
              size="lg"
              className="h-14 w-14 rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/30 transition-transform hover:scale-105 active:scale-95 dark:bg-white dark:text-slate-900"
            >
              +
            </Button>
          </LogEntryDialog>
        </div>
      </div>
    </>
  );
}
