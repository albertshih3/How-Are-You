import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const SidebarNav = () => {
  return (
    <div className="flex w-full flex-col items-center space-y-3">
      <Link href="/account" className={buttonVariants({ variant: "outline" })}>
        Profile Settings
      </Link>
      <Link
        href="/account/personalinformation"
        className={buttonVariants({ variant: "ghost" })}
      >
        Personal Settings
      </Link>
      <Link
        href="/account/acctsecuritystg"
        className={buttonVariants({ variant: "ghost" })}
      >
        Security Settings
      </Link>
    </div>
  );
};

export default SidebarNav;
