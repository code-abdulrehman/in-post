import { FiAward, FiGlobe, FiTrendingUp, FiStar } from 'react-icons/fi';

export default function StatsSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center">
            <FiAward className="text-4xl text-indigo-600 mx-auto mb-4" />
            <div className="text-4xl font-bold mb-2">300+</div>
            <p className="text-gray-600">Professional Templates</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center">
            <FiGlobe className="text-4xl text-indigo-600 mx-auto mb-4" />
            <div className="text-4xl font-bold mb-2">150+</div>
            <p className="text-gray-600">Countries Served</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center">
            <FiTrendingUp className="text-4xl text-indigo-600 mx-auto mb-4" />
            <div className="text-4xl font-bold mb-2">1M+</div>
            <p className="text-gray-600">Designs Created</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center">
            <FiStar className="text-4xl text-indigo-600 mx-auto mb-4" />
            <div className="text-4xl font-bold mb-2">4.9/5</div>
            <p className="text-gray-600">Customer Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
} 