import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { MdAdd, MdEdit, MdDelete, MdOpenInNew, MdFileUpload } from 'react-icons/md';
import { FaInstagram, FaFacebookF, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { BsTextareaResize } from "react-icons/bs";
import { FaXTwitter } from "react-icons/fa6";
import ConfirmDialog from './ConfirmDialog';
import { toast } from 'react-toastify';

export default function ProjectModal() {
  const [tab, setTab] = useState('new');
  const [projectName, setProjectName] = useState('Untitled Design');
  const [width, setWidth] = useState(1080);
  const [height, setHeight] = useState(1080);
  const [templateType, setTemplateType] = useState('custom');
  const [renameId, setRenameId] = useState(null);
  const [renameName, setRenameName] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  const fileInputRef = useRef(null);
  
  const navigate = useNavigate();
  const { 
    projects, 
    createProject, 
    loadProject, 
    deleteProject,
    renameProject,
    importProjectFromFile
  } = useStore();
  
  // Use effect to pre-populate name field
  useEffect(() => {
    if (tab === 'new') {
      setProjectName(`Untitled Design ${projects.length + 1}`);
    }
  }, [tab, projects.length]);
  
  // Template presets
  const templates = [
    { id: 'instagram-post', icon: <FaInstagram style={{background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', color: 'white', borderRadius: '5px', padding: '2px'}}/>, name: 'Instagram Post', width: 1080, height: 1080 },
    { id: 'facebook-post', icon: <FaFacebookF style={{background: 'linear-gradient(45deg, #3b5998, #4267B2)', color: 'white', borderRadius: '5px', padding: '2px'}}/>, name: 'Facebook Post', width: 1200, height: 630 },
    { id: 'twitter-post', icon: <FaXTwitter style={{background: 'linear-gradient(45deg, #000000, #14171A)', color: 'white', borderRadius: '5px', padding: '2px'}}/>, name: 'Twitter Post', width: 1200, height: 675 },
    { id: 'linkedin-post', icon: <FaLinkedin style={{background: 'linear-gradient(45deg, #0077B5, #00a0dc)', color: 'white', borderRadius: '5px', padding: '2px'}}/>, name: 'LinkedIn Post', width: 1200, height: 627 },
    { id: 'youtube-thumbnail', icon: <FaYoutube style={{background: 'linear-gradient(45deg, #FF0000, #CC0000)', color: 'white', borderRadius: '5px', padding: '2px'}}/>, name: 'YouTube Thumbnail', width: 1280, height: 720 },
    { id: 'instagram-story', icon: <FaInstagram style={{background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', color: 'white', borderRadius: '5px', padding: '2px'}}/>, name: 'Instagram Story', width: 1080, height: 1920 },
    { id: 'custom', icon: <BsTextareaResize className="border border-slate-400" style={{borderRadius: '5px', padding: '2px'}}/>, name: 'Custom Size', width: 800, height: 600 },
  ];
  
  // Handle template selection
  const handleTemplateSelect = (template) => {
    setTemplateType(template.id);
    setWidth(template.width);
    setHeight(template.height);
  };
  
  // Handle create new project
  const handleCreateProject = () => {
    if (!projectName.trim()) {
      alert('Please enter a project name');
      return;
    }
    
    const projectId = createProject(
      projectName.trim(),
      width,
      height,
      '#ffffff'
    );
    
    // Navigate to editor with project ID
    navigate(`/app?project=${projectId}`);
  };
  
  // Handle opening an existing project
  const handleOpenProject = (projectId) => {
    loadProject(projectId);
    navigate(`/app?project=${projectId}`);
  };
  
  // Handle renaming a project
  const handleRenameProject = () => {
    if (renameId && renameName.trim()) {
      renameProject(renameId, renameName.trim());
      setRenameId(null);
      setRenameName('');
    }
  };
  
  // Add handleFileImport function
  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Reset the file input for future uploads
    fileInputRef.current.value = "";
    
    // Check if it's a JSON file
    if (file.type !== 'application/json' && !file.name.endsWith('.json') && !file.name.endsWith('.inpost.json')) {
      setConfirmDialog({
        isOpen: true,
        title: 'Invalid File',
        message: 'Please select a valid .inpost.json file.',
        confirmText: 'OK',
        onConfirm: () => {}
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const projectData = JSON.parse(event.target.result);
        
        // Basic validation
        if (!projectData.elements || !projectData.canvasSize) {
          setConfirmDialog({
            isOpen: true,
            title: 'Invalid Project File',
            message: 'The file does not contain a valid inPost project structure.',
            confirmText: 'OK',
            onConfirm: () => {}
          });
          return;
        }
        
        // Import the project
        const projectId = importProjectFromFile(projectData);
        
        // Navigate to editor with new project ID
        toast.success('Project imported successfully!');
        navigate(`/app?project=${projectId}`);
      } catch (err) {
        setConfirmDialog({
          isOpen: true,
          title: 'Error Importing Project',
          message: `Failed to import: ${err.message}`,
          confirmText: 'OK',
          onConfirm: () => {}
        });
      }
    };
    
    reader.readAsText(file);
  };
  
  // Handle deleting a project
  const handleDeleteProject = (id, e) => {
    e.stopPropagation();
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Project',
      message: 'Are you sure you want to delete this project? This action cannot be undone.',
      confirmText: 'Delete',
      isDanger: true,
      onConfirm: () => deleteProject(id)
    });
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full h-[76vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">InPost Designer</h2>
          
          <div className="tabs flex flex-wrap">
            <button 
              className={`px-4 py-2 mr-2 rounded-md ${tab === 'new' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
              onClick={() => setTab('new')}
            >
              New Project
            </button>
            <button 
              className={`px-4 py-2 mr-2 rounded-md ${tab === 'existing' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
              onClick={() => setTab('existing')}
            >
              My Projects
            </button>
            <button 
              className="px-4 py-2 rounded-md hover:bg-gray-100 flex items-center"
              onClick={() => fileInputRef.current.click()}
            >
              <MdFileUpload className="mr-1" /> Import
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".json,.inpost.json"
              onChange={handleFileImport}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'new' ? (
            <div className="new-project-form">
              <div className="mb-6">
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter project name"
                />
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Choose a size template</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {templates.map((template) => (
                    <div 
                      key={template.id}
                      className={`border p-2 rounded-md p-3 cursor-pointer hover:border-indigo-500 hover:shadow transition-all ${templateType === template.id ? 'border-indigo-500 bg-indigo-50' : 'bg-stone-100'}`}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <div className='h-[68%] flex justify-center items-center'>
                      <div 
                        className="border border-gray-200 mx-auto mb-2 bg-white"
                        style={{
                          width: `${Math.min(90, (template.width / template.height) * 50)}px`,
                          height: `${Math.min(70, (template.height / template.width) * 50)}px`,
                          maxWidth: '90px',
                          maxHeight: '70px'
                        }}
                      ></div>
                      </div>
                      <div className='h-[30%] flex gap-1'>
                        {template.icon}
                        <div className='flex flex-col items-center'>
                      <div className="text-sm font-medium">{template.name}</div>
                      <div className="text-xs text-gray-500">{template.width} × {template.height}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {templateType && (
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      id="width"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      min="1"
                      max="3000"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      id="height"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      min="1"
                      max="3000"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="existing-projects">
              {projects.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">You don't have any projects yet.</p>
                  <button 
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    onClick={() => setTab('new')}
                  >
                    Create Your First Project
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {projects.map((project) => (
                    <div 
                      key={project.id}
                      className="border rounded-md p-4 flex cursor-pointer hover:bg-gray-50"
                      onClick={() => handleOpenProject(project.id)}
                    >
                      <div 
                        className="bg-white border border-gray-200 mr-4 flex-shrink-0 w-[100px] h-[100px] relative"
                        style={{
                          backgroundColor: project.canvasBackground || '#ffffff'
                        }}
                      >
                         <div className={`w-full h-full bg-white/90 text-shadow-md backdrop-blur-sm absolute inset-0 flex items-center justify-center text-gray-400 text-3xl font-bold opacity-10 text-${project.canvasBackground}`}>
                  {project?.name
                    ? project.name
                      .split(' ')
                      .filter(word => word.length > 0)
                      .map(word => word[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()
                    : ''}
                </div>
                      </div>
                      
                      <div className="flex-1">
                        {renameId === project.id ? (
                          <div className="flex items-center mb-1">
                            <input
                              type="text"
                              value={renameName}
                              onChange={(e) => setRenameName(e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded mr-2 text-sm w-full"
                              onClick={(e) => e.stopPropagation()}
                              autoFocus
                            />
                            <button 
                              className="px-2 py-1 bg-indigo-600 text-white text-xs rounded"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRenameProject();
                              }}
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <h3 className="font-medium flex items-center">
                            {project.name}
                            <button 
                              className="ml-2 text-gray-400 hover:text-gray-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                setRenameId(project.id);
                                setRenameName(project.name);
                              }}
                            >
                              <MdEdit size={16} />
                            </button>
                          </h3>
                        )}
                        
                        <div className="text-xs text-gray-500 mb-1">
                          {project.canvasSize.width} × {project.canvasSize.height}
                        </div>
                        <div className="text-xs text-gray-500">
                          Last modified: {formatDate(project.lastModified)}
                        </div>
                        <div className="mt-2 flex">
                          <button 
                            className="text-gray-500 hover:text-indigo-600 mr-3"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenProject(project.id);
                            }}
                          >
                            <MdOpenInNew size={18} />
                          </button>
                          <button 
                            className="text-gray-500 hover:text-red-600"
                            onClick={(e) => handleDeleteProject(project.id, e)}
                          >
                            <MdDelete size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t flex justify-end">
          {tab === 'new' ? (
            <button 
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
              onClick={handleCreateProject}
            >
              <MdAdd className="mr-1" size={20} />
              Create Project
            </button>
          ) : (
            <button 
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
              onClick={() => setTab('new')}
            >
              <MdAdd className="mr-1" size={20} />
              New Project
            </button>
          )}
        </div>

        {/* Confirmation Dialog */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({...confirmDialog, isOpen: false})}
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText={confirmDialog.confirmText || 'Confirm'}
          cancelText={confirmDialog.cancelText || 'Cancel'}
          isDanger={confirmDialog.isDanger}
        />
      </div>
    </div>
  );
} 