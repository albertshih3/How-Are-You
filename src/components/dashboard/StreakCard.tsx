"use client";

import { Card, CardBody } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Flame, Sparkles, Trophy } from "lucide-react";
import {
  useCountUp,
  hoverLift,
  celebrationVariants,
  scaleFadeVariants
} from "@/lib/animations";

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakCard({ currentStreak, longestStreak }: StreakCardProps) {
  // Animated counters for numbers
  const animatedCurrent = useCountUp(currentStreak, 800, currentStreak > 0);
  const animatedLongest = useCountUp(longestStreak, 800, longestStreak > 0);

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "Start your first entry to begin your streak!";
    if (streak === 1) return "Great start! Keep it going!";
    if (streak < 7) return "You're building a habit!";
    if (streak < 30) return "Amazing consistency!";
    return "You're on fire! 🔥";
  };

  const completion =
    longestStreak > 0
      ? Math.min(Math.round((currentStreak / longestStreak) * 100), 100)
      : currentStreak > 0
        ? 60
        : 0;

  // Check for milestone streaks (7, 30, 100 days)
  const isMilestone = [7, 30, 100].includes(currentStreak);

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
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your streak</h2>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Consistency
              </p>
            </div>
            <motion.div
              className="flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
              animate={isMilestone ? "celebrate" : "initial"}
              variants={celebrationVariants}
            >
              <Sparkles className="h-3.5 w-3.5" /> Keep glowing
            </motion.div>
          </div>

          <div className="flex-1">
            {currentStreak === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-900/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-500 dark:bg-orange-500/20">
                  <Flame className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {getStreakMessage(0)}
                </p>
              </motion.div>
            ) : (
              <div className="flex h-full flex-col gap-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="rounded-2xl bg-orange-50 p-5 dark:bg-orange-500/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-orange-600/70 dark:text-orange-400/70">
                        Current
                      </span>
                      <Flame className="h-4 w-4 text-orange-500" />
                    </div>
                    <p className="text-4xl font-bold text-orange-600 dark:text-orange-400 tabular-nums tracking-tight">{animatedCurrent}</p>
                    <p className="mt-1 text-xs font-medium text-orange-600/60 dark:text-orange-400/60">Day streak</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Best
                      </span>
                      <Trophy className="h-4 w-4 text-amber-500" />
                    </div>
                    <p className="text-4xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">{animatedLongest}</p>
                    <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">Longest run</p>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-auto space-y-3"
                >
                  <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <span>Progress</span>
                    <span>{completion}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completion}%` }}
                      transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full bg-orange-500"
                    />
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {getStreakMessage(currentStreak)}
                  </p>
                </motion.div>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
