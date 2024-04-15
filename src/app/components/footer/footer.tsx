import MaxWidthWrapper from "@/components/maxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const Footer = () => {
  return (
    <MaxWidthWrapper>
      <footer style={{ position: "absolute", bottom: 0, width: "75%" }}>
        <div className="border-t pt-2 flex space-x-5 items-center justify-center">
          <div>
            <p>© 2024 Albert Shih</p>
          </div>
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
      </footer>
    </MaxWidthWrapper>
  );
};

export default Footer;
