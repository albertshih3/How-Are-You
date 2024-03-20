import Link from 'next/link'; 
import { NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import MaxWidthWrapper from '@/components/maxWidthWrapper';
import Image from 'next/image';
import Logo from '/public/logo.svg';
import NavItems from './navItems';
import { buttonVariants } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/dark-mode';
  

const Navbar = () => {

    // Mock user for navbar mockup
    const user = null;

    return (
        <div className="sticky z-50 top-0 inset-x-0 h-16">
            <header>
                <MaxWidthWrapper>
                    <div className='border-b border-gray-200'>
                        <div className = 'flex h-16 items-center'>
                            { /* TODO: Mobile Navigation */ }
                            <div className = 'ml-4 flex lg:ml-0'>
                                <Link href = '/'>
                                    <Image src = {Logo} alt = 'How Are You Today?' width = {50} height = {50} />
                                </Link>
                            </div>
                            <div className = 'hiden z-50 lg:ml-8 lg:block lg:self-stretch'>
                                <NavItems />
                            </div>
                            <div className = 'ml-auto flex items-center'>
                                <div className='hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6'>
                                    {user ? null : <Link href='/login' className={buttonVariants({variant: 'outline'})}>Sign In</Link>}
                                    {user ? null : <span className='h-6 w-px bg-gray-200 aria-hidden="true"'></span>}
                                    {user ? (<p></p>) : <Link href='/sign-up' className={buttonVariants()}>Create Account</Link>}
                                    {user ? null : <span className='h-6 w-px bg-gray-200 aria-hidden="true"'></span>}
                                    <ModeToggle />
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