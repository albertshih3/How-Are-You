"use client";

import {
  AuthCredentialsValidator,
  TAuthCredentialsValudator,
} from "@/lib/validators/account-credentials-validator";
import {
  getAuth,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Toaster, toast } from "sonner";
import { useEffect } from "react";
import Image from "next/image";
import Logo from "/public/logo.svg";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password cannot be empty!" }),
});

const Login = () => {
  const auth = getAuth();
  console.log(auth.currentUser);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        toast.success("Welcome back! You have successfully signed in!");
        router.push("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error("There has been an issue signing you in: " + errorMessage);
        console.error(errorCode, errorMessage);
      });
  }

  return (
    <>
      <Toaster position="bottom-center" richColors />
      <div className="container relative flex flex-col items-center justify-center pt-20 lg:px-0">
        <div className="space0y-6 mx-auto flex w-full flex-col justify-center sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Image src={Logo} width={50} height={50} alt="logo" />
            <h1 className="text-2xl font-bold">Welcome Back!</h1>
            <Link
              className={buttonVariants({ variant: "link" })}
              href="/sign-up"
            >
              Do not have an account? Create one!
            </Link>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 pt-8"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@example.com" {...field} />
                    </FormControl>
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
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="justify center flex flex-col">
                <Button className=" align-center" type="submit">
                  Sign In
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
