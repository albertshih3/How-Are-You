"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
      <Link
        href="/account"
        className={`
          ${pathname === "/account/" ? buttonVariants({ variant: "ghost" }) : buttonVariants({ variant: "linkHover2" })},
          ${pathname === "/account/" ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline"},
          "justify-start",
          `}
      >
        Account
      </Link>
      <Link
        href="/account/profile"
        className={`
          ${pathname === "/account/profile/" ? buttonVariants({ variant: "ghost" }) : buttonVariants({ variant: "linkHover2" })},
          ${pathname === "/account/profile/" ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline"},
          "justify-start",
          `}
      >
        Profile
      </Link>
      <Link
        href="/account/security"
        className={`
          ${pathname === "/account/security/" ? buttonVariants({ variant: "ghost" }) : buttonVariants({ variant: "linkHover2" })},
          ${pathname === "/account/security/" ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline"},
          "justify-start",
          `}
      >
        Security
      </Link>
    </nav>
  );
}
