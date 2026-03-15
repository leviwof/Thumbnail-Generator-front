import { ClerkLoaded, ClerkLoading, Show, SignInButton, SignUpButton } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import VideoUploadForm from "../components/VideoUploadForm";
import { useToast } from "../components/ToastProvider";
import { useGenerateThumbnails } from "../hooks/useGenerateThumbnails";
import { useUploadVideo } from "../hooks/useUploadVideo";
import { rememberPendingAuthAction } from "../utils/authToastState";

function UploadVideoPage() {
  const navigate = useNavigate();
  const [uploadError, setUploadError] = useState("");
  const uploadMutation = useUploadVideo();
  const generateMutation = useGenerateThumbnails();
  const { error: showErrorToast, info, success } = useToast();

  async function handleSubmit(formState) {
    try {
      setUploadError("");
      const uploadResult = await uploadMutation.mutateAsync(formState);
      const videoId = uploadResult.videoId;
      await generateMutation.mutateAsync(videoId);
      success("Video added", "Your video was uploaded and thumbnails were generated.");
      navigate(`/videos/${videoId}`);
    } catch (error) {
      const message = error.response?.data?.message || error.message;

      setUploadError(message);
      showErrorToast("Upload failed", message);
    }
  }

  function handleSignInClick() {
    rememberPendingAuthAction("sign-in");
    info("Redirecting to sign in", "Log in first to add a new video.");
  }

  function handleSignUpClick() {
    rememberPendingAuthAction("sign-up");
    info("Redirecting to sign up", "Create an account first to add a new video.");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/70 bg-slate-950 px-8 py-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">
            Upload workflow
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">
            Prepare a video once and let the app generate your thumbnail options.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            This flow is designed for reviewers to see product thinking, not just file upload mechanics: metadata, preview, automated frame extraction, and thumbnail curation all live in one experience.
          </p>
        </div>

        <div className="grid gap-4">
          {[
            "Add title, description, and tags.",
            "Preview the video before it leaves the browser.",
            "Generate thumbnails and review the result instantly."
          ].map((item, index) => (
            <div
              key={item}
              className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(148,163,184,0.16)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Step 0{index + 1}
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-900">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <ClerkLoading>
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="h-5 w-48 animate-pulse rounded bg-slate-200" aria-hidden="true" />
          <div className="mt-4 h-8 w-80 animate-pulse rounded bg-slate-200" aria-hidden="true" />
          <div className="mt-3 h-5 w-full animate-pulse rounded bg-slate-100" aria-hidden="true" />
          <div className="mt-6 flex gap-3">
            <div className="h-12 w-28 animate-pulse rounded-full bg-slate-200" aria-hidden="true" />
            <div className="h-12 w-28 animate-pulse rounded-full bg-slate-100" aria-hidden="true" />
          </div>
        </section>
      </ClerkLoading>

      <ClerkLoaded>
        <Show when="signed-in">
          <VideoUploadForm
            isSubmitting={uploadMutation.isPending || generateMutation.isPending}
            onSubmit={handleSubmit}
          />
        </Show>

        <Show when="signed-out">
          <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[0_20px_60px_rgba(148,163,184,0.16)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">Authentication required</p>
            <h1 className="mt-3 text-2xl font-semibold text-slate-900">Sign in before uploading a video</h1>
            <p className="mt-2 text-sm text-slate-600">
              Use your Clerk account to access the upload workflow for new videos and generated thumbnails.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <SignInButton mode="redirect" forceRedirectUrl="/upload">
                <button
                  type="button"
                  onClick={handleSignInClick}
                  className="inline-flex rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="redirect" forceRedirectUrl="/upload">
                <button
                  type="button"
                  onClick={handleSignUpClick}
                  className="inline-flex rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-500 hover:text-brand-600"
                >
                  Sign up
                </button>
              </SignUpButton>
            </div>
          </section>
        </Show>
      </ClerkLoaded>

      {uploadError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {uploadError}
        </div>
      ) : null}
    </div>
  );
}

export default UploadVideoPage;
