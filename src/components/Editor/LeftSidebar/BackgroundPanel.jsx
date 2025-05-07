import { useState } from 'react';
import { useStore } from '../../../store';
import { MdCheck, MdColorLens, MdDelete, MdAdd } from 'react-icons/md';
import { FaPalette, FaPlus, FaUser } from 'react-icons/fa';
import ColorPickerWithPalette from '../../ui/ColorPickerWithPalette';
import ConfirmDialog from '../../ui/ConfirmDialog';

export default function BackgroundPanel() {
  const { 
    canvasBackground, 
    setCanvasBackground, 
    addToHistory, 
    colorPalettes, 
    currentPaletteId,
    setCurrentPalette,
    addPalette,
    deletePalette,
    addColorToPalette,
    removeColorFromPalette
  } = useStore();
  
  const [activeTab, setActiveTab] = useState('colors');
  const [bgOpacity, setBgOpacity] = useState(
    // Initialize with correct opacity if canvasBackground is rgba
    canvasBackground && typeof canvasBackground === 'string' && canvasBackground.startsWith('rgba') 
      ? Math.round(parseFloat(canvasBackground.match(/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([\d.]+)\s*\)/)[1]) * 100)
      : 100
  );
  
  // Palette management 
  const [isCreatingPalette, setIsCreatingPalette] = useState(false);
  const [newPaletteName, setNewPaletteName] = useState('');
  
  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [paletteToDelete, setPaletteToDelete] = useState(null);
  const [colorIndexToDelete, setColorIndexToDelete] = useState(null);
  const [deleteMode, setDeleteMode] = useState(null); // 'palette' or 'color'
  
  // Quick add color
  const [newColor, setNewColor] = useState('#CCCCCC');
  
  // Get the current palette colors
  const currentPaletteColors = colorPalettes[currentPaletteId]?.colors || [];
  const isCustomPalette = colorPalettes[currentPaletteId]?.isCustom || false;

  const handleColorSelect = (color) => {
    // Apply with current opacity
    if (bgOpacity < 100 && color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      const a = bgOpacity / 100;
      const rgbaColor = `rgba(${r}, ${g}, ${b}, ${a})`;
      setCanvasBackground(rgbaColor);
    } else {
      setCanvasBackground(color);
    }
    addToHistory('Change background color');
  };

  // Handle opacity change for background
  const handleBgOpacityChange = (event) => {
    const newOpacity = parseInt(event.target.value);
    setBgOpacity(newOpacity);
    
    // Get base color without opacity
    let baseColor;
    if (typeof canvasBackground === 'string') {
      if (canvasBackground.startsWith('rgba')) {
        // Extract RGB from rgba
        const match = canvasBackground.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*[\d.]+\s*\)/);
        if (match) {
          const [, r, g, b] = match;
          baseColor = `rgb(${r}, ${g}, ${b})`;
        } else {
          baseColor = '#FFFFFF';
        }
      } else if (canvasBackground.startsWith('#')) {
        baseColor = canvasBackground;
      } else if (canvasBackground.startsWith('rgb(')) {
        baseColor = canvasBackground;
      } else {
        baseColor = '#FFFFFF';
      }
    } else {
      baseColor = '#FFFFFF';
    }
    
    // Apply color with new opacity
    if (baseColor.startsWith('#')) {
      const r = parseInt(baseColor.slice(1, 3), 16);
      const g = parseInt(baseColor.slice(3, 5), 16);
      const b = parseInt(baseColor.slice(5, 7), 16);
      
      if (newOpacity < 100) {
        // Create rgba color
        const a = newOpacity / 100;
        const rgbaColor = `rgba(${r}, ${g}, ${b}, ${a})`;
        setCanvasBackground(rgbaColor);
      } else {
        // Use solid hex color
        setCanvasBackground(baseColor);
      }
    } else if (baseColor.startsWith('rgb(')) {
      // Handle rgb format
      const match = baseColor.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
      if (match) {
        const [, r, g, b] = match;
        
        if (newOpacity < 100) {
          const a = newOpacity / 100;
          const rgbaColor = `rgba(${r}, ${g}, ${b}, ${a})`;
          setCanvasBackground(rgbaColor);
        } else {
          setCanvasBackground(baseColor);
        }
      }
    }
    
    addToHistory('Change background opacity');
  };

  // Add color to current palette
  const handleAddToPalette = (color) => {
    const colorName = `Color ${colorPalettes[currentPaletteId]?.colors.length + 1 || 1}`;
    addColorToPalette(color, colorName, currentPaletteId);
  };

  const getSelectedColor = () => {
    if (typeof canvasBackground === 'string') {
      return canvasBackground;
    }
    return '#FFFFFF';
  };
  
  // Start creating a new palette
  const handleStartCreatePalette = () => {
    setIsCreatingPalette(true);
    setNewPaletteName('');
  };
  
  // Cancel palette creation
  const handleCancelCreatePalette = () => {
    setIsCreatingPalette(false);
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
  
  // Save a new palette with current selected color
  const handleSavePalette = () => {
    if (newPaletteName.trim()) {
      const paletteId = `custom-${Date.now()}`;
      const selectedColor = getSelectedColor();
      // Create palette with the current selected color
      addPalette(paletteId, newPaletteName.trim(), [
        { value: selectedColor, name: 'Color 1' }
      ]);
      setCurrentPalette(paletteId);
      setIsCreatingPalette(false);
    }
  };

  return (
    <div className="background-panel h-full">
      <h3 className="text-sm font-medium mb-3">Canvas Background</h3>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`flex-1 py-2 text-sm font-medium ${activeTab === 'colors' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('colors')}
        >
          <div className="flex items-center justify-center">
            <MdColorLens className="mr-1" /> Colors
          </div>
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${activeTab === 'palettes' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('palettes')}
        >
          <div className="flex items-center justify-center">
            <FaPalette className="mr-1" /> Palettes
          </div>
        </button>
      </div>

      {/* Colors Tab */}
      {activeTab === 'colors' && !isCreatingPalette && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">
              {colorPalettes[currentPaletteId]?.name || 'Colors'}
            </h4>
            <span className="text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded">
              Active Palette
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {currentPaletteColors.length > 0 ? (
              currentPaletteColors.slice(0, 12).map((color, index) => (
                <div
                  key={`${color.value}-${index}`}
                  className="relative cursor-pointer aspect-square rounded overflow-hidden border group"
                  onClick={() => handleColorSelect(color.value)}
                  title={color.name}
                >
                  <div 
                    className="w-full h-full"
                    style={{ backgroundColor: color.value }}
                  ></div>
                  {getSelectedColor() === color.value && (
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <MdCheck 
                        size={16} 
                        className={color.value === '#FFFFFF' || color.value === '#F3F4F6' || color.value.includes('rgba') ? 'text-gray-800' : 'text-white'} 
                      />
                    </div>
                  )}
                  
                  {isCustomPalette && (
                    <button
                      className="absolute top-0 right-0 p-0.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm transform translate-x-1 -translate-y-1 text-red-500 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartDeleteColor(currentPaletteId, index);
                      }}
                      title="Remove color"
                    >
                      <MdDelete size={12} />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-4 text-gray-400">
                No colors in this palette yet.
              </div>
            )}
          </div>

          {/* Custom color section with add to palette */}
          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-1">Custom Color</label>
            <div className="flex">
              <ColorPickerWithPalette
                value={getSelectedColor()}
                onChange={handleColorSelect}
                label=""
                fullWidth={true}
                onAddToPalette={handleAddToPalette}
                showPaletteColors={true}
              />
              
              {isCustomPalette && (
                <button
                  className="ml-2 px-2 py-1 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded border border-indigo-200 flex items-center"
                  onClick={() => handleAddToPalette(getSelectedColor())}
                  title="Add to current palette"
                >
                  <FaPlus size={10} className="mr-1" /> Add
                </button>
              )}
            </div>
          </div>
          
          {/* Show quick add colors UI for custom palettes */}
          {isCustomPalette && (
            <div className="mb-4 p-2 border border-gray-200 rounded-md bg-gray-50">
              <h4 className="text-xs font-medium text-gray-700 mb-2">Quick Add to Palette</h4>
              <div className="flex items-center">
                <input 
                  type="color" 
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
                />
                <span className="ml-2 text-xs text-gray-500 flex-1">
                  {newColor}
                </span>
                <button
                  className="px-2 py-1 text-xs bg-indigo-500 hover:bg-indigo-600 text-white rounded flex items-center"
                  onClick={() => handleAddToPalette(newColor)}
                >
                  <MdAdd size={14} className="mr-1" /> Add to Palette
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 mb-4">
            <label className="block text-xs text-gray-500 mb-1">
              Background Opacity: {bgOpacity}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={bgOpacity}
              onChange={handleBgOpacityChange}
              className="w-full"
            />
          </div>
        </div>
      )}
      
      {/* Palettes Tab */}
      {activeTab === 'palettes' && !isCreatingPalette && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-medium text-gray-700">Available Palettes</h4>
            <button
              className="flex items-center text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-2 py-1 rounded"
              onClick={handleStartCreatePalette}
            >
              <FaPlus size={10} className="mr-1" /> New
            </button>
          </div>
          
          <div className="space-y-3 min-h-[300px] overflow-y-auto pr-1">
            {Object.keys(colorPalettes).map(paletteId => (
              <div 
                key={paletteId} 
                onClick={() => setCurrentPalette(paletteId)}
                className={`p-3 border rounded-md ${currentPaletteId === paletteId ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1">
                    {colorPalettes[paletteId].isCustom && (
                      <span className="ml-1 text-xs text-gray-300">
                        <FaUser size={12} />
                      </span>
                    )}
                    <h4 className="text-sm font-medium text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap">{colorPalettes[paletteId].name}</h4>
                    </div>
                    <div className="flex items-center justify-end gap-1" >
                   
                      {currentPaletteId === paletteId && (
                       <span className="ml-2 text-xs bg-indigo-200 text-indigo-600 px-1.5 py-0.5 rounded">
                         <MdCheck size={12} />
                       </span>
                     )}
                    {colorPalettes[paletteId].isCustom && (
                      <button
                        className="px-2 py-0.5 text-xs bg-red-50 hover:bg-red-100 text-red-600 rounded"
                        onClick={() => handleStartDeletePalette(paletteId)}
                        title="Delete palette"
                      >
                        <MdDelete size={12} />
                      </button>
                    )}
                    </div>
                  </div>
                  
                </div>
                
                <div className="grid grid-cols-5 gap-2">
                  {colorPalettes[paletteId].colors.length > 0 ? (
                    colorPalettes[paletteId].colors.slice(0, 10).map((color, index) => (
                      <div
                        key={`${color.value}-${index}`}
                        className="relative cursor-pointer"
                        onClick={() => handleColorSelect(color.value)}
                      >
                        <div 
                          className="w-full aspect-square rounded-md border border-gray-200"
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        ></div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-5 text-center py-2 text-xs text-gray-400">
                      No colors yet
                    </div>
                  )}
                </div>
                
                {colorPalettes[paletteId].colors.length > 10 && (
                  <div className="text-xs text-gray-500 mt-1">
                    + {colorPalettes[paletteId].colors.length - 10} more colors
                  </div>
                )}
                
                {/* Quick add section for custom palettes */}
                {colorPalettes[paletteId].isCustom && currentPaletteId === paletteId && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <button
                      className="flex items-center text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 px-2 py-1 rounded w-full justify-center"
                      onClick={() => setActiveTab('colors')}
                    >
                      <MdAdd size={12} className="mr-1" /> Go to Colors tab to add more
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* New Palette Creation Form - Simplified */}
      {isCreatingPalette && (
        <div className="p-3 border rounded-md bg-white">
          <h4 className="text-sm font-medium mb-3">Create New Palette</h4>
          
          <div className="mb-3">
            <label className="block text-xs text-gray-500 mb-1">Palette Name</label>
            <input
              type="text"
              value={newPaletteName}
              onChange={(e) => setNewPaletteName(e.target.value)}
              className="w-full px-3 py-1 text-sm border rounded"
              placeholder="My Custom Palette"
            />
          </div>
          
          <div className="mb-3">
            <div className="p-2 bg-gray-50 rounded text-xs text-gray-600 border">
              <div className="flex items-center">
                <FaPlus size={10} className="mr-1 text-indigo-600" /> 
                <span>New palette will be created with your current selected color</span>
              </div>
              <div className="flex items-center mt-2">
                <div 
                  className="w-5 h-5 rounded border mr-2"
                  style={{ backgroundColor: getSelectedColor() }}
                ></div>
                <span>Selected color: {getSelectedColor()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <button
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded"
              onClick={handleCancelCreatePalette}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded"
              onClick={handleSavePalette}
              disabled={!newPaletteName.trim()}
            >
              Create Palette
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