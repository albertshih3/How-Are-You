"use client";

import MaxWidthWrapper from "@/components/maxWidthWrapper";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

const Unauthorized = () => {
  return (
    <MaxWidthWrapper>
      <div className="m-3 flex h-screen flex-col items-center justify-center sm:m-0" style={{ height: "calc(100vh - 200px)" }}>
        <h1 className="pb-1 text-center text-4xl font-bold text-red-600">
          Uh oh! <span className="text-red-700">You must log in to view this page!</span>
        </h1>
        <p className="text-muted-foreground hidden max-w-prose border-b pb-8 text-center text-sm sm:hidden md:block">
          Please sign in to continue. You can also create an account in just a few moments.
        </p>
        <SignInButton mode="modal">
          <Button className="mx-auto mt-10 flex w-64 flex-col items-center" variant="destructive">
            Log in
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button variant="link" className="mt-3">
            Don&apos;t have an account? Create one!
          </Button>
        </SignUpButton>
      </div>
    </MaxWidthWrapper>
  );
};

export default Unauthorized;
