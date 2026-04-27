import { SignIn } from "@/components/sign-in";
import { SignOut } from "@/components/sign-out";
import { SignUp } from "@/components/sign-up";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6">
      <div className="grid w-full max-w-3xl gap-4 md:grid-cols-2">
        <SignIn />
        <SignUp />
      </div>
      <SignOut />
    </main>
  );
}
