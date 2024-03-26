"use client";

import MaxWidthWrapper from "@/components/maxWidthWrapper";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useEffect, useState } from "react";
import firebaseConfig from "../config/firebasecfg";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  verifyBeforeUpdateEmail,
  deleteUser,
  reauthenticateWithCredential,
  User,
} from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";
import { toast, Toaster } from "sonner";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = isSupported().then((yes) => (yes ? getAnalytics(app) : null));

const auth = getAuth();

const Unauthorized = () => {
  const [user, setUser] = useState<User | null>(null);
  <Toaster position="bottom-center" richColors />;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User is signed in.
        setUser(currentUser);
      } else {
        // No user is signed in.
        setUser(null);
        const promise = () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ name: "Sonner" }), 5000),
          );

        toast.promise(promise, {
          loading:
            "You are not logged in. You will automically be redirected to the login page. Please wait...",
          success: (data) => {
            window.location.href = "/login";
            return `You have been redirected to the login page!`;
          },
          error:
            "There was a problem redirecting you to the login page. Please try again.",
        });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <>
      <MaxWidthWrapper>
        <div>
          <div
            className="m-3 flex h-screen flex-col items-center justify-center sm:m-0"
            style={{ height: "calc(100vh - 200px)" }}
          >
            <h1 className="pb-1 text-center text-4xl font-bold text-red-600">
              Uh oh!{" "}
              <span className="text-red-700">
                You must log in to view this page!
              </span>
            </h1>
            <p className="text-muted-foreground hidden max-w-prose border-b pb-8 text-center text-sm sm:hidden md:block">
              You will be automatically redirected to the login page in a few
              seconds. If you are not redirected, please click the button below.
            </p>
            <Link
              href="/login"
              className={`${buttonVariants({ variant: "destructive" })} mx-auto mt-10 flex w-64 flex-col items-center`}
            >
              Log in
            </Link>
            {/*  eslint-disable-next-line react/no-unescaped-entities */}
            <Link
              href="/sign-up"
              className={`${buttonVariants({ variant: "link" })} flex flex-col items-center`}
            >
              Don't have an account? Create one!
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
    </>
  );
};

export default Unauthorized;
