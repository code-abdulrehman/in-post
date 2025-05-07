import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FaCheck, FaPalette, FaPlus } from 'react-icons/fa';
import { MdColorLens } from 'react-icons/md';
import { useStore } from '../../store';
import { FiCheck } from 'react-icons/fi';

/**
 * Enhanced ColorPicker with project palette integration
 * Provides a compact popup for color selection from palettes
 */
const ColorPickerWithPalette = ({ 
  value, 
  onChange, 
  className = "", 
  label = "Color",
  fullWidth = false,
  showPaletteColors = true
}) => {
  const [showPalette, setShowPalette] = useState(false);
  const [color, setColor] = useState(value || '#F9E79F'); // Default to pastel yellow
  const [copiedColor, setCopiedColor] = useState(null);
  const paletteRef = useRef(null);

  // Get store functions and state
  const { 
    colorPalettes, 
    currentPaletteId, 
    setCurrentPalette,
    addColorToPalette
  } = useStore();
  
  // Get the current palette colors
  const currentPaletteColors = useMemo(() => {
    return colorPalettes[currentPaletteId]?.colors || [];
  }, [colorPalettes, currentPaletteId]);

  // Get the current palette name
  const currentPaletteName = useMemo(() => {
    return colorPalettes[currentPaletteId]?.name || 'Colors';
  }, [colorPalettes, currentPaletteId]);

  // Check if current palette is custom
  const isCustomPalette = useMemo(() => {
    return colorPalettes[currentPaletteId]?.isCustom || false;
  }, [colorPalettes, currentPaletteId]);

  // Get all available palettes
  const allPalettes = useMemo(() => {
    return Object.keys(colorPalettes).map(id => ({
      id,
      name: colorPalettes[id].name,
      isCustom: colorPalettes[id].isCustom || false,
      isActive: id === currentPaletteId
    }));
  }, [colorPalettes, currentPaletteId]);

  // Update internal color when prop changes
  useEffect(() => {
    if (value !== undefined && value !== color) {
      setColor(value);
    }
  }, [value]);

  // Handle click outside to close color palette
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (paletteRef.current && !paletteRef.current.contains(event.target)) {
        setShowPalette(false);
      }
    };

    if (showPalette) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPalette]);

  // Handle color selection from palette
  const handlePaletteColorSelect = (colorObj) => {
    setColor(colorObj.value);
    onChange(colorObj.value);
    setShowPalette(false);
  };

  // Add current color to project palette
  const handleAddCurrentColorToPalette = () => {
    if (!isCustomPalette) return;
    
    const colorName = `Color ${currentPaletteColors.length + 1}`;
    addColorToPalette(color, colorName, currentPaletteId);
  };

  // Toggle palette visibility
  const togglePalette = () => {
    setShowPalette(!showPalette);
  };

  // Handle copying color to clipboard
  const handleCopyColor = (colorValue) => {
    navigator.clipboard.writeText(colorValue);
    setCopiedColor(colorValue);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  // Standard colors for quick selection
  const standardColors = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', 
    '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
    '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', 
    '#607D8B', '#000000', '#FFFFFF'
  ];

  // Default color palette options
  const DEFAULT_PALETTE = [
    '#000000', // Black
    '#FFFFFF', // White
    '#F44336', // Red
    '#E91E63', // Pink
    '#9C27B0', // Purple
    '#673AB7', // Deep Purple
    '#3F51B5', // Indigo
    '#2196F3', // Blue
    '#03A9F4', // Light Blue
    '#00BCD4', // Cyan
    '#009688', // Teal
    '#4CAF50', // Green
    '#8BC34A', // Light Green
    '#CDDC39', // Lime
    '#FFEB3B', // Yellow
    '#FFC107', // Amber
    '#FF9800', // Orange
    '#FF5722', // Deep Orange
    '#795548', // Brown
    '#9E9E9E', // Gray
  ];

  const [recentColors, setRecentColors] = useState([]);
  
  // Load recent colors from local storage on component mount
  useEffect(() => {
    try {
      const savedColors = localStorage.getItem('recent_colors');
      if (savedColors) {
        setRecentColors(JSON.parse(savedColors));
      }
    } catch (e) {
      console.error('Error loading recent colors', e);
    }
  }, []);
  
  // Save color to recent colors when a new one is selected
  const saveToRecentColors = (color) => {
    if (!color) return;
    
    // Only add if it's not already in the recent colors
    if (!recentColors.includes(color)) {
      const newRecentColors = [color, ...recentColors.slice(0, 9)]; // Keep only 10 recent colors
      setRecentColors(newRecentColors);
      
      try {
        localStorage.setItem('recent_colors', JSON.stringify(newRecentColors));
      } catch (e) {
        console.error('Error saving recent colors', e);
      }
    }
  };
  
  // Handle color selection
  const handleColorSelect = (color) => {
    onChange(color);
    saveToRecentColors(color);
    setShowPalette(false);
  };

  return (
    <div className={`relative ${className || ''}`}>
      {label && <label className="block text-xs text-gray-500 mb-1">{label}</label>}
      <div className="flex items-center">
        <button
          className="p-1 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-300 transition-colors flex items-center justify-center"
          onClick={togglePalette}
          aria-label="Open color palette"
          type="button"
        >
          <div 
            className="w-5 h-5 rounded-sm relative border border-gray-300"
            style={{ backgroundColor: color }}
          />
        </button>
        
        {fullWidth && (
          <input
            type="text"
            value={color || '#F9E79F'}
            onChange={(e) => {
              const newColor = e.target.value || '#F9E79F';
              setColor(newColor);
              onChange(newColor);
            }}
            className="w-full flex-1 ml-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-mono"
          />
        )}
      </div>

      {showPalette && (
        <div
          className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 max-w-[240px] w-52 h-40 pb-1 overflow-y-auto"
          ref={paletteRef}
        >
          {/* Current Palette Section */}
          {showPaletteColors && (
            <div className="mb-2">
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-xs font-medium text-gray-600">{currentPaletteName}</h4>
                {isCustomPalette && (
                  <button
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                    onClick={handleAddCurrentColorToPalette}
                  >
                    <FaPlus size={10} className="inline mr-1" /> Add
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-6 gap-1">
                {currentPaletteColors.length > 0 ? (
                  currentPaletteColors.slice(0, 12).map((colorObj, index) => (
                    <div
                      key={`current-${colorObj.value}-${index}`}
                      className="relative cursor-pointer"
                    >
                      <div
                        className="w-full aspect-square rounded-md cursor-pointer border border-gray-200 hover:border-indigo-400"
                        style={{ backgroundColor: colorObj.value }}
                        onClick={() => handlePaletteColorSelect(colorObj)}
                        title={colorObj.name}
                      >
                        {colorObj.value === color && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <FaCheck 
                              size={10} 
                              className={
                                colorObj.value === '#FFFFFF' || 
                                colorObj.value.startsWith('rgb(255,255,255') || 
                                colorObj.value.includes('rgba(255,255,255')
                                  ? 'text-black' 
                                  : 'text-white'
                              } 
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-6 text-center py-1 text-xs text-gray-400">
                    No colors in this palette.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Standard colors */}
          <div className="mb-2">
            <h4 className="text-xs font-medium text-gray-600 mb-1">Standard Colors</h4>
            <div className="grid grid-cols-7 gap-1">
              {standardColors.map((c, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded cursor-pointer border hover:scale-110 transition-transform"
                  style={{ backgroundColor: c }}
                  onClick={() => {
                    setColor(c);
                    onChange(c);
                    setShowPalette(false);
                  }}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* Custom color input */}
          <div className="mb-2">
            <div className="flex items-center">
              <input 
                type="color" 
                value={color && color.startsWith('#') ? color : '#FFFFFF'}
                onChange={(e) => {
                  const newColor = e.target.value;
                  setColor(newColor);
                  onChange(newColor);
                }}
                className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => {
                  const newColor = e.target.value;
                  setColor(newColor);
                  onChange(newColor);
                }}
                className="flex-1 px-2 py-1 text-xs border rounded ml-2"
                placeholder="#RRGGBB"
              />
            </div>
          </div>
          
          {/* Palette selection - compact dropdown */}
          <div className="border-t border-gray-200 pt-1 mt-1">
            <details className="text-xs">
              <summary className="cursor-pointer py-1 font-medium text-gray-600">
                Change Palette
              </summary>
              <div className="max-h-[80px] overflow-y-auto text-xs">
                {allPalettes.map(palette => (
                  <div 
                    key={palette.id}
                    className={`p-1 mb-1 cursor-pointer rounded flex justify-between items-center ${palette.isActive ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
                    onClick={() => setCurrentPalette(palette.id)}
                  >
                    <span>{palette.name}</span>
                    {palette.isActive && <FaCheck size={10} />}
                  </div>
                ))}
              </div>
            </details>
          </div>

          {/* Recent colors */}
          {recentColors.length > 0 && (
            <div className="mb-3">
              <div className="text-xs text-gray-500 mb-1">Recent</div>
              <div className="grid grid-cols-5 gap-1">
                {recentColors.map((color, index) => (
                  <button
                    key={`recent-${index}`}
                    className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                    aria-label={`Select color ${color}`}
                  >
                    {value === color && <FiCheck className="text-white drop-shadow-md" />}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Default palette */}
          <div>
            <div className="text-xs text-gray-500 mb-1">Palette</div>
            <div className="grid grid-cols-5 gap-1">
              {DEFAULT_PALETTE.map((color) => (
                <button
                  key={color}
                  className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                  aria-label={`Select color ${color}`}
                >
                  {value === color && <FiCheck className={color === '#FFFFFF' ? 'text-black' : 'text-white'} />}
                </button>
              ))}
            </div>
          </div>
          
          {/* Transparency options */}
          <div className="mt-3">
            <div className="text-xs text-gray-500 mb-1">Transparency</div>
            <div className="flex space-x-1">
              <button
                className="flex-1 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => handleColorSelect('transparent')}
              >
                Transparent
              </button>
              <button
                className="flex-1 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => handleColorSelect('rgba(0,0,0,0.5)')}
              >
                Semi-transparent
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Copied Color Notification */}
      {copiedColor && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-gray-800 text-white text-xs py-1 px-2 rounded text-center">
          Copied {copiedColor}!
        </div>
      )}
    </div>
  );
};

export default ColorPickerWithPalette; 