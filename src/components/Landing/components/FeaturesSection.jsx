import { FiArrowRight, FiLayers, FiImage, FiType, FiDownload, FiGrid, FiShield } from 'react-icons/fi';

export default function FeaturesSection({ handleCreateDesign }) {
  // Features data
  const features = [
    {
      icon: <FiLayers className="text-3xl mb-3 text-indigo-600" />,
      title: 'Advanced Layering',
      description: 'Easily manage multiple layers with our intuitive layer management system.'
    },
    {
      icon: <FiImage className="text-3xl mb-3 text-indigo-600" />,
      title: 'Shape & Image Tools',
      description: 'Add and manipulate various shapes and images with precision.'
    },
    {
      icon: <FiType className="text-3xl mb-3 text-indigo-600" />,
      title: 'Text Editing',
      description: 'Powerful text tools with custom fonts, colors, and styling options.'
    },
    {
      icon: <FiDownload className="text-3xl mb-3 text-indigo-600" />,
      title: 'Multiple Export Options',
      description: 'Export your designs as PNG, JPEG, SVG, or PDF with a single click.'
    },
    {
      icon: <FiGrid className="text-3xl mb-3 text-indigo-600" />,
      title: 'Grid System',
      description: 'Use our toggle grid system for pixel-perfect designs and alignment.'
    },
    {
      icon: <FiShield className="text-3xl mb-3 text-indigo-600" />,
      title: 'Auto-Save',
      description: 'Never lose your work with automatic saving to local storage.'
    }
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold mb-3">
            Powerful Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Create Amazing Designs</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform provides all the tools you need to bring your creative vision to life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 border border-gray-100">
              {feature.icon}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button
            onClick={handleCreateDesign}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300 shadow-md hover:shadow-lg inline-flex items-center"
          >
            Try All Features Now
            <FiArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
} 