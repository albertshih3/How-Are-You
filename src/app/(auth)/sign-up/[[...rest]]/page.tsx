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
    <div className="container relative flex flex-col items-center justify-center pt-20 lg:px-0">
      <div className="space-y-6 mx-auto flex w-full flex-col justify-center sm:w-[350px]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Image src={Logo} width={50} height={50} alt="How Are You Today?" />
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-sm text-muted-foreground">
            Join the community and start recording how you feel today.
          </p>
          <Link
            className={buttonVariants({ variant: "linkHover2" })}
            href="/login"
          >
            Already have an account? Sign in
          </Link>
        </div>
        <div className="pt-4" data-testid="clerk-sign-up">
          <SignUp
            appearance={authAppearance}
            redirectUrl="/"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
