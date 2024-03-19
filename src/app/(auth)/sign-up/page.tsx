"use client"

import Image from 'next/image';
import Logo from '/public/logo.svg';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from "@/lib/utils";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthCredentialsValidator, TAuthCredentialsValudator } from '@/lib/validators/account-credentials-validator';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

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

import { z } from 'zod';

const Page = () => {

  const auth = getAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValudator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  const onSubmit = ({ email, password }: TAuthCredentialsValudator) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
      });
  }

  return (
    <>
      <div className='container relative flex pt-20 flex-col items-center justify-center lg:px-0'>
        <div className='mx-auto flex w-full flex-col justify-center space0y-6 sm:w-[350px]'>
          <div className='flex flex-col items-center space-y-2 text-center'>
            <Image src={Logo} width={100} height={100} alt='logo' />
            <h1 className='text-2xl font-bold'>
              Create an Account
            </h1>
            <Link className = {buttonVariants({variant:'link'})} href='/login'>Already have an account? Sign in!</Link>
          </div>
          
          <div className='grid gap-6'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='grid gap-2'>
                <div className='grid gap-1 py-2'>
                <Label htmlFor='email'>Email</Label>
                <Input {...register("email")} className={cn({'focus-visible:ring-red-500': errors.email})} placeholder='you@example.com' id='email' type='email' />
                </div>
              </div>
              <div className='grid gap-2'>
                <div className='grid gap-1 py-2'>
                <Label htmlFor='password'>Password</Label>
                <Input {...register("password")} className={cn({'focus-visible:ring-red-500': errors.password})} placeholder='password' id='password' type='password' />
                </div>
                <Button>Sign Up</Button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </>
  )
}

export default Page