import { FiArrowRight, FiMonitor, FiSettings } from 'react-icons/fi';

export default function CanvasSizesSection({ handleCreateDesign }) {
  // Canvas size options
  const canvasSizes = [
    {
      name: 'Instagram Post',
      dimensions: '1080 × 1080px',
      icon: <FiMonitor className="text-2xl mb-2 text-indigo-600" />,
    },
    {
      name: 'Facebook Cover',
      dimensions: '851 × 315px',
      icon: <FiMonitor className="text-2xl mb-2 text-indigo-600" />,
    },
    {
      name: 'Twitter Post',
      dimensions: '1200 × 675px',
      icon: <FiMonitor className="text-2xl mb-2 text-indigo-600" />,
    },
    {
      name: 'YouTube Thumbnail',
      dimensions: '1280 × 720px',
      icon: <FiMonitor className="text-2xl mb-2 text-indigo-600" />,
    },
    {
      name: 'LinkedIn Banner',
      dimensions: '1584 × 396px',
      icon: <FiMonitor className="text-2xl mb-2 text-indigo-600" />,
    },
    {
      name: 'Custom Size',
      dimensions: 'Any dimensions',
      icon: <FiSettings className="text-2xl mb-2 text-indigo-600" />,
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold mb-3">
            Perfect Dimensions
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pre-set Canvas Sizes for Any Project</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start with the right dimensions for your specific needs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {canvasSizes.map((size, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 border border-gray-100 cursor-pointer"
              onClick={handleCreateDesign}
            >
              {size.icon}
              <h3 className="font-semibold text-lg mb-1">{size.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{size.dimensions}</p>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium inline-flex items-center transition duration-300">
                Create design
                <FiArrowRight className="ml-1" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 