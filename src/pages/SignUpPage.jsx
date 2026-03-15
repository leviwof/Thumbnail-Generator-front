import { ClerkLoaded, ClerkLoading, SignUp } from "@clerk/react";

import AuthPageShell from "../components/AuthPageShell";

function SignUpPage() {
  return (
    <AuthPageShell
      badge="Create account"
      title="Start uploading videos with a fresh account"
      description="Your existing Clerk publishable key from client/.env now powers a dedicated sign-up flow, so new users can register directly from the app and land in the upload experience."
    >
      <ClerkLoading>
        <div className="space-y-4">
          <div className="h-6 w-32 animate-pulse rounded bg-slate-200" aria-hidden="true" />
          <div className="h-[34rem] rounded-[1.75rem] bg-white shadow-sm" aria-hidden="true" />
        </div>
      </ClerkLoading>

      <ClerkLoaded>
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/upload"
        />
      </ClerkLoaded>
    </AuthPageShell>
  );
}

export default SignUpPage;
