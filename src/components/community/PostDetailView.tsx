"use client";

import { useState } from "react";
import { Card, CardBody, Chip, Button, Divider } from "@nextui-org/react";
import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Clock,
  AlertTriangle,
  Flag,
  User,
  UserX,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { POST_CATEGORIES, COMMUNITY_GUIDELINES } from "@/lib/constants/posts";
import { scaleFadeVariants } from "@/lib/animations";
import { RespondDialog } from "./RespondDialog";
import { ReportDialog } from "./ReportDialog";
import { Id } from "@convex/_generated/dataModel";
import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PostDetailViewProps {
  postId: Id<"posts">;
}

export function PostDetailView({ postId }: PostDetailViewProps) {
  const [showRespondDialog, setShowRespondDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportResponseId, setReportResponseId] = useState<Id<"postResponses"> | undefined>();

  const post = useQuery(api.posts.getPostById, { postId });
  const responses = useQuery(api.postResponses.getPostResponses, { postId });
  const hasSupported = useQuery(api.posts.hasSupported, { postId });
  const toggleSupport = useMutation(api.posts.toggleSupport);

  if (!post) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">Post not found</p>
      </div>
    );
  }

  const category = POST_CATEGORIES[post.category];
  const timeAgo = getTimeAgo(post.createdAt);

  const handleToggleSupport = async () => {
    try {
      await toggleSupport({ postId });
    } catch (error: any) {
      toast.error(error.message || "Failed to update support");
    }
  };

  const handleReportPost = () => {
    setReportResponseId(undefined);
    setShowReportDialog(true);
  };

  const handleReportResponse = (responseId: Id<"postResponses">) => {
    setReportResponseId(responseId);
    setShowReportDialog(true);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Main Post Card */}
        <motion.div initial="hidden" animate="visible" variants={scaleFadeVariants}>
          <Card className="w-full rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <CardBody className="flex flex-col gap-6 p-8">
              {/* Header with category and content warning */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Chip
                    size="md"
                    variant="flat"
                    className={`bg-${category.color}-50 text-${category.color}-700 dark:bg-${category.color}-500/10 dark:text-${category.color}-400`}
                    startContent={<span className="text-lg">{category.icon}</span>}
                  >
                    {category.label}
                  </Chip>
                  {post.contentWarning && (
                    <Chip
                      size="md"
                      variant="flat"
                      className="bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                      startContent={<AlertTriangle className="h-4 w-4" />}
                    >
                      Content Warning: {post.contentWarning}
                    </Chip>
                  )}
                </div>

                <Button
                  size="sm"
                  variant="light"
                  onPress={handleReportPost}
                  startContent={<Flag className="h-4 w-4" />}
                  className="text-slate-500"
                >
                  Report
                </Button>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold leading-tight text-slate-900 dark:text-white">
                {post.title}
              </h1>

              {/* Content */}
              <div
                className="prose prose-slate max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
              />

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <Divider />

              {/* Footer with author and actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {post.isAnonymous ? (
                      <UserX className="h-5 w-5 text-slate-400" />
                    ) : (
                      <User className="h-5 w-5 text-slate-400" />
                    )}
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {post.authorDisplayName}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                        <Clock className="h-3 w-3" />
                        <span>{timeAgo}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    size="md"
                    variant={hasSupported ? "solid" : "bordered"}
                    color={hasSupported ? "danger" : "default"}
                    onPress={handleToggleSupport}
                    startContent={
                      <Heart
                        className={cn(
                          "h-4 w-4",
                          hasSupported && "fill-current"
                        )}
                      />
                    }
                    className="rounded-full"
                  >
                    {post.supportCount}
                  </Button>

                  <Button
                    size="md"
                    color="primary"
                    onPress={() => setShowRespondDialog(true)}
                    startContent={<MessageCircle className="h-4 w-4" />}
                    className="rounded-full"
                  >
                    Respond
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Responses Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Responses ({post.responseCount})
          </h2>

          {responses && responses.length > 0 ? (
            <div className="flex flex-col gap-4">
              {responses.map((response, index) => (
                <motion.div
                  key={response._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                    <CardBody className="flex flex-col gap-4 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {response.isAnonymous ? (
                            <UserX className="h-4 w-4 text-slate-400" />
                          ) : (
                            <User className="h-4 w-4 text-slate-400" />
                          )}
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {response.authorDisplayName}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                              <Clock className="h-3 w-3" />
                              <span>{getTimeAgo(response.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="light"
                          isIconOnly
                          onPress={() => handleReportResponse(response._id)}
                        >
                          <Flag className="h-4 w-4 text-slate-400" />
                        </Button>
                      </div>

                      <div
                        className="prose prose-sm prose-slate dark:prose-invert"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(response.content),
                        }}
                      />
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
              <CardBody className="flex flex-col items-center justify-center gap-4 p-12 text-center">
                <MessageCircle className="h-12 w-12 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-600 dark:text-slate-400">
                    No responses yet
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-500">
                    Be the first to offer support
                  </p>
                </div>
                <Button
                  color="primary"
                  onPress={() => setShowRespondDialog(true)}
                  className="rounded-full"
                >
                  Add Response
                </Button>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Crisis Resources Footer */}
        {post.contentWarning && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/50">
            <h3 className="mb-2 text-sm font-semibold text-blue-900 dark:text-blue-100">
              {COMMUNITY_GUIDELINES.crisisResources.intro}
            </h3>
            <div className="grid gap-2 sm:grid-cols-3">
              {COMMUNITY_GUIDELINES.crisisResources.resources.map((resource, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-blue-200 bg-white p-3 dark:border-blue-900 dark:bg-slate-900"
                >
                  <p className="text-xs font-semibold text-blue-900 dark:text-blue-100">
                    {resource.name}
                  </p>
                  <p className="text-xs font-medium text-blue-800 dark:text-blue-200">
                    {resource.contact}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <RespondDialog
        isOpen={showRespondDialog}
        onClose={() => setShowRespondDialog(false)}
        postId={postId}
        onSuccess={() => {
          // Responses will auto-refresh via Convex reactivity
        }}
      />

      <ReportDialog
        isOpen={showReportDialog}
        onClose={() => setShowReportDialog(false)}
        postId={reportResponseId ? undefined : postId}
        responseId={reportResponseId}
        contentType={reportResponseId ? "response" : "post"}
      />
    </>
  );
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;
  return `${Math.floor(seconds / 2592000)}mo ago`;
}
