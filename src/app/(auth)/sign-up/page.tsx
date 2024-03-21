"use client"

// Import Statements
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
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import firebaseConfig from '@/app/config/firebasecfg';
import { Toaster, toast } from 'sonner'
import { useRouter } from 'next/navigation';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

import { z } from 'zod';


const Page = () => {

  const auth = getAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValudator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  const onSubmit = ({ email, password, name }: TAuthCredentialsValudator) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(user, {
          displayName: name
        })
        console.log(user);
        if (auth.currentUser) {
          sendEmailVerification(auth.currentUser);
        }
        toast.success('Your account has been created! Please check your email for a verification link!')
        sessionStorage.setItem('toastMessage', 'Your account has been created! Please check your email for a verification link!');
        router.push('/login')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error('There has been an issue creating your account: ' + errorMessage)
        console.error(errorCode, errorMessage);
      });
  }

  return (
    <>
      <Toaster position="bottom-center" richColors  />
      <div className='container relative flex pt-20 flex-col items-center justify-center lg:px-0'>
        <div className='mx-auto flex w-full flex-col justify-center space0y-6 sm:w-[350px]'>
          <div className='flex flex-col items-center space-y-2 text-center'>
            <Image src={Logo} width={50} height={50} alt='logo' />
            <h1 className='text-2xl font-bold'>
              Create an Account
            </h1>
            <Link className = {buttonVariants({variant:'link'})} href='/login'>Already have an account? Sign in!</Link>
          </div>
          
          <div className='grid gap-6'>
            <form onSubmit={handleSubmit(onSubmit)}>
            <div className='grid gap-2'>
                <div className='grid gap-1 py-2'>
                <Label htmlFor='name'>Name</Label>
                <Input {...register("name")} className={cn({'focus-visible:ring-red-500': errors.name})} placeholder='Prefered Name' id='name' type='text' />
                </div>
              </div>
              <div className='grid gap-2'>
                <div className='grid gap-1 py-2'>
                <Label htmlFor='email'>Email</Label>
                <Input {...register("email")} className={cn({'focus-visible:ring-red-500': errors.email})} placeholder='you@example.com' id='email' type='email' />
                </div>
              </div>
              <div className='grid gap-2'>
                <div className='grid gap-1 py-2'>
                <Label htmlFor='password'>Password</Label>
                <Input {...register("password")} className={cn({'focus-visible:ring-red-500': errors.password})} placeholder='Password' id='password' type='password' />
                </div>
                <Button>Sign Up</Button>
              </div>
            </form>
            <Button onClick={() => sessionStorage.setItem('toastMessage', 'Your account has been created! Please check your email for a verification link!')}>Test Toast</Button>
          </div>

        </div>
      </div>
    </>
  )
}

export default Page