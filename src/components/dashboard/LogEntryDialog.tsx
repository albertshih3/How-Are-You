"use client";

import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Slider, Checkbox, Textarea, Input } from "@nextui-org/react";
import { MapPin, CloudSun, Users, Image as ImageIcon, Plus, Shield } from "lucide-react";
import type { LocationData, WeatherData } from "@/lib/types/location";
import { fetchWeather } from "@/lib/weather/api";
import { LocationInput } from "@/components/dashboard/LocationInput";
import { WeatherDisplay } from "@/components/dashboard/WeatherDisplay";

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
import { encryptEntry, encryptBlob, encryptLocation, decryptLocation } from "@/lib/crypto/encryption";
import { toast } from "sonner";

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
  const [locationData, setLocationData] = useState<LocationData | null>(
    entryToEdit?.decryptedLocation || null
  );
  const [weatherData, setWeatherData] = useState<WeatherData | null>(
    entryToEdit?.weather ? (() => {
      try {
        return JSON.parse(entryToEdit.weather) as WeatherData;
      } catch {
        return null;
      }
    })() : null
  );
  const [socialContext, setSocialContext] = useState<string[]>(entryToEdit?.socialContext || []);
  const [photoUrl, setPhotoUrl] = useState(entryToEdit?.photoUrl || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fetchingWeather, setFetchingWeather] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [showWeatherInput, setShowWeatherInput] = useState(false);

  const generateUploadUrl = useMutation(api.entries.generateUploadUrl);
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
    const loadEntryData = async () => {
      if (open && entryToEdit) {
        setSelectedMood(entryToEdit.moodType as MoodType);
        setIntensity(entryToEdit.moodIntensity);
        setNotes(entryToEdit.decryptedNotes || entryToEdit.notes || "");
        setSelectedTags(entryToEdit.decryptedTags || entryToEdit.tags || []);

        // Decrypt encrypted location if available
        if (entryToEdit.encryptedLocation && entryToEdit.locationIv && isUnlocked && decryptionKey) {
          try {
            const decryptedLocationData = await decryptLocation(
              entryToEdit.encryptedLocation,
              entryToEdit.locationIv,
              decryptionKey
            );
            setLocationData(decryptedLocationData);
            setShowLocationInput(true); // Show input since data exists
          } catch (error) {
            console.error("Failed to decrypt location:", error);
            // Fall through to plaintext fallback
          }
        } else if (entryToEdit.location) {
          // Fallback to plaintext location
          try {
            const parsedLocation = JSON.parse(entryToEdit.location) as LocationData;
            setLocationData(parsedLocation);
            setShowLocationInput(true); // Show input since data exists
          } catch {
            setLocationData(null);
          }
        }

        // Parse weather data
        const parsedWeather = entryToEdit.weather ? (() => {
          try {
            return JSON.parse(entryToEdit.weather) as WeatherData;
          } catch {
            return null;
          }
        })() : null;
        setWeatherData(parsedWeather);
        if (parsedWeather) {
          setShowWeatherInput(true); // Show input since data exists
        }

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
      }
    };

    loadEntryData();
  }, [open, entryToEdit, setValue, isUnlocked, decryptionKey]);

  // Automatically fetch weather when location changes
  useEffect(() => {
    const autoFetchWeather = async () => {
      if (!locationData) return;
      if (fetchingWeather) return; // Prevent concurrent fetches

      setFetchingWeather(true);
      try {
        const weather = await fetchWeather(locationData.lat, locationData.lon);
        setWeatherData(weather);
        setShowWeatherInput(true); // Auto-show weather input when weather is fetched
      } catch (error) {
        console.error("Failed to fetch weather:", error);
        // Don't show error toast, just fail silently - user can enter manually
      } finally {
        setFetchingWeather(false);
      }
    };

    autoFetchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationData]); // Intentionally omit fetchingWeather to prevent infinite loops

  const moodDetails = selectedMood ? MOOD_TYPES[selectedMood] : null;

  const handleDialogChange = (isOpen: boolean) => {
    if (setOpen) setOpen(isOpen);

    if (!isOpen && !entryToEdit) {
      setSelectedMood(null);
      setIntensity(5);
      setNotes("");
      setSelectedTags([]);
      setLocationData(null);
      setWeatherData(null);
      setSocialContext([]);
      setPhotoUrl("");
      setSelectedFile(null);
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
        encryptedLocation?: string;
        locationIv?: string;
        weather?: string;
        socialContext?: string[];
        photoUrl?: string;
        encryptedImageStorageId?: string;
        encryptedImageIv?: string;
      } = {
        moodType: data.moodType,
        moodIntensity: data.moodIntensity,
        weather: weatherData ? JSON.stringify(weatherData) : undefined,
        socialContext: data.socialContext,
        photoUrl: data.photoUrl,
      };

      // Handle encrypted image upload
      if (selectedFile) {
        // Validate file size (10MB max)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (selectedFile.size > maxSize) {
          toast.error("Image must be smaller than 10MB");
          setIsSubmitting(false);
          return;
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/heic"];
        if (!allowedTypes.includes(selectedFile.type)) {
          toast.error("Please select an image file (JPEG, PNG, WebP, HEIC)");
          setIsSubmitting(false);
          return;
        }

        // Check if encryption is unlocked
        if (!isUnlocked || !decryptionKey) {
          toast.error("Please unlock encryption to upload images");
          setIsSubmitting(false);
          return;
        }

        try {
          setUploading(true);

          // Read file as ArrayBuffer
          const arrayBuffer = await selectedFile.arrayBuffer();

          // Encrypt the file
          const { encryptedData, iv } = await encryptBlob(arrayBuffer, decryptionKey);

          // Get upload URL
          const uploadUrl = await generateUploadUrl();

          // Upload encrypted blob
          const uploadResponse = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": "application/octet-stream" },
            body: encryptedData,
          });

          if (!uploadResponse.ok) {
            throw new Error("Failed to upload image");
          }

          const { storageId } = await uploadResponse.json();

          // Add encrypted image data to entry
          entryData.encryptedImageStorageId = storageId;
          entryData.encryptedImageIv = iv;

          toast.success("Image uploaded successfully");
        } catch (uploadError) {
          console.error("Image upload error:", uploadError);
          toast.error("Failed to upload image. Please try again.");
          setIsSubmitting(false);
          setUploading(false);
          return;
        } finally {
          setUploading(false);
        }
      }

      // Encrypt location if encryption is unlocked
      if (locationData) {
        if (isUnlocked && decryptionKey) {
          const { encryptedLocation, iv } = await encryptLocation(locationData, decryptionKey);
          entryData.encryptedLocation = encryptedLocation;
          entryData.locationIv = iv;
        } else {
          // Fallback to plaintext for backward compatibility
          entryData.location = JSON.stringify(locationData);
        }
      }

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
        toast.success("Entry updated successfully");
      } else {
        await createEntry(entryData);
        toast.success("Entry saved successfully");
      }

      // Clear selected file and close dialog
      setSelectedFile(null);
      handleDialogChange(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving entry:", error);
      toast.error("Failed to save entry. Please try again.");
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
            className="w-full rounded-2xl bg-blue-600 text-base font-semibold tracking-tight text-white shadow-sm transition duration-200 hover:bg-blue-700 sm:w-auto dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Log How You&apos;re Feeling
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white p-0 shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.2 }}
          className="max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader className="space-y-2 px-8 pt-8 pb-6 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <DialogTitle className="text-3xl font-bold text-slate-900 dark:text-white">
              {entryToEdit ? "Edit entry" : "How are you feeling?"}
            </DialogTitle>
            <DialogDescription className="text-base text-slate-600 dark:text-slate-400 text-left pt-1">
              Take a moment to check in with yourself
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-8 pb-8">
            {/* Mood Selector - Always Visible */}
            <div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
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
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "group flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 min-h-[110px] transition-all duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500",
                        isActive
                          ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-400"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-800"
                      )}
                    >
                      <span className="text-4xl sm:text-5xl leading-none transition-transform duration-200 group-hover:scale-110" aria-hidden>
                        {moodData.emoji}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wide text-center">
                        {moodData.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
              {errors.moodType && (
                <p className="mt-3 text-sm text-red-500 text-center">{errors.moodType.message}</p>
              )}
            </div>

            {/* Intensity Section - Progressive Disclosure */}
            <AnimatePresence>
              {selectedMood && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="h-px bg-slate-100 dark:bg-slate-800" />

                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        How intense is this feeling?
                      </h3>
                      <div className="flex items-center justify-center gap-1.5">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                          <span
                            key={level}
                            className={cn(
                              "text-2xl transition-all duration-200",
                              intensity >= level ? "opacity-100" : "opacity-20 grayscale"
                            )}
                          >
                            {moodDetails?.emoji}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 px-4">
                      <Slider
                        size="md"
                        step={1}
                        minValue={1}
                        maxValue={10}
                        value={intensity}
                        onChange={(value) => {
                          const numValue = Array.isArray(value) ? value[0] : value;
                          setIntensity(numValue);
                          setValue("moodIntensity", numValue);
                        }}
                        className="max-w-full"
                        classNames={{
                          base: "gap-4",
                          track: "h-2 bg-slate-100 dark:bg-slate-800 border-0",
                          filler: "bg-blue-600 dark:bg-blue-500",
                          thumb: "h-6 w-6 border-4 border-white bg-blue-600 shadow-md dark:border-slate-900 dark:bg-blue-500",
                        }}
                      />
                      <p className="text-center text-xl font-bold text-blue-600 dark:text-blue-400">
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
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  className="space-y-8"
                >
                  <div className="h-px bg-slate-100 dark:bg-slate-800" />

                  <div className="space-y-6">
                    <div>
                      <label className="mb-3 block text-center text-base font-semibold text-slate-900 dark:text-white">
                        What&apos;s contributing to this?
                      </label>
                      <div className="flex flex-wrap justify-center gap-2">
                        {COMMON_TAGS.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleTagToggle(tag)}
                            className={cn(
                              "rounded-full px-4 py-2 text-xs font-medium transition-all duration-200",
                              selectedTags.includes(tag)
                                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                            )}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        {!showLocationInput && locationData === null ? (
                          <button
                            type="button"
                            onClick={() => setShowLocationInput(true)}
                            className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-3 text-left text-sm font-medium text-slate-600 transition-colors hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                          >
                            <div className="flex items-center gap-2">
                              <Plus className="h-4 w-4" />
                              Add location
                            </div>
                          </button>
                        ) : (
                          <>
                            <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> Location (optional)
                              </div>
                            </label>
                            <LocationInput
                              value={locationData}
                              onChange={(location) => {
                                setLocationData(location);
                                setValue("location", location ? JSON.stringify(location) : "");
                              }}
                              onError={(error) => toast.error(error)}
                              onCancel={() => setShowLocationInput(false)}
                            />
                          </>
                        )}
                      </div>

                      <div>
                        {!showWeatherInput && weatherData === null ? (
                          <button
                            type="button"
                            onClick={() => setShowWeatherInput(true)}
                            className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-3 text-left text-sm font-medium text-slate-600 transition-colors hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                          >
                            <div className="flex items-center gap-2">
                              <Plus className="h-4 w-4" />
                              Add weather
                            </div>
                          </button>
                        ) : (
                          <>
                            <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
                              <div className="flex items-center gap-2">
                                <CloudSun className="h-4 w-4" /> Weather (optional) {fetchingWeather && "(Fetching...)"}
                              </div>
                            </label>
                            <WeatherDisplay
                              value={weatherData}
                              onChange={(weather) => {
                                setWeatherData(weather);
                                setValue("weather", weather ? JSON.stringify(weather) : "");
                              }}
                              editable={true}
                              onCancel={() => setShowWeatherInput(false)}
                            />
                          </>
                        )}
                      </div>

                      {(showLocationInput || showWeatherInput || locationData || weatherData) && (
                        <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
                          <div className="flex items-start gap-2">
                            <Shield className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                            <p>
                              Location and weather data are encrypted on your device before being stored.
                            </p>
                          </div>
                        </div>
                      )}
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
                              "rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
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
                          <ImageIcon className="h-4 w-4" /> Photo (Encrypted)
                        </div>
                      </label>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) setSelectedFile(file);
                            }}
                            classNames={{
                              inputWrapper: "h-14 bg-white/60 dark:bg-slate-900/40 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 focus-within:!border-indigo-400",
                              input: "pt-3 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100",
                            }}
                          />
                          {selectedFile && (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedFile(null)}
                              className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        {selectedFile && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-xl border-2 border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={URL.createObjectURL(selectedFile)}
                                alt="Preview"
                                className="h-24 w-24 rounded-lg object-cover shadow-sm"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                  {selectedFile.name}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="mb-3 block text-center text-base font-semibold text-slate-900 dark:text-white">
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
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 text-sm leading-relaxed text-slate-900 transition focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                      />
                      <p className="mt-2 text-center text-xs text-slate-400 dark:text-slate-500">
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
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleDialogChange(false)}
                disabled={isSubmitting}
                className="rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !selectedMood}
                className="rounded-xl bg-slate-900 px-8 py-6 text-base font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
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
