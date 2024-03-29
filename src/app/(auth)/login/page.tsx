"use client";

import { AuthCredentialsValidator, TAuthCredentialsValudator } from '@/lib/validators/account-credentials-validator';
import { getAuth, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import firebaseConfig from '@/app/config/firebasecfg';
import { Toaster, toast } from 'sonner'
import { useEffect } from 'react';
import Image from 'next/image';
import Logo from '/public/logo.svg';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from "@/lib/utils";
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const app = initializeApp(firebaseConfig);
const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, {message: 'Password cannot be empty!'}),
})

const Login = () => {
  const auth = getAuth(); 
  console.log(auth.currentUser);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })
 
  function onSubmit(values: z.infer<typeof formSchema>) {
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        toast.success('Welcome back! You have successfully signed in!')
        sessionStorage.setItem('toastMessage', 'Welcome back! You have successfully signed in!');
        router.push('/')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error('There has been an issue signing you in: ' + errorMessage)
        console.error(errorCode, errorMessage);
      });
  }

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
    <>
      <Toaster position="bottom-center" richColors  />
      <div className='container relative flex pt-20 flex-col items-center justify-center lg:px-0'>
        <div className='mx-auto flex w-full flex-col justify-center space0y-6 sm:w-[350px]'>
          <div className='flex flex-col items-center space-y-2 text-center'>
            <Image src={Logo} width={50} height={50} alt='logo' />
            <h1 className='text-2xl font-bold'>
              Welcome Back!
            </h1>
            <Link className = {buttonVariants({variant:'link'})} href='/sign-up'>Do not have an account? Create one!</Link>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please enter the email you used when signing up.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Password" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please enter your password.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Sign In</Button>
            </form>
          </Form>

        </div>
      </div>
    </>
  )
}

export default Login;
