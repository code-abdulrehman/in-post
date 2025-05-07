import React, { useState, useEffect } from 'react';
import { useStore } from '../../store';
import {
  FiTrash,
  FiCopy,
  FiZoomIn,
  FiZoomOut,
  FiHome,
  FiEdit,
  FiCheck,
  FiSave,
  FiDownload
} from 'react-icons/fi';
import { MdRedo, MdUndo } from 'react-icons/md';
import { MdOutlineGrid4X4 } from "react-icons/md";
import { toast } from 'react-toastify';
import ExportModal from '../ui/ExportModal';
import { useNavigate } from 'react-router-dom';

export default function Toolbar() {
  const navigate = useNavigate();
  const [isEditingName, setIsEditingName] = useState(false);
  const [projectNameInput, setProjectNameInput] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);

  const {
    undo,
    redo,
    history,
    historyIndex,
    deleteElement,
    duplicateElement,
    selectedElementId,
    toggleGrid,
    showGrid,
    canvasScale,
    setCanvasScale,
    setRoute,
    cursorPosition,
    canvasSize,
    currentProjectId,
    projects,
    renameProject,
    saveCurrentProject
  } = useStore();

  // Get the current project name
  const currentProject = projects.find(p => p.id === currentProjectId);
  const projectName = currentProject ? currentProject.name : 'Untitled Design';

  // Handle starting to edit the project name
  const startEditingName = () => {
    setProjectNameInput(projectName);
    setIsEditingName(true);
  };

  // Handle saving the project name
  const saveProjectName = () => {
    if (currentProjectId && projectNameInput.trim()) {
      renameProject(currentProjectId, projectNameInput.trim());
      toast.success('Project renamed successfully');
    }
    setIsEditingName(false);
  };

  const handleDelete = () => {
    if (selectedElementId) {
      deleteElement(selectedElementId);
    }
  };

  const handleDuplicate = () => {
    if (selectedElementId) {
      duplicateElement(selectedElementId);
    }
  };

  const handleZoomIn = () => {
    if (canvasScale < 2) {
      setCanvasScale(Math.min(canvasScale + 0.1, 2));
    }
  };

  const handleZoomOut = () => {
    if (canvasScale > 0.5) {
      setCanvasScale(Math.max(canvasScale - 0.1, 0.5));
    }
  };

  const handleSave = () => {
    const success = saveCurrentProject();
    if (success) {
      toast.success('Project saved successfully', {
        position: "bottom-right",
        autoClose: 2000
      });
    } else {
      toast.error('Failed to save project', {
        position: "bottom-right",
        autoClose: 2000
      });
    }
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  return (
    <div className="bg-white border-t-none border border-gray-300 px-4 py-2 flex items-center justify-between rounded-b-2xl mx-2">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => {
            navigate('/');
          }}
          className="text-gray-700 hover:text-indigo-600 p-1 rounded transition-colors duration-200 flex items-center"
        >
          <FiHome className="mr-1" /> <span>Home</span>
        </button>

        <div className="h-6 border-l border-gray-300 mx-2"></div>

        {/* Project name editor */}
        <div className="flex items-center w-32">
          {isEditingName ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={projectNameInput}
                onChange={(e) => setProjectNameInput(e.target.value)}
                className="border rounded p1 text-sm w-32 "
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveProjectName();
                  if (e.key === 'Escape') setIsEditingName(false);
                }}
              />
              <button
                onClick={saveProjectName}
                className="text-indigo-600 hover:text-indigo-800"
                title="Save Name"
              >
                <FiCheck />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <h1 className="text-sm font-medium w-32 overflow-hidden text-ellipsis whitespace-nowrap">{projectName}</h1>
              <button
                onClick={startEditingName}
                className="text-gray-500 hover:text-gray-700"
                title="Edit Name"
              >
                <FiEdit size={14} />
              </button>
            </div>
          )}
        </div>

        <div className="w-[350px] flex items-center justify-center absolute left-[40%] right-[40%] bg-white p-2 top-16 rounded-2xl border border-gray-300">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className={`p-2 rounded transition-colors duration-200 ${historyIndex > 0
              ? 'text-gray-700 hover:text-indigo-600'
              : 'text-gray-400 cursor-not-allowed'
              }`}
            title="Undo"
          >
            <MdUndo />
          </button>

          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className={`p-2 rounded transition-colors duration-200 ${historyIndex < history.length - 1
              ? 'text-gray-700 hover:text-indigo-600'
              : 'text-gray-400 cursor-not-allowed'
              }`}
            title="Redo"
          >
            <MdRedo />
          </button>

          <div className="h-6 border-l border-gray-300 mx-2"></div>

          <button
            onClick={handleDelete}
            disabled={!selectedElementId}
            className={`p-2 rounded transition-colors duration-200 ${selectedElementId
              ? 'text-gray-700 hover:text-red-600'
              : 'text-gray-400 cursor-not-allowed'
              }`}
            title="Delete Selected"
          >
            <FiTrash />
          </button>

          <button
            onClick={handleDuplicate}
            disabled={!selectedElementId}
            className={`p-2 rounded transition-colors duration-200 ${selectedElementId
              ? 'text-gray-700 hover:text-indigo-600'
              : 'text-gray-400 cursor-not-allowed'
              }`}
            title="Duplicate Selected"
          >
            <FiCopy />
          </button>

          <div className="h-6 border-l border-gray-300 mx-2"></div>

          <button
            onClick={toggleGrid}
            className={`p-2 rounded transition-colors duration-200 ${showGrid
              ? 'text-indigo-600 bg-indigo-50'
              : 'text-gray-700 hover:text-indigo-600'
              }`}
            title="Toggle Grid"
          >
            <MdOutlineGrid4X4 />
          </button>

          <div className="h-6 border-l border-gray-300 mx-2"></div>

          <button
            onClick={handleZoomOut}
            className="text-gray-700 hover:text-indigo-600 p-2 rounded transition-colors duration-200"
            title="Zoom Out"
          >
            <FiZoomOut />
          </button>

          <span className="text-sm font-medium">{Math.round(canvasScale * 100)}%</span>

          <button
            onClick={handleZoomIn}
            className="text-gray-700 hover:text-indigo-600 p-2 rounded transition-colors duration-200"
            title="Zoom In"
          >
            <FiZoomIn />
          </button>
        </div>

      </div>

      <div className="flex items-center">
        {/* Canvas info */}
        <div className="flex items-center mr-4 text-xs text-gray-600">
          <span className="mr-4">X: {Math.round(cursorPosition.x)} Y: {Math.round(cursorPosition.y)}</span>
          <span>{canvasSize.width} × {canvasSize.height}px</span>
        </div>


        <div className="h-6 border-l border-gray-300 mx-2"></div>
        {/* Save and Export buttons */}
        <div className="flex items-center">
          <button
            onClick={handleSave}
            className="text-gray-700 hover:text-indigo-600 p-2 rounded transition-colors duration-200 flex items-center mr-2"
            title="Save Project"
          >
            <FiSave className="mr-1" /> Save
          </button>

          <button
            onClick={handleExport}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md flex items-center"
            title="Export Design"
          >
            <FiDownload className="mr-1" /> Export
          </button>
        </div>

      </div>

      {/* Export Modal */}
      {showExportModal && <ExportModal onClose={() => setShowExportModal(false)} />}
    </div>
  );
} 