import { useState } from 'react';
import { useStore } from '../../../store';
import { MdColorLens } from 'react-icons/md';
import { FaPalette } from 'react-icons/fa';
import ConfirmDialog from '../../ui/ConfirmDialog';
import axios from 'axios';
import { toast } from 'react-toastify';

// Import the extracted components
import PaletteColorsTab from './BackgroundPanelComponents/PaletteColorsTab';
import PalettesTab from './BackgroundPanelComponents/PalettesTab';
import CreatePaletteForm from './BackgroundPanelComponents/CreatePaletteForm';
import AIPaletteDialog from './BackgroundPanelComponents/AIPaletteDialog';

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
        <PaletteColorsTab
          colorPalettes={colorPalettes}
          currentPaletteId={currentPaletteId}
          currentPaletteColors={currentPaletteColors}
          isCustomPalette={isCustomPalette}
          getSelectedColor={getSelectedColor}
          handleColorSelect={handleColorSelect}
          handleStartDeleteColor={handleStartDeleteColor}
          handleStartAiPaletteGeneration={handleStartAiPaletteGeneration}
          handleAddToPalette={handleAddToPalette}
          newColor={newColor}
          setNewColor={setNewColor}
          bgOpacity={bgOpacity}
          handleBgOpacityChange={handleBgOpacityChange}
        />
      )}
      
      {/* Palettes Tab */}
      {activeTab === 'palettes' && !isCreatingPalette && (
        <PalettesTab
          colorPalettes={colorPalettes}
          currentPaletteId={currentPaletteId}
          setCurrentPalette={setCurrentPalette}
          handleStartDeletePalette={handleStartDeletePalette}
          handleColorSelect={handleColorSelect}
          handleStartCreatePalette={handleStartCreatePalette}
          handleStartAiPaletteGeneration={handleStartAiPaletteGeneration}
          setActiveTab={setActiveTab}
        />
      )}
      
      {/* New Palette Creation Form */}
      {isCreatingPalette && (
        <CreatePaletteForm
          newPaletteName={newPaletteName}
          setNewPaletteName={setNewPaletteName}
          getSelectedColor={getSelectedColor}
          handleCancelCreatePalette={handleCancelCreatePalette}
          handleSavePalette={handleSavePalette}
        />
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
        <AIPaletteDialog
          aiPrompt={aiPrompt}
          setAiPrompt={setAiPrompt}
          isGeneratingPalette={isGeneratingPalette}
          useCurrentBackground={useCurrentBackground}
          getSelectedColor={getSelectedColor}
          generateRandomPrompt={generateRandomPrompt}
          handleGenerateAiPalette={handleGenerateAiPalette}
          onClose={() => setShowAiDialog(false)}
        />
      )}
    </div>
  );
} 