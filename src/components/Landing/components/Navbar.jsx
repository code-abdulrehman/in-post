import { FiPlusCircle } from 'react-icons/fi';

export default function Navbar({ isScrolled, handleCreateDesign }) {
  return (
    <nav
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'top-3 px-3 sm:top-4 sm:px-4' : 'top-0 px-0'
      }`}
    >
      <div
        className={`mx-auto w-full max-w-7xl transition-all duration-300 ${
          isScrolled
            ? 'rounded-2xl border border-stone-200/90 bg-white/80 py-3 shadow-lg shadow-stone-900/5 backdrop-blur-md sm:px-2'
            : 'bg-transparent py-4 sm:py-5'
        }`}
      >
        <div className={`flex items-center justify-between ${isScrolled ? 'px-3 sm:px-4' : 'px-4 sm:px-5'}`}>
          <div className="flex min-w-0 items-center">
            <h1 className="truncate text-xl font-bold text-orange-600 sm:text-2xl">
              PPost
              <span className="hidden sm:inline"> Designer</span>
            </h1>
          </div>

          <div className="hidden items-center gap-6 text-sm md:flex md:gap-8 md:text-base">
            <a
              href="#features"
              className="font-medium text-stone-700 transition hover:text-orange-600"
            >
              Features
            </a>
            <a
              href="#export"
              className="font-medium text-stone-700 transition hover:text-orange-600"
            >
              Export
            </a>
            <a
              href="#canvas-sizes"
              className="font-medium text-stone-700 transition hover:text-orange-600"
            >
              Sizes
            </a>
            <a href="#faq" className="font-medium text-stone-700 transition hover:text-orange-600">
              FAQ
            </a>
          </div>

          <div className="flex shrink-0 items-center pl-2">
            <button
              type="button"
              onClick={handleCreateDesign}
              className="flex items-center rounded-lg bg-orange-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-orange-700 sm:px-4 sm:text-base"
            >
              <FiPlusCircle className="mr-1 shrink-0" aria-hidden />
              <span className="sm:hidden">New</span>
              <span className="hidden sm:inline">New Design</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
