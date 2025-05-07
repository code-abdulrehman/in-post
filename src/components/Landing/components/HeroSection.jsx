import { FiArrowRight } from 'react-icons/fi';

export default function HeroSection({ handleCreateDesign }) {
  return (
    <section className="bg-gradient-to-b from-indigo-50 to-white pt-32 pb-16 md:pb-24 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Create Stunning <br />
              <span className="text-indigo-600">Social Media</span> Graphics
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              The ultimate online design tool to create eye-catching social media posts, marketing materials, and more in minutes.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleCreateDesign}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 shadow-md hover:shadow-lg flex items-center"
              >
                Start Designing
                <FiArrowRight className="ml-2" />
              </button>
              <a
                href="#features"
                className="bg-white hover:bg-gray-50 text-gray-800 font-bold py-3 px-8 rounded-lg transition duration-300 border border-gray-200 shadow-sm hover:shadow-md"
              >
                Learn More
              </a>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="bg-white p-4 shadow-xl rounded-xl transform rotate-2 hover:rotate-0 transition-transform duration-500 max-w-xl mx-auto">
              <img
                src="/src/assets/bg-pattern-lines.webp"
                alt="InPost Designer Preview"
                className="rounded-lg w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 