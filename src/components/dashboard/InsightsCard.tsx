"use client";

import { Card, CardBody } from "@nextui-org/react";
import { motion } from "framer-motion";
import {
  Activity,
  CalendarCheck2,
  LineChart,
  Sparkles,
} from "lucide-react";

import { MOOD_TYPES, type MoodType } from "@/lib/constants/moods";
import {
  useCountUp,
  useCountUpDecimal,
  hoverLift,
  scaleFadeVariants,
  getStaggerDelay
} from "@/lib/animations";
import { Doc } from "@convex/_generated/dataModel";

interface InsightsCardProps {
  entries: Doc<"entries">[];
}

export function InsightsCard({ entries }: InsightsCardProps) {
  // Calculate insights from last 7 days
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weeklyEntries = entries.filter((e) => e.timestamp >= sevenDaysAgo);

  // Calculate all values and hooks BEFORE any early returns (React Rules of Hooks)
  const hasEntries = weeklyEntries.length > 0;

  // Calculate most common mood
  const moodCounts: Record<string, number> = {};
  weeklyEntries.forEach((entry) => {
    moodCounts[entry.moodType] = (moodCounts[entry.moodType] || 0) + 1;
  });

  const mostCommonMood = hasEntries
    ? Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]
    : null;

  const mostCommonMoodData = mostCommonMood
    ? MOOD_TYPES[mostCommonMood[0] as MoodType]
    : null;

  // Calculate average intensity
  const avgIntensity = hasEntries
    ? weeklyEntries.reduce((sum, entry) => sum + entry.moodIntensity, 0) /
      weeklyEntries.length
    : 0;

  const intensityPercent = Math.round((avgIntensity / 10) * 100);

  // Animated counts - hooks must be called unconditionally
  const animatedEntryCount = useCountUp(weeklyEntries.length, 800);
  const animatedAvgIntensity = useCountUpDecimal(avgIntensity, 800, 1);

  // Early return AFTER all hooks are called
  if (!hasEntries) {
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
            <LineChart className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Weekly insights
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Your trends appear once you log a few entries this week.
          </p>
        </CardBody>
      </Card>
      </motion.div>
    );
  }

  const getMessage = () => {
    if (weeklyEntries.length >= 7) {
      return "Amazing! You've logged every day this week.";
    } else if (weeklyEntries.length >= 5) {
      return "Great consistency! Keep it up.";
    } else if (weeklyEntries.length >= 3) {
      return "You're building a healthy habit.";
    } else {
      return "Try to log more regularly for better insights.";
    }
  };

  const intensityValues = weeklyEntries
    .slice(0, 6)
    .map((entry) => entry.moodIntensity);
  const intensityBars = intensityValues
    .concat(Array.from({ length: Math.max(0, 6 - intensityValues.length) }, () => 0))
    .slice(0, 6);
  const maxBarHeight = 72;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={scaleFadeVariants}
      whileHover={hoverLift}
    >
      <Card className="w-full rounded-[24px] border border-transparent bg-white/90 shadow-[0_18px_32px_-18px_rgba(15,23,42,0.25)] backdrop-blur transition-shadow duration-300 hover:shadow-[0_25px_50px_-12px_rgba(15,23,42,0.35)] dark:border-white/5 dark:bg-slate-900/75">
        <CardBody className="flex h-full flex-col gap-7 p-9 lg:p-11 xl:gap-8 xl:p-12">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                Weekly insights
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                Your emotional trends
              </h2>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {weeklyEntries.length} logs
            </div>
          </div>

          <div className="grid flex-1 gap-7 sm:grid-cols-2 xl:gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: getStaggerDelay(0, 0.15) }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="group rounded-2xl border border-slate-200 bg-blue-50/70 p-5 shadow-inner transition duration-300 hover:border-blue-200 hover:shadow-[0_18px_35px_-20px_rgba(59,130,246,0.45)] dark:border-slate-700 dark:bg-blue-500/10"
            >
            <div className="flex items-center gap-3 text-blue-600 dark:text-blue-300">
              <CalendarCheck2 className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em]">Consistency</span>
            </div>
            <p className="mt-3 text-3xl font-semibold tabular-nums text-blue-700 dark:text-blue-200">
              {animatedEntryCount}
            </p>
            <p className="text-xs text-blue-700/70 dark:text-blue-200/70">Entries this week</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: getStaggerDelay(1, 0.15) }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="group rounded-2xl border border-slate-200 bg-purple-50/70 p-5 shadow-inner transition duration-300 hover:border-purple-200 hover:shadow-[0_18px_35px_-20px_rgba(124,58,237,0.45)] dark:border-slate-700 dark:bg-purple-500/10"
          >
            <div className="flex items-center gap-3 text-purple-600 dark:text-purple-300">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em]">Mood</span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-3xl">{mostCommonMoodData!.emoji}</span>
              <div>
                <p className="text-base font-semibold text-purple-700 dark:text-purple-200">
                  {mostCommonMoodData!.label}
                </p>
                <p className="text-xs text-purple-700/70 dark:text-purple-200/70">
                  Most common feeling
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: getStaggerDelay(2, 0.15) }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 shadow-inner transition duration-300 hover:shadow-[0_18px_35px_-20px_rgba(15,23,42,0.3)] dark:border-slate-700 dark:bg-slate-900/70"
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">Intensity</span>
              <Activity className="h-4 w-4" />
            </div>
            <p className="mt-3 text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">
              {animatedAvgIntensity}/10
            </p>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${intensityPercent}%` }}
                transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 shadow-[0_5px_14px_rgba(56,189,248,0.45)]"
              />
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              {intensityPercent >= 70
                ? "Energy running high—remember to rest."
                : intensityPercent <= 30
                  ? "A gentle week—keep checking in."
                  : "A balanced range of emotions."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: getStaggerDelay(3, 0.15) }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 shadow-inner transition duration-300 hover:shadow-[0_18px_35px_-20px_rgba(15,23,42,0.3)] dark:border-slate-700 dark:bg-slate-900/70"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Mood pulse
            </span>
            <div className="mt-4 flex items-end justify-between gap-2">
              {intensityBars.map((value, index) => {
                const barHeight = value > 0 ? (value / 10) * maxBarHeight : maxBarHeight * 0.15;
                return (
                  <motion.div
                    key={`intensity-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: `${Math.max(barHeight, 8)}px`,
                      opacity: 1
                    }}
                    transition={{
                      delay: 0.6 + index * 0.05,
                      duration: 0.5,
                      ease: "easeOut"
                    }}
                    className="relative flex-1 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800"
                  >
                    <div
                      className="absolute bottom-0 left-0 right-0 rounded-full bg-gradient-to-t from-indigo-500 via-sky-500 to-cyan-400"
                      style={{ height: `${value === 0 ? 0 : 100}%` }}
                    />
                  </motion.div>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Most recent entries ordered left to right.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-auto rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-5 text-center text-sm font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300"
        >
          {getMessage()}
        </motion.div>
      </CardBody>
    </Card>
    </motion.div>
  );
}
