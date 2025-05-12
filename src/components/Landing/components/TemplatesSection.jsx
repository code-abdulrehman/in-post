import { FiArrowRight } from 'react-icons/fi';

export default function TemplatesSection({ handleCreateDesign }) {
  // Template categories
  const templateCategories = [
    { name: 'All', count: 300 },
    { name: 'Social Media', count: 120 },
    { name: 'Marketing', count: 75 },
    { name: 'Presentation', count: 45 },
    { name: 'Print', count: 60 }
  ];

  // Featured templates
  const featuredTemplates = [
    {
      title: 'Instagram Story',
      category: 'Social Media',
      image: '/api/placeholder/600/1000',
      description: 'Perfect for engaging stories with your followers',
      premium: false
    },
    {
      title: 'Business Presentation',
      category: 'Corporate',
      image: '/api/placeholder/800/600',
      description: 'Professional slides for impactful presentations',
      premium: true
    },
    {
      title: 'YouTube Thumbnail',
      category: 'Video',
      image: '/api/placeholder/1280/720',
      description: 'Eye-catching thumbnails that drive clicks',
      premium: false
    },
    {
      title: 'Resume Template',
      category: 'Professional',
      image: '/api/placeholder/600/800',
      description: 'Stand out with a modern, professional resume',
      premium: true
    },
    {
      title: 'Facebook Ad',
      category: 'Marketing',
      image: '/api/placeholder/1200/628',
      description: 'High-converting ad templates for Facebook campaigns',
      premium: false
    },
    {
      title: 'Event Invitation',
      category: 'Personal',
      image: '/api/placeholder/600/900',
      description: 'Beautiful invitations for special occasions',
      premium: true
    }
  ];

  return (
    <section id="templates" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold mb-3">
            Design Collection
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Discover Inspiring Designs</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse our most popular templates to jumpstart your creative projects
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {templateCategories.map((category, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full text-sm font-medium transition duration-300 ${index === 0
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredTemplates.map((template, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 group cursor-pointer"
              onClick={handleCreateDesign}
            >
              <div className="relative">
                <img
                  src={template.image}
                  alt={template.title}
                  className="w-full h-52 object-cover transition duration-300 group-hover:scale-105"
                />
                {template.premium && (
                  <div className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">
                    PREMIUM
                  </div>
                )}
                <div className="absolute inset-0 bg-indigo-600 bg-opacity-0 group-hover:bg-opacity-20 transition duration-300 flex items-center justify-center">
                  <button className="bg-white text-indigo-600 font-medium py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition duration-300">
                    Use Template
                  </button>
                </div>
              </div>
              <div className="p-5">
                <div className="text-xs text-indigo-600 font-semibold mb-1">{template.category}</div>
                <h3 className="font-semibold text-lg mb-1">{template.title}</h3>
                <p className="text-gray-600 text-sm">{template.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={handleCreateDesign}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300 shadow-md hover:shadow-lg inline-flex items-center"
          >
            Browse All Templates
            <FiArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
} 