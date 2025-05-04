import { useState, useRef, useEffect } from 'react';
import { MdCheck } from 'react-icons/md';

/**
 * A color picker component with predefined colors, RGBA support and custom color input
 */
export default function ColorPicker({ value, onChange, className = '' }) {
  const [showPicker, setShowPicker] = useState(false);
  const [customColor, setCustomColor] = useState(value || '#000000');
  const [opacity, setOpacity] = useState(100);
  const [useRgba, setUseRgba] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    // Check if the value is an rgba color
    if (value && value.startsWith('rgba')) {
      setUseRgba(true);
      // Extract opacity value from rgba
      const match = value.match(/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([\d.]+)\s*\)/);
      if (match && match[1]) {
        setOpacity(Math.round(parseFloat(match[1]) * 100));
      }
    } else {
      setUseRgba(false);
    }
  }, [value]);

  const colors = [
    '#FFFFFF', // White
    '#F3F4F6', // Light Gray
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#6366F1', // Indigo
    '#000000', // Black
    'rgba(59, 130, 246, 0.5)', // Semi-transparent Blue
    'rgba(239, 68, 68, 0.5)', // Semi-transparent Red
  ];

  // Handle clicking outside to close the picker
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleColorSelect = (color) => {
    onChange(color);
    setCustomColor(color);
    setShowPicker(false);
  };

  const handleCustomColorChange = (e) => {
    const color = e.target.value;
    setCustomColor(color);
    
    if (useRgba) {
      // Convert hex to rgba
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      const a = opacity / 100;
      const rgbaColor = `rgba(${r}, ${g}, ${b}, ${a})`;
      onChange(rgbaColor);
    } else {
      onChange(color);
    }
  };

  const handleOpacityChange = (e) => {
    const newOpacity = parseInt(e.target.value);
    setOpacity(newOpacity);
    
    if (customColor.startsWith('#')) {
      // Convert hex to rgba
      const r = parseInt(customColor.slice(1, 3), 16);
      const g = parseInt(customColor.slice(3, 5), 16);
      const b = parseInt(customColor.slice(5, 7), 16);
      const a = newOpacity / 100;
      const rgbaColor = `rgba(${r}, ${g}, ${b}, ${a})`;
      onChange(rgbaColor);
    }
  };

  const toggleColorFormat = () => {
    setUseRgba(!useRgba);
    
    if (!useRgba) {
      // Convert current hex to rgba
      if (customColor.startsWith('#')) {
        const r = parseInt(customColor.slice(1, 3), 16);
        const g = parseInt(customColor.slice(3, 5), 16);
        const b = parseInt(customColor.slice(5, 7), 16);
        const a = opacity / 100;
        const rgbaColor = `rgba(${r}, ${g}, ${b}, ${a})`;
        onChange(rgbaColor);
      }
    } else {
      // Use hex only
      onChange(customColor);
    }
  };

  // Get display color for the color picker button
  const getDisplayColor = () => {
    if (value && value.startsWith('rgba')) {
      return value;
    }
    return value || customColor;
  };

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      <div 
        className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
        style={{ backgroundColor: getDisplayColor() }}
        onClick={() => setShowPicker(!showPicker)}
      />
      
      {showPicker && (
        <div className="absolute left-0 top-10 bg-white rounded-md p-3 z-10 w-44 border overflow-y-auto h-16">
          <div className="grid grid-cols-6 gap-2 mb-2">
            {colors.map((color) => (
              <div
                key={color}
                className="w-5 h-5 rounded cursor-pointer relative border"
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
              >
                {color === value && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MdCheck 
                      size={14} 
                      className={
                        color === '#FFFFFF' || color === '#F3F4F6' || 
                        (color.startsWith('rgba') && color.endsWith('0.5'))
                        ? 'text-black' : 'text-white'
                      } 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs text-gray-500">Custom Color</label>
              <button 
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-0.5 rounded"
                onClick={toggleColorFormat}
              >
                {useRgba ? 'Use HEX' : 'Use RGBA'}
              </button>
            </div>
            
            <div className="flex">
              <input
                type="color"
                value={customColor.startsWith('#') ? customColor : '#000000'}
                onChange={handleCustomColorChange}
                className="w-8 h-8 p-0 border-0"
              />
              <input
                type="text"
                value={useRgba && value && value.startsWith('rgba') ? value : customColor}
                onChange={(e) => {
                  const newColor = e.target.value;
                  setCustomColor(newColor);
                  onChange(newColor);
                }}
                className="w-32 ml-2 px-2 py-1 text-xs border rounded"
                placeholder={useRgba ? "rgba(0,0,0,0.5)" : "#FFFFFF"}
              />
            </div>

            {useRgba && (
              <div className="mt-2">
                <label className="block text-xs text-gray-500 mb-1">
                  Opacity: {opacity}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={opacity}
                  onChange={handleOpacityChange}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 