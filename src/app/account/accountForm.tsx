"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Mail,
  ArrowRightIcon,
  ChevronsUpDown,
  Check,
  CalendarIcon,
} from "lucide-react";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
} from "firebase/firestore";
import { getAuth, sendEmailVerification } from "firebase/auth";
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
  nickname: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(50, {
      message: "Your username is too long!",
    }),
  pronouns: z.string(),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
});

const auth = getAuth();
const db = getFirestore();
console.log(db);

const usersRef = collection(db, "users");

const AccountForm = ({ userDetails }: { userDetails: UserDetails }) => {
  const [userData, setUserData] = useState<DocumentData | null>(null);
  let verifyAlert = null;

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: "",
      pronouns: "",
      dob: userData ? userData.birthday : new Date(),
    },
  });

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
                sendEmailVerification(auth.currentUser).then(() => {
                  toast.success("Verification email sent!");
                });
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

  console.log(userData);

  return (
    <div>
      {verifyAlert}
      <div className="mt-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nickname</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        userData ? userData.nickname : "Enter your nickname"
                      }
                      {...field}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pronouns"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Pronouns</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? PRONOUNS.find(
                                (pronoun) => pronoun.value === field.value,
                              )?.label
                            : "Select Pronouns"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search pronouns..." />
                        <CommandList>
                          <CommandEmpty>No pronoun found.</CommandEmpty>
                          <CommandGroup>
                            {PRONOUNS.map((pronoun) => (
                              <CommandItem
                                value={pronoun.label}
                                key={pronoun.value}
                                onSelect={() => {
                                  form.setValue("pronouns", pronoun.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    pronoun.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {pronoun.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Optional. Select your pronouns. These will be displayed in
                    your profile.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Your date of birth is used to determine appropritate
                    content.
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
    </div>
  );
};

export default AccountForm;
