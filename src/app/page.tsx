// Imports
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from 'next/link';
import Navbar from './components/navigation/navbar';
import MaxWidthWrapper from "@/components/maxWidthWrapper";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsGuW-IKBby4u6P7I09JeIiB2ucaAp3v8",
  authDomain: "how-are-you-5e726.firebaseapp.com",
  projectId: "how-are-you-5e726",
  storageBucket: "how-are-you-5e726.appspot.com",
  messagingSenderId: "998409201010",
  appId: "1:998409201010:web:3bd10d45a4041c6f9469eb",
  measurementId: "G-39BHF66YLF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

export default function Home() {
  return (
    <MaxWidthWrapper>
      <div className = 'py-20 mx-auto text-center flex flex-col items-center max-w-3xl'>
        <h1 className = 'text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl'>How Are You <span className = 'text-blue-600'>Today</span>?</h1>
        <p className = 'mt-6 text-lg max-w-prose text-muted-foreground'>A mental health application for students, by students.</p>
        <div className = "flex flex-col sm:flex-row gap-4 mt-6">
          <Link href = '/begin' className = {buttonVariants()}>Get Started &rarr;</Link>
          <Button variant = 'ghost'>Learn More &rarr;</Button>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
