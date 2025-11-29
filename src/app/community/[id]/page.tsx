"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { Button } from "@nextui-org/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PostDetailView } from "@/components/community/PostDetailView";
import { scaleFadeVariants } from "@/lib/animations";
import { Id } from "@convex/_generated/dataModel";

interface PageProps {
  params: { id: string };
}

export default function PostDetailPage({ params }: PageProps) {
  const { id } = params;

  // Validate that id is a valid Convex ID
  const postId = id as Id<"posts">;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Link href="/community">
          <Button
            variant="light"
            startContent={<ArrowLeft className="h-4 w-4" />}
            className="rounded-full"
          >
            Back to Community
          </Button>
        </Link>
      </motion.div>

      {/* Post Detail */}
      <motion.div initial="hidden" animate="visible" variants={scaleFadeVariants}>
        <PostDetailView postId={postId} />
      </motion.div>
    </div>
  );
}
