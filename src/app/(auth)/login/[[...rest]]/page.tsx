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
    <div className="container relative flex flex-col items-center justify-center pt-20 lg:px-0">
      <div className="space-y-6 mx-auto flex w-full flex-col justify-center sm:w-[350px]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Image src={Logo} width={50} height={50} alt="How Are You Today?" />
          <h1 className="text-2xl font-bold">Welcome Back!</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to continue tracking your mood and connecting with the community.
          </p>
          <Link
            className={buttonVariants({ variant: "linkHover2" })}
            href="/sign-up"
          >
            Need an account? Create one
          </Link>
        </div>
        <div className="pt-4" data-testid="clerk-sign-in">
          <SignIn
            appearance={authAppearance}
            redirectUrl="/"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
