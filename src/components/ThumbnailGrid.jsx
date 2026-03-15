import { useState } from "react";

import { useToast } from "./ToastProvider";
import { classNames } from "../utils/classNames";
import { resolveAssetUrl } from "../utils/assetUrl";
import { downloadAsset } from "../utils/downloadAsset";

function ThumbnailGrid({
  thumbnails,
  primaryThumbnailId,
  onSelect,
  isSelectable = false,
  isLoading = false
}) {
  const [downloadingThumbnailId, setDownloadingThumbnailId] = useState("");
  const [downloadError, setDownloadError] = useState("");
  const { error: showErrorToast, success } = useToast();

  if (!thumbnails.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        No thumbnails available yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {thumbnails.map((thumbnail) => {
        const isPrimary = thumbnail._id === primaryThumbnailId;
        const thumbnailSource = thumbnail.url || thumbnail.thumbnailUrl;
        const thumbnailSrc = resolveAssetUrl(thumbnailSource);
        const downloadName = thumbnail.filename || `thumbnail-${thumbnail._id}.png`;
        const isDownloading = downloadingThumbnailId === thumbnail._id;

        return (
          <div
            key={thumbnail._id}
            onClick={() => {
              if (isSelectable && !isPrimary) {
                onSelect?.(thumbnail._id);
              }
            }}
            onKeyDown={(event) => {
              if (!isSelectable || isLoading || isPrimary) {
                return;
              }

              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect?.(thumbnail._id);
              }
            }}
            role={isSelectable ? "button" : undefined}
            tabIndex={isSelectable && !isLoading ? 0 : undefined}
            className={classNames(
              "group overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition relative",
              isSelectable ? "hover:-translate-y-0.5 hover:shadow-md" : "",
              isPrimary ? "border-brand-500 ring-2 ring-brand-100" : "border-slate-200",
              isLoading ? "opacity-60 cursor-wait" : ""
            )}
          >
            <div className="aspect-video bg-slate-100">
              {thumbnailSrc ? (
                <img
                  src={thumbnailSrc}
                  alt="thumbnail"
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={() => {
                    console.log("Thumbnail failed:", thumbnailSource);
                  }}
                />
              ) : null}
              {isPrimary && (
                <span className="absolute left-3 top-3 rounded-full bg-brand-500/90 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  Primary
                </span>
              )}
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm font-medium text-slate-700">
                {isPrimary ? "Primary thumbnail" : "Select as primary"}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">
                  {thumbnail.timestampSeconds.toFixed(2)}s
                </span>
                {thumbnailSrc ? (
                  <button
                    type="button"
                    disabled={isDownloading}
                    onClick={async (event) => {
                      event.stopPropagation();
                      setDownloadError("");
                      setDownloadingThumbnailId(thumbnail._id);

                      try {
                        await downloadAsset(thumbnailSource, downloadName);
                        success("Download started", `${downloadName} is being saved to your device.`);
                      } catch (error) {
                        const message = error.message || "Unable to download the thumbnail.";

                        setDownloadError(message);
                        showErrorToast("Download failed", message);
                      } finally {
                        setDownloadingThumbnailId("");
                      }
                    }}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-brand-500 hover:text-brand-500"
                  >
                    {isDownloading ? "Downloading..." : "Download"}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
      {downloadError ? <p className="sm:col-span-2 xl:col-span-4 text-sm text-red-600">{downloadError}</p> : null}
    </div>
  );
}

export default ThumbnailGrid;
