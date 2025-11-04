"use client";

import MaxWidthWrapper from "@/components/maxWidthWrapper";
import { SignedIn, SignedOut } from "@clerk/nextjs";

import Unauthorized from "../unauthorized/page";
import AccountForm from "./accountForm";

const AccountClientPage = () => {
  return (
    <>
      <SignedOut>
        <MaxWidthWrapper>
          <Unauthorized />
        </MaxWidthWrapper>
      </SignedOut>
      <SignedIn>
        <MaxWidthWrapper className="pb-16 pt-10">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <h1 className="text-3xl font-semibold sm:text-4xl">Manage your account</h1>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              Update profile details, security preferences, and connected accounts through the Clerk dashboard below.
            </p>
          </div>
          <div className="mt-10 flex justify-center">
            <div className="w-full max-w-4xl">
              <AccountForm />
            </div>
          </div>
        </MaxWidthWrapper>
      </SignedIn>
    </>
  );
};

export default AccountClientPage;
