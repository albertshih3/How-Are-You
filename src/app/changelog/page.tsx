import MaxWidthWrapper from "@/components/maxWidthWrapper";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { toast, Toaster } from 'sonner';
  

const Changelog = () => {
    return (
        <>
            <Toaster position="bottom-center" richColors  />
            <MaxWidthWrapper>
                <div className = 'container relative flex flex-col pt-10 items-center justify-center'>
                    <h1 className = 'text-4xl font-bold sm:text-6xl'>Changelog</h1>
                    <p className = 'mt-6 text-lg max-w-prose text-muted-foreground text-align:center'>Here you can find the latest changes to the app.</p>
                    <span className='h-20 bg-gray-200 aria-hidden="true"'></span>
                </div>
            </MaxWidthWrapper>
            <div>
                <MaxWidthWrapper>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger className='font-bold text-xl'>Update 1</AccordionTrigger>
                            <AccordionContent>
                            Initial update after initial push to main. This is the first iteration of the
                            changlog page which should make it easier to keep track of changes outside of Github
                            commits.
                            <p className = 'font-bold'>Changes:</p>
                            <ul>
                                <li>- Added Changelog page</li>
                                <li>- Updated navbar to include changelog page</li>
                                <li>- Implemented authentication to navbar (only show changes when logged in)</li>
                            </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className='font-bold text-xl'>Update 2: Navbar & Login</AccordionTrigger>
                            <AccordionContent>
                            Updates to the navigation bar and login page. This update includes a new mobile navigation button
                            and also fixes the spacing issue on the login page. It also fixes an issue where the password field
                            on the login page was not being recognized as a password field.
                            <p className = 'font-bold'>Changes:</p>
                            <ul>
                                <li>- New hamburger menu on navigation bar</li>
                                <li>- Fixed login page input spacing</li>
                                <li>- Updated password field on login to be a password type and not a regular input.</li>
                            </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger className='font-bold text-xl'>Update 3: Navbar Revamp!</AccordionTrigger>
                            <AccordionContent>
                            Navigation Bar is now responsive and uses new UI components. Navbar also complies with theming.
                            Navigation bar items are still hardcoded at the moment and will be updated in the future to match
                            the pages in the app.
                            <p className = 'font-bold'>Changes:</p>
                            <ul>
                                <li>- New navigation bar with proper theming</li>
                            </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger className='font-bold text-xl'>Update 4: Mobile Navigation & Toasts!</AccordionTrigger>
                            <AccordionContent>
                            Introducing the mobile navbar! Now the navbar is fully functional on mobile devices. Also, updated
                            toasts in the app to now display directly from the navbar. This will make it so we do not need to
                            store the toast message in session storage anymore. Toasts should also persist across page changes now.
                            <p className = 'font-bold'>Changes:</p>
                            <ul className='pb-5'>
                                <li>- New mobile navigation bar using drawers!</li>
                                <li>- Updated toasts to display from navbar</li>
                                <li className='font-bold'>- ISSUE: Remove sessionStorage toast storage</li>
                                <li className='font-bold'>- ISSUE: Extra toast code due to sessionStorage</li>
                                <li className='font-bold'>- ISSUE: Navbar not changing color in dark mode</li>
                            </ul>
                            <p className = 'border-t pt-3 font-bold'>Hotfix 1</p>
                            <ul>
                                <li className='font-bold'>- FIXED: Removed sessionStorage toast storage</li>
                                <li className='font-bold'>- FIXED: Removed extra toast code due to sessionStorage</li>
                                <li className='font-bold'>- FIXED: Navbar is now dynamic :D</li>
                            </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-5">
                            <AccordionTrigger className='font-bold text-xl'>Update 5: Navigation Bar Iteration 1 Final!</AccordionTrigger>
                            <AccordionContent>
                            Finished up navbar by removing placeholder text and adding future page links.
                            Mobile navigation is also looking better!
                            <p className = 'font-bold'>Changes:</p>
                            <ul className='pb-5'>
                                <li>- Removed placeholder text, added additional navigation items</li>
                                <li>- Updated mobile navigation to match desktop navigation</li>
                                <li className='font-bold'>- ISSUE: Mobile Navigation still does not close upon menu click</li>
                            </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </MaxWidthWrapper>
            </div>
        </>
    )
}

export default Changelog;