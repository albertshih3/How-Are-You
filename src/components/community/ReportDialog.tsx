"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Radio,
  RadioGroup,
  Textarea,
} from "@nextui-org/react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { REPORT_REASONS } from "@/lib/constants/posts";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { Id } from "@convex/_generated/dataModel";

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  postId?: Id<"posts">;
  responseId?: Id<"postResponses">;
  contentType: "post" | "response";
}

export function ReportDialog({
  isOpen,
  onClose,
  postId,
  responseId,
  contentType,
}: ReportDialogProps) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportContent = useMutation(api.moderation.reportContent);

  const handleSubmit = async () => {
    if (!reason) {
      toast.error("Please select a reason");
      return;
    }

    if (description.trim().length < 10) {
      toast.error("Please provide a more detailed description");
      return;
    }

    setIsSubmitting(true);

    try {
      await reportContent({
        postId,
        responseId,
        reason,
        description: description.trim(),
      });

      toast.success("Report submitted successfully. Thank you for helping keep our community safe.");
      onClose();

      // Reset form
      setReason("");
      setDescription("");
    } catch (error: any) {
      console.error("Failed to submit report:", error);
      toast.error(error.message || "Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      classNames={{
        base: "rounded-[2rem] bg-white dark:bg-slate-900 shadow-2xl",
        header: "border-none px-8 pt-8 pb-0",
        body: "px-8 py-6",
        footer: "border-none px-8 pb-8 pt-0",
        closeButton: "top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
      }}
    >
      <ModalContent>
        <ModalHeader>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Report {contentType === "post" ? "Post" : "Response"}
              </h2>
            </div>
            <p className="text-sm font-normal text-slate-500 dark:text-slate-400">
              Help us keep the community safe
            </p>
          </div>
        </ModalHeader>

        <ModalBody>
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4 dark:border-amber-900/30 dark:bg-amber-950/20">
              <p className="text-sm text-amber-900 dark:text-amber-100">
                Reports are reviewed by moderators. Please provide as much detail as possible to help
                us understand the issue.
              </p>
            </div>

            <RadioGroup
              label="Reason for reporting"
              value={reason}
              onValueChange={setReason}
              classNames={{
                label: "text-sm font-medium text-slate-700 dark:text-slate-300 mb-2",
                wrapper: "gap-3",
              }}
            >
              {REPORT_REASONS.map((r) => (
                <Radio
                  key={r.value}
                  value={r.value}
                  classNames={{
                    base: "max-w-full cursor-pointer gap-3 rounded-xl border-2 border-transparent bg-slate-50 px-4 py-3 transition-all hover:bg-slate-100 data-[selected=true]:border-amber-500 data-[selected=true]:bg-amber-50 dark:bg-slate-800 dark:hover:bg-slate-700 dark:data-[selected=true]:bg-amber-950/30",
                    label: "text-sm font-medium text-slate-700 dark:text-slate-300",
                  }}
                >
                  {r.label}
                </Radio>
              ))}
            </RadioGroup>

            <Textarea
              label="Additional details"
              placeholder="Please describe the issue in more detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              minRows={4}
              description={`${description.length} / 10 characters minimum`}
              classNames={{
                label: "text-sm font-medium text-slate-700 dark:text-slate-300 mb-2",
                inputWrapper: "bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-transparent hover:bg-slate-100 focus-within:bg-white focus-within:border-amber-500 transition-all shadow-none",
                input: "text-slate-900 dark:text-white",
              }}
            />
          </div>
        </ModalBody>

        <ModalFooter>
          <div className="flex w-full items-center justify-end gap-3">
            <Button variant="light" onPress={onClose} isDisabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={handleSubmit}
              isLoading={isSubmitting}
              className="rounded-full font-medium shadow-lg shadow-red-500/20"
            >
              Submit Report
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
