"use client";

import Link from 'next/link'; 
import { NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import MaxWidthWrapper from '@/components/maxWidthWrapper';
import Image from 'next/image';
import Logo from '/public/logo.svg';
import React, { useState, useEffect } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { ModeToggle, ModeToggleMobile } from '@/components/ui/dark-mode';
import { getAuth, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import firebaseConfig from '@/app/config/firebasecfg';
import { toast, Toaster } from 'sonner';
import { Icons } from '@/components/ui/icons';
import { cn } from "@/lib/utils";
import { useMediaQuery } from '@/hooks/use-media-query';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
import { Menu } from 'lucide-react';

const app = initializeApp(firebaseConfig);
const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

const components: { title: string; href: string; description: string }[] = [
    {
      title: "Alert Dialog",
      href: "/docs/primitives/alert-dialog",
      description:
        "A modal dialog that interrupts the user with important content and expects a response.",
    },
    {
      title: "Hover Card",
      href: "/docs/primitives/hover-card",
      description:
        "For sighted users to preview content available behind a link.",
    },
    {
      title: "Progress",
      href: "/docs/primitives/progress",
      description:
        "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
    },
    {
      title: "Scroll-area",
      href: "/docs/primitives/scroll-area",
      description: "Visually or semantically separates content.",
    },
    {
      title: "Tabs",
      href: "/docs/primitives/tabs",
      description:
        "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
    },
    {
      title: "Tooltip",
      href: "/docs/primitives/tooltip",
      description:
        "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
    },
  ]

const Navbar = () => {

    const [user, setUser] = useState<User | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
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
            <Toaster position="bottom-center" richColors  />
            <MaxWidthWrapper>
                {/* !Desktop Navigation */}
                <div className = 'hidden md:flex h-16 items-center border-b border-gray-3000'>
                    <div className="sticky z-50 top-0 inset-x-0 h-16">
                        <NavigationMenu>
                            <div className = 'ml-4 flex lg:ml-0 pt-3 pr-3'>
                                <Link href = '/'>
                                    <Image src = {Logo} alt = 'How Are You Today?' width = {30} height = {30} />
                                </Link>
                            </div>
                            <NavigationMenuList className = 'hidden md:flex pt-3'>
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
                                            A simple mental health application to help you track your mood and emotions.
                                            Made for college students by college students.
                                            </p>
                                        </a>
                                        </NavigationMenuLink>
                                    </li>
                                    <ListItem href="/docs" title="Introduction">
                                        Re-usable components built using Radix UI and Tailwind CSS.
                                    </ListItem>
                                    <ListItem href="/docs/installation" title="Installation">
                                        How to install dependencies and structure your app.
                                    </ListItem>
                                    <ListItem href="/docs/primitives/typography" title="Typography">
                                        Styles for headings, paragraphs, lists...etc
                                    </ListItem>
                                    </ul>
                                </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                <NavigationMenuTrigger>Components</NavigationMenuTrigger>
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
                                <NavigationMenuItem>
                                <Link href="/docs" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Documentation
                                    </NavigationMenuLink>
                                </Link>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                    <div className = 'ml-auto flex items-center pt-3 pb-3'>
                                <div className='hidden md:flex md:flex-1 md:items-center md:justify-end md:space-x-3'>
                                    {user ? (
                                        <>
                                            <Link href='/changelog' className = {buttonVariants({variant: 'ghost'})}>Changelog</Link>
                                            <Button onClick={() => 
                                                signOut(getAuth()).then(() => {
                                                    toast.info('You have been logged out!', {
                                                        description: 'See you again soon!',
                                                    })
                                                }).catch((error) => {
                                                    // An error happened.
                                                })
                                            }>Logout</Button>
                                            <span className='h-6 w-px bg-gray-200 aria-hidden="true"'></span>
                                            <ModeToggle />
                                        </>
                                    ) : (
                                        <>
                                            <Link href='/login' className={buttonVariants({variant: 'outline'})}>Sign In</Link>
                                            <Link href='/sign-up' className={buttonVariants()}>Create Account</Link>
                                            <span className='h-6 w-px bg-gray-200 aria-hidden="true"'></span>
                                            <ModeToggle />
                                        </>
                                    )}
                                </div>
                            </div>
                </div>

                {/* !Mobile Navigation */}
                <div className = 'md:hidden'>
                    <div className="sticky z-50 top-0 inset-x-0 h-16">

                        <Drawer>
                            <DrawerTrigger className='pt-3'>
                                <Menu />
                            </DrawerTrigger>
                            <DrawerContent>
                                <DrawerHeader>
                                <DrawerTitle>Main Menu</DrawerTitle>
                                </DrawerHeader>
                                <div className='flex flex-col items-center space-y-2'>
                                    <Link className={buttonVariants({variant: 'ghost'})} href='/'>Home</Link>
                                    <div className='border-t border-b pt-3 pb-3 flex flex-col items-center space-y-2'>
                                        {user ? (
                                            <>
                                                <Link href='/changelog' className = {buttonVariants({variant: 'ghost'})}>Changelog</Link>
                                                <Button variant='ghost' onClick={() => 
                                                    signOut(getAuth()).then(() => {
                                                        toast.info('You have been logged out!', {
                                                            description: 'See you again soon!',
                                                        })
                                                    }).catch((error) => {
                                                        // An error happened.
                                                    })
                                                }>Logout</Button>
                                            </>
                                        ) : (
                                            <>
                                                <Link href='/login' className={buttonVariants({variant: 'ghost'})}>Sign In</Link>
                                                <Link href='/sign-up' className={`${buttonVariants({variant: 'ghost'})}`}>Create Account</Link>
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
}

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
            className
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
  )
})
ListItem.displayName = "ListItem"

export default Navbar;