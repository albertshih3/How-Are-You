"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, Chip } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { NotebookPen, Sparkles, Pencil, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { MOOD_TYPES, type MoodType } from "@/lib/constants/moods";
import { useEncryption } from "@/contexts/EncryptionContext";
import { decryptEntry } from "@/lib/crypto/encryption";
import {
  scaleFadeVariants,
  hoverLift,
  getStaggerDelay
} from "@/lib/animations";
import { LogEntryDialog } from "./LogEntryDialog";
import { DeleteEntryDialog } from "./DeleteEntryDialog";
import { DecryptedEntry } from "@/types/entry";
import { Doc } from "@convex/_generated/dataModel";

interface RecentEntriesListProps {
  entries: Doc<"entries">[];
}

export function RecentEntriesList({ entries }: RecentEntriesListProps) {
  const { decryptionKey, isUnlocked } = useEncryption();
  const [decryptedEntries, setDecryptedEntries] = useState<DecryptedEntry[]>([]);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [entryToEdit, setEntryToEdit] = useState<DecryptedEntry | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<DecryptedEntry | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Decrypt entries when they change or when decryption key becomes available
  useEffect(() => {
    const decryptEntries = async () => {
      if (!entries || entries.length === 0) {
        setDecryptedEntries([]);
        return;
      }

      setIsDecrypting(true);

      try {
        const decrypted = await Promise.all(
          entries.map(async (entry) => {
            // If entry has encrypted fields and we have a decryption key, decrypt them
            if (
              isUnlocked &&
              decryptionKey &&
              entry.iv &&
              (entry.encryptedNotes || entry.encryptedTags)
            ) {
              try {
                const { notes, tags } = await decryptEntry(
                  entry.encryptedNotes,
                  entry.encryptedTags,
                  entry.iv,
                  decryptionKey
                );

                return {
                  ...entry,
                  decryptedNotes: notes,
                  decryptedTags: tags,
                };
              } catch (error) {
                // Return entry with error indicator (decryption failed)
                return {
                  ...entry,
                  decryptedNotes: "[Unable to decrypt]",
                  decryptedTags: [],
                };
              }
            }

            // Otherwise, use plaintext fields (backward compatibility)
            return {
              ...entry,
              decryptedNotes: entry.notes,
              decryptedTags: entry.tags,
            };
          })
        );

        setDecryptedEntries(decrypted);
      } catch (error) {
        // Silently fail - individual entry errors are already handled above
        setDecryptedEntries([]);
      } finally {
        setIsDecrypting(false);
      }
    };

    decryptEntries();
  }, [entries, decryptionKey, isUnlocked]);

  const handleEdit = (entry: DecryptedEntry) => {
    setEntryToEdit(entry);
    setEditDialogOpen(true);
  };

  const handleDelete = (entry: DecryptedEntry) => {
    setEntryToDelete(entry);
    setDeleteDialogOpen(true);
  };

  const handleEditSuccess = () => {
    setEntryToEdit(null);
    setEditDialogOpen(false);
  };

  const handleDeleteSuccess = () => {
    setEntryToDelete(null);
    setDeleteDialogOpen(false);
  };

  if (entries.length === 0) {
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
            <NotebookPen className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent entries</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Your story begins with the next check-in. Capture a moment to see it here.
          </p>
        </CardBody>
      </Card>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={scaleFadeVariants}
        whileHover={hoverLift}
      >
        <Card className="w-full rounded-[24px] border border-transparent bg-white/90 shadow-[0_18px_32px_-18px_rgba(15,23,42,0.25)] backdrop-blur transition-shadow duration-300 hover:shadow-[0_25px_50px_-12px_rgba(15,23,42,0.35)] dark:border-white/5 dark:bg-slate-900/75">
          <CardBody className="flex h-full flex-col gap-7 p-9 lg:p-11 xl:p-12">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                Journal feed
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                Recent entries
              </h2>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Sparkles className="h-4 w-4" />
              {entries.length} total
            </div>
          </div>

          <div className="flex-1 space-y-6">
          {isDecrypting ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-slate-500">Decrypting entries...</div>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {decryptedEntries.map((entry, index) => {
                const moodData = MOOD_TYPES[entry.moodType as MoodType];
                const timeAgo = formatDistanceToNow(new Date(entry.timestamp), {
                  addSuffix: true,
                });

                return (
                  <motion.div
                    key={entry._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      delay: getStaggerDelay(index, 0.08),
                      duration: 0.4
                    }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.45)] transition-shadow duration-300 hover:border-slate-300 hover:shadow-[0_35px_60px_-30px_rgba(37,99,235,0.45)] dark:border-slate-700/70 dark:bg-slate-900/80 dark:hover:border-slate-600 xl:p-7"
                  >
                  <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-slate-100/80 via-white/20 to-transparent opacity-0 transition duration-300 group-hover:opacity-100 dark:from-slate-800/60" />

                    {/* Edit and Delete Buttons */}
                    <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:opacity-100">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(entry)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100/80 text-slate-600 transition-colors hover:bg-blue-100 hover:text-blue-600 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                        aria-label="Edit entry"
                      >
                        <Pencil className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(entry)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100/80 text-slate-600 transition-colors hover:bg-red-100 hover:text-red-600 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                        aria-label="Delete entry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>

                    <div className="relative z-10 flex items-start gap-5">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-4xl shadow-inner dark:bg-slate-800">
                      {moodData.emoji}
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-lg font-semibold text-slate-900 dark:text-white">
                          {moodData.label}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          Intensity {entry.moodIntensity}/10
                        </span>
                        <span className="ml-auto text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                          {timeAgo}
                        </span>
                      </div>

                      {entry.decryptedNotes && (
                        <p className="text-sm text-slate-600 transition duration-200 dark:text-slate-400">
                          {entry.decryptedNotes}
                        </p>
                      )}

                      {entry.decryptedTags && entry.decryptedTags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {entry.decryptedTags.map((tag, tagIndex) => (
                            <motion.div
                              key={tag}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 + tagIndex * 0.05 }}
                              whileHover={{ scale: 1.05 }}
                            >
                              <Chip
                                size="sm"
                                radius="full"
                                variant="flat"
                                className="bg-slate-100/80 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700"
                              >
                                #{tag}
                              </Chip>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            </AnimatePresence>
          )}
        </div>
      </CardBody>
    </Card>
      </motion.div>

      {/* Edit Entry Dialog */}
      <LogEntryDialog
        entryToEdit={entryToEdit}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={handleEditSuccess}
        hideTrigger
      />

      {/* Delete Entry Dialog */}
      <DeleteEntryDialog
        entry={entryToDelete}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </>
  );
}
