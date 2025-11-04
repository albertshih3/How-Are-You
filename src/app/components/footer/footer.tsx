import MaxWidthWrapper from "@/components/maxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-auto border-t bg-background">
      <MaxWidthWrapper className="flex flex-col items-center justify-between gap-4 py-6 text-center sm:flex-row sm:text-left">
        <p className="text-sm text-muted-foreground">© 2024 Albert Shih</p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:justify-end">
          <Link
            className={buttonVariants({ variant: "linkHover2" })}
            href="/about"
          >
            About Us
          </Link>
          <Link
            className={buttonVariants({ variant: "linkHover2" })}
            href="/privacy-policy"
          >
            Privacy Policy
          </Link>
          <Link
            className={buttonVariants({ variant: "linkHover2" })}
            href="/terms"
          >
            Terms of Service
          </Link>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
};

export default Footer;
