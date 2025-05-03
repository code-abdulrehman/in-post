import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import {
  FiLayers,
  FiImage,
  FiType,
  FiDownload,
  FiGrid,
  FiShield,
  FiMenu,
  FiMonitor,
  FiSettings,
  FiFileText,
  FiCode,
  FiStar,
  FiArrowRight,
  FiCheckCircle,
  FiGlobe,
  FiCamera,
  FiPlay,
  FiTrendingUp,
  FiAward,
  FiPlusCircle,
  FiClock,
  FiEdit
} from 'react-icons/fi';

export default function DesignToolLanding() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { projects, createProject } = useStore();
  
  // Sort projects by last modified date
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
    .slice(0, 4);
  
  // Handle scroll for navbar effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleCreateDesign = () => {
    // Navigate to the app route, which will trigger the project modal
    navigate('/app');
  };
  
  const handleOpenProject = (projectId) => {
    navigate(`/app?project=${projectId}`);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="overflow-y-auto">
      {/* Navbar */}
      <nav className={`fixed z-50 w-full md:container mx-auto transition-all duration-300 ${isScrolled ? 'bg-white/50 backdrop-blur-sm py-3 top-3 left-0 right-0 rounded-xl' : 'bg-transparent py-5 top-0 left-0 right-0 rounded-none'
        }`}>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">InPost Designer</h1>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="font-medium hover:text-indigo-600 transition duration-300">Features</a>
              <a href="#templates" className="font-medium hover:text-indigo-600 transition duration-300">Templates</a>
              <a href="#export" className="font-medium hover:text-indigo-600 transition duration-300">Export</a>
              <a href="#pricing" className="font-medium hover:text-indigo-600 transition duration-300">Pricing</a>
            </div>

            <div className="flex items-center">
              <button
                onClick={handleCreateDesign}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center"
              >
                <FiPlusCircle className="mr-1" /> New Design
              </button>
              <button className="md:hidden ml-4 text-2xl">
                <FiMenu />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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
      
      {/* Recent Projects Section (shows only if there are projects) */}
      {recentProjects.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold mb-3">
                  Your Work
                </div>
                <h2 className="text-3xl font-bold">Recent Projects</h2>
              </div>
              <button
                onClick={handleCreateDesign}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center"
              >
                <FiPlusCircle className="mr-1" /> New Project
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentProjects.map(project => (
                <div 
                  key={project.id}
                  className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-300"
                  onClick={() => handleOpenProject(project.id)}
                >
                  <div 
                    className="bg-white relative"
                    style={{
                      paddingBottom: `${(project.canvasSize.height / project.canvasSize.width) * 100}%`,
                      backgroundColor: project.canvasBackground || '#ffffff'
                    }}
                  >
                    {/* Thumbnail preview would go here */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-sm text-gray-400">
                        {project.canvasSize.width} × {project.canvasSize.height}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white">
                    <h3 className="font-medium mb-1 truncate">{project.name}</h3>
                    <div className="flex items-center text-xs text-gray-500">
                      <FiClock className="mr-1" />
                      <span>Modified {formatDate(project.lastModified)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {recentProjects.length > 0 && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleCreateDesign}
                  className="text-indigo-600 font-medium inline-flex items-center hover:underline"
                >
                  View All Projects
                  <FiArrowRight className="ml-1" />
                </button>
              </div>
            )}
          </div>
        </section>
      )}
      
      {/* Features Section */}
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

      {/* Templates Section */}
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

      {/* Export Options Section */}
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

      {/* Canvas Sizes Section */}
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

      {/* Statistics Section */}
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

      {/* CTA Section */}
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6 md:px-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <FiLayers className="text-purple-400 text-2xl mr-2" />
                <h3 className="text-xl font-bold text-purple-400">In Post</h3>
              </div>
              <p className="text-gray-400">
                The ultimate design tool for creating stunning visuals right in your browser. No design experience needed.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition">Templates</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Elements</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Photos</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Text Styles</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition">Blog</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Tutorials</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition">About Us</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Careers</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} In Post. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

