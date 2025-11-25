"use client";

import Image from "next/image";
import Link from "next/link";
import { Toaster } from "sonner";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowRight,
  HeartPulse,
  MessageCircleHeart,
  NotebookPen,
  ShieldCheck,
  Sparkles,
  Sun,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";

import MaxWidthWrapper from "@/components/maxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dashboard } from "@/components/dashboard/Dashboard";

type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

const FEATURES: Feature[] = [
  {
    title: "Daily Check-ins",
    description: "Two-minute prompts to help you spot emotional patterns.",
    icon: Sun,
  },
  {
    title: "Private Journaling",
    description: "A safe space for your thoughts, encrypted and secure.",
    icon: NotebookPen,
  },
  {
    title: "Campus Resources",
    description: "One-tap access to counseling and crisis support.",
    icon: HeartPulse,
  },
  {
    title: "Peer Support",
    description: "Connect with students who understand the journey.",
    icon: MessageCircleHeart,
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "It’s simple, quick, and actually helps me notice when I’m getting stressed before it becomes overwhelming.",
    name: "Priya S.",
    role: "Sophomore, Psychology",
  },
  {
    quote:
      "Finally, an app that feels like a deep breath instead of another task on my to-do list.",
    name: "Jordan L.",
    role: "Senior, CS",
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isSignedIn) {
    return <Dashboard />;
  }

  return (
    <>
      <Toaster position="bottom-center" richColors />
      <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/10">

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
          {/* Warm Gradient Background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-orange-100/40 dark:bg-orange-900/10 blur-[100px] rounded-full opacity-70" />
            <div className="absolute top-20 right-0 w-[800px] h-[600px] bg-rose-100/30 dark:bg-rose-900/10 blur-[120px] rounded-full opacity-60" />
          </div>

          <MaxWidthWrapper>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="flex flex-col items-center text-center"
            >
              <motion.div variants={fadeIn} className="mb-6 inline-flex items-center rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-sm text-primary/80 backdrop-blur-sm">
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                <span>Reimagining student wellbeing</span>
              </motion.div>

              <motion.h1 variants={fadeIn} className="max-w-3xl text-5xl font-medium tracking-tight sm:text-7xl text-primary">
                Find your balance, <br className="hidden sm:block" />
                <span className="text-muted-foreground">one day at a time.</span>
              </motion.h1>

              <motion.p variants={fadeIn} className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
                How Are You? is a simple, private space to track your mood, journal your thoughts, and access support when you need it most.
              </motion.p>

              <motion.div variants={fadeIn} className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/sign-up" className={buttonVariants({ size: "lg", className: "rounded-full px-8 text-base" })}>
                  Start checking in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/about"
                  className={buttonVariants({ variant: "ghost", size: "lg", className: "rounded-full px-8 text-base hover:bg-primary/5" })}
                >
                  How it works
                </Link>
              </motion.div>

              {/* Dashboard Preview */}
              <motion.div
                variants={fadeIn}
                className="mt-20 relative w-full max-w-5xl mx-auto"
              >
                <div className="relative rounded-3xl border border-border/40 bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-border/10 bg-muted/30">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400/20" />
                      <div className="w-3 h-3 rounded-full bg-amber-400/20" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400/20" />
                    </div>
                  </div>
                  <Image
                    src="/dashboard-preview.png"
                    alt="How Are You? Dashboard Preview"
                    width={1200}
                    height={800}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </motion.div>
            </motion.div>
          </MaxWidthWrapper>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-muted/30">
          <MaxWidthWrapper>
            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group"
                  >
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-background border border-border/50 shadow-sm transition-colors group-hover:border-primary/20 group-hover:bg-primary/5">
                      <Icon className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-medium">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </MaxWidthWrapper>
        </section>

        {/* Testimonials Section */}
        <section className="py-24">
          <MaxWidthWrapper className="max-w-5xl">
            <div className="grid gap-8 md:grid-cols-2">
              {TESTIMONIALS.map((testimonial, i) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-3xl bg-muted/30 p-8 sm:p-10"
                >
                  <div className="flex flex-col h-full justify-between gap-6">
                    <p className="text-xl font-medium leading-relaxed text-foreground/80">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div>
                      <div className="font-medium">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </MaxWidthWrapper>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <MaxWidthWrapper>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-primary px-6 py-20 text-center sm:px-16">
              <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom_right,#ffffff05_0%,#ffffff00_100%)]" />
              <div className="relative z-10 mx-auto max-w-2xl space-y-8">
                <h2 className="text-3xl font-medium tracking-tight text-primary-foreground sm:text-4xl">
                  Ready to prioritize your wellbeing?
                </h2>
                <p className="text-primary-foreground/70 text-lg">
                  Join your peers in building healthier habits. It’s free, private, and takes just minutes a day.
                </p>
                <Link
                  href="/sign-up"
                  className={buttonVariants({
                    size: "lg",
                    variant: "secondary",
                    className: "rounded-full px-8 h-12 text-base font-medium",
                  })}
                >
                  Get Started Now
                </Link>
              </div>
            </div>
          </MaxWidthWrapper>
        </section>

        <footer className="py-12 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} How Are You? Built with care for students.</p>
        </footer>
      </div>
    </>
  );
}
