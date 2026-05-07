"use client";

import { Code } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { UserAccountMenu } from "@/components/user-account-menu";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";

const links = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Marketplace",
    href: "/project-marketplace",
  },
  {
    name: "Pricing",
    href: "/plans",
  },
];

export default function PublicNavbar() {
  const { data: session } = authClient.useSession();

  return (
    <nav className="sticky top-0 z-40 flex w-full items-center justify-between border-b bg-background/95 px-4 py-2 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-5">
        <Logo className="shrink-0 text-xl sm:text-2xl" />

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {links.map((link) => (
              <NavigationMenuItem key={link.name}>
                <NavigationMenuLink href={link.href}>
                  {link.name}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex items-center gap-2">
        {!session ? (
          <Button
            variant="outline"
            size="lg"
            className="hidden sm:inline-flex"
            asChild
          >
            <Link href="/signup">Sign Up</Link>
          </Button>
        ) : (
          <UserAccountMenu align="end" side="bottom" variant="navbar" />
        )}

        <Button size="lg" asChild>
          <Link href="/project-definitions">
            <Code />
            <span className="hidden sm:inline">Create a Project</span>
            <span className="sm:hidden">Create</span>
          </Link>
        </Button>
      </div>
    </nav>
  );
}
