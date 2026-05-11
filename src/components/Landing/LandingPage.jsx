import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import {
  Navbar,
  HeroSection,
  RecentProjects,
  FeaturesSection,
  ExportSection,
  CanvasSizesSection,
  CtaSection,
  FaqSection,
  Footer,
} from './components';

export default function DesignToolLanding() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { projects, createProject } = useStore();

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
    .slice(0, 4);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCreateDesign = () => {
    navigate('/app');
  };

  const handleOpenProject = (projectId) => {
    navigate(`/app?project=${projectId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="overflow-y-auto">
      <Navbar isScrolled={isScrolled} handleCreateDesign={handleCreateDesign} />

      <HeroSection handleCreateDesign={handleCreateDesign} />

      <RecentProjects
        recentProjects={recentProjects}
        handleOpenProject={handleOpenProject}
        handleCreateDesign={handleCreateDesign}
        formatDate={formatDate}
      />

      <FeaturesSection handleCreateDesign={handleCreateDesign} />

      <ExportSection handleCreateDesign={handleCreateDesign} />

      <CanvasSizesSection handleCreateDesign={handleCreateDesign} />

      <CtaSection handleCreateDesign={handleCreateDesign} />

      <FaqSection />

      <Footer />
    </div>
  );
}
