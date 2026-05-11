import { FiArrowRight } from 'react-icons/fi';

/** Lightweight “editor in the browser” preview — no raster hero image, fills width cleanly. */
function HeroEditorPreview() {
  return (
    <div className="w-full select-none rounded-t-2xl border border-orange-100/90 bg-white p-2 shadow-xl shadow-orange-900/10 ring-1 ring-orange-950/[0.05] sm:p-3 absolute top-16 -right-32 h-[86vh] w-[70%] overflow-hidden">
      <div className="mb-2 flex items-center gap-1.5 rounded-lg bg-stone-100 px-2 py-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
        <span className="ml-2 truncate text-[10px] font-medium text-stone-500 sm:text-xs">
        ppost.vercel.app/app?project= — canvas
        </span>
      </div>
      <div className="flex h-auto gap-2 overflow-hidden rounded-xl bg-stone-50 p-2 sm:gap-3 sm:p-3">
        <img src="/dash.png" alt="Hero Preview" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}

export default function HeroSection({ handleCreateDesign }) {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-orange-50/90 via-white to-amber-50/50 py-14 pt-[4.75rem] sm:py-16 sm:pt-24 md:py-20 md:pt-28">
      <div className="pointer-events-none absolute inset-0 z-0 bg-pattern-lines opacity-[0.06]" aria-hidden />
      <div className="pointer-events-none absolute -bottom-20 -right-16 z-0 h-64 w-64 rounded-full bg-orange-200/45 blur-3xl sm:h-80 sm:w-80" />
      <div className="pointer-events-none absolute -left-16 -top-20 z-0 h-64 w-64 rounded-full bg-amber-100/55 blur-3xl sm:h-72 sm:w-72" />

      <div className="relative z-10 mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-10 ">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-x-14 xl:gap-x-20">
          <div className="max-w-xl lg:max-w-none flex flex-col justify-center absolute top-24">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-orange-800/75 sm:text-sm">
              PPost · in your browser
            </p>
            <h1 className="font-hero-display text-neutral-900">
              <span className="block text-4xl font-normal leading-[1.07] sm:text-5xl lg:text-[3.05rem]">
                Design in the tab.
              </span>
              <span className="mt-1 block text-4xl font-normal italic leading-[1.07] text-orange-600 sm:text-5xl lg:text-[3.1rem]">
                Export in seconds.
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-stone-600 sm:text-lg">
              Canvas, layers, and typography—then PNG, JPG, or WebP. No extra apps, no account wall
              for trying the editor.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="button"
                onClick={handleCreateDesign}
                className="inline-flex w-full items-center justify-center rounded-lg bg-orange-600 px-7 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-orange-700 hover:shadow-lg sm:w-auto sm:px-8"
              >
                Open editor
                <FiArrowRight className="ml-2 shrink-0" aria-hidden />
              </button>
              <a
                href="#features"
                className="inline-flex w-full items-center justify-center rounded-lg border-2 border-orange-600 bg-white/90 px-7 py-3.5 text-base font-semibold text-orange-700 backdrop-blur-sm transition hover:bg-orange-50 sm:w-auto sm:px-8"
              >
                Features
              </a>
            </div>
            <p className="mt-5 text-sm text-stone-500">No account required.</p>
          </div>

          <div className="min-w-0">
            <HeroEditorPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
