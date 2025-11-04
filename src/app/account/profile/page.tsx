import MaxWidthWrapper from "@/components/maxWidthWrapper";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { SignedIn, SignedOut } from "@clerk/nextjs";

import SidebarNav from "@/app/components/navigation/sidebar";
import Unauthorized from "@/app/unauthorized/page";
import ProfileForm from "./profileForm";

const ProfilePage = () => {
  return (
    <>
      <SignedOut>
        <MaxWidthWrapper>
          <Unauthorized />
        </MaxWidthWrapper>
      </SignedOut>
      <SignedIn>
        <MaxWidthWrapper className="relative">
          <div className="mx-auto ml-5 flex flex-col sm:mt-8">
            <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
              Profile
            </h1>
            <p className="mb-8 mt-1 pr-20 text-muted-foreground sm:text-lg">
              Update the information other community members see.
            </p>
          </div>
        </MaxWidthWrapper>
        <MaxWidthWrapper>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={25} minSize={15}>
              <div className="rounded-l-md border-b border-l border-t p-5">
                <SidebarNav />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel minSize={35}>
              <div className="rounded-r-md border-b border-r border-t p-5">
                <ProfileForm />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </MaxWidthWrapper>
      </SignedIn>
    </>
  );
};

export default ProfilePage;
