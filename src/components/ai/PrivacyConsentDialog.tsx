"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

interface PrivacyConsentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConsent: () => void;
}

const STORAGE_KEY = "ai_continuation_consent_shown";

export function PrivacyConsentDialog({ open, onOpenChange, onConsent }: PrivacyConsentDialogProps) {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Check if consent has been shown before
    const hasSeenConsent = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "true";

    if (open && !hasSeenConsent) {
      setShouldShow(true);
    } else if (open && hasSeenConsent) {
      // If they've seen it before, automatically consent
      onConsent();
      onOpenChange(false);
    }
  }, [open, onConsent, onOpenChange]);

  const handleConsent = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, "true");
    }
    onConsent();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={shouldShow} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <DialogTitle className="text-xl">Privacy Notice</DialogTitle>
          </div>
          <DialogDescription className="text-base text-slate-600 dark:text-slate-400 space-y-3 pt-2">
            <p>
              Your current entry will be sent to <strong>Google Gemini</strong> to generate a continuation.
            </p>
            <p>
              This data will <strong>not be stored by us</strong> but will be processed by Google&apos;s AI service
              according to their privacy policy.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              This notice will only show once. You can always choose whether to use AI assistance.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConsent}
            className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            I Understand, Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
