import MaxWidthWrapper from "@/components/maxWidthWrapper";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  

const Changelog = () => {
    return (
        <>
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
                    </Accordion>
                </MaxWidthWrapper>
            </div>
        </>
    )
}

export default Changelog;