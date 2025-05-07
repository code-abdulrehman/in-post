import { FiArrowRight, FiImage, FiFileText, FiCode, FiDownload } from 'react-icons/fi';

export default function ExportSection({ handleCreateDesign }) {
  // Export options data
  const exportOptions = [
    {
      title: 'PNG Format',
      description: 'High-quality raster images with transparency support',
      icon: <FiImage className="text-3xl mb-3 text-indigo-600" />,
    },
    {
      title: 'JPEG Format',
      description: 'Compressed images ideal for photos and web sharing',
      icon: <FiFileText className="text-3xl mb-3 text-indigo-600" />,
    },
    {
      title: 'SVG Format',
      description: 'Scalable vector graphics for responsive designs',
      icon: <FiCode className="text-3xl mb-3 text-indigo-600" />,
    },
    {
      title: 'PDF Format',
      description: 'Professional document format for printing and sharing',
      icon: <FiFileText className="text-3xl mb-3 text-indigo-600" />,
    }
  ];

  return (
    <section id="export" className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-16">
            <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold mb-3">
              Export Options
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Share Your Designs Anywhere</h2>
            <p className="text-xl text-gray-600 mb-8">
              Export your designs in multiple formats to use them exactly where you need them.
            </p>

            <div className="space-y-6">
              {exportOptions.map((option, index) => (
                <div key={index} className="flex items-start">
                  <div className="mr-4 mt-1">
                    {option.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{option.title}</h3>
                    <p className="text-gray-600">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleCreateDesign}
              className="mt-10 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300 shadow-md hover:shadow-lg inline-flex items-center"
            >
              Try Export Features
              <FiArrowRight className="ml-2" />
            </button>
          </div>

          <div className="lg:w-1/2">
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-lg">Export Preview</h3>
                <div className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded">
                  Multiple Formats
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <img
                  src="/api/placeholder/500/300"
                  alt="Export Preview"
                  className="w-full rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="bg-white border border-gray-200 hover:border-indigo-500 text-gray-800 font-medium py-2 rounded-lg transition duration-300 flex items-center justify-center">
                  <FiDownload className="mr-2 text-indigo-600" />
                  PNG
                </button>
                <button className="bg-white border border-gray-200 hover:border-indigo-500 text-gray-800 font-medium py-2 rounded-lg transition duration-300 flex items-center justify-center">
                  <FiDownload className="mr-2 text-indigo-600" />
                  JPEG
                </button>
                <button className="bg-white border border-gray-200 hover:border-indigo-500 text-gray-800 font-medium py-2 rounded-lg transition duration-300 flex items-center justify-center">
                  <FiDownload className="mr-2 text-indigo-600" />
                  SVG
                </button>
                <button className="bg-white border border-gray-200 hover:border-indigo-500 text-gray-800 font-medium py-2 rounded-lg transition duration-300 flex items-center justify-center">
                  <FiDownload className="mr-2 text-indigo-600" />
                  PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 