"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useClerk, useUser } from "@clerk/nextjs";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ShieldCheck, ShieldQuestion, Trash2 } from "lucide-react";

const SecurityForm = () => {
  const deleteProfile = useMutation(api.users.deleteProfile);
  const { openUserProfile, signOut } = useClerk();
  const { user } = useUser();

  const [confirmValue, setConfirmValue] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handlePasswordManagement = () => {
    openUserProfile({});
  };

  const handleDeleteAccount = async () => {
    await toast.promise(
      (async () => {
        await deleteProfile({});
        if (user) {
          await user.delete();
        }
        await signOut({ redirectUrl: "/" });
      })(),
      {
        loading: "Deleting account…",
        success: "Your account has been deleted.",
        error: "We could not delete your account. Please try again.",
      },
    );
    setDialogOpen(false);
    setConfirmValue("");
  };

  return (
    <div>
      <div className="border-b border-dashed border-gray-200 pb-4">
        <h2 className="text-2xl font-semibold">Stay in control</h2>
        <p className="text-muted-foreground">
          Update sensitive account information or remove your data entirely.
        </p>
      </div>

      <div className="mt-6 space-y-6">
        <Alert>
          <ShieldCheck className="h-5 w-5" />
          <div className="ml-2">
            <AlertTitle>Update your password</AlertTitle>
            <AlertDescription>
              Password and multi-factor settings are managed through Clerk&apos;s secure account
              portal.
            </AlertDescription>
            <Button className="mt-4" variant="expandIcon" onClick={handlePasswordManagement}>
              Open security settings
            </Button>
          </div>
        </Alert>

        <Alert variant="destructive">
          <Trash2 className="h-5 w-5" />
          <div className="ml-2">
            <AlertTitle>Delete your account</AlertTitle>
            <AlertDescription>
              This action permanently removes your profile and all associated data. You cannot undo
              this action.
            </AlertDescription>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4" variant="destructive">
                  Delete account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm permanent deletion</DialogTitle>
                  <DialogDescription>
                    To continue, type <span className="font-semibold">DELETE</span> in the box
                    below. Your account and data will be erased immediately.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                  <Input
                    placeholder="Type DELETE to confirm"
                    value={confirmValue}
                    onChange={(event) => setConfirmValue(event.target.value)}
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="linkHover2">Cancel</Button>
                  </DialogClose>
                  <Button
                    variant="destructive"
                    disabled={confirmValue !== "DELETE"}
                    onClick={handleDeleteAccount}
                  >
                    Permanently delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </Alert>

        <Alert>
          <ShieldQuestion className="h-5 w-5" />
          <div className="ml-2">
            <AlertTitle>Need help?</AlertTitle>
            <AlertDescription>
              Reach out to support if you accidentally removed access or need to restore your
              account.
            </AlertDescription>
          </div>
        </Alert>
      </div>
    </div>
  );
};

export default SecurityForm;
