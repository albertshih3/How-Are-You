"use client";

import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

export default function AuthSidePanel() {
    const pathname = usePathname();
    const isSignup = pathname.includes("/sign-up");

    return (
        <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
                {isSignup ? (
                    <>
                        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm backdrop-blur-sm mb-4">
                            <Sparkles className="mr-2 h-3.5 w-3.5" />
                            <span>Student Wellbeing</span>
                        </div>
                        <p className="text-lg leading-relaxed">
                            &ldquo;Join your peers in building healthier habits. It&apos;s free, private, and takes just minutes a day.&rdquo;
                        </p>
                        <footer className="text-sm opacity-80">The How Are You Team</footer>
                    </>
                ) : (
                    <>
                        <p className="text-lg leading-relaxed">
                            &ldquo;Welcome back! It&apos;s great to see you again. Take a moment to check in with yourself.&rdquo;
                        </p>
                        <footer className="text-sm opacity-80">Daily Reminder</footer>
                    </>
                )}
            </blockquote>
        </div>
    );
}
