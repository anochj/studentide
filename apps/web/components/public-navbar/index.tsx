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
    <nav className="w-full border-b flex justify-between items-center px-14 py-2">
      <div className="flex gap-6">
        <Logo />

        <NavigationMenu>
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

      <div className="flex gap-2">
        {!session ? (
          <Button variant="outline" size="lg" className="p-4 py-5" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        ) : (
          <UserAccountMenu align="end" side="bottom" variant="navbar" />
        )}

        <Button size="lg" className="p-4 py-5" asChild>
          <Link href="/project-definitions">
            <Code /> Create a Project
          </Link>
        </Button>
      </div>
    </nav>
  );
}
