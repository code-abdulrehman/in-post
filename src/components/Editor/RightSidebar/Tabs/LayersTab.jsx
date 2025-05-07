import { useStore } from '../../../../store';
import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiUnlock,
  FiEdit,
  FiCheck,
  FiTrash,
  FiArrowUp,
  FiArrowDown,
  FiCornerUpLeft
} from 'react-icons/fi';
import { useState } from 'react';

export default function LayersTab({
  elements,
  selectedElementId,
  selectElement,
  moveElementToTop,
  moveElementUp,
  moveElementDown,
  moveElementToBottom,
  handleVisibilityToggle,
  handleLockToggle,
  handleStartRename,
  handleSaveRename,
  deleteElement,
  editingLayerId,
  newLayerName,
  setNewLayerName,
  addToHistory,
  getElementTypeIcon,
  getElementName
}) {
  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-sm">Layers</h3>
        <div className="flex space-x-1">
          <button
            disabled={!selectedElementId}
            onClick={() => {
              if (selectedElementId) {
                moveElementToTop(selectedElementId);
                addToHistory('Move to front');
              }
            }}
            className={`p-1 rounded hover:bg-gray-100 ${!selectedElementId ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700'}`}
            title="Move to Front"
          >
            <FiCornerUpLeft size={14} />
          </button>
          <button
            disabled={!selectedElementId}
            onClick={() => {
              if (selectedElementId) {
                moveElementUp(selectedElementId);
                addToHistory('Move layer up');
              }
            }}
            className={`p-1 rounded hover:bg-gray-100 ${!selectedElementId ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700'}`}
            title="Move Layer Up"
          >
            <FiArrowUp size={14} />
          </button>
          <button
            disabled={!selectedElementId}
            onClick={() => {
              if (selectedElementId) {
                moveElementDown(selectedElementId);
                addToHistory('Move layer down');
              }
            }}
            className={`p-1 rounded hover:bg-gray-100 ${!selectedElementId ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700'}`}
            title="Move Layer Down"
          >
            <FiArrowDown size={14} />
          </button>
          <button
            disabled={!selectedElementId}
            onClick={() => {
              if (selectedElementId) {
                moveElementToBottom(selectedElementId);
                addToHistory('Move to back');
              }
            }}
            className={`p-1 rounded hover:bg-gray-100 ${!selectedElementId ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700'}`}
            title="Move to Back"
          >
            <FiCornerUpLeft size={14} style={{ transform: 'rotate(180deg)' }} />
          </button>
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-md overflow-hidden">
        {elements.length === 0 ? (
          <div className="p-3 text-center text-gray-500 text-sm">
            No elements on canvas yet
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {/* Render layers in reverse (top to bottom) */}
            {[...elements].reverse().map((element) => (
              <div 
                key={element.id}
                className={`flex items-center p-2 cursor-pointer group ${
                  selectedElementId === element.id ? 'bg-indigo-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => selectElement(element.id)}
              >
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVisibilityToggle(element.id);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                    title={element.visible === false ? "Show Layer" : "Hide Layer"}
                  >
                    {element.visible === false ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                  </button>
                  
                  <button
                    onClick={(e) => handleLockToggle(element.id, e)}
                    className="text-gray-500 hover:text-gray-700"
                    title={element.locked ? "Unlock Layer" : "Lock Layer"}
                  >
                    {element.locked ? <FiLock size={14} className="text-yellow-500" /> : <FiUnlock size={14} />}
                  </button>
                </div>
                
                <div 
                  className="w-5 h-5 flex items-center justify-center text-xs mx-2 bg-gray-100 rounded"
                  style={{ color: element.fill || element.stroke || '#000' }}
                >
                  {getElementTypeIcon(element.type)}
                </div>
                
                <div className="flex-1 text-sm truncate">
                  {editingLayerId === element.id ? (
                    <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={newLayerName}
                        onChange={(e) => setNewLayerName(e.target.value)}
                        className="flex-1 min-w-0 py-0 px-1 text-sm border border-gray-300 rounded"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveRename(element.id, e);
                          } else if (e.key === 'Escape') {
                            // Handle cancel edit here
                          }
                        }}
                      />
                      <button
                        onClick={(e) => handleSaveRename(element.id, e)}
                        className="ml-1 text-indigo-600"
                      >
                        <FiCheck size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className={element.locked ? "text-gray-400" : "" + 'w-24 overflow-hidden text-ellipsis whitespace-nowrap'}>
                        {element.name || getElementName(element)}
                      </span>
                      
                      {/* Edit button always visible (not only on hover) */}
                      <button
                        onClick={(e) => handleStartRename(element, e)}
                        className={`ml-2 text-gray-500 hover:text-gray-700 ${
                          element.locked ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={element.locked}
                      >
                        <FiEdit size={14} />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Delete button */}
                <div className="flex items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!element.locked) {
                        deleteElement(element.id);
                      }
                    }}
                    className={`text-gray-500 hover:text-red-600 p-1 rounded hover:bg-gray-100 ${
                      element.locked ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={element.locked}
                    title="Delete Layer"
                  >
                    <FiTrash size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        *Layers at the top of the list appear in front on the canvas
      </p>
    </div>
  );
} 