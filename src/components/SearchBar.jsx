function SearchBar({ search, tag, onSearchChange, onTagChange }) {
  return (
    <div className="grid gap-6 rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(148,163,184,0.16)] backdrop-blur lg:grid-cols-[1.2fr_0.8fr_auto] lg:items-end">
      <label className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          Search by title
        </span>
        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search videos, campaigns, or concepts..."
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 outline-none ring-0 transition focus:border-brand-500"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          Filter by tag
        </span>
        <input
          type="text"
          value={tag}
          onChange={(event) => onTagChange(event.target.value)}
          placeholder="e.g. travel or product"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 outline-none ring-0 transition focus:border-brand-500"
        />
      </label>

      <div className="rounded-2xl bg-slate-950 px-5 py-4 text-sm text-white">
        <p className="font-semibold">Curate faster</p>
        <p className="mt-1 text-slate-300">
          Find a title, open it, and promote the strongest frame in one pass.
        </p>
      </div>
    </div>
  );
}

export default SearchBar;
