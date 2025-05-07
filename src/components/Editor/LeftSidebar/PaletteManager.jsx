import { useState, useEffect } from 'react';
import { useStore } from '../../../store';
import { 
  MdDelete, 
  MdEdit, 
  MdCheck, 
  MdAdd,
  MdColorize,
  MdOutlineFormatColorFill 
} from 'react-icons/md';
import { FaPlus, FaPalette } from 'react-icons/fa';
import ConfirmDialog from '../../ui/ConfirmDialog';
import ColorPickerWithPalette from '../../ui/ColorPickerWithPalette';

export default function PaletteManager() {
  const { 
    colorPalettes, 
    currentPaletteId, 
    setCurrentPalette,
    addPalette,
    updatePalette,
    deletePalette,
    addColorToPalette,
    removeColorFromPalette
  } = useStore();
  
  const [isCreatingPalette, setIsCreatingPalette] = useState(false);
  const [isEditingPalette, setIsEditingPalette] = useState(false);
  const [editingPaletteId, setEditingPaletteId] = useState(null);
  const [newPaletteName, setNewPaletteName] = useState('');
  const [paletteColors, setPaletteColors] = useState([
    { value: '#F44336', name: 'Red' },
    { value: '#2196F3', name: 'Blue' },
    { value: '#4CAF50', name: 'Green' },
    { value: '#FFC107', name: 'Amber' }
  ]);
  
  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [paletteToDelete, setPaletteToDelete] = useState(null);
  const [colorIndexToDelete, setColorIndexToDelete] = useState(null);
  const [deleteMode, setDeleteMode] = useState(null); // 'palette' or 'color'
  
  // Starting palette creation
  const handleStartCreatePalette = () => {
    setIsCreatingPalette(true);
    setIsEditingPalette(false);
    setEditingPaletteId(null);
    setNewPaletteName('');
    setPaletteColors([
      { value: '#F44336', name: 'Red' },
      { value: '#2196F3', name: 'Blue' },
      { value: '#4CAF50', name: 'Green' },
      { value: '#FFC107', name: 'Amber' }
    ]);
  };
  
  // Starting palette editing
  const handleStartEditPalette = (paletteId) => {
    const palette = colorPalettes[paletteId];
    if (palette && palette.isCustom) {
      setIsEditingPalette(true);
      setIsCreatingPalette(false);
      setEditingPaletteId(paletteId);
      setNewPaletteName(palette.name);
      setPaletteColors([...palette.colors]);
    }
  };
  
  // Canceling palette creation/editing
  const handleCancelPalette = () => {
    setIsCreatingPalette(false);
    setIsEditingPalette(false);
    setEditingPaletteId(null);
  };
  
  // Save a new palette
  const handleSavePalette = () => {
    if (newPaletteName.trim()) {
      if (isEditingPalette && editingPaletteId) {
        // Update existing palette
        updatePalette(editingPaletteId, newPaletteName.trim(), paletteColors);
      } else {
        // Create new palette
        const paletteId = `custom-${Date.now()}`;
        addPalette(paletteId, newPaletteName.trim(), paletteColors);
        setCurrentPalette(paletteId);
      }
      
      setIsCreatingPalette(false);
      setIsEditingPalette(false);
      setEditingPaletteId(null);
    }
  };
  
  // Handle starting the deletion process for a palette
  const handleStartDeletePalette = (paletteId) => {
    if (colorPalettes[paletteId] && colorPalettes[paletteId].isCustom) {
      setPaletteToDelete(paletteId);
      setDeleteMode('palette');
      setShowDeleteConfirm(true);
    }
  };
  
  // Handle starting the deletion process for a color
  const handleStartDeleteColor = (paletteId, colorIndex) => {
    if (colorPalettes[paletteId] && colorPalettes[paletteId].isCustom) {
      setPaletteToDelete(paletteId);
      setColorIndexToDelete(colorIndex);
      setDeleteMode('color');
      setShowDeleteConfirm(true);
    }
  };
  
  // Handle confirming deletion
  const handleConfirmDelete = () => {
    if (deleteMode === 'palette' && paletteToDelete) {
      deletePalette(paletteToDelete);
    } else if (deleteMode === 'color' && paletteToDelete && colorIndexToDelete !== null) {
      removeColorFromPalette(colorIndexToDelete, paletteToDelete);
    }
    
    setShowDeleteConfirm(false);
    setPaletteToDelete(null);
    setColorIndexToDelete(null);
    setDeleteMode(null);
  };
  
  // Add a color to the palette being created/edited
  const handleAddColorToPalette = () => {
    setPaletteColors([
      ...paletteColors,
      { value: '#CCCCCC', name: `Color ${paletteColors.length + 1}` }
    ]);
  };
  
  // Update a color in the palette being created/edited
  const handlePaletteColorChange = (index, color) => {
    const newColors = [...paletteColors];
    newColors[index] = { ...newColors[index], value: color };
    setPaletteColors(newColors);
  };
  
  // Update a color name in the palette being created/edited
  const handlePaletteColorNameChange = (index, name) => {
    const newColors = [...paletteColors];
    newColors[index] = { ...newColors[index], name };
    setPaletteColors(newColors);
  };
  
  // Remove a color from the palette being created/edited
  const handleRemoveColorFromPalette = (index) => {
    const newColors = [...paletteColors];
    newColors.splice(index, 1);
    setPaletteColors(newColors);
  };
  
  // Add a color to an existing palette
  const handleAddColorToExistingPalette = (paletteId) => {
    if (colorPalettes[paletteId] && colorPalettes[paletteId].isCustom) {
      const palette = colorPalettes[paletteId];
      addColorToPalette('#CCCCCC', `Color ${palette.colors.length + 1}`, paletteId);
    }
  };
  
  return (
    <div className="palette-manager">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium">Color Palettes</h3>
        <button
          className="flex items-center text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-2 py-1 rounded"
          onClick={handleStartCreatePalette}
        >
          <FaPlus size={10} className="mr-1" /> New Palette
        </button>
      </div>
      
      {!isCreatingPalette && !isEditingPalette && (
        <div className="space-y-4">
          {Object.keys(colorPalettes).map(paletteId => (
            <div 
              key={paletteId} 
              className={`p-3 border rounded-md mb-3 ${currentPaletteId === paletteId ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'}`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <h4 className="text-sm font-medium text-gray-700">{colorPalettes[paletteId].name}</h4>
                  {currentPaletteId === paletteId && (
                    <span className="ml-2 text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded">
                      Active
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-1">
                  <button
                    className="p-1 text-gray-400 hover:text-indigo-500 rounded-full"
                    onClick={() => setCurrentPalette(paletteId)}
                    title="Use this palette"
                  >
                    <MdCheck size={16} />
                  </button>
                  
                  {colorPalettes[paletteId].isCustom && (
                    <>
                      <button
                        className="p-1 text-gray-400 hover:text-indigo-500 rounded-full"
                        onClick={() => handleStartEditPalette(paletteId)}
                        title="Edit palette"
                      >
                        <MdEdit size={16} />
                      </button>
                      <button
                        className="p-1 text-gray-400 hover:text-red-500 rounded-full"
                        onClick={() => handleStartDeletePalette(paletteId)}
                        title="Delete palette"
                      >
                        <MdDelete size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-5 gap-2 mb-2">
                {colorPalettes[paletteId].colors.length > 0 ? (
                  colorPalettes[paletteId].colors.slice(0, 10).map((color, index) => (
                    <div
                      key={`${color.value}-${index}`}
                      className="relative group"
                    >
                      <div 
                        className="w-full aspect-square rounded-md border border-gray-200"
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      ></div>
                      
                      {colorPalettes[paletteId].isCustom && (
                        <button
                          className="absolute top-0 right-0 p-0.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm transform translate-x-1 -translate-y-1 text-red-500 hover:text-red-700"
                          onClick={() => handleStartDeleteColor(paletteId, index)}
                          title="Remove color"
                        >
                          <MdDelete size={12} />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-5 text-center py-2 text-xs text-gray-400">
                    No colors yet
                  </div>
                )}
              </div>
              
              {colorPalettes[paletteId].colors.length > 10 && (
                <div className="text-xs text-gray-500 mt-1 mb-2">
                  + {colorPalettes[paletteId].colors.length - 10} more colors
                </div>
              )}
              
              {colorPalettes[paletteId].isCustom && (
                <div className="mt-2 flex justify-end">
                  <button
                    className="flex items-center text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 px-2 py-1 rounded"
                    onClick={() => handleAddColorToExistingPalette(paletteId)}
                  >
                    <MdAdd size={14} className="mr-1" /> Add Color
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Palette Creation/Editing Form */}
      {(isCreatingPalette || isEditingPalette) && (
        <div className="p-3 border rounded-md bg-white">
          <h4 className="text-sm font-medium mb-3">
            {isEditingPalette ? 'Edit Palette' : 'Create New Palette'}
          </h4>
          
          <div className="mb-3">
            <label className="block text-xs text-gray-500 mb-1">Palette Name</label>
            <input
              type="text"
              value={newPaletteName}
              onChange={(e) => setNewPaletteName(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border rounded"
              placeholder="My Custom Palette"
            />
          </div>
          
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs text-gray-500">Colors</label>
              <button
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-0.5 rounded flex items-center"
                onClick={handleAddColorToPalette}
              >
                <FaPlus size={8} className="mr-1" /> Add Color
              </button>
            </div>
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {paletteColors.map((color, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: color.value }}
                  ></div>
                  <input
                    type="text"
                    value={color.name}
                    onChange={(e) => handlePaletteColorNameChange(index, e.target.value)}
                    className="flex-1 px-2 py-1 text-xs border rounded"
                    placeholder="Color name"
                  />
                  <ColorPickerWithPalette
                    value={color.value}
                    onChange={(newColor) => handlePaletteColorChange(index, newColor)}
                    label=""
                  />
                  <button
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => handleRemoveColorFromPalette(index)}
                  >
                    <MdDelete size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <button
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded"
              onClick={handleCancelPalette}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded"
              onClick={handleSavePalette}
              disabled={!newPaletteName.trim()}
            >
              {isEditingPalette ? 'Update Palette' : 'Save Palette'}
            </button>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title={deleteMode === 'palette' ? "Delete Palette" : "Remove Color"}
        message={
          deleteMode === 'palette' 
            ? "Are you sure you want to delete this palette? This action cannot be undone."
            : "Are you sure you want to remove this color? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        isDanger={true}
      />
    </div>
  );
} 