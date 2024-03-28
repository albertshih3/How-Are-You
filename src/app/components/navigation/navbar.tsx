"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import MaxWidthWrapper from "@/components/maxWidthWrapper";
import Image from "next/image";
import Logo from "/public/logo.svg";
import React, { useState, useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ModeToggle, ModeToggleMobile } from "@/components/ui/dark-mode";
import { getAuth, signOut, onAuthStateChanged, User } from "firebase/auth";
import { toast, Toaster } from "sonner";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import firebaseConfig from "@/app/config/firebasecfg";

const app = initializeApp(firebaseConfig);
const analytics = isSupported().then((yes) => (yes ? getAnalytics(app) : null));

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Mood Tracker",
    href: "/mood-tracker",
    description:
      "Track your mood and emotions with our easy to use mood tracker.",
  },
  {
    title: "Journal",
    href: "/journal",
    description:
      "Write down your thoughts and feelings in your personal journal.",
  },
  {
    title: "View Community Posts",
    href: "/community",
    description:
      "View and engage with posts from other users in the community.",
  },
  {
    title: "Create a Post",
    href: "/community/create",
    description:
      "Create a post to share your thoughts and feelings with the community.",
  },
];

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUser(user);
      } else {
        // User is signed out
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  return (
    <header>
      <Toaster position="bottom-center" richColors />
      <MaxWidthWrapper>
        {/* !Desktop Navigation */}
        <div className="border-gray-3000 hidden h-16 items-center border-b md:flex">
          <div className="sticky inset-x-0 top-0 z-50 h-16">
            <NavigationMenu>
              <div className="ml-4 flex pr-3 pt-3 lg:ml-0">
                <Link href="/">
                  <Image
                    className="p-1"
                    src={Logo}
                    alt="How Are You Today?"
                    width={30}
                    height={30}
                  />
                </Link>
              </div>
              <NavigationMenuList className="hidden pt-3 md:flex">
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/"
                          >
                            <Icons.logo className="h-6 w-6" />
                            <div className="mb-2 mt-4 text-lg font-medium">
                              How Are You?
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              A simple mental health application to help you
                              track your mood and emotions. Made for college
                              students by college students.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/sign-up" title="Create an Account">
                        Create an account to access all of the apps features!
                      </ListItem>
                      <ListItem href="/features" title="Features">
                        Get an in depth look at all of the features we offer.
                      </ListItem>
                      <ListItem href="/privacy" title="Privacy Policy">
                        Learn more about our privacy policy, and how we manage
                        data.
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {user ? (
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Quick Access</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                        {components.map((component) => (
                          <ListItem
                            key={component.title}
                            title={component.title}
                            href={component.href}
                          >
                            {component.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : null}

                <NavigationMenuItem>
                  <Link href="/about" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      About Us
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="ml-auto flex items-center pb-3 pt-3">
            <div className="hidden md:flex md:flex-1 md:items-center md:justify-end md:space-x-3">
              {user ? (
                <>
                  <Link
                    href="/changelog"
                    className={buttonVariants({ variant: "ghost" })}
                  >
                    Changelog
                  </Link>
                  <Link
                    href="/account"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    My Account
                  </Link>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      signOut(getAuth())
                        .then(() => {
                          toast.info("You have been logged out!", {
                            description: "See you again soon!",
                          });
                        })
                        .catch((error) => {
                          // An error happened.
                        })
                    }
                  >
                    Logout
                  </Button>
                  <span className='aria-hidden="true" h-6 w-px bg-gray-200'></span>
                  <ModeToggle />
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Sign In
                  </Link>
                  <Link href="/sign-up" className={buttonVariants()}>
                    Create Account
                  </Link>
                  <span className='aria-hidden="true" h-6 w-px bg-gray-200'></span>
                  <ModeToggle />
                </>
              )}
            </div>
          </div>
        </div>

        {/* !Mobile Navigation */}
        <div className="md:hidden">
          <div className="sticky inset-x-0 top-0 z-50 h-16">
            <Drawer>
              <DrawerTrigger className="pt-3">
                <Menu />
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Main Menu</DrawerTitle>
                </DrawerHeader>
                <div className="flex flex-col items-center space-y-2">
                  <Link
                    className={buttonVariants({ variant: "ghost" })}
                    href="/"
                  >
                    Home
                  </Link>

                  <div className="flex flex-col items-center space-y-2 border-t pb-3 pt-3">
                    <Link
                      href="/about"
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      About Us
                    </Link>

                    {user ? (
                      <Link
                        href="/qamobile"
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        Quick Access
                      </Link>
                    ) : null}
                  </div>

                  <div className="flex flex-col items-center space-y-2 border-b border-t pb-3 pt-3">
                    {user ? (
                      <>
                        <Link
                          href="/changelog"
                          className={buttonVariants({ variant: "ghost" })}
                        >
                          Changelog
                        </Link>
                        <Link
                          href="/account"
                          className={buttonVariants({ variant: "ghost" })}
                        >
                          My Account
                        </Link>
                        <Button
                          variant="ghost"
                          onClick={() =>
                            signOut(getAuth())
                              .then(() => {
                                toast.info("You have been logged out!", {
                                  description: "See you again soon!",
                                });
                              })
                              .catch((error) => {
                                // An error happened.
                              })
                          }
                        >
                          Logout
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className={buttonVariants({ variant: "ghost" })}
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/sign-up"
                          className={`${buttonVariants({ variant: "ghost" })}`}
                        >
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>
                  <ModeToggleMobile />
                </div>
                <DrawerFooter>
                  <DrawerClose>
                    <Button variant="outline">Close Menu</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </MaxWidthWrapper>
    </header>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Navbar;
