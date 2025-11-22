"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, Chip } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { NotebookPen, Sparkles, Pencil, Trash2, Loader2 } from "lucide-react";
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
import { useDecryptedImage } from "@/hooks/useDecryptedImage";

interface RecentEntriesListProps {
  entries: Doc<"entries">[];
}

// Component to display decrypted image
function DecryptedImage({ storageId, iv }: { storageId: string; iv: string }) {
  const { imageUrl, isLoading, error } = useDecryptedImage(storageId, iv);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Decrypting image...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!imageUrl) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="mt-3"
    >
      <img
        src={imageUrl}
        alt="Entry attachment"
        className="max-w-full rounded-xl border border-slate-200 shadow-sm dark:border-slate-700"
        style={{ maxHeight: "300px", objectFit: "cover" }}
      />
    </motion.div>
  );
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
        <Card className="w-full rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <CardBody className="flex h-full flex-col gap-6 p-6 xl:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Journal feed
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                  Recent entries
                </h2>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <Sparkles className="h-3.5 w-3.5" />
                {entries.length} total
              </div>
            </div>

            <div className="flex-1 space-y-4">
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
                        className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-all hover:border-slate-200 hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700 dark:hover:bg-slate-900"
                      >
                        {/* Edit and Delete Buttons */}
                        <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:opacity-100">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(entry)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm transition-colors hover:text-blue-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-blue-400"
                            aria-label="Edit entry"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(entry)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm transition-colors hover:text-red-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-red-400"
                            aria-label="Delete entry"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </motion.button>
                        </div>

                        <div className="relative z-10 flex items-start gap-4">
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm dark:bg-slate-800">
                            {moodData.emoji}
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                              <span className="text-base font-semibold text-slate-900 dark:text-white">
                                {moodData.label}
                              </span>
                              <span className="rounded-full bg-slate-200/50 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                Intensity {entry.moodIntensity}/10
                              </span>
                              <span className="text-xs text-slate-400 dark:text-slate-500">
                                {timeAgo}
                              </span>
                            </div>

                            {entry.decryptedNotes && (
                              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                {entry.decryptedNotes}
                              </p>
                            )}

                            {entry.decryptedTags && entry.decryptedTags.length > 0 && (
                              <div className="flex flex-wrap gap-2 pt-1">
                                {entry.decryptedTags.map((tag, tagIndex) => (
                                  <Chip
                                    key={tag}
                                    size="sm"
                                    radius="full"
                                    variant="flat"
                                    className="h-6 bg-white px-2 text-[10px] font-medium text-slate-500 shadow-sm dark:bg-slate-800 dark:text-slate-400"
                                  >
                                    #{tag}
                                  </Chip>
                                ))}
                              </div>
                            )}

                            {/* Display encrypted image if present */}
                            {entry.encryptedImageStorageId && entry.encryptedImageIv && (
                              <DecryptedImage
                                storageId={entry.encryptedImageStorageId}
                                iv={entry.encryptedImageIv}
                              />
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
