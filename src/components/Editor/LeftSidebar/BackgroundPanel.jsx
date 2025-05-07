import { useState } from 'react';
import { useStore } from '../../../store';
import { MdCheck, MdColorLens, MdDelete, MdAdd, MdAutoAwesome } from 'react-icons/md';
import { FaPalette, FaPlus, FaUser, FaMagic } from 'react-icons/fa';
import { IoMdRefresh } from 'react-icons/io';
import ColorPickerWithPalette from '../../ui/ColorPickerWithPalette';
import ConfirmDialog from '../../ui/ConfirmDialog';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BsPcDisplay } from "react-icons/bs";

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
  
  // AI generation states
  const [isGeneratingPalette, setIsGeneratingPalette] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiDialog, setShowAiDialog] = useState(false);
  const [useCurrentBackground, setUseCurrentBackground] = useState(false);
  
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
  
  // Start AI palette generation dialog
  const handleStartAiPaletteGeneration = (useBackground = false) => {
    setShowAiDialog(true);
    setUseCurrentBackground(useBackground);
    
    const currentBackground = getSelectedColor();
    
    if (useBackground && currentBackground) {
      // Pre-fill with prompt about the current background color
      setAiPrompt(`Create a harmonious color palette based on the color ${currentBackground}`);
    } else {
      setAiPrompt('');
    }
  };
  
  // Generate palette with AI
  const handleGenerateAiPalette = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please enter a description for your palette');
      return;
    }
    
    setIsGeneratingPalette(true);
    
    try {
      // If using current background, add it to the prompt
      const currentBackground = getSelectedColor();
      const promptText = useCurrentBackground && currentBackground 
        ? `${aiPrompt}. Please include the color ${currentBackground} in the palette.`
        : aiPrompt;
      
      const response = await axios.post('http://localhost:4003/api/color/gen', {
        text: promptText
      });
      
      if (response.data.success) {
        // Parse the colors from the response
        const colorData = parseAiColorResponse(response.data.data);
        
        if (colorData.length > 0) {
          // Create a new palette with these colors
          const paletteId = `ai-${Date.now()}`;
          const paletteName = `AI Palette: ${aiPrompt.substring(0, 20)}${aiPrompt.length > 20 ? '...' : ''}`;
          addPalette(paletteId, paletteName, colorData);
          setCurrentPalette(paletteId);
          
          toast.success('New AI palette created for your background!');
          setShowAiDialog(false);
        } else {
          toast.error('Could not parse colors from AI response');
        }
      } else {
        toast.error('Failed to generate palette. Please try again.');
      }
    } catch (error) {
      console.error('Error generating AI palette:', error);
      toast.error('Error connecting to AI service. Please try again later.');
    } finally {
      setIsGeneratingPalette(false);
    }
  };
  
  // Parse the AI response to extract colors
  const parseAiColorResponse = (responseText) => {
    // This regex will find hex color codes like #RRGGBB or #RGB
    const hexRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g;
    const colorMatches = responseText.match(hexRegex) || [];
    
    // Generate descriptive names for colors based on their hex values
    return colorMatches.map((hex, index) => {
      // Convert hex to lowercase for consistency
      const cleanHex = hex.toLowerCase();
      
      // Function to get a general color name
      const getColorName = (hex) => {
        // Remove the # and ensure 6 digits by expanding 3-digit hex codes
        let hexCode = hex.replace('#', '');
        if (hexCode.length === 3) {
          hexCode = hexCode.split('').map(c => c + c).join('');
        }
        
        // Convert to RGB
        const r = parseInt(hexCode.substr(0, 2), 16);
        const g = parseInt(hexCode.substr(2, 2), 16);
        const b = parseInt(hexCode.substr(4, 2), 16);
        
        // Calculate hue, saturation, and lightness
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const l = (max + min) / 2;
        
        // Determine if it's a grayscale color
        if (max === min) {
          if (l < 40) return 'Black';
          if (l < 90) return 'Gray';
          if (l < 160) return 'Silver';
          if (l < 220) return 'Light Gray';
          return 'White';
        }
        
        const d = max - min;
        const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        let h;
        
        if (max === r) {
          h = (g - b) / d + (g < b ? 6 : 0);
        } else if (max === g) {
          h = (b - r) / d + 2;
        } else {
          h = (r - g) / d + 4;
        }
        
        h *= 60;
        
        // Determine color name based on hue
        let colorName;
        if (h < 15 || h >= 345) colorName = 'Red';
        else if (h < 45) colorName = 'Orange';
        else if (h < 75) colorName = 'Yellow';
        else if (h < 165) colorName = 'Green';
        else if (h < 195) colorName = 'Cyan';
        else if (h < 255) colorName = 'Blue';
        else if (h < 285) colorName = 'Purple';
        else if (h < 345) colorName = 'Magenta';
        
        // Add lightness descriptor
        if (colorName !== 'White' && colorName !== 'Black') {
          if (l < 40) return 'Dark ' + colorName;
          if (l > 220) return 'Light ' + colorName;
        }
        
        return colorName;
      };
      
      return {
        value: cleanHex,
        name: `${getColorName(cleanHex)} (${cleanHex})`
      };
    });
  };
  
  // Generate a random AI prompt
  const generateRandomPrompt = () => {
    const themes = [
      'sunset over the ocean',
      'autumn forest leaves',
      'vibrant tropical beach',
      'minimalist corporate design',
      'pastel spring flowers',
      'desert landscape at dusk',
      'modern tech startup',
      'vintage retro 80s vibe'
    ];
    
    const colorTerms = [
      'Create a color palette inspired by',
      'Design harmonious colors for', 
      'Generate a professional palette based on',
      'Make a vibrant color scheme that evokes'
    ];
    
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    const randomTerm = colorTerms[Math.floor(Math.random() * colorTerms.length)];
    
    setAiPrompt(`${randomTerm} ${randomTheme}`);
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
          <div className="flex items-center justify-between mb-2 gap-2">
            <h4 className="text-sm font-medium text-gray-700 w-full overflow-hidden text-ellipsis whitespace-nowrap">
              {colorPalettes[currentPaletteId]?.name || 'Colors'}
            </h4>
            <span className="text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded">
              Active
            </span>
          </div>
          
          {/* AI Palette Generation Button */}
          <div className="mb-3 p-2 border border-dashed border-purple-300 rounded-md bg-gradient-to-r from-purple-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaMagic className="mr-2 text-purple-500" size={14} />
                <span className="text-xs font-medium text-purple-700">AI Color Magic</span>
              </div>
              <div className="flex space-x-1">
                <button
                  className="flex items-center text-xs bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-2 py-1 rounded shadow-sm"
                  onClick={() => handleStartAiPaletteGeneration(false)}
                >
                  <FaMagic size={8} className="mr-1 animate-pulse" /> Generate
                </button>
              </div>
            </div>
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
            <div className="flex space-x-1">
              <button
                className="flex items-center text-xs bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-2 py-1 rounded"
                onClick={() => handleStartAiPaletteGeneration(false)}
              >
                <FaMagic size={10} className="mr-1" /> AI
              </button>
              <button
                className="flex items-center text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-2 py-1 rounded"
                onClick={handleStartCreatePalette}
              >
                <FaPlus size={10} className="mr-1" /> New
              </button>
            </div>
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
                    
                    {(!colorPalettes[paletteId].isCustom && !paletteId.startsWith('ai-')) && (
                      <span className="ml-1 text-xs text-gray-500">
                        <BsPcDisplay size={12} />
                      </span>
                    )}

                    {(colorPalettes[paletteId].isCustom && !paletteId.startsWith('ai-')) && (
                      <span className="ml-1 text-xs text-gray-500">
                        <FaUser size={12} />
                      </span>
                    )}
                    {/* Add AI badge for AI-generated palettes */}
                    {paletteId.startsWith('ai-') && (
                      <span className="ml-1 text-xs text-purple-400">
                        <FaMagic size={12} />
                      </span>
                    )}
                    <h4 className="text-sm font-medium text-gray-700 w-20 overflow-hidden text-ellipsis whitespace-nowrap">{colorPalettes[paletteId].name}</h4>
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

      {/* AI Palette Generation Dialog */}
      {showAiDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <FaMagic className="mr-2 text-purple-500" /> Generate AI Background Palette
            </h3>
            
            {useCurrentBackground && (
              <div className="mb-4 p-3 border-l-4 border-indigo-500 bg-indigo-50 rounded">
                <div className="flex items-center mb-2">
                  <div 
                    className="w-6 h-6 mr-2 rounded border border-gray-300" 
                    style={{ backgroundColor: getSelectedColor() }}
                  ></div>
                  <p className="text-sm font-medium text-indigo-700">New palette will be created with your current background color</p>
                </div>
                <p className="text-xs text-indigo-600">
                  The AI will create a harmonious palette that includes this color
                </p>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-2">
                Describe the color palette you want:
              </label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded min-h-[100px] max-h-[150px] overflow-y-auto focus:outline-none"
                placeholder="e.g. Sunset over the ocean, Autumn forest colors, Corporate professional palette"
                disabled={isGeneratingPalette}
              />
              <div className="flex justify-between mt-2">
                <div className="text-xs text-gray-500">
                  Try to be descriptive for best results
                </div>
                <button
                  className="text-xs text-purple-600 hover:text-purple-800 flex items-center"
                  onClick={generateRandomPrompt}
                  disabled={isGeneratingPalette}
                >
                  <IoMdRefresh className="mr-1" /> Random idea
                </button>
              </div>
            </div>
            
            <div className="p-3 border border-gray-200 rounded-md mb-4 bg-gray-50">
              <h4 className="text-xs font-medium text-gray-700 mb-2">Suggested Prompts:</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Modern website design",
                  "Luxury brand colors",
                  "Nature inspired greens",
                  "Bold and vibrant",
                  "Calm and soothing",
                  "Corporate professional",
                  "Vintage retro style",
                  "Tech startup look"
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    className="text-xs text-left p-1.5 hover:bg-purple-100 rounded text-gray-700 transition-colors"
                    onClick={() => setAiPrompt(prompt)}
                    disabled={isGeneratingPalette}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                onClick={() => setShowAiDialog(false)}
                disabled={isGeneratingPalette}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded text-sm flex items-center"
                onClick={handleGenerateAiPalette}
                disabled={isGeneratingPalette || !aiPrompt.trim()}
              >
                {isGeneratingPalette ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <FaMagic className="mr-2" /> Generate Palette
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 