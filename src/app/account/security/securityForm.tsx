"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mail, ArrowRightIcon, User } from "lucide-react";
import {
  getAuth,
  sendEmailVerification,
  reauthenticateWithCredential,
  deleteUser,
  updatePassword,
  EmailAuthProvider,
} from "firebase/auth";
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
import { toast } from "sonner";
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
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  DocumentData,
  deleteDoc,
} from "firebase/firestore";

export interface UserDetails {
  uid: string | null;
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
  photoURL: string | null;
}

const db = getFirestore();
const usersRef = collection(db, "users");

const formSchemaPassword = z
  .object({
    password: z.string().min(8, {
      message: "Your password must be 8 characters long.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Your password must be 8 characters long.",
    }),
    isVerified: z.boolean().optional(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
      });
    }
  });

const SecurityForm = ({ userDetails }: { userDetails: UserDetails }) => {
  const [userData, setUserData] = useState<DocumentData | null>(null);
  const auth = getAuth();
  const user = auth.currentUser;
  const [showDiv1, setShowDiv1] = useState(true);
  const [showDiv2, setShowDiv2] = useState(false);
  const [showDiv3, setShowDiv3] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (userDetails.uid) {
        const docRef = doc(db, "users", userDetails.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(() => docSnap.data());
        }
      }
    };

    fetchData();
  }, [userDetails]);

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

  const handleButtonClickDelete = () => {
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
            setShowDiv3(!showDiv3);
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

  const formName = useForm<z.infer<typeof formSchemaPassword>>({
    resolver: zodResolver(formSchemaPassword),
  });

  function onSubmitPassword(values: z.infer<typeof formSchemaPassword>) {
    if (auth.currentUser) {
      if (values.password) {
        toast.promise(
          updatePassword(auth.currentUser, values.password)
            .then(() => {
              // Update successful.
              console.log("Password Updated Successfully");
            })
            .catch((error) => {
              // An error ocurred
              console.log(error);
            }),
          {
            loading: "Updating...",
            success: "Your password has been updated!",
            error: "There was an issue updating your password.",
          },
        );
      }
    }

    setShowDiv1(!showDiv1);
    setShowDiv2(!showDiv2);
  }

  const deleteData = async () => {
    if (userDetails.uid) {
      await deleteDoc(doc(db, "users", userDetails.uid));
    }
  };

  const deleteAccountConfirmed = () => {
    if (auth.currentUser) {
      toast.promise(
        deleteData()
          .then(() => {
            // Delete successful.
            console.log("Firestore Data Deleted Successfully");
            toast.success("Your account data has been deleted.");
            if (auth.currentUser) {
              deleteUser(auth.currentUser)
                .then(() => {
                  // User deleted.
                  console.log("User Deleted Successfully");
                })
                .catch((error) => {
                  // An error ocurred
                  console.log(error);
                });
            }
          })
          .catch((error) => {
            // An error ocurred
            console.log(error);
          }),
        {
          loading: "Deleting...",
          success: "Your account has been deleted!",
          error: "There was an issue deleting your account.",
        },
      );
    }

    setShowDiv1(!showDiv1);
    setShowDiv3(!showDiv3);
  };

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

  let displayPassword = (
    <Alert>
      <User className="h-5 w-5" />
      <div className="flex justify-between">
        <div className="ml-2 mr-1 mt-1">
          <AlertTitle>Password Settings</AlertTitle>
          <AlertDescription>
            Make changes to your account password
          </AlertDescription>
        </div>
        <div className="ml-1 mr-1 mt-1">
          <Dialog>
            <DialogTrigger>
              <Button
                variant="expandIcon"
                Icon={ArrowRightIcon}
                iconPlacement="right"
              >
                Update Password
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
        </div>
      </div>
    </Alert>
  );

  let displayDelete = (
    <Alert variant="destructive">
      <Mail className="h-5 w-5" />
      <div className="flex justify-between">
        <div className="ml-2 mr-1 mt-1">
          <AlertTitle>Delete your account</AlertTitle>
          <AlertDescription>
            Delete your account and all associated data.
          </AlertDescription>
        </div>
        <div className="">
          <Dialog>
            <DialogTrigger>
              <Button
                variant="destructive"
                Icon={ArrowRightIcon}
                iconPlacement="right"
              >
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent className="box-border border-red-600">
              <DialogHeader>
                <DialogTitle>
                  <strong className="text-red-600">
                    This action is irrversible!
                  </strong>
                </DialogTitle>
                <DialogDescription>
                  You have opted to delete your account. This action is
                  irreversible. Please enter your password to confirm. Once your
                  confirm, your account and all of its associated data will be
                  deleted immediatly!
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
                <Button variant="destructive" onClick={handleButtonClickDelete}>
                  <DialogClose>Delete My Account</DialogClose>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Alert>
  );

  return (
    <div>
      {verifyAlert}
      <div className="mt-5 border-b border-dashed border-gray-200 pb-4">
        <h2 className="text-2xl font-semibold">Security Settings</h2>
        <p className="text-muted-foreground">
          Update your account security settings. You can change your password or
          delete your account.
        </p>
      </div>
      <div id="div1" className={`${showDiv1 ? "" : "hidden"} mt-5 space-y-3`}>
        {displayPassword}
        {displayDelete}
      </div>

      {/* Form for updating account information */}
      <div id="div2" className={`${showDiv2 ? "" : "hidden"} mt-5`}>
        <Form {...formName}>
          <form
            onSubmit={formName.handleSubmit(onSubmitPassword)}
            className="space-y-8"
          >
            <FormField
              control={formName.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your new password..."
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your updated password.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formName.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Please re-enter your new password..."
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Re-enter your updated password.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button variant="ringHover" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </div>

      <div id="div3" className={`${showDiv3 ? "" : "hidden"} mt-5`}>
        <h1 className="text-1xl mb-2 font-bold tracking-tight text-red-600 sm:text-2xl">
          Delete Account
        </h1>
        <p className="mb-5">
          You have opted to delete your account.{" "}
          <span className="text-destructive underline">
            <strong>This action is irreversible</strong>
          </span>
          . Please enter your password to confirm.{" "}
          <strong>
            {" "}
            Once your confirm, your account and all of its associated data will
            be deleted immediatly
          </strong>
          !
        </p>
        <div className="flex space-x-2">
          <Link
            className={buttonVariants({ variant: "shine" })}
            href="/account"
          >
            Back to settings
          </Link>
          <Button variant={"destructive"} onClick={deleteAccountConfirmed}>
            I want to delete my account.
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecurityForm;
