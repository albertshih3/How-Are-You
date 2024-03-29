"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Mail,
  ArrowRightIcon,
  ChevronsUpDown,
  Check,
  CalendarIcon,
  User,
  HeartHandshake,
  Camera,
} from "lucide-react";
import {
  getAuth,
  sendEmailVerification,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "sonner";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PRONOUNS } from "@/app/config/pronouns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface UserDetails {
  uid: string | null;
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
  photoURL: string | null;
}
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "You must enter a name.",
    })
    .refine(
      (name) => {
        return name.split(" ").length > 1;
      },
      {
        message: "Please enter your full name. (First, Last)",
      },
    ),
  email: z
    .string()
    .min(2, {
      message: "Please enter a valid email address.",
    })
    .email("Please enter a valid email address (must include @)."),
});

const AccountForm = ({ userDetails }: { userDetails: UserDetails }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [showDiv1, setShowDiv1] = useState(true);
  const [showDiv2, setShowDiv2] = useState(false);
  const [password, setPassword] = useState("");

  const handleButtonClick = () => {
    if (user) {
      if (user.email) {
        const credential = EmailAuthProvider.credential(user.email, password);
        console.log(user);

        reauthenticateWithCredential(user, credential)
          .then(() => {
            // User re-authenticated.
            console.log(user);

            toast.success("Re-authenticated successfully!");

            setShowDiv1(!showDiv1);
            setShowDiv2(!showDiv2);
          })
          .catch((error) => {
            // Handle the error (e.g., display an error message)
            console.error("Error re-authenticating:", error);
            toast.error(
              "There was an issue re-authenticating. Please try again.",
            );
          });
      } else {
        console.error("User email is null.");
        // Handle the case where user.email is null (e.g., show an error message)
        toast.error("Somehow your email is null? How are you seeing this?");
      }
    } else {
      console.error("User is null.");
      // Handle the case where user is null (e.g., show an error message)
      toast.error("Okay you aren't even logged in. How did you get here?");
    }
  };

  let verifyAlert = null;

  const form = useForm<z.infer<typeof formSchema>>({});

  function onSubmit(values: z.infer<typeof formSchema>) {
    const setData = async () => {
      if (userDetails.uid) {
        await setDoc(doc(db, "users", userDetails.uid), {
          nickname: values.nickname,
          pronouns: values.pronouns,
          birthday: values.dob,
        });
      }
    };

    toast.promise(setData(), {
      loading: "Updating...",
      success: "Your information has been updated!",
      error: "There was an issue updating your information.",
    });

    setShowDiv1(!showDiv1);
    setShowDiv2(!showDiv2);
  }

  if (!userDetails.emailVerified) {
    verifyAlert = (
      <Alert variant="destructive">
        <Mail className="h-5 w-5" />
        <div className="flex">
          <div className="ml-2 mr-1 mt-1">
            <AlertTitle>Email Not Verified</AlertTitle>
            <AlertDescription>
              Your email address has not been verified. Please check your inbox
              for a verification email.
            </AlertDescription>
          </div>
          <div className="ml-1 mr-1 mt-1 content-center">
            <Button
              onClick={() => {
                const user = auth.currentUser;
                if (user) {
                  sendEmailVerification(user).then(() => {
                    toast.success("Verification email sent!");
                  });
                } else {
                  // Handle the case when user is null (e.g., show an error message)
                  console.error(
                    "User is null. Unable to send verification email.",
                  );
                }
              }}
              variant="expandIcon"
              Icon={ArrowRightIcon}
              iconPlacement="right"
            >
              Resend Verification Email
            </Button>
          </div>
        </div>
      </Alert>
    );
  }

  let displayProfilePhoto = (
    <Alert>
      <Camera className="h-5 w-5" />
      <div className="flex">
        <div className="ml-2 mr-1 mt-1">
          <AlertTitle>Current Profile Photo</AlertTitle>
          <AlertDescription>
            Your current profile photo is{" "}
            <strong>FEATURE NOT IMPLEMENTED</strong>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );

  let displayName = (
    <Alert>
      <User className="h-5 w-5" />
      <div className="flex">
        <div className="ml-2 mr-1 mt-1">
          <AlertTitle>Your Name</AlertTitle>
          <AlertDescription>
            <strong>{userDetails?.displayName}</strong>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );

  let displayEmail = (
    <Alert>
      <Mail className="h-5 w-5" />
      <div className="flex">
        <div className="ml-2 mr-1 mt-1">
          <AlertTitle>Primary Email Address</AlertTitle>
          <AlertDescription>
            <strong>{userDetails?.email}</strong>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );

  return (
    <div>
      {verifyAlert}
      <div className="border-b border-dashed border-gray-200 pb-4">
        <h2 className="text-2xl font-semibold">Account Settings</h2>
        <p className="text-muted-foreground">
          Update your account information here.
        </p>
      </div>
      <div id="div1" className={`${showDiv1 ? "" : "hidden"} mt-5 space-y-3`}>
        {displayProfilePhoto}
        {displayName}
        {displayEmail}
        <div className="flex justify-center space-x-3">
          <Dialog>
            <DialogTrigger>
              <Button
                variant="expandIcon"
                Icon={ArrowRightIcon}
                iconPlacement="right"
              >
                Update Account Information
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  You are about to change sensitive account data!
                </DialogTitle>
                <DialogDescription>
                  Because you are attempting to change sensitive data, we need
                  to verify your identity before you can proceed.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-right">
                  Please re-enter your password
                </Label>
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button variant="linkHover2">
                  <DialogClose>Cancel</DialogClose>
                </Button>
                <Button variant="ringHover" onClick={handleButtonClick}>
                  <DialogClose>Continue</DialogClose>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            variant="expandIcon"
            Icon={ArrowRightIcon}
            iconPlacement="right"
          >
            <Link href="/account/security">Change Password</Link>
          </Button>
          <Link
            href="/account/security"
            className={buttonVariants({ variant: "destructive" })}
          >
            Delete Account
          </Link>
        </div>
      </div>

      {/* Form for updating account information */}
      <div id="div2" className={`${showDiv2 ? "" : "hidden"} mt-5`}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AccountForm;
