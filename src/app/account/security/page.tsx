"use client";

import { useEffect, useState } from "react";
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
import firebaseConfig from "@/app/config/firebasecfg";
import SidebarNav from "@/app/components/navigation/sidebar";
import Unauthorized from "@/app/unauthorized/page";
import SecurityForm, { UserDetails } from "./securityForm";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = isSupported().then((yes) => (yes ? getAnalytics(app) : null));

// Check if user is logged in
const auth = getAuth();

const AccountSecurity = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  <Toaster position="bottom-center" richColors />;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User is signed in.
        setUser(currentUser);
        setUserDetails({
          uid: currentUser.uid,
          email: currentUser.email,
          emailVerified: currentUser.emailVerified,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        });
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
          <div className="relative">
            <Toaster position="bottom-center" richColors />
            <div>
              <div className="mx-auto ml-5 flex flex-col sm:mt-8">
                <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
                  Account Settings
                </h1>
                <p className="mb-8 mt-1 pr-20 text-muted-foreground sm:text-lg">
                  Change your email address, password, or delete your account.
                </p>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
        <MaxWidthWrapper>
          <div>
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={25} minSize={15}>
                <div className="rounded-l-md border-b border-l border-t p-5">
                  <SidebarNav />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel>
                <div className="rounded-r-md border-b border-r border-t p-5">
                  {userDetails && <SecurityForm userDetails={userDetails} />}
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </MaxWidthWrapper>
      </>
    );
  }
};

export default AccountSecurity;
