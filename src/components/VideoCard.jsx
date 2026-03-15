import { Link } from "react-router-dom";

import { resolveAssetUrl } from "../utils/assetUrl";
import { formatDate } from "../utils/formatters";

function VideoCard({ video }) {
  const thumbnailSrc = resolveAssetUrl(
    video.primaryThumbnail?.url || video.primaryThumbnail?.thumbnailUrl
  );
  const tagPreview = Array.isArray(video.tags) ? video.tags.slice(0, 3) : [];

  return (
    <Link
      to={`/videos/${video._id}`}
      className="group overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/90 shadow-[0_20px_60px_rgba(148,163,184,0.18)] transition hover:-translate-y-1.5 hover:shadow-[0_28px_80px_rgba(15,23,42,0.18)]"
    >
      <div className="relative aspect-video overflow-hidden bg-slate-200">
        {thumbnailSrc ? (
          <img
            src={thumbnailSrc}
            alt={video.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-medium text-slate-500">
            No thumbnail yet
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/70 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-slate-950/65 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
          {thumbnailSrc ? "Primary selected" : "Pending curation"}
        </div>
      </div>
      <div className="space-y-4 px-5 py-5">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">{video.title}</h2>
          <p className="text-sm text-slate-500">Uploaded {formatDate(video.createdAt)}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {tagPreview.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
            >
              #{tag}
            </span>
          ))}
          {!tagPreview.length ? (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
              Untagged
            </span>
          ) : null}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-sm font-medium text-slate-600">Open detail workspace</span>
          <span className="text-sm font-semibold text-brand-500 transition group-hover:translate-x-1">
            View video
          </span>
        </div>
      </div>
    </Link>
  );
}

export default VideoCard;
