import Image from "next/image";
import Link from "next/link";

import { SignUp } from "@clerk/nextjs";

import { buttonVariants } from "@/components/ui/button";
import { authAppearance } from "@/app/config/clerkAppearance";

import Logo from "/public/logo.svg";

export function generateStaticParams() {
  return [{ rest: [] as string[] }];
}

const SignUpPage = () => {
  return (
    <>
      <div className="flex flex-col items-center space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to create your account
        </p>
      </div>
      <div className="grid gap-6" data-testid="clerk-sign-up">
        <SignUp
          appearance={authAppearance}
          redirectUrl="/"
        />
      </div>
      <p className="px-8 text-center text-sm text-muted-foreground">
        <Link
          href="/login"
          className="hover:text-brand underline underline-offset-4"
        >
          Already have an account? Sign In
        </Link>
      </p>
    </>
  );
};

export default SignUpPage;
