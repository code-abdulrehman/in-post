export default function CtaSection({ handleCreateDesign }) {
  return (
    <section className="py-20 bg-orange-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern-lines opacity-10 z-0" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-amber-400 rounded-full mix-blend-multiply filter blur-xl opacity-50" />

      <div className="container mx-auto px-4 max-w-7xl text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Open the editor and try it</h2>
        <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto text-white">
          Everything runs locally in your browser—pick a canvas size, design, then export or save a
          project file.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleCreateDesign}
            className="bg-white text-orange-600 hover:bg-orange-50 font-medium py-3 px-8 rounded-lg text-lg transition duration-300 shadow-lg hover:shadow-xl"
          >
            Open editor
          </button>
          <a
            href="#faq"
            className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white hover:bg-white/10 font-medium py-3 px-8 rounded-lg text-lg transition duration-300"
          >
            Read FAQ
          </a>
        </div>
        <p className="text-white text-sm mt-6 opacity-80">No account required.</p>
      </div>
    </section>
  );
} 