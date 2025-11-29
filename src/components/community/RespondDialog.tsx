"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Switch,
} from "@nextui-org/react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { POSTING_RULES } from "@/lib/constants/posts";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
import { Id } from "@convex/_generated/dataModel";
import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";

interface RespondDialogProps {
  isOpen: boolean;
  onClose: () => void;
  postId: Id<"posts">;
  onSuccess?: () => void;
}

export function RespondDialog({ isOpen, onClose, postId, onSuccess }: RespondDialogProps) {
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createResponse = useMutation(api.postResponses.createResponse);

  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const contentLength = stripHtml(content).length;

  const handleSubmit = async () => {
    if (contentLength < POSTING_RULES.MIN_RESPONSE_LENGTH) {
      toast.error(`Response must be at least ${POSTING_RULES.MIN_RESPONSE_LENGTH} characters`);
      return;
    }

    if (contentLength > POSTING_RULES.MAX_RESPONSE_LENGTH) {
      toast.error(`Response must be less than ${POSTING_RULES.MAX_RESPONSE_LENGTH} characters`);
      return;
    }

    setIsSubmitting(true);

    try {
      const sanitizedContent = DOMPurify.sanitize(content);

      await createResponse({
        postId,
        content: sanitizedContent,
        isAnonymous,
      });

      toast.success("Response posted successfully!");
      onClose();
      onSuccess?.();

      // Reset form
      setContent("");
      setIsAnonymous(false);
    } catch (error: any) {
      console.error("Failed to create response:", error);
      toast.error(error.message || "Failed to post response");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      isDismissable={!isSubmitting}
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
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Add Response</h2>
            <p className="text-sm font-normal text-slate-500 dark:text-slate-400">
              Share your support and perspective
            </p>
          </div>
        </ModalHeader>

        <ModalBody>
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div className="flex flex-col gap-1 py-0.5">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                    How can your response offer support?
                  </p>
                  <p className="text-xs leading-relaxed text-blue-700 dark:text-blue-300">
                    Share from your own experience, validate their feelings, or offer a helpful
                    perspective.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Your Response
              </label>
              <RichTextEditor value={content} onChange={setContent} />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {contentLength} / {POSTING_RULES.MIN_RESPONSE_LENGTH}-
                {POSTING_RULES.MAX_RESPONSE_LENGTH} characters
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <Switch
                isSelected={isAnonymous}
                onValueChange={setIsAnonymous}
                classNames={{
                  wrapper: "group-data-[selected=true]:bg-blue-600 bg-slate-200 dark:bg-slate-700",
                }}
              />
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Respond anonymously
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your nickname will be hidden
                </p>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <div className="flex w-full items-center justify-end gap-3">
            <Button variant="light" onPress={onClose} isDisabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleSubmit}
              isLoading={isSubmitting}
              isDisabled={
                contentLength < POSTING_RULES.MIN_RESPONSE_LENGTH ||
                contentLength > POSTING_RULES.MAX_RESPONSE_LENGTH
              }
              className={cn(
                "rounded-full bg-slate-900 px-6 font-medium text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:shadow-white/10 dark:hover:bg-slate-100",
                (contentLength < POSTING_RULES.MIN_RESPONSE_LENGTH ||
                  contentLength > POSTING_RULES.MAX_RESPONSE_LENGTH) &&
                "cursor-not-allowed opacity-50 shadow-none hover:bg-slate-900 dark:hover:bg-white"
              )}
            >
              Post Response
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
