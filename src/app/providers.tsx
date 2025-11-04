"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { NextUIProvider } from "@nextui-org/react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "@convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error(
    "NEXT_PUBLIC_CONVEX_URL is not set. Please configure your Convex deployment URL.",
  );
}

const convex = new ConvexReactClient(convexUrl);

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!publishableKey) {
  throw new Error(
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set. Please configure your Clerk publishable key.",
  );
}

function ConvexUserSync() {
  const { isLoaded, isSignedIn } = useAuth();
  const ensureUser = useMutation(api.users.ensureUser);
  const [hasSynced, setHasSynced] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      setHasSynced(false);
      return;
    }

    if (hasSynced) {
      return;
    }

    void ensureUser({}).finally(() => setHasSynced(true));
  }, [ensureUser, hasSynced, isLoaded, isSignedIn]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <NextUIProvider>
          <ConvexUserSync />
          {children}
        </NextUIProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
