"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Shield, AlertTriangle, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEncryption } from "@/contexts/EncryptionContext";
import { useMigrateEntries } from "@/lib/crypto/migration";

const setupSchema = z
  .object({
    passphrase: z
      .string()
      .min(12, "Passphrase must be at least 12 characters for security"),
    confirmPassphrase: z.string(),
  })
  .refine((data) => data.passphrase === data.confirmPassphrase, {
    message: "Passphrases do not match",
    path: ["confirmPassphrase"],
  });

type SetupFormData = z.infer<typeof setupSchema>;

interface SetupEncryptionDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SetupEncryptionDialog({ open, onOpenChange }: SetupEncryptionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [showConfirmPassphrase, setShowConfirmPassphrase] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);

  const { setupEncryption, decryptionKey } = useEncryption();
  const migrateEntries = useMigrateEntries();

  const form = useForm<SetupFormData>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      passphrase: "",
      confirmPassphrase: "",
    },
  });

  const passphrase = form.watch("passphrase");
  const passphraseStrength = getPassphraseStrength(passphrase);

  const onSubmit = async (data: SetupFormData) => {
    try {
      setIsSubmitting(true);

      // Setup encryption (generates DEK, wraps it, stores it)
      await setupEncryption(data.passphrase);

      // Migrate existing plaintext entries (decryptionKey is now available in context)
      if (decryptionKey) {
        await migrateEntries(decryptionKey, (current, total) => {
          setMigrationProgress({ current, total });
        });
      }

      // Reset form and close dialog
      form.reset();
      setMigrationProgress(null);
      onOpenChange?.(false);
    } catch (error) {
      console.error("Failed to setup encryption:", error);
      form.setError("root", {
        message: "Failed to setup encryption. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <Shield className="h-6 w-6 text-blue-500" />
            </div>
            <DialogTitle className="text-2xl">Enable End-to-End Encryption</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Protect your journal entries with end-to-end encryption. Your notes and tags will be
            encrypted on your device before being stored.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Warning */}
            <div className="flex gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm space-y-1">
                <p className="font-semibold text-amber-700 dark:text-amber-400">
                  Important: Save your passphrase securely
                </p>
                <p className="text-amber-600 dark:text-amber-500">
                  If you forget your passphrase, your encrypted data cannot be recovered. There is
                  no password reset option.
                </p>
              </div>
            </div>

            {/* Passphrase Input */}
            <FormField
              control={form.control}
              name="passphrase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passphrase</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassphrase ? "text" : "password"}
                        placeholder="Enter a strong passphrase (12+ characters)"
                        disabled={isSubmitting}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassphrase(!showPassphrase)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassphrase ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Use a memorable but secure passphrase with at least 12 characters
                  </FormDescription>
                  {passphrase.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              passphraseStrength === "weak"
                                ? "w-1/3 bg-red-500"
                                : passphraseStrength === "medium"
                                ? "w-2/3 bg-amber-500"
                                : "w-full bg-green-500"
                            }`}
                          />
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            passphraseStrength === "weak"
                              ? "text-red-500"
                              : passphraseStrength === "medium"
                              ? "text-amber-500"
                              : "text-green-500"
                          }`}
                        >
                          {passphraseStrength === "weak"
                            ? "Weak"
                            : passphraseStrength === "medium"
                            ? "Medium"
                            : "Strong"}
                        </span>
                      </div>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Passphrase Input */}
            <FormField
              control={form.control}
              name="confirmPassphrase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Passphrase</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmPassphrase ? "text" : "password"}
                        placeholder="Re-enter your passphrase"
                        disabled={isSubmitting}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassphrase(!showConfirmPassphrase)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassphrase ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Migration Progress */}
            {migrationProgress && (
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-blue-500 animate-pulse" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Encrypting your existing entries...</p>
                    <p className="text-xs text-muted-foreground">
                      {migrationProgress.current} of {migrationProgress.total} entries encrypted
                    </p>
                  </div>
                </div>
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{
                      width: `${
                        (migrationProgress.current / migrationProgress.total) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Root Error */}
            {form.formState.errors.root && (
              <p className="text-sm text-red-500">{form.formState.errors.root.message}</p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Lock className="h-4 w-4 animate-pulse" />
                  Setting up encryption...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Enable Encryption
                </span>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to calculate passphrase strength
function getPassphraseStrength(passphrase: string): "weak" | "medium" | "strong" {
  if (passphrase.length < 12) return "weak";
  if (passphrase.length < 16) return "medium";

  // Check for variety: lowercase, uppercase, numbers, special chars
  const hasLowercase = /[a-z]/.test(passphrase);
  const hasUppercase = /[A-Z]/.test(passphrase);
  const hasNumbers = /[0-9]/.test(passphrase);
  const hasSpecial = /[^a-zA-Z0-9]/.test(passphrase);

  const varietyCount = [hasLowercase, hasUppercase, hasNumbers, hasSpecial].filter(Boolean).length;

  if (varietyCount >= 3 && passphrase.length >= 16) return "strong";
  return "medium";
}
