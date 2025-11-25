import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AuthSidePanel from "@/components/auth/AuthSidePanel";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full grid lg:grid-cols-2">
            {/* Left Panel - Decorative */}
            <div className="relative hidden lg:flex h-full flex-col bg-muted p-10 text-white dark:border-r">
                <div className="absolute inset-0 bg-zinc-900" />

                {/* Warm Gradients */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-orange-500/20 blur-[100px] rounded-full opacity-50" />
                    <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-rose-500/20 blur-[120px] rounded-full opacity-50" />
                </div>

                {/* Content */}
                <AuthSidePanel />
            </div>

            {/* Right Panel - Form */}
            <div className="relative flex flex-col items-center justify-center p-8 bg-background">
                <Link
                    href="/"
                    className="absolute right-4 top-4 md:right-8 md:top-8 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
                <div className="w-full max-w-[450px] space-y-6 flex flex-col items-center">
                    {children}
                </div>
            </div>
        </div>
    );
}
