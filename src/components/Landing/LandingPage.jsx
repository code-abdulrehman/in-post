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
import {
  Navbar,
  HeroSection,
  RecentProjects,
  FeaturesSection,
  TemplatesSection,
  ExportSection,
  CanvasSizesSection,
  StatsSection,
  CtaSection,
  Footer
} from './components';

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
      <Navbar 
        isScrolled={isScrolled} 
        handleCreateDesign={handleCreateDesign} 
      />
      
      <HeroSection handleCreateDesign={handleCreateDesign} />
      
      <RecentProjects 
        recentProjects={recentProjects} 
        handleOpenProject={handleOpenProject} 
        handleCreateDesign={handleCreateDesign}
        formatDate={formatDate}
      />
      
      <FeaturesSection handleCreateDesign={handleCreateDesign} />
      
      <TemplatesSection handleCreateDesign={handleCreateDesign} />
      
      <ExportSection handleCreateDesign={handleCreateDesign} />
      
      <CanvasSizesSection handleCreateDesign={handleCreateDesign} />
      
      <StatsSection />
      
      <CtaSection handleCreateDesign={handleCreateDesign} />
      
      <Footer />
    </div>
  );
}

