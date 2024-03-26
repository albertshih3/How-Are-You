"use client";

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
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import { toast, Toaster } from "sonner";
import MaxWidthWrapper from "@/components/maxWidthWrapper";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import SidebarNav from "../components/navigation/sidebar";
import Unauthorized from "../unauthorized/page";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = isSupported().then((yes) => (yes ? getAnalytics(app) : null));

// Check if user is logged in
const auth = getAuth();

const AccountPage = () => {
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
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (user === null) {
    return (
      <>
        <MaxWidthWrapper>
          <Unauthorized />
        </MaxWidthWrapper>
      </>
    );
  } else {
    return (
      <>
        <Toaster position="bottom-center" richColors />
        <MaxWidthWrapper className="relative">
          <div className="absolute inset-0 ml-20 bg-gradient-to-r from-orange-100 opacity-25"></div>
          <div className="relative">
            <Toaster position="bottom-center" richColors />
            <div>
              <div className="mx-auto ml-5 flex flex-col sm:mt-8">
                <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
                  Account Settings
                </h1>
                <p className="text-muted-foreground mb-8 mt-1 pr-20 sm:text-lg">
                  Change your email address, password, or delete your account.
                </p>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
        <MaxWidthWrapper>
          <div>
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel>
                <div className="mt-5 border p-5">
                  <SidebarNav />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel>
                <div>
                  <div></div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </MaxWidthWrapper>
      </>
    );
  }
};

export default AccountPage;
