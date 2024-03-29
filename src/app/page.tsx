"use client";

// Imports
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import MaxWidthWrapper from "@/components/maxWidthWrapper";

import { Toaster } from "sonner";

export default function Home() {
  return (
    <MaxWidthWrapper>
      <Toaster position="bottom-center" richColors />
      <div className="mx-auto flex max-w-3xl flex-col items-center py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          How Are You <span className="text-blue-600">Today</span>?
        </h1>
        <p className="mt-6 max-w-prose text-lg text-muted-foreground">
          A mental health application for students, by students.
        </p>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <Link href="/sign-up" className={buttonVariants()}>
            Get Started &rarr;
          </Link>
          <Button variant="ghost">Learn More &rarr;</Button>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
