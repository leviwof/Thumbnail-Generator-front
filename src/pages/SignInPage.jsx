import { ClerkLoaded, ClerkLoading, SignIn } from "@clerk/react";

import AuthPageShell from "../components/AuthPageShell";

function SignInPage() {
  return (
    <AuthPageShell
      badge="Welcome back"
      title="Sign in to keep building your video gallery"
      description="Use the Clerk credentials from your configured frontend environment to access uploads, thumbnail generation, and the account menu."
    >
      <ClerkLoading>
        <div className="space-y-4">
          <div className="h-6 w-28 animate-pulse rounded bg-slate-200" aria-hidden="true" />
          <div className="h-[28rem] rounded-[1.75rem] bg-white shadow-sm" aria-hidden="true" />
        </div>
      </ClerkLoading>

      <ClerkLoaded>
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/"
        />
      </ClerkLoaded>
    </AuthPageShell>
  );
}

export default SignInPage;
