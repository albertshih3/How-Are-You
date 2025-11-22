"use client";

import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { RecentEntriesList } from "@/components/dashboard/RecentEntriesList";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function EntriesPage() {
  const entries = useQuery(api.entries.getAllUserEntries);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 px-4 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-48 top-0 h-96 w-96 rounded-full bg-gradient-to-br from-blue-200/30 to-indigo-200/30 blur-3xl dark:from-blue-900/20 dark:to-indigo-900/20" />
        <div className="absolute -right-48 bottom-0 h-96 w-96 rounded-full bg-gradient-to-br from-purple-200/30 to-pink-200/30 blur-3xl dark:from-purple-900/20 dark:to-pink-900/20" />
      </div>

      <div className="relative mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Link href="/">
            <Button
              variant="ghost"
              className="gap-2 pl-0 hover:bg-transparent hover:text-slate-900 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                <BookOpen className="h-7 w-7" />
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-4xl font-bold tracking-tight text-transparent dark:from-white dark:via-blue-100 dark:to-indigo-100">
                  Journal Entries
                </h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {entries === undefined
                    ? "Loading your entries..."
                    : entries.length === 0
                    ? "No entries yet"
                    : `${entries.length} ${entries.length === 1 ? "entry" : "entries"} total`}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {entries === undefined ? (
            <div className="flex h-64 items-center justify-center rounded-[24px] border border-white/20 bg-white/90 shadow-lg backdrop-blur dark:border-white/10 dark:bg-slate-900/75">
              <div className="text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-400" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Loading entries...
                </p>
              </div>
            </div>
          ) : entries.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-[24px] border border-white/20 bg-white/90 shadow-lg backdrop-blur dark:border-white/10 dark:bg-slate-900/75">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                  <BookOpen className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                  No entries yet
                </h3>
                <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
                  Start your journal by logging how you&apos;re feeling today
                </p>
                <Link href="/">
                  <Button className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-6 font-semibold text-white shadow-lg transition hover:opacity-90">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <RecentEntriesList entries={entries} />
          )}
        </motion.div>
      </div>
    </div>
  );
}
