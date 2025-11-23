"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface PromptSuggestionsProps {
  prompts: string[] | null;
  isLoading: boolean;
  error: string | null;
  onSelectPrompt: (prompt: string) => void;
}

const FALLBACK_PROMPTS = [
  "What triggered this feeling?",
  "How has this affected my day so far?",
  "What would help me feel better right now?",
];

export function PromptSuggestions({ prompts, isLoading, error, onSelectPrompt }: PromptSuggestionsProps) {
  const displayPrompts = error ? FALLBACK_PROMPTS : prompts || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
          Generating prompts...
        </span>
      </div>
    );
  }

  if (displayPrompts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {error && (
        <p className="text-xs text-amber-600 dark:text-amber-400 mb-2">
          Using fallback prompts. Try again later.
        </p>
      )}
      {displayPrompts.map((prompt, idx) => (
        <motion.button
          key={idx}
          type="button"
          onClick={() => onSelectPrompt(prompt)}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="w-full text-left p-3 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 dark:hover:border-blue-500 transition-colors text-sm text-slate-700 dark:text-slate-300"
        >
          {prompt}
        </motion.button>
      ))}
    </div>
  );
}
