"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles, BookHeart, LineChart, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "welcome" | "intent" | "experience" | "features" | "completion";

export function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
    const [step, setStep] = useState<Step>("welcome");
    const [intent, setIntent] = useState<string>("");
    const [experience, setExperience] = useState<string>("");

    const completeOnboarding = useMutation(api.users.completeOnboarding);

    const handleComplete = async () => {
        await completeOnboarding({ intent, experienceLevel: experience });
        onComplete();
    };

    const nextStep = (next: Step) => setStep(next);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-2xl">
                <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

                <AnimatePresence mode="wait">
                    {step === "welcome" && (
                        <WelcomeStep key="welcome" onNext={() => nextStep("intent")} />
                    )}
                    {step === "intent" && (
                        <IntentStep
                            key="intent"
                            selected={intent}
                            onSelect={setIntent}
                            onNext={() => nextStep("experience")}
                        />
                    )}
                    {step === "experience" && (
                        <ExperienceStep
                            key="experience"
                            selected={experience}
                            onSelect={setExperience}
                            onNext={() => nextStep("features")}
                        />
                    )}
                    {step === "features" && (
                        <FeaturesStep key="features" onNext={() => nextStep("completion")} />
                    )}
                    {step === "completion" && (
                        <CompletionStep key="completion" onComplete={handleComplete} />
                    )}
                </AnimatePresence>

                <div className="mt-8 flex justify-center gap-2">
                    {["welcome", "intent", "experience", "features", "completion"].map((s, i) => (
                        <div
                            key={s}
                            className={cn(
                                "h-1.5 rounded-full transition-all duration-300",
                                step === s ? "w-8 bg-primary" : "w-1.5 bg-muted"
                            )}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center text-center"
        >
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight">Welcome to How Are You?</h2>
            <p className="mb-8 max-w-md text-muted-foreground">
                Your personal space for reflection, growth, and emotional well-being.
                Let&apos;s get to know you a little better to personalize your experience.
            </p>
            <Button size="lg" onClick={onNext} className="rounded-full px-8">
                Let&apos;s Begin <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </motion.div>
    );
}

function IntentStep({
    selected,
    onSelect,
    onNext
}: {
    selected: string;
    onSelect: (val: string) => void;
    onNext: () => void;
}) {
    const intents = [
        { id: "stress", label: "Manage Stress", icon: "😤" },
        { id: "mood", label: "Track Mood", icon: "📊" },
        { id: "journal", label: "Daily Journaling", icon: "✍️" },
        { id: "curious", label: "Just Curious", icon: "🤔" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center"
        >
            <h2 className="mb-2 text-2xl font-bold">What brings you here today?</h2>
            <p className="mb-8 text-muted-foreground">Select the one that resonates most.</p>

            <div className="mb-8 grid w-full grid-cols-2 gap-4">
                {intents.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onSelect(item.id)}
                        className={cn(
                            "flex flex-col items-center justify-center rounded-2xl border-2 p-6 transition-all hover:border-primary/50 hover:bg-primary/5",
                            selected === item.id
                                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                : "border-border bg-card"
                        )}
                    >
                        <span className="mb-2 text-3xl">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </div>

            <Button
                size="lg"
                onClick={onNext}
                disabled={!selected}
                className="rounded-full px-8"
            >
                Continue
            </Button>
        </motion.div>
    );
}

function ExperienceStep({
    selected,
    onSelect,
    onNext
}: {
    selected: string;
    onSelect: (val: string) => void;
    onNext: () => void;
}) {
    const options = [
        { id: "new", label: "I'm new to journaling", desc: "Guide me through the basics" },
        { id: "experienced", label: "I journal regularly", desc: "I know what I'm doing" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center"
        >
            <h2 className="mb-2 text-2xl font-bold">Have you journaled before?</h2>
            <p className="mb-8 text-muted-foreground">Help us tailor the guidance level.</p>

            <div className="mb-8 flex w-full flex-col gap-4">
                {options.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onSelect(item.id)}
                        className={cn(
                            "flex items-center justify-between rounded-2xl border-2 p-6 text-left transition-all hover:border-primary/50 hover:bg-primary/5",
                            selected === item.id
                                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                : "border-border bg-card"
                        )}
                    >
                        <div>
                            <div className="font-semibold">{item.label}</div>
                            <div className="text-sm text-muted-foreground">{item.desc}</div>
                        </div>
                        {selected === item.id && <Check className="h-5 w-5 text-primary" />}
                    </button>
                ))}
            </div>

            <Button
                size="lg"
                onClick={onNext}
                disabled={!selected}
                className="rounded-full px-8"
            >
                Continue
            </Button>
        </motion.div>
    );
}

function FeaturesStep({ onNext }: { onNext: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center text-center"
        >
            <h2 className="mb-8 text-2xl font-bold">Here&apos;s what you can do</h2>

            <div className="mb-8 grid w-full gap-6 sm:grid-cols-3">
                <div className="flex flex-col items-center gap-3 rounded-2xl bg-secondary/50 p-4">
                    <div className="rounded-xl bg-blue-500/10 p-3 text-blue-500">
                        <BookHeart className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold">Daily Check-ins</h3>
                    <p className="text-xs text-muted-foreground">Quick prompts to capture your feelings.</p>
                </div>
                <div className="flex flex-col items-center gap-3 rounded-2xl bg-secondary/50 p-4">
                    <div className="rounded-xl bg-purple-500/10 p-3 text-purple-500">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold">Private & Secure</h3>
                    <p className="text-xs text-muted-foreground">End-to-end encrypted. Only you have the key.</p>
                </div>
                <div className="flex flex-col items-center gap-3 rounded-2xl bg-secondary/50 p-4">
                    <div className="rounded-xl bg-green-500/10 p-3 text-green-500">
                        <LineChart className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold">Insights</h3>
                    <p className="text-xs text-muted-foreground">Visualize your emotional trends over time.</p>
                </div>
            </div>

            <Button size="lg" onClick={onNext} className="rounded-full px-8">
                Sounds Good
            </Button>
        </motion.div>
    );
}

function CompletionStep({ onComplete }: { onComplete: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center"
        >
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10">
                <Check className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="mb-4 text-3xl font-bold">You&apos;re all set!</h2>
            <p className="mb-8 max-w-md text-muted-foreground">
                Your safe space is ready. We&apos;ll give you a quick tour of the dashboard to get you started.
            </p>
            <Button size="lg" onClick={onComplete} className="rounded-full px-8">
                Go to Dashboard
            </Button>
        </motion.div>
    );
}
