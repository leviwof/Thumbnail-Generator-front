import { ClerkLoaded, ClerkLoading, Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";

import { rememberPendingAuthAction } from "../utils/authToastState";
import { useToast } from "./ToastProvider";

const authButtonClassName =
  "inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-500 hover:text-brand-600";

function SignUpIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19a6 6 0 0 0-12 0" />
      <circle cx="9" cy="7" r="4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 8v6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 11h-6" />
    </svg>
  );
}

function AuthControls() {
  const { info } = useToast();

  const handleSignInClick = () => {
    rememberPendingAuthAction("sign-in");
    info("Redirecting to sign in", "Complete login to upload and manage your videos.");
  };

  const handleSignUpClick = () => {
    rememberPendingAuthAction("sign-up");
    info("Redirecting to sign up", "Create your account to unlock uploads and gallery actions.");
  };

  return (
    <div className="flex items-center gap-3">
      <ClerkLoading>
        <div className="h-10 w-36 animate-pulse rounded-full bg-slate-200" aria-hidden="true" />
      </ClerkLoading>

      <ClerkLoaded>
        <Show when="signed-out">
          <div className="flex items-center gap-2">
            <SignInButton mode="redirect">
              <button type="button" className={authButtonClassName} onClick={handleSignInClick}>
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="redirect" fallbackRedirectUrl="/upload">
              <button
                type="button"
                onClick={handleSignUpClick}
                className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                <SignUpIcon />
                Sign up
              </button>
            </SignUpButton>
          </div>
        </Show>

        <Show when="signed-in">
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-500 sm:inline">Signed in</span>
            <UserButton />
          </div>
        </Show>
      </ClerkLoaded>
    </div>
  );
}

export default AuthControls;
