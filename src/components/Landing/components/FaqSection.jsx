import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const faqs = [
  {
    q: 'What is PPost?',
    a: 'PPost is a browser-based canvas editor for social graphics. You build layouts with layers, shapes, images, and text—then export or save projects on your device.',
  },
  {
    q: 'Do I need an account?',
    a: 'No. You can open the editor and start working without signing up.',
  },
  {
    q: 'Where is my work stored?',
    a: 'Projects are saved in your browser using local storage, so they stay on your machine unless you export or copy them elsewhere.',
  },
  {
    q: 'Which export formats are supported?',
    a: 'You can download PNG, JPG, and WebP images from the export dialog, save a PPost project file (.ppost.json) to reopen later, or use a raster export with an optional watermark.',
  },
  {
    q: 'Is there a template library in the app?',
    a: 'The editor focuses on a blank canvas and presets (like common social sizes). There is not a separate in-app template marketplace.',
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState(null);

  return (
    <section id="faq" className="py-20 md:py-24 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-orange-100 text-orange-900 rounded-full text-sm font-semibold mb-3">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Common questions</h2>
          <p className="mt-3 text-lg text-gray-600">
            Straight answers about how PPost works in your browser.
          </p>
        </div>

        <ul className="space-y-3">
          {faqs.map((item, index) => {
            const isOpen = open === index;
            return (
              <li
                key={item.q}
                className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium text-gray-900 hover:bg-orange-50/80 transition-colors"
                  onClick={() => setOpen(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <FiChevronDown
                    className={`shrink-0 text-orange-600 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    size={22}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-0 text-gray-600 text-sm md:text-base leading-relaxed border-t border-gray-100">
                    <p className="pt-3">{item.a}</p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
