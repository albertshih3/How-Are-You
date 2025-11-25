import Image from "next/image";
import Link from "next/link";

import { SignIn } from "@clerk/nextjs";

import { buttonVariants } from "@/components/ui/button";
import { authAppearance } from "@/app/config/clerkAppearance";

import Logo from "/public/logo.svg";

export function generateStaticParams() {
  return [{ rest: [] as string[] }];
}

const Login = () => {
  return (
    <>
      <div className="flex flex-col items-center space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your details to sign in to your account
        </p>
      </div>
      <div className="grid gap-6" data-testid="clerk-sign-in">
        <SignIn
          appearance={authAppearance}
          redirectUrl="/"
        />
      </div>
      <p className="px-8 text-center text-sm text-muted-foreground">
        <Link
          href="/sign-up"
          className="hover:text-brand underline underline-offset-4"
        >
          Don&apos;t have an account? Sign Up
        </Link>
      </p>
    </>
  );
};

export default Login;
