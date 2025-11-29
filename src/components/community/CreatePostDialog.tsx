"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Switch,
  Chip,
} from "@nextui-org/react";
import { ChevronLeft, ChevronRight, Check, AlertCircle, User, UserX } from "lucide-react";
import { POST_CATEGORIES, POST_PROMPTS, POSTING_RULES } from "@/lib/constants/posts";
import { COMMON_TAGS } from "@/lib/constants/moods";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import DOMPurify from "dompurify";

interface CreatePostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type PageNumber = 1 | 2 | 3 | 4 | 5;
type CategoryType = "wins" | "support" | "coping" | "resources" | "questions" | "reflections";

function ProgressStepper({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  return (
    <div className="mb-8 flex items-center justify-center gap-2">
      {Array.from({ length: totalPages }).map((_, idx) => (
        <div
          key={idx}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            idx + 1 === currentPage
              ? "w-8 bg-slate-900 dark:bg-white"
              : idx + 1 < currentPage
                ? "w-1.5 bg-slate-900/40 dark:bg-white/40"
                : "w-1.5 bg-slate-200 dark:bg-slate-800"
          )}
        />
      ))}
    </div>
  );
}

export function CreatePostDialog({ isOpen, onClose, onSuccess }: CreatePostDialogProps) {
  const [currentPage, setCurrentPage] = useState<PageNumber>(1);
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [reflectionAnswer, setReflectionAnswer] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [hasContentWarning, setHasContentWarning] = useState(false);
  const [contentWarning, setContentWarning] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const createPost = useMutation(api.posts.createPost);
  const cooldownData = useQuery(api.posts.checkPostCooldown);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCurrentPage(1);
        setCategory(null);
        setReflectionAnswer("");
        setTitle("");
        setContent("");
        setSelectedTags([]);
        setHasContentWarning(false);
        setContentWarning("");
        setIsAnonymous(false);
      }, 300);
    }
  }, [isOpen]);

  const canProceedFromPage = (page: PageNumber): boolean => {
    switch (page) {
      case 1:
        return category !== null;
      case 2:
        return reflectionAnswer.trim().length >= 20;
      case 3:
        return (
          title.trim().length >= POSTING_RULES.MIN_TITLE_LENGTH &&
          content.trim().length >= POSTING_RULES.MIN_CONTENT_LENGTH &&
          content.trim().length <= POSTING_RULES.MAX_CONTENT_LENGTH
        );
      case 4:
        return true; // Identity step is always valid
      case 5:
        return true; // Review step is always valid
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedFromPage(currentPage)) {
      setCurrentPage((prev) => Math.min(5, prev + 1) as PageNumber);
    }
  };

  const handleBack = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1) as PageNumber);
  };

  const handleSubmit = async () => {
    if (cooldownData && !cooldownData.canPost) {
      toast.error(`Please wait ${cooldownData.minutesRemaining} minutes before posting again`);
      return;
    }

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    setIsSubmitting(true);

    try {
      // Sanitize HTML content
      const sanitizedContent = DOMPurify.sanitize(content);

      await createPost({
        category,
        title: title.trim(),
        content: sanitizedContent,
        tags: selectedTags,
        isAnonymous,
        contentWarning: hasContentWarning ? contentWarning : undefined,
      });

      toast.success("Post created successfully!");
      onClose();
      onSuccess?.();
    } catch (error: any) {
      console.error("Failed to create post:", error);
      toast.error(error.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
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
          <div className="flex w-full flex-col items-center">
            <ProgressStepper currentPage={currentPage} totalPages={5} />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {currentPage === 1 && "Start a Conversation"}
              {currentPage === 2 && "Reflection"}
              {currentPage === 3 && "Write Post"}
              {currentPage === 4 && "Choose Identity"}
              {currentPage === 5 && "Review Post"}
            </h2>
          </div>
        </ModalHeader>

        <ModalBody>
          <AnimatePresence mode="wait">
            {/* Page 1: Category Selection */}
            {currentPage === 1 && (
              <motion.div
                key="page-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6"
              >
                <div className="text-center">
                  <p className="text-slate-600 dark:text-slate-400">
                    What would you like to share with the community today?
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {Object.entries(POST_CATEGORIES).map(([key, cat]) => (
                    <button
                      key={key}
                      onClick={() => setCategory(key as CategoryType)}
                      className={cn(
                        "group flex flex-col gap-3 rounded-2xl border p-5 text-left transition-all",
                        category === key
                          ? `border-${cat.color}-200 bg-${cat.color}-50 ring-1 ring-${cat.color}-200 dark:border-${cat.color}-900 dark:bg-${cat.color}-900/20 dark:ring-${cat.color}-900`
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-800/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl transition-transform group-hover:scale-110">{cat.icon}</span>
                        <span className={cn(
                          "font-semibold",
                          category === key ? `text-${cat.color}-900 dark:text-${cat.color}-100` : "text-slate-900 dark:text-white"
                        )}>
                          {cat.label}
                        </span>
                      </div>
                      <p className={cn(
                        "text-sm leading-relaxed",
                        category === key ? `text-${cat.color}-700 dark:text-${cat.color}-300` : "text-slate-600 dark:text-slate-400"
                      )}>
                        {cat.description}
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Page 2: Reflection Prompt */}
            {currentPage === 2 && category && (
              <motion.div
                key="page-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-4"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Take a moment to reflect
                </h3>
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/50">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {POST_PROMPTS[category][0]}
                  </p>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Why are you sharing this? How might it support your wellness journey?
                </p>
                <Textarea
                  value={reflectionAnswer}
                  onChange={(e) => setReflectionAnswer(e.target.value)}
                  placeholder="Take a moment to reflect on your intention for sharing..."
                  minRows={4}
                  classNames={{
                    input: "resize-none",
                  }}
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {reflectionAnswer.length} / 20 characters minimum
                </p>
              </motion.div>
            )}

            {/* Page 3: Write Post */}
            {currentPage === 3 && (
              <motion.div
                key="page-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-8"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Write your post
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Share your thoughts, experiences, or questions with the community.
                  </p>
                </div>

                {/* Title */}
                <Input
                  label="Title"
                  placeholder="Give your post a clear title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={POSTING_RULES.MAX_TITLE_LENGTH}
                  description={`${title.length} / ${POSTING_RULES.MAX_TITLE_LENGTH} characters`}
                  classNames={{
                    inputWrapper: "bg-slate-50 dark:bg-slate-800/50",
                  }}
                />

                {/* Rich Text Editor */}
                <div className="flex flex-col gap-3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Content
                  </label>
                  <RichTextEditor value={content} onChange={setContent} />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {stripHtml(content).length} / {POSTING_RULES.MIN_CONTENT_LENGTH}-
                    {POSTING_RULES.MAX_CONTENT_LENGTH} characters
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-col gap-3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Tags (optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_TAGS.map((tag) => (
                      <Chip
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        variant={selectedTags.includes(tag) ? "solid" : "bordered"}
                        color={selectedTags.includes(tag) ? "primary" : "default"}
                        className="cursor-pointer"
                      >
                        {tag}
                      </Chip>
                    ))}
                  </div>
                </div>

                {/* Content Warning */}
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                  <Switch
                    isSelected={hasContentWarning}
                    onValueChange={setHasContentWarning}
                    classNames={{
                      wrapper: "group-data-[selected=true]:bg-blue-600 bg-slate-200 dark:bg-slate-700",
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Add content warning
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      For potentially triggering content
                    </p>
                  </div>
                </div>

                {hasContentWarning && (
                  <Input
                    label="Content Warning"
                    placeholder="e.g., Discussion of anxiety, mentions of food/eating"
                    value={contentWarning}
                    onChange={(e) => setContentWarning(e.target.value)}
                    classNames={{
                      inputWrapper: "bg-slate-50 dark:bg-slate-800/50",
                    }}
                  />
                )}
              </motion.div>
            )}

            {/* Page 4: Identity Selection */}
            {currentPage === 4 && (
              <motion.div
                key="page-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-4"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  How would you like to post?
                </h3>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => setIsAnonymous(false)}
                    className={cn(
                      "flex flex-col gap-3 rounded-2xl border-2 p-4 text-left transition-all",
                      !isAnonymous
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                        : "border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-slate-900 dark:text-white">
                        Post as yourself
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Your nickname will be visible to others. This can help build meaningful
                      connections.
                    </p>
                  </button>

                  <button
                    onClick={() => setIsAnonymous(true)}
                    className={cn(
                      "flex flex-col gap-3 rounded-2xl border-2 p-4 text-left transition-all",
                      isAnonymous
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                        : "border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <UserX className="h-5 w-5 text-purple-600" />
                      <span className="font-semibold text-slate-900 dark:text-white">
                        Post anonymously
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      You&apos;ll appear as &quot;Anonymous.&quot; Use this when you need extra privacy.
                    </p>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Page 5: Review */}
            {currentPage === 5 && category && (
              <motion.div
                key="page-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-4"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Review your post
                </h3>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                  <div className="mb-3 flex items-center gap-2">
                    <Chip size="sm" variant="flat">
                      <span className="mr-1">{POST_CATEGORIES[category].icon}</span>
                      {POST_CATEGORIES[category].label}
                    </Chip>
                    {hasContentWarning && (
                      <Chip size="sm" variant="flat" color="warning">
                        Content Warning
                      </Chip>
                    )}
                  </div>

                  <h4 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    {title}
                  </h4>

                  <div
                    className="prose prose-sm mb-3 dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
                  />

                  {selectedTags.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {selectedTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Posted by: {isAnonymous ? "Anonymous" : "Your nickname"}
                  </p>
                </div>

                {cooldownData && !cooldownData.canPost && (
                  <div className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/50">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                    <div>
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                        Cooldown active
                      </p>
                      <p className="text-xs text-amber-800 dark:text-amber-200">
                        You can post again in {cooldownData.minutesRemaining} minutes. Take time
                        to reflect!
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </ModalBody>

        <ModalFooter>
          <div className="flex w-full items-center justify-between">
            <Button
              variant="light"
              onPress={handleBack}
              isDisabled={currentPage === 1 || isSubmitting}
              startContent={<ChevronLeft className="h-4 w-4" />}
            >
              Back
            </Button>

            <div className="flex gap-2">
              <Button variant="light" onPress={onClose} isDisabled={isSubmitting}>
                Cancel
              </Button>

              {currentPage < 5 ? (
                <Button
                  color="primary"
                  onPress={handleNext}
                  isDisabled={!canProceedFromPage(currentPage)}
                  endContent={<ChevronRight className="h-4 w-4" />}
                  className="rounded-full bg-blue-600 font-medium text-white hover:bg-blue-700"
                >
                  Next
                </Button>
              ) : (
                <Button
                  color="primary"
                  onPress={handleSubmit}
                  isLoading={isSubmitting}
                  isDisabled={cooldownData && !cooldownData.canPost}
                  endContent={<Check className="h-4 w-4" />}
                  className="rounded-full bg-blue-600 font-medium text-white hover:bg-blue-700"
                >
                  Publish Post
                </Button>
              )}
            </div>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
