"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardBody, Chip, Button } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { NotebookPen, Sparkles, Pencil, Trash2, Loader2, ChevronDown, ChevronUp, ArrowRight, MapPin, Cloud, CloudRain, CloudSnow, Sun, CloudDrizzle, CloudFog, CloudLightning } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { LocationData, WeatherData } from "@/lib/types/location";

import { MOOD_TYPES, type MoodType } from "@/lib/constants/moods";
import { useEncryption } from "@/contexts/EncryptionContext";
import { decryptEntry, decryptLocation, decryptPrompt } from "@/lib/crypto/encryption";
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
import { SafeHtmlRenderer } from "@/components/ui/SafeHtmlRenderer";

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
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);

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
            let decryptedNotes = entry.notes;
            let decryptedTags = entry.tags;
            let decryptedLocationData: LocationData | null = null;
            let decryptedPromptData: string | null = null;

            // Decrypt notes and tags if encrypted
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
                decryptedNotes = notes;
                decryptedTags = tags;
              } catch (error) {
                decryptedNotes = "[Unable to decrypt]";
                decryptedTags = [];
              }
            }

            // Decrypt location if encrypted
            if (
              isUnlocked &&
              decryptionKey &&
              entry.encryptedLocation &&
              entry.locationIv
            ) {
              try {
                decryptedLocationData = await decryptLocation(
                  entry.encryptedLocation,
                  entry.locationIv,
                  decryptionKey
                );
              } catch (error) {
                console.error("Failed to decrypt location:", error);
                // Fall through to plaintext fallback
              }
            } else if (entry.location) {
              // Fallback to plaintext location
              try {
                decryptedLocationData = JSON.parse(entry.location) as LocationData;
              } catch {
                decryptedLocationData = null;
              }
            }

            // Decrypt prompt if encrypted
            if (
              isUnlocked &&
              decryptionKey &&
              entry.encryptedPrompt &&
              entry.promptIv
            ) {
              try {
                decryptedPromptData = await decryptPrompt(
                  entry.encryptedPrompt,
                  entry.promptIv,
                  decryptionKey
                );
              } catch (error) {
                console.error("Failed to decrypt prompt for entry:", entry._id, error);
              }
            }

            return {
              ...entry,
              decryptedNotes,
              decryptedTags,
              decryptedLocation: decryptedLocationData,
              decryptedPrompt: decryptedPromptData,
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

  const toggleExpand = (id: string) => {
    setExpandedEntryId(expandedEntryId === id ? null : id);
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
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent entries</h2>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Journal feed
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="font-bold">{entries.length}</span> latest
              </div>
            </div>

            <div className="flex-1 space-y-3">
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
                    const isExpanded = expandedEntryId === entry._id;

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
                        className={`group relative overflow-hidden rounded-2xl border transition-all ${isExpanded
                            ? "border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
                            : "border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700 dark:hover:bg-slate-900"
                          }`}
                      >
                        <div
                          className="flex cursor-pointer items-center gap-4 p-4"
                          onClick={() => toggleExpand(entry._id)}
                        >
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm dark:bg-slate-800">
                            {moodData.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                {moodData.label}
                              </span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                {timeAgo}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <div className="h-1.5 w-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-slate-400 dark:bg-slate-500"
                                  style={{ width: `${(entry.moodIntensity / 10) * 100}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                                {entry.moodIntensity}/10
                              </span>
                            </div>
                          </div>
                          <div className="text-slate-400 transition-transform duration-200 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </div>
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border-t border-slate-100 bg-slate-50/30 px-4 pb-4 dark:border-slate-800 dark:bg-slate-900/30"
                            >
                              <div className="pt-4 space-y-3">
                                {/* AI Prompt Bar */}
                                {entry.decryptedPrompt && (
                                  <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 mb-3">
                                    <Sparkles className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-blue-700 dark:text-blue-300 flex-1">
                                      {entry.decryptedPrompt}
                                    </p>
                                  </div>
                                )}

                                {entry.decryptedNotes && (
                                  <SafeHtmlRenderer
                                    html={entry.decryptedNotes}
                                    className="text-sm leading-relaxed text-slate-600 dark:text-slate-400"
                                  />
                                )}

                                {entry.decryptedTags && entry.decryptedTags.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {entry.decryptedTags.map((tag) => (
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

                                {/* Display location and weather */}
                                {(entry.location || entry.weather) && (
                                  <div className="flex flex-wrap gap-3 text-xs">
                                    {entry.location && (() => {
                                      try {
                                        const locationData: LocationData = JSON.parse(entry.location);
                                        return (
                                          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                            <MapPin className="h-3.5 w-3.5 text-blue-500" />
                                            <span>{locationData.name}</span>
                                          </div>
                                        );
                                      } catch {
                                        return null;
                                      }
                                    })()}
                                    {entry.weather && (() => {
                                      try {
                                        const weatherData: WeatherData = JSON.parse(entry.weather);
                                        const WeatherIcon = {
                                          '01d': Sun,
                                          '02d': Cloud,
                                          '03d': Cloud,
                                          '09d': CloudDrizzle,
                                          '10d': CloudRain,
                                          '11d': CloudLightning,
                                          '13d': CloudSnow,
                                          '50d': CloudFog,
                                        }[weatherData.icon] || Cloud;
                                        return (
                                          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                            <WeatherIcon className="h-3.5 w-3.5 text-blue-500" />
                                            <span>{weatherData.condition}, {weatherData.temp}°{weatherData.unit}</span>
                                          </div>
                                        );
                                      } catch {
                                        return null;
                                      }
                                    })()}
                                  </div>
                                )}

                                {/* Display encrypted image if present */}
                                {entry.encryptedImageStorageId && entry.encryptedImageIv && (
                                  <DecryptedImage
                                    storageId={entry.encryptedImageStorageId}
                                    iv={entry.encryptedImageIv}
                                  />
                                )}

                                <div className="flex justify-end gap-2 pt-2">
                                  <Button
                                    size="sm"
                                    variant="light"
                                    isIconOnly
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEdit(entry);
                                    }}
                                    className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="light"
                                    isIconOnly
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(entry);
                                    }}
                                    className="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            <div className="mt-2 border-t border-slate-100 pt-4 dark:border-slate-800">
              <Link
                href="/entries"
                className="group flex items-center justify-center gap-2 rounded-xl bg-slate-50 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                View all entries
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
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
