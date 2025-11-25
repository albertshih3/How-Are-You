"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type TourStep = {
    targetId: string;
    title: string;
    description: string;
    position: "top" | "bottom" | "left" | "right";
};

const STEPS: TourStep[] = [
    {
        targetId: "tour-log-entry-btn",
        title: "Start Here",
        description: "Tap this button to log your first check-in. It only takes a minute.",
        position: "right",
    },
    {
        targetId: "tour-insights-card",
        title: "Your Insights",
        description: "As you log more entries, you'll see your emotional trends and patterns appear here.",
        position: "bottom",
    },
    {
        targetId: "tour-recent-entries",
        title: "History",
        description: "View and reflect on your past entries. You can always look back.",
        position: "left",
    },
];

export function DashboardTour({ onComplete }: { onComplete: () => void }) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const completeTour = useMutation(api.users.completeTour);

    const currentStep = STEPS[currentStepIndex];

    const updateRect = useCallback(() => {
        const element = document.getElementById(currentStep.targetId);
        if (element) {
            setTargetRect(element.getBoundingClientRect());
        }
    }, [currentStep.targetId]);

    useEffect(() => {
        updateRect();
        window.addEventListener("resize", updateRect);
        window.addEventListener("scroll", updateRect);
        return () => {
            window.removeEventListener("resize", updateRect);
            window.removeEventListener("scroll", updateRect);
        };
    }, [updateRect]);

    // Add a small delay to allow layout to settle
    useEffect(() => {
        const timer = setTimeout(updateRect, 100);
        return () => clearTimeout(timer);
    }, [currentStepIndex, updateRect]);

    const handleNext = async () => {
        if (currentStepIndex < STEPS.length - 1) {
            setCurrentStepIndex((prev) => prev + 1);
        } else {
            await completeTour();
            onComplete();
        }
    };

    const handleSkip = async () => {
        await completeTour();
        onComplete();
    };

    if (!targetRect) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Dimmed Background with Cutout */}
            <div className="absolute inset-0 bg-black/50 transition-all duration-500" style={{
                clipPath: `polygon(
          0% 0%, 0% 100%, 
          ${targetRect.left}px 100%, 
          ${targetRect.left}px ${targetRect.top}px, 
          ${targetRect.right}px ${targetRect.top}px, 
          ${targetRect.right}px ${targetRect.bottom}px, 
          ${targetRect.left}px ${targetRect.bottom}px, 
          ${targetRect.left}px 100%, 
          100% 100%, 100% 0%
        )`
            }} />

            {/* Spotlight Border */}
            <motion.div
                className="absolute rounded-xl border-2 border-primary shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                initial={false}
                animate={{
                    top: targetRect.top - 4,
                    left: targetRect.left - 4,
                    width: targetRect.width + 8,
                    height: targetRect.height + 8,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
            />

            {/* Tooltip */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStepIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute w-80 rounded-2xl bg-card p-6 shadow-xl border border-border"
                    style={{
                        top: getTooltipPosition(targetRect, currentStep.position).top,
                        left: getTooltipPosition(targetRect, currentStep.position).left,
                    }}
                >
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">
                            Step {currentStepIndex + 1} of {STEPS.length}
                        </span>
                        <button onClick={handleSkip} className="text-muted-foreground hover:text-foreground">
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <h3 className="mb-2 text-lg font-bold">{currentStep.title}</h3>
                    <p className="mb-6 text-sm text-muted-foreground">{currentStep.description}</p>

                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={handleSkip}>
                            Skip
                        </Button>
                        <Button size="sm" onClick={handleNext}>
                            {currentStepIndex === STEPS.length - 1 ? "Finish" : "Next"}
                        </Button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function getTooltipPosition(rect: DOMRect, position: "top" | "bottom" | "left" | "right") {
    const gap = 16;
    const tooltipWidth = 320; // Approximate width
    const tooltipHeight = 200; // Approximate height

    switch (position) {
        case "top":
            return {
                top: rect.top - tooltipHeight - gap,
                left: rect.left + rect.width / 2 - tooltipWidth / 2,
            };
        case "bottom":
            return {
                top: rect.bottom + gap,
                left: rect.left + rect.width / 2 - tooltipWidth / 2,
            };
        case "left":
            return {
                top: rect.top + rect.height / 2 - tooltipHeight / 2,
                left: rect.left - tooltipWidth - gap,
            };
        case "right":
            return {
                top: rect.top + rect.height / 2 - tooltipHeight / 2,
                left: rect.right + gap,
            };
    }
}
