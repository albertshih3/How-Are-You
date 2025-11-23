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
        <Card className="w-full rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
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
      <Card className="w-full rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
        <CardBody className="flex h-full flex-col gap-6 p-6 xl:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Weekly insights</h2>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Your trends
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              <span className="font-bold">{weeklyEntries.length}</span> logs
            </div>
          </div>

          <div className="grid flex-1 gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            {/* Consistency Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: getStaggerDelay(0, 0.15) }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="group flex flex-col justify-between rounded-2xl bg-blue-50 p-5 transition duration-300 dark:bg-blue-500/10"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600/70 dark:text-blue-400/70">Consistency</span>
                <CalendarCheck2 className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-4xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                  {animatedEntryCount}
                </p>
                <p className="mt-1 text-xs font-medium text-blue-600/60 dark:text-blue-400/60">Entries this week</p>
              </div>
            </motion.div>

            {/* Mood Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: getStaggerDelay(1, 0.15) }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="group flex flex-col justify-between rounded-2xl bg-purple-50 p-5 transition duration-300 dark:bg-purple-500/10"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-600/70 dark:text-purple-400/70">Mood</span>
                <Sparkles className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl drop-shadow-sm">{mostCommonMoodData?.emoji || "—"}</span>
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {mostCommonMoodData?.label || "No data"}
                  </span>
                </div>
                <p className="mt-1 text-xs font-medium text-purple-600/60 dark:text-purple-400/60">
                  Most common
                </p>
              </div>
            </motion.div>

            {/* Intensity Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: getStaggerDelay(2, 0.15) }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50 p-5 transition duration-300 dark:border-slate-800 dark:bg-slate-800/50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Intensity</span>
                <Activity className="h-4 w-4 text-slate-400" />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{animatedAvgIntensity}</span>
                  <span className="text-xl font-medium text-slate-400">/10</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${intensityPercent}%` }}
                    transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-slate-900 dark:bg-white"
                  />
                </div>
              </div>
            </motion.div>

            {/* Mood Pulse Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: getStaggerDelay(3, 0.15) }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50 p-5 transition duration-300 dark:border-slate-800 dark:bg-slate-800/50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Pulse
                </span>
                <LineChart className="h-4 w-4 text-slate-400" />
              </div>
              <div className="flex items-end justify-between gap-2 h-12">
                {intensityBars.map((value, index) => {
                  const barHeight = value > 0 ? (value / 10) * 100 : 15;
                  return (
                    <motion.div
                      key={`intensity-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: `${barHeight}%`,
                        opacity: 1
                      }}
                      transition={{
                        delay: 0.6 + index * 0.05,
                        duration: 0.5,
                        ease: "easeOut"
                      }}
                      className="relative flex-1 overflow-hidden rounded-sm bg-slate-200 dark:bg-slate-700"
                    >
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-slate-900 dark:bg-white"
                        style={{ height: `${value === 0 ? 0 : 100}%` }}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-auto text-center text-xs font-medium text-slate-500 dark:text-slate-400"
          >
            {getMessage()}
          </motion.div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
