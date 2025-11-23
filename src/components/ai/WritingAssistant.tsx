"use client";

import { useState } from "react";
import { Sparkles, Lightbulb, Wand2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PrivacyConsentDialog } from "./PrivacyConsentDialog";
import { PromptSuggestions } from "./PromptSuggestions";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface WritingAssistantProps {
  moodType: string;
  intensity: number;
  existingText: string;
  onInsertText: (text: string) => void;
  onSelectPrompt: (prompt: string) => void;
}

export function WritingAssistant({ moodType, intensity, existingText, onInsertText, onSelectPrompt }: WritingAssistantProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [prompts, setPrompts] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  const [showPromptsDialog, setShowPromptsDialog] = useState(false);
  const [pendingContinuation, setPendingContinuation] = useState(false);

  const fetchPrompts = async (mode: "generate" | "continue") => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/writing-prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          moodType,
          intensity,
          existingText: mode === "continue" ? existingText : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch prompts");
      }

      const data = await response.json();

      if (mode === "generate") {
        setPrompts(data.prompts);
        setShowPromptsDialog(true);
      } else {
        // For continuation, insert text directly
        onInsertText(data.continuation);
        toast.success("Continuation added to your entry");
      }
    } catch (err) {
      console.error("Error fetching prompts:", err);
      setError(err instanceof Error ? err.message : "An error occurred");

      if (mode === "generate") {
        // Show fallback prompts
        setShowPromptsDialog(true);
      } else {
        toast.error("Failed to generate continuation. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePrompts = () => {
    fetchPrompts("generate");
  };

  const handleContinueThought = () => {
    if (!existingText.trim()) {
      toast.error("Please write something first before using continuation");
      return;
    }
    setPendingContinuation(true);
    setShowPrivacyDialog(true);
  };

  const handlePrivacyConsent = () => {
    if (pendingContinuation) {
      fetchPrompts("continue");
      setPendingContinuation(false);
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    onSelectPrompt(prompt);
    setShowPromptsDialog(false);
    setPrompts(null);
    toast.success("Prompt selected");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
            disabled={isLoading}
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Help me write</span>
            <span className="sm:hidden">AI Help</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem
            onClick={handleGeneratePrompts}
            disabled={isLoading}
            className="gap-2 cursor-pointer"
          >
            <Lightbulb className="h-4 w-4" />
            <span>Get writing prompts</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleContinueThought}
            disabled={isLoading || !existingText.trim()}
            className="gap-2 cursor-pointer"
          >
            <Wand2 className="h-4 w-4" />
            <span>Continue my thought</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Privacy Consent Dialog */}
      <PrivacyConsentDialog
        open={showPrivacyDialog}
        onOpenChange={setShowPrivacyDialog}
        onConsent={handlePrivacyConsent}
      />

      {/* Prompts Dialog */}
      <Dialog open={showPromptsDialog} onOpenChange={setShowPromptsDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-blue-500" />
              Writing Prompts
            </DialogTitle>
            <DialogDescription>
              Select a prompt to help you get started with your journal entry.
            </DialogDescription>
          </DialogHeader>
          <PromptSuggestions
            prompts={prompts}
            isLoading={isLoading}
            error={error}
            onSelectPrompt={handleSelectPrompt}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
