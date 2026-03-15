import { useEffect, useState } from "react";

function VideoUploadForm({ isSubmitting, submitLabel, onSubmit }) {
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    tags: "",
    videoFile: null
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState("");
  const [previewError, setPreviewError] = useState("");

  useEffect(() => {
    if (!formState.videoFile) {
      setPreviewUrl("");
      setThumbnailPreviewUrl("");
      setPreviewError("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(formState.videoFile);
    let isActive = true;

    setPreviewUrl(objectUrl);
    setThumbnailPreviewUrl("");
    setPreviewError("");

    const previewVideo = document.createElement("video");
    previewVideo.preload = "metadata";
    previewVideo.muted = true;
    previewVideo.playsInline = true;

    const handleLoadedMetadata = () => {
      const duration = Number.isFinite(previewVideo.duration) ? previewVideo.duration : 0;
      const captureTime = duration > 0 ? Math.min(Math.max(duration * 0.25, 0.1), duration) : 0;

      try {
        previewVideo.currentTime = captureTime;
      } catch (_error) {
        setPreviewError("Thumbnail preview could not be generated, but the video preview is ready.");
      }
    };

    const handleSeeked = () => {
      if (!isActive) {
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = previewVideo.videoWidth || 640;
      canvas.height = previewVideo.videoHeight || 360;

      const context = canvas.getContext("2d");

      if (!context) {
        setPreviewError("Thumbnail preview could not be generated, but the video preview is ready.");
        return;
      }

      context.drawImage(previewVideo, 0, 0, canvas.width, canvas.height);
      setThumbnailPreviewUrl(canvas.toDataURL("image/png"));
    };

    const handleError = () => {
      if (isActive) {
        setPreviewError("Thumbnail preview could not be generated, but the video preview is ready.");
      }
    };

    previewVideo.addEventListener("loadedmetadata", handleLoadedMetadata);
    previewVideo.addEventListener("seeked", handleSeeked);
    previewVideo.addEventListener("error", handleError);
    previewVideo.src = objectUrl;

    return () => {
      isActive = false;
      previewVideo.removeEventListener("loadedmetadata", handleLoadedMetadata);
      previewVideo.removeEventListener("seeked", handleSeeked);
      previewVideo.removeEventListener("error", handleError);
      previewVideo.removeAttribute("src");
      previewVideo.load();
      URL.revokeObjectURL(objectUrl);
    };
  }, [formState.videoFile]);

  function updateField(field, value) {
    setFormState((current) => ({
      ...current,
      [field]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit(formState);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[0_24px_80px_rgba(148,163,184,0.18)]"
    >
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Upload a video</h1>
        <p className="mt-2 text-sm text-slate-500">
          Add metadata, upload the source video, and generate gallery-ready thumbnails.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">Title</span>
          <input
            type="text"
            required
            value={formState.title}
            onChange={(event) => updateField("title", event.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-500"
            placeholder="My product launch demo"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">Tags</span>
          <input
            type="text"
            value={formState.tags}
            onChange={(event) => updateField("tags", event.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-500"
            placeholder="launch, campaign, feature"
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-700">Description</span>
        <textarea
          rows="4"
          value={formState.description}
          onChange={(event) => updateField("description", event.target.value)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-500"
          placeholder="Describe the content, goal, and intended audience."
        />
      </label>

      <label className="flex flex-col gap-3 rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50/80 p-5">
        <span className="text-sm font-medium text-slate-700">Video file</span>
        <input
          type="file"
          accept="video/*"
          required
          onChange={(event) => updateField("videoFile", event.target.files?.[0] || null)}
          className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-slate-500"
        />
        <p className="text-sm text-slate-500">
          Upload a landscape or portrait video. The app will extract thumbnail candidates automatically.
        </p>
      </label>

      {previewUrl ? (
        <section className="space-y-4 rounded-[1.75rem] border border-slate-200 bg-slate-50/90 p-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Video preview</h2>
            <p className="mt-1 text-sm text-slate-500">
              The selected file is previewed locally before upload. The thumbnail is taken from the video itself.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 px-4 py-3">
                <p className="text-sm font-medium text-slate-700">Thumbnail preview</p>
              </div>
              <div className="aspect-video bg-slate-100">
                {thumbnailPreviewUrl ? (
                  <img
                    src={thumbnailPreviewUrl}
                    alt="Generated thumbnail preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500">
                    Generating thumbnail preview...
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 px-4 py-3">
                <p className="text-sm font-medium text-slate-700">Video preview</p>
              </div>
              <video
                src={previewUrl}
                poster={thumbnailPreviewUrl || undefined}
                controls
                className="aspect-video h-full w-full bg-black"
              />
            </div>
          </div>

          {previewError ? <p className="text-sm text-amber-600">{previewError}</p> : null}
        </section>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitLabel || (isSubmitting ? "Uploading..." : "Upload & generate thumbnails")}
      </button>
    </form>
  );
}

export default VideoUploadForm;
