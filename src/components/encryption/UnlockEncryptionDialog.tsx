"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Unlock, AlertCircle, Eye, EyeOff, LogOut } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEncryption } from "@/contexts/EncryptionContext";
import { Checkbox } from "@/components/ui/checkbox";

const unlockSchema = z.object({
  passphrase: z.string().min(1, "Passphrase is required"),
  rememberMe: z.boolean().default(false),
});

type UnlockFormData = z.infer<typeof unlockSchema>;

interface UnlockEncryptionDialogProps {
  open: boolean;
}

export function UnlockEncryptionDialog({ open }: UnlockEncryptionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [showForgotWarning, setShowForgotWarning] = useState(false);

  const { unlockWithPassphrase, error: encryptionError } = useEncryption();
  const { signOut } = useClerk();

  const form = useForm<UnlockFormData>({
    resolver: zodResolver(unlockSchema),
    defaultValues: {
      passphrase: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: UnlockFormData) => {
    try {
      setIsSubmitting(true);
      await unlockWithPassphrase(data.passphrase, data.rememberMe);
      // Dialog will close automatically when isUnlocked becomes true
      form.reset();
    } catch (error) {
      // Error is already set in context
      console.error("Failed to unlock:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <Dialog open={open} modal={true}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <Lock className="h-6 w-6 text-blue-500" />
            </div>
            <DialogTitle className="text-2xl">Unlock Your Journal</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Enter your passphrase to decrypt and access your journal entries.
          </DialogDescription>
        </DialogHeader>

        {!showForgotWarning ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          placeholder="Enter your passphrase"
                          disabled={isSubmitting}
                          className="pr-10"
                          autoFocus
                          id="encryption-passphrase"
                          name="encryption-passphrase"
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassphrase(!showPassphrase)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          tabIndex={-1}
                        >
                          {showPassphrase ? (
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

              {/* Remember Me Checkbox */}
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Remember me on this device
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Stay unlocked even after you close the browser. Only use this on private devices.
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              {/* Error Message */}
              {encryptionError && (
                <div className="flex gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-red-700 dark:text-red-400">
                      {encryptionError}
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="space-y-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Lock className="h-4 w-4 animate-pulse" />
                      Unlocking...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Unlock className="h-4 w-4" />
                      Unlock
                    </span>
                  )}
                </Button>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => setShowForgotWarning(true)}
                    className="text-muted-foreground hover:text-foreground underline"
                  >
                    Forgot passphrase?
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <LogOut className="h-3 w-3" />
                    Log out
                  </button>
                </div>
              </div>
            </form>
          </Form>
        ) : (
          // Forgot Passphrase Warning
          <div className="space-y-6">
            <div className="flex gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm space-y-2">
                <p className="font-semibold text-amber-700 dark:text-amber-400">
                  Cannot recover forgotten passphrase
                </p>
                <p className="text-amber-600 dark:text-amber-500">
                  Your data is protected with end-to-end encryption. If you&apos;ve forgotten your
                  passphrase, there is no way to recover your encrypted journal entries.
                </p>
                <p className="text-amber-600 dark:text-amber-500">
                  Your only option is to reset encryption, which will permanently delete all
                  existing encrypted entries. You can then set up encryption again with a new
                  passphrase.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowForgotWarning(false)}
                className="flex-1"
              >
                Go Back
              </Button>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="flex-1 flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Contact support if you need to reset encryption and delete encrypted data.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
