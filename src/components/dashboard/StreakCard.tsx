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
      <Card className="w-full rounded-[24px] border border-transparent bg-white/90 shadow-[0_18px_32px_-18px_rgba(15,23,42,0.25)] backdrop-blur transition-shadow duration-300 hover:shadow-[0_25px_50px_-12px_rgba(15,23,42,0.35)] dark:border-white/5 dark:bg-slate-900/75">
        <CardBody className="flex h-full flex-col gap-6 p-8 lg:p-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Your streak</h2>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Consistency
              </p>
            </div>
            <motion.div
              className="flex items-center gap-2 rounded-full bg-orange-100/70 px-4 py-2 text-xs font-medium text-orange-600 dark:bg-orange-500/15 dark:text-orange-300"
              animate={isMilestone ? "celebrate" : "initial"}
              variants={celebrationVariants}
            >
              <Sparkles className="h-4 w-4" /> Keep glowing
            </motion.div>
          </div>

        <div className="flex-1">
          {currentStreak === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex h-full flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-slate-300/70 p-8 text-center dark:border-slate-700/70"
            >
              <Flame className="h-14 w-14 text-orange-400" />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {getStreakMessage(0)}
              </p>
            </motion.div>
          ) : (
            <div className="flex h-full flex-col gap-6">
              <div className="grid items-end gap-6 sm:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 p-6 text-white shadow-[0_18px_35px_-18px_rgba(234,179,8,0.6)] transition-shadow hover:shadow-[0_25px_50px_-12px_rgba(234,179,8,0.7)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm uppercase tracking-[0.2em] text-white/70">
                      Current
                    </span>
                    <Flame className="h-5 w-5 text-white" />
                  </div>
                  <p className="mt-3 text-5xl font-bold tabular-nums">{animatedCurrent}</p>
                  <p className="mt-1 text-xs text-white/70">Day streak</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="rounded-2xl border border-slate-200 bg-white/70 p-6 text-slate-900 shadow-inner transition-shadow hover:shadow-[0_18px_35px_-18px_rgba(15,23,42,0.3)] dark:border-slate-700 dark:bg-slate-900/70 dark:text-white"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                      Personal best
                    </span>
                    <Trophy className="h-5 w-5 text-amber-400" />
                  </div>
                  <p className="mt-3 text-4xl font-semibold tabular-nums">{animatedLongest}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Longest run so far</p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-auto space-y-3"
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                  <span>Progress</span>
                  <span>{completion}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completion}%` }}
                    transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 shadow-[0_5px_15px_rgba(249,115,22,0.45)]"
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
