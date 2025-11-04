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
  pronouns: string;
};

type TrustSignal = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const FEATURES: Feature[] = [
  {
    title: "Daily mood check-ins",
    description:
      "Understand emotional patterns with guided prompts tailored for student life.",
    icon: HeartPulse,
  },
  {
    title: "Reflective journaling",
    description:
      "Capture thoughts in a private space with templates designed by peers and counselors.",
    icon: NotebookPen,
  },
  {
    title: "Resource library",
    description:
      "Access evidence-based coping tools, campus services, and crisis hotlines in one hub.",
    icon: Sparkles,
  },
  {
    title: "Supportive community",
    description:
      "Connect with moderated peer groups and share wins that keep momentum going.",
    icon: MessageCircleHeart,
  },
];

const TRUST_SIGNALS: TrustSignal[] = [
  {
    title: "Privacy first",
    description:
      "Powered by Clerk authentication—your reflections stay yours.",
    icon: ShieldCheck,
  },
  {
    title: "Evidence-informed",
    description:
      "Developed with input from student counselors and backed by research insights.",
    icon: Activity,
  },
  {
    title: "Made by students",
    description:
      "Co-created with real student stories to ensure it resonates with daily campus life.",
    icon: HeartPulse,
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Checking in takes less than two minutes, but it has completely changed how I notice stress before it spirals.",
    name: "Priya S.",
    role: "Sophomore • Psychology",
    pronouns: "she/her",
  },
  {
    quote:
      "It feels like it was built by people who get what juggling classes, clubs, and life actually looks like.",
    name: "Jordan L.",
    role: "Senior • Computer Science",
    pronouns: "they/them",
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const heroContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
};

const staggerGrid = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const FeatureCard = ({ feature }: { feature: Feature }) => {
  const Icon = feature.icon;
  return (
    <motion.div
      variants={fadeIn}
      className="flex h-full flex-col gap-4 rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{feature.title}</h3>
        <p className="text-sm text-muted-foreground">{feature.description}</p>
      </div>
    </motion.div>
  );
};

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <motion.figure
    variants={fadeIn}
    className="flex h-full flex-col justify-between rounded-2xl border border-border/60 bg-background/80 p-6 shadow-sm backdrop-blur"
  >
    <blockquote className="text-base leading-7 text-foreground/90">
      “{testimonial.quote}”
    </blockquote>
    <figcaption className="mt-6">
      <p className="font-semibold">{testimonial.name}</p>
      <p className="text-sm text-muted-foreground">
        {testimonial.role} • {testimonial.pronouns}
      </p>
    </figcaption>
  </motion.figure>
);

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();

  // Show loading state while checking auth
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show Dashboard for signed-in users
  if (isSignedIn) {
    return <Dashboard />;
  }

  // Show landing page for non-authenticated users
  return (
    <>
      <Toaster position="bottom-center" richColors />
      <div className="flex flex-col gap-24 pb-20">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-background to-background" />
          <MaxWidthWrapper className="relative pt-20">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={heroContainer}
              className="grid items-center gap-12 lg:grid-cols-[1fr,0.9fr]"
            >
              <motion.div variants={fadeIn} className="space-y-7">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
                  Supporting students every single day
                </span>
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                  Get ahead of burnout with daily moments of care.
                </h1>
                <p className="max-w-xl text-lg text-muted-foreground">
                  How Are You? empowers students to understand their emotional
                  patterns, build resilient routines, and reach out before stress
                  overwhelms. Reflect in private, find actionable resources, and
                  celebrate progress with peers who get it.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link href="/sign-up" className={buttonVariants({ size: "lg" })}>
                    Start your wellbeing journey
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    href="/about"
                    className={buttonVariants({ variant: "ghost", size: "lg" })}
                  >
                    Learn how it works
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
                <dl className="grid grid-cols-2 gap-6 text-left text-sm text-muted-foreground sm:flex sm:items-center sm:gap-10">
                  <div>
                    <dt className="font-semibold text-foreground">5 min a day</dt>
                    <dd>to check in and regroup.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">100% private</dt>
                    <dd>your reflections stay encrypted.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">Student-led</dt>
                    <dd>built with real campus voices.</dd>
                  </div>
                </dl>
              </motion.div>
              <motion.div
                variants={fadeIn}
                className="relative mx-auto w-full max-w-lg"
              >
                <div className="absolute inset-0 -z-10 blur-3xl" aria-hidden>
                  <div className="h-full w-full rounded-full bg-gradient-to-r from-primary/40 via-sky-300/30 to-indigo-400/30" />
                </div>
                <div className="overflow-hidden rounded-3xl border border-border/60 bg-background/90 shadow-xl ring-1 ring-primary/10">
                  <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-6 py-4">
                    <span className="text-sm font-medium text-muted-foreground">
                      Today’s check-in preview
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="text-xs text-muted-foreground">Live</span>
                    </div>
                  </div>
                  <div className="grid gap-6 px-6 py-8">
                    <div className="rounded-2xl border border-border/60 bg-card/70 p-4 text-sm text-muted-foreground">
                      “I felt energized after study group, but anxious about the
                      upcoming exam. Tomorrow I’ll outline the last chapter.”
                    </div>
                    <div className="grid gap-3 text-sm">
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        Mood trend this week
                      </span>
                      <Image
                        src="/next.svg"
                        alt="Sample chart placeholder"
                        width={400}
                        height={160}
                        className="h-40 w-full rounded-xl border border-dashed border-border/60 bg-muted/30 object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-primary/5 px-4 py-3 text-sm">
                      <div>
                        <p className="font-medium text-foreground">Actionable next step</p>
                        <p className="text-muted-foreground">Schedule a 15-minute walk with a friend this afternoon.</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Log it
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </MaxWidthWrapper>
        </section>

        <section>
          <MaxWidthWrapper className="space-y-12">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Built to make support simple
              </h2>
              <p className="mx-auto max-w-2xl text-base text-muted-foreground">
                We combine daily micro-reflections with proven techniques so you can notice patterns, regulate emotions, and get help when it matters most.
              </p>
            </div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerGrid}
              className="grid gap-6 md:grid-cols-2"
            >
              {FEATURES.map((feature) => (
                <FeatureCard key={feature.title} feature={feature} />
              ))}
            </motion.div>
          </MaxWidthWrapper>
        </section>

        <section className="bg-muted/40 py-16">
          <MaxWidthWrapper className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={fadeIn}
              className="space-y-6"
            >
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Feel supported, even on the busiest days
              </h2>
              <p className="text-base text-muted-foreground">
                Quick prompts encourage mindful breaks between classes, while contextual insights help you recognize what fuels or drains you. When you need extra support, see campus resources and crisis contacts without leaving the app.
              </p>
              <ul className="grid gap-4 text-sm text-muted-foreground">
                {TRUST_SIGNALS.map((signal) => {
                  const Icon = signal.icon;
                  return (
                    <li key={signal.title} className="flex gap-3 rounded-xl border border-border/50 bg-background/80 p-4">
                      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{signal.title}</p>
                        <p>{signal.description}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={fadeIn}
              className="relative overflow-hidden rounded-3xl border border-border/60 bg-background shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-sky-200/30" aria-hidden />
              <div className="relative grid gap-6 px-8 py-10">
                <h3 className="text-xl font-semibold">Your wellbeing command center</h3>
                <p className="text-sm text-muted-foreground">
                  Visualize mood trends, log gratitude moments, and jump into curated coping strategies. Everything stays synced across devices.
                </p>
                <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-6 text-sm text-primary">
                  This is a placeholder for a future dashboard screenshot. Replace with product imagery once design is finalized.
                </div>
                <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wide text-muted-foreground">
                  <span className="rounded-full bg-background px-3 py-1">Mood insights</span>
                  <span className="rounded-full bg-background px-3 py-1">Guided journals</span>
                  <span className="rounded-full bg-background px-3 py-1">Resource library</span>
                  <span className="rounded-full bg-background px-3 py-1">Peer support</span>
                </div>
              </div>
            </motion.div>
          </MaxWidthWrapper>
        </section>

        <section>
          <MaxWidthWrapper className="space-y-10">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Hear from students who rely on How Are You?
              </h2>
              <p className="mx-auto max-w-2xl text-base text-muted-foreground">
                Feedback from our beta community keeps the experience grounded in real needs. Their stories guide every new release.
              </p>
            </div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerGrid}
              className="grid gap-6 md:grid-cols-2"
            >
              {TESTIMONIALS.map((testimonial) => (
                <TestimonialCard key={testimonial.name} testimonial={testimonial} />
              ))}
            </motion.div>
          </MaxWidthWrapper>
        </section>

        <section className="py-16">
          <MaxWidthWrapper>
            <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-3xl border border-border/50 bg-card px-8 py-12 text-center shadow-lg">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Ready to check in with yourself?
              </h2>
              <p className="max-w-2xl text-base text-muted-foreground">
                Create your free account today and start building habits that keep you grounded, focused, and supported throughout the semester.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/sign-up" className={buttonVariants({ size: "lg" })}>
                  Join the beta community
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/about"
                  className={buttonVariants({ variant: "outline", size: "lg" })}
                >
                  Partner with us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </MaxWidthWrapper>
        </section>
      </div>
    </>
  );
}
