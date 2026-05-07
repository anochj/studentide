import { Sparkles } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t bg-surface-1">
      <div className="section-container grid gap-8 py-10 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <div className="flex items-center gap-2 text-heading">
            <div className="flex size-8 items-center justify-center rounded-lg bg-brand text-brand-foreground">
              <Sparkles className="size-4" />
            </div>
            <span className="text-lg font-medium">StudentIDE</span>
          </div>
          <p className="mt-4 max-w-xl text-sm leading-6 text-body-muted">
            Structured coding projects, prepared IDE sessions, searchable
            learning paths, and submissions that preserve the work context.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-body-muted">
          <Link href="/project-marketplace" className="hover:text-heading">
            Marketplace
          </Link>
          <Link href="/plans" className="hover:text-heading">
            Pricing
          </Link>
          <Link href="/signup" className="hover:text-heading">
            Sign up
          </Link>
          <Link href="/project-definitions" className="hover:text-heading">
            Create
          </Link>
        </div>
      </div>
    </footer>
  );
}
