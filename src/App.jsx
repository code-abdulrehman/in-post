import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useStore } from './store';
import LandingPage from './components/Landing/LandingPage';
import EditorPage from './components/Editor/EditorPage';
import ProjectModal from './components/ui/ProjectModal';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentProjectId, loadProject } = useStore();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(false);
  const [wasUnstable, setWasUnstable] = useState(false);
  
  // Check for project ID in URL when on the editor route
  useEffect(() => {
    // Extract project ID from URL if it's in the editor route
    if (location.pathname.startsWith('/app')) {
      const projectIdParam = new URLSearchParams(location.search).get('project');
      
      // If we have a project ID in URL and it's different from current one
      if (projectIdParam && projectIdParam !== currentProjectId) {
        // Try to load the project
        const success = loadProject(projectIdParam);
        
        // If loading failed, navigate to landing page
        if (!success) {
          navigate('/', { replace: true });
        }
      }
      // We removed the else-if that was redirecting to '/' when no project is loaded
      // This allows the user to stay on /app and see the project modal
    }
  }, [location, currentProjectId, loadProject, navigate]);
  
  // Monitor internet connection status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      // Don't hide the status if it was previously unstable
      if (!wasUnstable) {
        setTimeout(() => setShowStatus(false), 4000);
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check connection quality
    const checkConnectionQuality = () => {
      if (navigator.connection) {
        const connection = navigator.connection;
        if (connection.downlink < 1) {
          setIsOnline('slow');
          setShowStatus(true);
        } else if (connection.downlink < 2) {
          setIsOnline('unstable');
          setShowStatus(true);
          setWasUnstable(true);
        } else if (isOnline === true && wasUnstable) {
          // Connection is stable now but was unstable before
          // Keep showing the status bar
          setShowStatus(true);
        }
      }
    };
    
    const intervalId = setInterval(checkConnectionQuality, 5000);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [isOnline, wasUnstable]);
  
  return (
    <div className="h-screen relative">
      {/* Internet status indicator */}
      {showStatus && (
        <div className={`z-[1000] fixed bottom-0 left-0 right-0 h-4 flex items-center justify-center text-white text-xs font-medium transition-all ${
          isOnline === true ? (wasUnstable ? 'bg-orange-500' : 'bg-green-500') : 
          isOnline === 'slow' ? 'bg-yellow-500' : 
          isOnline === 'unstable' ? 'bg-orange-500' : 
          'bg-red-500'
        }`}>
          {isOnline === true ? (wasUnstable ? 'Connection Stabilized (Previously Unstable)' : 'Connected - Stable Internet') : 
           isOnline === 'slow' ? 'Slow Internet Connection' : 
           isOnline === 'unstable' ? 'Unstable Internet Connection' : 
           'Offline - No Internet Connection'}
        </div>
      )}
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<EditorPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
      
      {/* Project modal for creating new projects or opening existing ones */}
      {location.pathname === '/app' && !currentProjectId && 
       !new URLSearchParams(location.search).get('project') && (
        <ProjectModal />
      )}
    </div>
  );
}
