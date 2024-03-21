"use client";

// Imports
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from 'next/link';
import Navbar from './components/navigation/navbar';
import MaxWidthWrapper from "@/components/maxWidthWrapper";
import firebaseConfig from "./config/firebasecfg";
import { useEffect } from "react";
import { toast, Toaster } from "sonner";


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

export default function Home() {

  useEffect(() => {
    const message = sessionStorage.getItem('toastMessage');
    let isToast = false;
  
    if (message) {
      toast.success(message)
      sessionStorage.removeItem('toastMessage');
      isToast = true;
    }
  }, []);

  return (
    <MaxWidthWrapper>
      <Toaster position="bottom-center" richColors  />
      <div className = 'py-20 mx-auto text-center flex flex-col items-center max-w-3xl'>
        <h1 className = 'text-4xl font-bold tracking-tight sm:text-6xl'>How Are You <span className = 'text-blue-600'>Today</span>?</h1>
        <p className = 'mt-6 text-lg max-w-prose text-muted-foreground'>A mental health application for students, by students.</p>
        <div className = "flex flex-col sm:flex-row gap-4 mt-6">
          <Link href = '/begin' className = {buttonVariants()}>Get Started &rarr;</Link>
          <Button variant = 'ghost'>Learn More &rarr;</Button>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
