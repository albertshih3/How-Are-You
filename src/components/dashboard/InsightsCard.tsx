"use client";

import { Card, CardBody } from "@nextui-org/react";
import {
  Activity,
  CalendarCheck2,
  LineChart,
  Sparkles,
} from "lucide-react";

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

interface InsightsCardProps {
  entries: Entry[];
}

export function InsightsCard({ entries }: InsightsCardProps) {
  // Calculate insights from last 7 days
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weeklyEntries = entries.filter((e) => e.timestamp >= sevenDaysAgo);

  if (weeklyEntries.length === 0) {
    return (
      <Card className="w-full rounded-[24px] border border-transparent bg-white/90 shadow-[0_18px_32px_-18px_rgba(15,23,42,0.25)] backdrop-blur dark:border-white/5 dark:bg-slate-900/75 min-h-[240px] sm:min-h-[260px] lg:min-h-[280px]">
        <CardBody className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
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
    );
  }

  // Calculate most common mood
  const moodCounts: Record<string, number> = {};
  weeklyEntries.forEach((entry) => {
    moodCounts[entry.moodType] = (moodCounts[entry.moodType] || 0) + 1;
  });

  const mostCommonMood = Object.entries(moodCounts).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const mostCommonMoodData = MOOD_TYPES[mostCommonMood[0] as MoodType];

  // Calculate average intensity
  const avgIntensity =
    weeklyEntries.reduce((sum, entry) => sum + entry.moodIntensity, 0) /
    weeklyEntries.length;

  const intensityPercent = Math.round((avgIntensity / 10) * 100);

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
    <Card className="w-full rounded-[24px] border border-transparent bg-white/90 shadow-[0_18px_32px_-18px_rgba(15,23,42,0.25)] backdrop-blur dark:border-white/5 dark:bg-slate-900/75 min-h-[240px] sm:min-h-[260px] lg:min-h-[280px]">
      <CardBody className="flex h-full flex-col gap-4 p-5 sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
              Weekly insights
            </p>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Your emotional trends
            </h2>
          </div>
          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {weeklyEntries.length} logs
          </div>
        </div>

        <div className="grid flex-1 gap-4 sm:grid-cols-2">
          <div className="group rounded-2xl border border-slate-200 bg-blue-50/70 p-4 shadow-inner transition duration-200 hover:border-blue-200 hover:shadow-[0_18px_35px_-20px_rgba(59,130,246,0.45)] dark:border-slate-700 dark:bg-blue-500/10">
            <div className="flex items-center gap-3 text-blue-600 dark:text-blue-300">
              <CalendarCheck2 className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em]">Consistency</span>
            </div>
            <p className="mt-3 text-3xl font-semibold text-blue-700 dark:text-blue-200">
              {weeklyEntries.length}
            </p>
            <p className="text-xs text-blue-700/70 dark:text-blue-200/70">Entries this week</p>
          </div>

          <div className="group rounded-2xl border border-slate-200 bg-purple-50/70 p-4 shadow-inner transition duration-200 hover:border-purple-200 hover:shadow-[0_18px_35px_-20px_rgba(124,58,237,0.45)] dark:border-slate-700 dark:bg-purple-500/10">
            <div className="flex items-center gap-3 text-purple-600 dark:text-purple-300">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em]">Mood</span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-3xl">{mostCommonMoodData.emoji}</span>
              <div>
                <p className="text-base font-semibold text-purple-700 dark:text-purple-200">
                  {mostCommonMoodData.label}
                </p>
                <p className="text-xs text-purple-700/70 dark:text-purple-200/70">
                  Most common feeling
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-inner dark:border-slate-700 dark:bg-slate-900/70">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">Intensity</span>
              <Activity className="h-4 w-4" />
            </div>
            <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">
              {avgIntensity.toFixed(1)}/10
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 shadow-[0_5px_14px_rgba(56,189,248,0.45)]"
                style={{ width: `${intensityPercent}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              {intensityPercent >= 70
                ? "Energy running high—remember to rest."
                : intensityPercent <= 30
                  ? "A gentle week—keep checking in."
                  : "A balanced range of emotions."}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-inner dark:border-slate-700 dark:bg-slate-900/70">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Mood pulse
            </span>
            <div className="mt-4 flex items-end justify-between gap-2">
              {intensityBars.map((value, index) => {
                const barHeight = value > 0 ? (value / 10) * maxBarHeight : maxBarHeight * 0.15;
                return (
                  <div
                    key={`intensity-${index}`}
                    className="relative flex-1 overflow-hidden rounded-full bg-slate-200/80 transition-[height] duration-200 ease-out dark:bg-slate-800"
                    style={{ height: `${Math.max(barHeight, 8)}px` }}
                  >
                    <div
                      className="absolute bottom-0 left-0 right-0 rounded-full bg-gradient-to-t from-indigo-500 via-sky-500 to-cyan-400"
                      style={{ height: `${value === 0 ? 0 : 100}%` }}
                    />
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Most recent entries ordered left to right.
            </p>
          </div>
        </div>

        <div className="mt-auto rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-5 text-center text-sm font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
          {getMessage()}
        </div>
      </CardBody>
    </Card>
  );
}
