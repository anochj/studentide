import type * as React from "react";
import { cn } from "@/lib/utils";

type LogoProps = React.ComponentProps<"div"> & {
  markClassName?: string;
};

export function Logo({ className, markClassName, ...props }: LogoProps) {
  return (
    <div className={cn("font-bold text-2xl", className)} {...props}>
      student<span className={cn("text-primary", markClassName)}>ide_</span>
    </div>
  );
}
