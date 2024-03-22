"use client";

import Link from 'next/link'; 
import { NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import MaxWidthWrapper from '@/components/maxWidthWrapper';
import Image from 'next/image';
import Logo from '/public/logo.svg';
import NavItems from './navItems';
import React, { useState, useEffect } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/dark-mode';
import { getAuth, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import firebaseConfig from '@/app/config/firebasecfg';
import { toast, Toaster } from 'sonner';

const app = initializeApp(firebaseConfig);
const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

const Navbar = () => {

    <Toaster position="bottom-center" richColors  />

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
        <div className="sticky z-50 top-0 inset-x-0 h-16">
            <header>
                <MaxWidthWrapper>
                    <div className='border-b border-gray-200'>
                        <div className = 'flex h-16 items-center'>
                            <div className = 'ml-4 flex lg:ml-0'>
                                <Link href = '/'>
                                    <Image src = {Logo} alt = 'How Are You Today?' width = {30} height = {30} />
                                </Link>
                            </div>
                            <div className = 'hidden lg:block lg:self-stretch lg:ml-8'>
                                <NavItems />
                            </div>
                            <div className = 'ml-auto flex items-center'>
                                <div className='hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-3'>
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
                                {/* Mobile Navigation */}
                                <div className='lg:hidden ml-4'>
                                    <button onClick={() => setMenuOpen(!menuOpen)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                            {menuOpen ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                            )}
                                        </svg>
                                    </button>
                                    {menuOpen && (
                                        <div className='absolute top-16 left-0 w-full p-2 bg-white shadow-md'>
                                            <NavItems />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </MaxWidthWrapper>
            </header>
        </div>
    );
}

export default Navbar;