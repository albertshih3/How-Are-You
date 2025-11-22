"use client";

import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Slider, Checkbox, Textarea, Input } from "@nextui-org/react";
import { MapPin, CloudSun, Users, Image as ImageIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EntryValidator, type TEntryValidator } from "@/lib/validators/entry-validator";
import { MOOD_TYPES, COMMON_TAGS, type MoodType } from "@/lib/constants/moods";
import { cn } from "@/lib/utils";
import { useEncryption } from "@/contexts/EncryptionContext";
import { encryptEntry } from "@/lib/crypto/encryption";

import { DecryptedEntry } from "@/types/entry";

interface LogEntryDialogProps {
  children?: ReactNode;
  onSuccess?: () => void;
  entryToEdit?: DecryptedEntry | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
}

export function LogEntryDialog({ children, onSuccess, entryToEdit, open: controlledOpen, onOpenChange: controlledOnOpenChange, hideTrigger }: LogEntryDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange : setInternalOpen;

  const [selectedMood, setSelectedMood] = useState<MoodType | null>(entryToEdit?.moodType as MoodType || null);
  const [intensity, setIntensity] = useState(entryToEdit?.moodIntensity || 5);
  const [notes, setNotes] = useState(entryToEdit?.decryptedNotes || entryToEdit?.notes || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(entryToEdit?.decryptedTags || entryToEdit?.tags || []);
  const [location, setLocation] = useState(entryToEdit?.location || "");
  const [weather, setWeather] = useState(entryToEdit?.weather || "");
  const [socialContext, setSocialContext] = useState<string[]>(entryToEdit?.socialContext || []);
  const [photoUrl, setPhotoUrl] = useState(entryToEdit?.photoUrl || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createEntry = useMutation(api.entries.createEntry);
  const updateEntry = useMutation(api.entries.updateEntry);
  const { decryptionKey, isUnlocked } = useEncryption();

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TEntryValidator>({
    resolver: zodResolver(EntryValidator),
    defaultValues: {
      moodType: entryToEdit?.moodType as MoodType || undefined,
      moodIntensity: entryToEdit?.moodIntensity || 5,
      notes: entryToEdit?.decryptedNotes || entryToEdit?.notes || "",
      tags: entryToEdit?.decryptedTags || entryToEdit?.tags || [],
      location: entryToEdit?.location || "",
      weather: entryToEdit?.weather || "",
      socialContext: entryToEdit?.socialContext || [],
      photoUrl: entryToEdit?.photoUrl || "",
    },
  });

  // Reset form when entryToEdit changes or dialog opens
  useEffect(() => {
    if (open) {
      if (entryToEdit) {
        setSelectedMood(entryToEdit.moodType as MoodType);
        setIntensity(entryToEdit.moodIntensity);
        setNotes(entryToEdit.decryptedNotes || entryToEdit.notes || "");
        setSelectedTags(entryToEdit.decryptedTags || entryToEdit.tags || []);
        setLocation(entryToEdit.location || "");
        setWeather(entryToEdit.weather || "");
        setSocialContext(entryToEdit.socialContext || []);
        setPhotoUrl(entryToEdit.photoUrl || "");

        setValue("moodType", entryToEdit.moodType as MoodType);
        setValue("moodIntensity", entryToEdit.moodIntensity);
        setValue("notes", entryToEdit.decryptedNotes || entryToEdit.notes || "");
        setValue("tags", entryToEdit.decryptedTags || entryToEdit.tags || []);
        setValue("location", entryToEdit.location || "");
        setValue("weather", entryToEdit.weather || "");
        setValue("socialContext", entryToEdit.socialContext || []);
        setValue("photoUrl", entryToEdit.photoUrl || "");
      } else {
        // Reset to defaults if not editing
        // Only reset if we just opened the dialog and weren't already editing
      }
    }
  }, [open, entryToEdit, setValue]);

  const moodDetails = selectedMood ? MOOD_TYPES[selectedMood] : null;

  const handleDialogChange = (isOpen: boolean) => {
    if (setOpen) setOpen(isOpen);

    if (!isOpen && !entryToEdit) {
      setSelectedMood(null);
      setIntensity(5);
      setNotes("");
      setSelectedTags([]);
      setLocation("");
      setWeather("");
      setSocialContext([]);
      setPhotoUrl("");
      reset();
      setValue("moodIntensity", 5);
      setValue("tags", []);
      setValue("notes", "");
      setValue("location", "");
      setValue("weather", "");
      setValue("socialContext", []);
      setValue("photoUrl", "");
    }
  };

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
    setValue("moodType", mood);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    setValue("tags", newTags);
  };

  const onSubmit = async (data: TEntryValidator) => {
    try {
      setIsSubmitting(true);

      // Prepare entry data
      const entryData: {
        moodType: string;
        moodIntensity: number;
        encryptedNotes?: string;
        encryptedTags?: string;
        iv?: string;
        notes?: string;
        tags?: string[];
        location?: string;
        weather?: string;
        socialContext?: string[];
        photoUrl?: string;
      } = {
        moodType: data.moodType,
        moodIntensity: data.moodIntensity,
        location: data.location,
        weather: data.weather,
        socialContext: data.socialContext,
        photoUrl: data.photoUrl,
      };

      // Encrypt notes and tags if encryption is unlocked
      if (isUnlocked && decryptionKey) {
        const notesToEncrypt = data.notes || "";
        const tagsToEncrypt = data.tags && data.tags.length > 0 ? data.tags : [];

        // Always generate a NEW IV for security (never reuse IVs with AES-GCM)
        const { encryptedNotes, encryptedTags, iv } = await encryptEntry(
          notesToEncrypt,
          tagsToEncrypt,
          decryptionKey
        );

        entryData.encryptedNotes = encryptedNotes;
        entryData.encryptedTags = encryptedTags;
        entryData.iv = iv;
      } else {
        // Fallback to plaintext (for backward compatibility or if encryption not set up)
        entryData.notes = data.notes || undefined;
        entryData.tags = data.tags && data.tags.length > 0 ? data.tags : [];
      }

      // Update existing entry or create new entry
      if (entryToEdit) {
        await updateEntry({
          entryId: entryToEdit._id,
          ...entryData,
        });
      } else {
        await createEntry(entryData);
      }

      handleDialogChange(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      {!children && !entryToEdit && !hideTrigger && (
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="w-full rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-base font-semibold tracking-tight text-white shadow-[0_18px_40px_-18px_rgba(79,70,229,0.55)] transition duration-200 hover:opacity-90 sm:w-auto"
          >
            Log How You&apos;re Feeling
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-hidden rounded-[2.25rem] border border-white/20 bg-white/95 p-0 shadow-[0_45px_120px_-45px_rgba(30,64,175,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/90">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader className="space-y-3 px-8 pt-8 pb-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <DialogTitle className="text-4xl font-bold text-slate-900 dark:text-white">
              {entryToEdit ? "Edit entry" : "How are you feeling?"}
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
              Take a moment to check in with yourself
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 px-8 pb-8">
            {/* Mood Selector - Always Visible */}
            <div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                {(Object.keys(MOOD_TYPES) as MoodType[]).map((mood) => {
                  const moodData = MOOD_TYPES[mood];
                  const isActive = selectedMood === mood;

                  return (
                    <motion.button
                      key={mood}
                      type="button"
                      onClick={() => handleMoodSelect(mood)}
                      aria-pressed={isActive}
                      aria-label={moodData.label}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "group flex flex-col items-center justify-center gap-3 rounded-3xl border-2 p-5 min-h-[130px] text-slate-600 transition-all duration-300 dark:text-slate-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                        isActive
                          ? "border-transparent bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20 text-slate-900 shadow-[0_20px_60px_-15px_rgba(99,102,241,0.5)] scale-105 dark:text-white"
                          : "border-slate-200 bg-white/60 hover:border-slate-300 hover:bg-white/80 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/40 dark:hover:border-slate-600 dark:hover:bg-slate-900/60"
                      )}
                    >
                      <span className="text-5xl sm:text-6xl leading-none transition-transform duration-300 group-hover:scale-110" aria-hidden>
                        {moodData.emoji}
                      </span>
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-wide text-center">
                        {moodData.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
              {errors.moodType && (
                <p className="mt-4 text-sm text-red-500 text-center">{errors.moodType.message}</p>
              )}
            </div>

            {/* Intensity Section - Progressive Disclosure */}
            <AnimatePresence>
              {selectedMood && (
                <motion.div
                  initial={{ opacity: 0, y: -20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="space-y-6"
                >
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700" />

                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        How intense is this feeling?
                      </h3>
                      <div className="flex items-center justify-center gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                          <span
                            key={level}
                            className={cn(
                              "text-2xl sm:text-3xl transition-all duration-300",
                              intensity >= level ? "opacity-100 scale-100" : "opacity-20 scale-75"
                            )}
                          >
                            {moodDetails?.emoji}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Slider
                        size="lg"
                        step={1}
                        minValue={1}
                        maxValue={10}
                        value={intensity}
                        onChange={(value) => {
                          const numValue = Array.isArray(value) ? value[0] : value;
                          setIntensity(numValue);
                          setValue("moodIntensity", numValue);
                        }}
                        className="max-w-full py-4"
                        classNames={{
                          base: "gap-6",
                          track: "h-4 bg-slate-200/80 dark:bg-slate-800 border-0 shadow-none",
                          filler: "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500",
                          thumb: "h-7 w-7 border-3 border-white bg-gradient-to-br from-blue-500 to-purple-500 shadow-xl",
                        }}
                      />
                      <p className="text-center text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {intensity}/10
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Details Section - Progressive Disclosure */}
            <AnimatePresence>
              {selectedMood && (
                <motion.div
                  initial={{ opacity: 0, y: -20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="space-y-8"
                >
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700" />

                  <div className="space-y-6">
                    <div>
                      <label className="mb-4 block text-center text-lg font-semibold text-slate-900 dark:text-white">
                        What&apos;s contributing to this?
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {COMMON_TAGS.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleTagToggle(tag)}
                            className={cn(
                              "rounded-2xl px-5 py-3.5 text-sm font-semibold transition-all duration-200",
                              selectedTags.includes(tag)
                                ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-lg scale-105"
                                : "border-2 border-slate-200 bg-white/60 text-slate-700 hover:border-slate-300 hover:bg-white/80 hover:scale-105 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300 dark:hover:border-slate-600"
                            )}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* New Metadata Fields */}
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" /> Location
                          </div>
                        </label>
                        <Input
                          placeholder="Where are you?"
                          value={location}
                          onValueChange={(val) => {
                            setLocation(val);
                            setValue("location", val);
                          }}
                          classNames={{
                            inputWrapper: "bg-white/60 dark:bg-slate-900/40 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 focus-within:!border-indigo-400",
                          }}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                          <div className="flex items-center gap-2">
                            <CloudSun className="h-4 w-4" /> Weather
                          </div>
                        </label>
                        <Input
                          placeholder="Sunny, Rainy, etc."
                          value={weather}
                          onValueChange={(val) => {
                            setWeather(val);
                            setValue("weather", val);
                          }}
                          classNames={{
                            inputWrapper: "bg-white/60 dark:bg-slate-900/40 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 focus-within:!border-indigo-400",
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" /> Social Context
                        </div>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["Alone", "With Family", "With Friends", "With Partner", "With Colleagues", "In Public"].map((ctx) => (
                          <button
                            key={ctx}
                            type="button"
                            onClick={() => {
                              const newContext = socialContext.includes(ctx)
                                ? socialContext.filter((c) => c !== ctx)
                                : [...socialContext, ctx];
                              setSocialContext(newContext);
                              setValue("socialContext", newContext);
                            }}
                            className={cn(
                              "rounded-xl px-4 py-2 text-xs font-medium transition-all duration-200",
                              socialContext.includes(ctx)
                                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 ring-1 ring-indigo-500/30"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                            )}
                          >
                            {ctx}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="h-4 w-4" /> Photo URL (Optional)
                        </div>
                      </label>
                      <Input
                        placeholder="https://..."
                        value={photoUrl}
                        onValueChange={(val) => {
                          setPhotoUrl(val);
                          setValue("photoUrl", val);
                        }}
                        classNames={{
                          inputWrapper: "bg-white/60 dark:bg-slate-900/40 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 focus-within:!border-indigo-400",
                        }}
                      />
                    </div>

                    <div>
                      <label className="mb-4 block text-center text-lg font-semibold text-slate-900 dark:text-white">
                        Any additional thoughts? (optional)
                      </label>
                      <Textarea
                        placeholder="Write down what's on your mind..."
                        value={notes}
                        onChange={(e) => {
                          setNotes(e.target.value);
                          setValue("notes", e.target.value);
                        }}
                        maxLength={500}
                        minRows={4}
                        className="w-full rounded-2xl border-2 border-slate-200 bg-white/60 text-base leading-relaxed text-slate-700 transition focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200"
                      />
                      <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                        {notes.length}/500 characters
                      </p>
                      {errors.notes && (
                        <p className="mt-2 text-sm text-red-500 text-center">{errors.notes.message}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogChange(false)}
                disabled={isSubmitting}
                className="rounded-2xl border-2 border-slate-300 bg-white/80 px-8 py-6 text-base font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-900/80"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !selectedMood}
                className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-12 py-6 text-base font-bold text-white shadow-[0_20px_50px_-12px_rgba(99,102,241,0.6)] transition hover:shadow-[0_25px_60px_-15px_rgba(99,102,241,0.7)] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? "Saving..." : entryToEdit ? "Update Entry" : "Save Entry"}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
