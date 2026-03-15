import { ClerkLoaded, Show } from "@clerk/react";
import { Link, NavLink } from "react-router-dom";

import AuthControls from "./AuthControls";

function navClassName({ isActive }) {
  return [
    "rounded-full px-4 py-2 text-sm font-medium transition",
    isActive
      ? "bg-slate-950 text-white shadow-lg shadow-slate-950/15"
      : "text-slate-600 hover:bg-white hover:text-slate-950"
  ].join(" ");
}

function Layout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(29,78,216,0.14),transparent_58%)]"
      />

      <header className="sticky top-0 z-20 border-b border-white/60 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white shadow-lg shadow-brand-500/20">
                TG
              </span>
              <div>
                <p className="display-font text-lg font-bold tracking-tight text-slate-950">
                  Thumbnail Generator
                </p>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
                  Video Gallery Studio
                </p>
              </div>
            </Link>

          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

            <nav className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100/80 p-1">
              <NavLink to="/" className={navClassName}>
                Gallery
              </NavLink>
              <ClerkLoaded>
                <Show when="signed-in">
                  <NavLink to="/upload" className={navClassName}>
                    Upload
                  </NavLink>
                </Show>
              </ClerkLoaded>
            </nav>

            <AuthControls />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}

export default Layout;
