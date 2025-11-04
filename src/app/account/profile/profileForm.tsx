"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PRONOUNS } from "@/app/config/pronouns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Check, ChevronsUpDown, HeartHandshake, User } from "lucide-react";

const stringField = z
  .string()
  .max(80, { message: "Please keep this under 80 characters." })
  .optional()
  .or(z.literal(""));

const formSchema = z.object({
  fullName: stringField,
  nickname: stringField,
  pronouns: z.string().optional().or(z.literal("")),
  dob: z.date().optional(),
});

const ProfileForm = () => {
  const profile = useQuery(api.users.getProfile);
  const updateProfile = useMutation(api.users.updateProfile);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      nickname: "",
      pronouns: "",
      dob: undefined,
    },
  });

  useEffect(() => {
    if (profile === undefined) {
      return;
    }

    form.reset({
      fullName: profile?.fullName ?? "",
      nickname: profile?.nickname ?? "",
      pronouns: profile?.pronouns ?? "",
      dob: profile?.birthday ? new Date(profile.birthday) : undefined,
    });
  }, [form, profile]);

  const onSubmit = form.handleSubmit(async (values) => {
    const payload = {
      fullName: values.fullName?.trim() ? values.fullName.trim() : undefined,
      nickname: values.nickname?.trim() ? values.nickname.trim() : undefined,
      pronouns: values.pronouns?.trim() ? values.pronouns.trim() : undefined,
      birthday: values.dob ? values.dob.toISOString().split("T")[0] : undefined,
    };

    await toast.promise(updateProfile(payload), {
      loading: "Saving profile...",
      success: "Profile updated!",
      error: "Unable to update profile.",
    });
  });

  if (profile === undefined) {
    return <p className="text-sm text-muted-foreground">Loading profile…</p>;
  }

  return (
    <div>
      <div className="border-b border-dashed border-gray-200 pb-4">
        <h2 className="text-2xl font-semibold">Profile Settings</h2>
        <p className="text-muted-foreground">
          Update your public profile information that appears across the app.
        </p>
      </div>
      <div className="mt-6 space-y-6">
        <div className="rounded-md border p-4">
          <h3 className="flex items-center gap-2 text-lg font-medium">
            <User className="h-5 w-5" /> Display Name
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {profile?.fullName ?? "Not set yet"}
          </p>
        </div>
        <div className="rounded-md border p-4">
          <h3 className="flex items-center gap-2 text-lg font-medium">
            <HeartHandshake className="h-5 w-5" /> Pronouns
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {profile?.pronouns
              ? PRONOUNS.find((item) => item.value === profile.pronouns)?.label ?? profile.pronouns
              : "Not set yet"}
          </p>
        </div>
      </div>
      <div className="mt-8">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="How should we address you?" {...field} />
                  </FormControl>
                  <FormDescription>
                    We use this when personalizing parts of the experience.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nickname</FormLabel>
                  <FormControl>
                    <Input placeholder="Display name shown to others" {...field} />
                  </FormControl>
                  <FormDescription>Leave blank if you prefer to stay anonymous.</FormDescription>
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
                            ? PRONOUNS.find((pronoun) => pronoun.value === field.value)?.label
                            : "Select pronouns"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search pronouns..." />
                        <CommandList>
                          <CommandEmpty>No pronouns found.</CommandEmpty>
                          <CommandGroup>
                            {PRONOUNS.map((pronoun) => (
                              <CommandItem
                                key={pronoun.value}
                                value={pronoun.label}
                                onSelect={() => field.onChange(pronoun.value)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    pronoun.value === field.value ? "opacity-100" : "opacity-0",
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
                    Optional. Share how you would like others to refer to you.
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
                          variant="outline"
                          className={cn(
                            "w-[240px] justify-start",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? format(field.value, "PPP") : "Pick a date"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    We use this to tailor resources. We never share your birthday publicly.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" variant="ringHover">
              Save changes
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfileForm;
