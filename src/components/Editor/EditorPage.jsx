import { useEffect, useState } from 'react';
import { useStore } from '../../store';
import { useNavigate, useLocation } from 'react-router-dom';
import Toolbar from './Toolbar';
import LeftSidebar from './LeftSidebar/index';
import RightSidebar from './RightSidebar';
import Canvas from './Canvas';
import ChatBot from './ChatBot';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    addToHistory, 
    currentProjectId, 
    saveCurrentProject,
    elements,
    canvasSize,
    canvasBackground
  } = useStore();

  const [showTabs, setShowTabs] = useState(false);
  
  // Initialize the design history when the editor is loaded
  useEffect(() => {
    // Check if we have a project ID in the URL
    const projectId = new URLSearchParams(location.search).get('project');
    
    // We removed the redirect to home when no project ID is present
    // This allows the project modal to be shown
    
    // Only initialize history if we have a project
    if (projectId || currentProjectId) {
      addToHistory('Initialize design');
      
      // Show welcome toast
      toast.info('Welcome to the design editor! Your work will be auto-saved.', {
        position: "bottom-right",
        autoClose: 3000
      });
    }
    
    // Set up keyboard shortcuts
    const handleKeyDown = (e) => {
      // Check if the event target is an input field or textarea
      const isInputField = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
      if (isInputField) return;
      
      // Keyboard shortcuts for common actions
      if (e.ctrlKey || e.metaKey) {  // Ctrl or Cmd key
        switch (e.key.toLowerCase()) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              // Ctrl+Shift+Z: Redo
              useStore.getState().redo();
            } else {
              // Ctrl+Z: Undo
              useStore.getState().undo();
            }
            break;
          case 'y':
            // Ctrl+Y: Redo
            e.preventDefault();
            useStore.getState().redo();
            break;
          case 'd':
            // Ctrl+D: Duplicate
            e.preventDefault();
            const { selectedElementId, duplicateElement } = useStore.getState();
            if (selectedElementId) {
              duplicateElement(selectedElementId);
            }
            break;
          case 's':
            // Ctrl+S: Save
            e.preventDefault();
            if (saveCurrentProject()) {
              toast.success('Project saved successfully!', {
                position: "bottom-right",
                autoClose: 2000
              });
            }
            break;
          default:
            break;
        }
      } else {
        switch (e.key) {
          case 'Delete':
            // Delete: Remove selected element
            const { selectedElementId, deleteElement } = useStore.getState();
            if (selectedElementId) {
              deleteElement(selectedElementId);
            }
            break;
          case 'Escape':
            // Escape: Clear selection
            useStore.getState().clearSelection();
            break;
          default:
            break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Auto-save timer
    const autoSaveInterval = setInterval(() => {
      if (currentProjectId) {
        saveCurrentProject();
      }
    }, 30000); // Auto-save every 30 seconds
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(autoSaveInterval);
    };
  }, [addToHistory, navigate, location.search, currentProjectId, saveCurrentProject]);
  
  // Handle canvas clicks to deselect elements
  const handleOutsideClick = (e) => {
    // Only deselect if clicking directly on the canvas container, not on elements
    if (e.target.classList.contains('canvas-container')) {
      useStore.getState().clearSelection();
    }
  };
  
  // If no project is loaded, only render minimal UI or nothing (modal will be shown by App.jsx)
  if (!currentProjectId && !new URLSearchParams(location.search).get('project')) {
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        <ToastContainer />
      </div>
    );
  }
  
  // Otherwise render the full editor
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <ToastContainer />
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">
        <LeftSidebar showTabs={showTabs} setShowTabs={setShowTabs} />
        <div className="flex flex-col items-center flex-1 w-[calc(100%-600px)] h-full relative top-16 overflow-hidden">
          <div className='canvas-container overflow-auto flex-1 max-h-[78%] w-full' onClick={handleOutsideClick}>
            <Canvas />
          </div>
          <div className='h-[20%]'>
            <ChatBot />
          </div>
        </div>
        <RightSidebar />
      </div>
    </div>
  );
} 