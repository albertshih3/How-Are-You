export type MoodType =
  | "happy"
  | "sad"
  | "anxious"
  | "stressed"
  | "calm"
  | "angry"
  | "overwhelmed"
  | "neutral"
  | "excited"
  | "tired";

export interface MoodMetadata {
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
}

export const MOOD_TYPES: Record<MoodType, MoodMetadata> = {
  happy: {
    label: "Happy",
    emoji: "😊",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100 hover:bg-yellow-200",
  },
  sad: {
    label: "Sad",
    emoji: "😢",
    color: "text-blue-600",
    bgColor: "bg-blue-100 hover:bg-blue-200",
  },
  anxious: {
    label: "Anxious",
    emoji: "😰",
    color: "text-purple-600",
    bgColor: "bg-purple-100 hover:bg-purple-200",
  },
  stressed: {
    label: "Stressed",
    emoji: "😫",
    color: "text-red-600",
    bgColor: "bg-red-100 hover:bg-red-200",
  },
  calm: {
    label: "Calm",
    emoji: "😌",
    color: "text-green-600",
    bgColor: "bg-green-100 hover:bg-green-200",
  },
  angry: {
    label: "Angry",
    emoji: "😠",
    color: "text-red-700",
    bgColor: "bg-red-100 hover:bg-red-200",
  },
  overwhelmed: {
    label: "Overwhelmed",
    emoji: "😵",
    color: "text-orange-600",
    bgColor: "bg-orange-100 hover:bg-orange-200",
  },
  neutral: {
    label: "Neutral",
    emoji: "😐",
    color: "text-gray-600",
    bgColor: "bg-gray-100 hover:bg-gray-200",
  },
  excited: {
    label: "Excited",
    emoji: "🤩",
    color: "text-pink-600",
    bgColor: "bg-pink-100 hover:bg-pink-200",
  },
  tired: {
    label: "Tired",
    emoji: "😴",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100 hover:bg-indigo-200",
  },
};

export const COMMON_TAGS = [
  "anxiety",
  "stress",
  "school",
  "work",
  "relationships",
  "family",
  "sleep",
  "exercise",
  "social",
  "health",
  "finances",
  "loneliness",
  "burnout",
  "overwhelmed",
] as const;

export type CommonTag = (typeof COMMON_TAGS)[number];
