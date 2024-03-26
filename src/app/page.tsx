"use client";

// Imports
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import MaxWidthWrapper from "@/components/maxWidthWrapper";
import firebaseConfig from "./config/firebasecfg";
import { Toaster } from "sonner";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = isSupported().then((yes) => (yes ? getAnalytics(app) : null));

export default function Home() {
  return (
    <MaxWidthWrapper>
      <Toaster position="bottom-center" richColors />
      <div className="mx-auto flex max-w-3xl flex-col items-center py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          How Are You <span className="text-blue-600">Today</span>?
        </h1>
        <p className="text-muted-foreground mt-6 max-w-prose text-lg">
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
