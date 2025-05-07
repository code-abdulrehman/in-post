import React from 'react';

export default function CtaSection({ handleCreateDesign }) {
  return (
    <section className="py-20 bg-indigo-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern-lines opacity-10 z-0"></div>
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>

      <div className="container mx-auto px-4 max-w-7xl text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Unleash Your Creativity?</h2>
        <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto text-white">
          Join thousands of designers and creators who trust our platform for their design needs
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleCreateDesign}
            className="bg-white text-indigo-600 hover:bg-indigo-50 font-medium py-3 px-8 rounded-lg text-lg transition duration-300 shadow-lg hover:shadow-xl"
          >
            Start Designing Now
          </button>
          <button
            onClick={handleCreateDesign}
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:bg-opacity-10 font-medium py-3 px-8 rounded-lg text-lg transition duration-300"
          >
            Explore Templates
          </button>
        </div>
        <p className="text-white text-sm mt-6 opacity-80">No registration required. Start creating immediately.</p>
      </div>
    </section>
  );
} 