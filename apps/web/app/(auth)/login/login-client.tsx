"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Google from "@/components/icons/Google";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import {
  AUTH_REDIRECT_PARAM,
  getAuthPageHref,
  getSafeAuthRedirectPath,
} from "@/lib/auth-redirect";

// Simple login schema - usually kept in @/lib/validations/auth
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginInput = z.infer<typeof loginSchema>;

function LoginPageContent() {
  const searchParams = useSearchParams();
  const redirectPath = useMemo(
    () => getSafeAuthRedirectPath(searchParams.get(AUTH_REDIRECT_PARAM)),
    [searchParams],
  );
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    setServerError(null);
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: redirectPath,
    });

    if (error) {
      // Better Auth returns 'INVALID_EMAIL_OR_PASSWORD' for credentials
      setServerError(error.message || "Invalid email or password.");
    }
  };

  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 min-h-screen items-center">
      <aside className="hidden lg:block relative h-screen">
        <Image
          src="/images/studentide_icon_dark.png"
          alt="studentide logo"
          fill
          className="object-contain p-24"
          priority
        />
      </aside>

      <section className="h-full flex flex-col items-center justify-center px-8 py-12 lg:px-20">
        <div className="w-full max-w-md">
          <header className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground mt-2">
              Enter your credentials to access your account.
            </p>
          </header>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...register("email")}
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    className="h-12"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <FieldError>{errors.email.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    {...register("password")}
                    id="password"
                    type="password"
                    className="h-12"
                    aria-invalid={!!errors.password}
                  />
                  {errors.password && (
                    <FieldError>{errors.password.message}</FieldError>
                  )}
                </Field>

                {serverError && (
                  <p className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
                    {serverError}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium mt-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              </FieldGroup>
            </FieldSet>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-12"
              type="button"
              onClick={() =>
                authClient.signIn.social({
                  provider: "github",
                  callbackURL: redirectPath,
                })
              }
            >
              <GitHubLogoIcon className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button
              variant="outline"
              className="h-12"
              type="button"
              onClick={() =>
                authClient.signIn.social({
                  provider: "google",
                  callbackURL: redirectPath,
                })
              }
            >
              <Google />
              Google
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href={getAuthPageHref("/signup", redirectPath)}
              className="font-semibold text-primary hover:underline"
            >
              Create one for free
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  );
}
