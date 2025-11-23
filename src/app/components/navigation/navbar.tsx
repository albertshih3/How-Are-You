"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import MaxWidthWrapper from "@/components/maxWidthWrapper";
import Image from "next/image";
import Logo from "/public/logo.svg";
import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ModeToggle, ModeToggleMobile } from "@/components/ui/dark-mode";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

const NAV_LINKS = [
  { title: "Dashboard", href: "/" },
  { title: "Journal", href: "/entries" },
  { title: "Insights", href: "/insights" },
  { title: "Resources", href: "/resources" },
  { title: "Community", href: "/community" },
];

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Desktop Navigation */}
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src={Logo}
                alt="How Are You Today?"
                width={30}
                height={30}
                className="p-1"
              />
              <span className="hidden font-bold sm:inline-block">
                How Are You?
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex">
              <NavigationMenu>
                <NavigationMenuList>
                  <SignedOut>
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
                                  track your mood and emotions.
                                </p>
                              </a>
                            </NavigationMenuLink>
                          </li>
                          <ListItem href="/sign-up" title="Create an Account">
                            Create an account to access all features!
                          </ListItem>
                          <ListItem href="/about" title="About Us">
                            Learn more about our mission and team.
                          </ListItem>
                          <ListItem href="/privacy" title="Privacy Policy">
                            How we handle your data.
                          </ListItem>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link href="/about" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                          About
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  </SignedOut>

                  <SignedIn>
                    {NAV_LINKS.map((link) => (
                      <NavigationMenuItem key={link.title}>
                        <Link href={link.href} legacyBehavior passHref>
                          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            {link.title}
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    ))}
                  </SignedIn>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex md:items-center md:gap-2">
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
                <ModeToggle />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm">Get Started</Button>
                </SignUpButton>
                <ModeToggle />
              </SignedOut>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="md:hidden">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Menu</DrawerTitle>
                  </DrawerHeader>
                  <div className="flex flex-col space-y-4 px-4 py-6">
                    <SignedOut>
                      <Link
                        href="/"
                        className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}
                      >
                        Home
                      </Link>
                      <Link
                        href="/about"
                        className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}
                      >
                        About Us
                      </Link>
                      <div className="flex flex-col gap-2 pt-4">
                        <SignInButton mode="modal">
                          <Button variant="outline" className="w-full">Sign In</Button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                          <Button className="w-full">Create Account</Button>
                        </SignUpButton>
                      </div>
                    </SignedOut>

                    <SignedIn>
                      {NAV_LINKS.map((link) => (
                        <Link
                          key={link.title}
                          href={link.href}
                          className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}
                        >
                          {link.title}
                        </Link>
                      ))}
                      <div className="flex items-center justify-between border-t pt-4">
                        <span className="text-sm font-medium">Account</span>
                        <UserButton afterSignOutUrl="/" />
                      </div>
                    </SignedIn>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Theme</span>
                        <ModeToggleMobile />
                      </div>
                    </div>
                  </div>
                  <DrawerFooter>
                    <DrawerClose>
                      <Button variant="outline">Close</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
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
