"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type UserProfileAvatarProps = {
  name: string;
  email?: string | null;
  image?: string | null;
  className?: string;
  fallbackClassName?: string;
};

function getUserInitials(name: string, email?: string | null) {
  const trimmedName = name.trim();
  const trimmedEmail = email?.trim();
  const source =
    trimmedName && trimmedName !== "Student"
      ? trimmedName
      : trimmedEmail || trimmedName || "Student";
  const initials = source
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return initials || "ST";
}

export function UserProfileAvatar({
  name,
  email,
  image,
  className,
  fallbackClassName,
}: UserProfileAvatarProps) {
  const displayName = name || "Student";
  const initials = getUserInitials(displayName, email);

  return (
    <Avatar className={cn("size-8 rounded-md", className)}>
      <AvatarImage alt={displayName} src={image ?? undefined} />
      <AvatarFallback className={cn("rounded-md text-xs", fallbackClassName)}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
