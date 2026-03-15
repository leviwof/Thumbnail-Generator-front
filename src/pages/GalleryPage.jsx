import { useDeferredValue, useState } from "react";
import { Link } from "react-router-dom";

import SearchBar from "../components/SearchBar";
import VideoCard from "../components/VideoCard";
import { useVideos } from "../hooks/useVideos";

function GalleryPage() {
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");
  const deferredSearch = useDeferredValue(search);
  const deferredTag = useDeferredValue(tag);
  const { data, isLoading, isError, error } = useVideos(deferredSearch, deferredTag);
  const items = data?.items || [];
  const uniqueTags = new Set(
    items.flatMap((video) => (Array.isArray(video.tags) ? video.tags : []))
  );
  const stats = [
    {
      label: "Videos indexed",
      value: items.length.toString().padStart(2, "0")
    },
    {
      label: "Tags discovered",
      value: uniqueTags.size.toString().padStart(2, "0")
    },
    {
      label: "Ready actions",
      value: "Upload, review, select"
    }
  ];

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 px-8 py-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">
            Gallery control room
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Turn raw videos into gallery-ready thumbnails with a workflow that feels intentional.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Upload source footage, generate multiple thumbnail candidates, and curate the strongest frame before publishing it to the gallery.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/upload"
              className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
            >
              Upload a new video
            </Link>
            <a
              href="#gallery-grid"
              className="inline-flex items-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/90 transition hover:border-white/50 hover:bg-white/10"
            >
              Explore gallery
            </a>
          </div>
        </div>

        <div className="grid gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(148,163,184,0.18)] backdrop-blur"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                {stat.label}
              </p>
              <p className="mt-3 display-font text-3xl font-bold tracking-tight text-slate-950">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <SearchBar search={search} tag={tag} onSearchChange={setSearch} onTagChange={setTag} />

      {isLoading ? <p className="text-sm text-slate-500">Loading videos...</p> : null}
      {isError ? <p className="text-sm text-red-600">{error.message}</p> : null}

      {!isLoading && !data?.items?.length ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/90 p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">No videos found</h2>
          <p className="mt-2 text-sm text-slate-500">
            Upload a video to populate the gallery or adjust the search filters.
          </p>
        </div>
      ) : null}

      <section id="gallery-grid" className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {data?.items?.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </section>
    </div>
  );
}

export default GalleryPage;
