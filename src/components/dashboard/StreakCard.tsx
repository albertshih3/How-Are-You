"use client";

import { Card, CardBody } from "@nextui-org/react";
import { Flame, Sparkles, Trophy } from "lucide-react";

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakCard({ currentStreak, longestStreak }: StreakCardProps) {
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

  return (
    <Card className="w-full rounded-[24px] border border-transparent bg-white/90 shadow-[0_18px_32px_-18px_rgba(15,23,42,0.25)] backdrop-blur dark:border-white/5 dark:bg-slate-900/75 min-h-[240px] sm:min-h-[260px] lg:min-h-[280px]">
      <CardBody className="flex h-full flex-col gap-4 p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Your streak</h2>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Consistency
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-orange-100/70 px-3 py-1 text-xs font-medium text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
            <Sparkles className="h-4 w-4" /> Keep glowing
          </div>
        </div>

        <div className="flex-1">
          {currentStreak === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-300/70 p-6 text-center dark:border-slate-700/70">
              <Flame className="h-12 w-12 text-orange-400" />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {getStreakMessage(0)}
              </p>
            </div>
          ) : (
            <div className="flex h-full flex-col gap-5">
              <div className="grid items-end gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 p-5 text-white shadow-[0_18px_35px_-18px_rgba(234,179,8,0.6)]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm uppercase tracking-[0.2em] text-white/70">
                      Current
                    </span>
                    <Flame className="h-5 w-5 text-white" />
                  </div>
                  <p className="mt-2 text-4xl font-bold">{currentStreak}</p>
                  <p className="text-xs text-white/70">Day streak</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 text-slate-900 shadow-inner dark:border-slate-700 dark:bg-slate-900/70 dark:text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-sm uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                      Personal best
                    </span>
                    <Trophy className="h-5 w-5 text-amber-400" />
                  </div>
                  <p className="mt-2 text-3xl font-semibold">{longestStreak}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Longest run so far</p>
                </div>
              </div>

              <div className="mt-auto space-y-2">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                  <span>Progress</span>
                  <span>{completion}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 shadow-[0_5px_15px_rgba(249,115,22,0.45)]"
                    style={{ width: `${completion}%` }}
                  />
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {getStreakMessage(currentStreak)}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
