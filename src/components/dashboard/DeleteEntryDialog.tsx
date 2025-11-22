"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Trash2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MOOD_TYPES, type MoodType } from "@/lib/constants/moods";
import { DecryptedEntry } from "@/types/entry";

interface DeleteEntryDialogProps {
  entry: DecryptedEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteEntryDialog({
  entry,
  open,
  onOpenChange,
  onSuccess,
}: DeleteEntryDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteEntry = useMutation(api.entries.deleteEntry);

  if (!entry) return null;

  const moodData = MOOD_TYPES[entry.moodType as MoodType];
  const formattedDate = format(new Date(entry.timestamp), "PPP 'at' p");
  const notesPreview = entry.decryptedNotes || entry.notes || "";
  const displayNotes =
    notesPreview.length > 100
      ? notesPreview.substring(0, 100) + "..."
      : notesPreview;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteEntry({ entryId: entry._id });
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden rounded-[2rem] border border-white/20 bg-white/95 p-0 shadow-[0_45px_120px_-45px_rgba(220,38,38,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/90">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <DialogHeader className="space-y-3 px-8 pt-8 pb-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
              Delete Entry?
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
              This action cannot be undone. This entry will be permanently
              removed from your journal.
            </DialogDescription>
          </DialogHeader>

          <div className="px-8 pb-8 space-y-6">
            {/* Entry Preview */}
            <div className="rounded-2xl border-2 border-slate-200 bg-white/60 p-5 dark:border-slate-700 dark:bg-slate-900/40">
              <div className="flex items-start gap-4 mb-3">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-3xl dark:bg-slate-800">
                  {moodData.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {moodData.label}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {formattedDate}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  Intensity {entry.moodIntensity}/10
                </span>
              </div>
              {displayNotes && (
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  {displayNotes}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isDeleting}
                className="rounded-2xl border-2 border-slate-300 bg-white/80 px-8 py-6 text-base font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-900/80"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-2xl bg-gradient-to-r from-red-600 to-red-700 px-12 py-6 text-base font-bold text-white shadow-[0_20px_50px_-12px_rgba(220,38,38,0.6)] transition hover:shadow-[0_25px_60px_-15px_rgba(220,38,38,0.7)] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isDeleting ? (
                  <span className="flex items-center gap-2">
                    Deleting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete Entry
                  </span>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
