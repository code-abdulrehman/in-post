import { FiArrowRight } from 'react-icons/fi';

/** Product preview — flows in document (no absolute); scales on all breakpoints. */
function HeroEditorPreview() {
  return (
    <div className="w-full select-none overflow-hidden rounded-2xl border border-orange-100/90 bg-white shadow-xl shadow-orange-900/10 ring-1 ring-orange-950/[0.05] xl:absolute xl:-top-4">
      <div className="flex items-center gap-2 border-b border-stone-100 bg-stone-100/90 px-3 py-2 sm:gap-2.5 sm:px-3">
        <span className="h-2 w-2 shrink-0 rounded-full bg-red-400/90 sm:h-2.5 sm:w-2.5" />
        <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400/90 sm:h-2.5 sm:w-2.5" />
        <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400/90 sm:h-2.5 sm:w-2.5" />
        <span className="min-w-0 truncate text-[10px] font-medium text-stone-500 sm:text-xs">
          ppost.vercel.app/app?project= — canvas
        </span>
      </div>
      <div className="bg-gradient-to-b from-stone-50 to-white p-2 sm:p-3 lg:p-4">
        <img
          src="/dash.png"
          alt="PPost editor preview"
          className="mx-auto w-full max-w-full rounded-lg object-cover object-top shadow-inner ring-1 ring-stone-200/60 max-h-[42vh] min-h-[12rem] sm:max-h-[48vh] sm:min-h-[14rem] md:max-h-[52vh] lg:max-h-[min(68vh,34rem)] lg:min-h-[16rem] xl:max-h-[min(78vh,44rem)] xl:min-h-[18rem] 2xl:max-h-[min(82vh,48rem)]"
          width={1600}
          height={1000}
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  );
}

export default function HeroSection({ handleCreateDesign }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50/90 via-white to-amber-50/50 pb-12 pt-[4.5rem] sm:pb-16 sm:pt-[5.25rem] md:pb-20 md:pt-28 lg:pb-24 lg:pt-32 xl:pb-28 xl:pt-36">
      <div className="pointer-events-none absolute inset-0 z-0 bg-pattern-lines opacity-[0.06]" aria-hidden />
      <div className="pointer-events-none absolute -bottom-16 -right-12 z-0 h-56 w-56 rounded-full bg-orange-200/40 blur-3xl sm:-bottom-20 sm:-right-16 sm:h-72 sm:w-72" />
      <div className="pointer-events-none absolute -left-12 -top-16 z-0 h-56 w-56 rounded-full bg-amber-100/50 blur-3xl sm:h-64 sm:w-64" />

      {/* Same horizontal rhythm as navbar (max-w-7xl) */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-5 lg:px-6">
        <div className="flex flex-col gap-8 sm:gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] lg:items-center lg:gap-x-10 lg:gap-y-10 xl:gap-x-16 2xl:gap-x-20">
          <div className="min-w-0 max-w-xl lg:max-w-none lg:pr-2 xl:pr-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-800/75 sm:mb-3 sm:text-xs sm:tracking-[0.18em]">
              PPost · in your browser
            </p>
            <h1 className="font-hero-display text-neutral-900">
              {/* Scale must not shrink past md — large screens match original serif poster look */}
              <span className="block text-[1.85rem] font-normal leading-[1.08] sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.05] xl:text-[3.75rem] 2xl:text-[4rem]">
                Design in the tab.
              </span>
              <span className="mt-1 block text-[1.85rem] font-normal italic leading-[1.08] text-orange-600 sm:text-4xl md:text-5xl lg:text-[3.35rem] xl:text-[3.85rem] 2xl:text-[4.1rem]">
                Export in seconds.
              </span>
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-stone-600 sm:mt-5 sm:text-base md:text-lg lg:max-w-xl lg:text-lg xl:text-xl">
              Canvas, layers, and typography—then PNG, JPG, or WebP. No extra apps, no account wall
              for trying the editor.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="button"
                onClick={handleCreateDesign}
                className="inline-flex w-full items-center justify-center rounded-lg bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-orange-700 hover:shadow-lg sm:w-auto sm:px-8 sm:text-base"
              >
                Open editor
                <FiArrowRight className="ml-2 shrink-0" aria-hidden />
              </button>
              <a
                href="#features"
                className="inline-flex w-full items-center justify-center rounded-lg border-2 border-orange-600 bg-white/90 px-6 py-3 text-sm font-semibold text-orange-700 backdrop-blur-sm transition hover:bg-orange-50 sm:w-auto sm:px-8 sm:text-base"
              >
                Features
              </a>
            </div>
            <p className="mt-4 text-xs text-stone-500 sm:mt-5 sm:text-sm">No account required.</p>
          </div>

          <div className="min-w-0 w-full">
            <HeroEditorPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
