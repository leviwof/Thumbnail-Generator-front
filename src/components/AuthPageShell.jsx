function AuthPageShell({ badge, description, title, children }) {
  return (
    <div className="mx-auto max-w-5xl">
      <section className="grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/60 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.2),_transparent_45%),linear-gradient(135deg,_#0f172a,_#1e293b_55%,_#0f766e)] px-8 py-10 text-white sm:px-10 lg:px-12 lg:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">{badge}</p>
          <h1 className="mt-4 max-w-md text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-slate-200 sm:text-base">{description}</p>

          <div className="mt-10 grid gap-4 text-sm text-slate-100 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur">
              <p className="font-semibold text-white">Protected uploads</p>
              <p className="mt-2 text-slate-200">Create an account to unlock the upload form and generate thumbnails.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur">
              <p className="font-semibold text-white">Fast access</p>
              <p className="mt-2 text-slate-200">Return to your session from the header avatar whenever you need it.</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-8 sm:px-8 lg:px-10 lg:py-12">{children}</div>
      </section>
    </div>
  );
}

export default AuthPageShell;
