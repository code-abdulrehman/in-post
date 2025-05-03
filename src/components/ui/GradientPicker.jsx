import { useState, useRef, useEffect } from 'react';
import { MdCheck, MdGradient } from 'react-icons/md';
import ColorPicker from './ColorPicker';

/**
 * A gradient picker component to select and customize gradients
 */
export default function GradientPicker({ value, onChange, className = '' }) {
  const [showPicker, setShowPicker] = useState(false);
  const [gradientType, setGradientType] = useState('linear');
  const [gradientDirection, setGradientDirection] = useState('to right');
  const [gradientStart, setGradientStart] = useState('#3B82F6');
  const [gradientEnd, setGradientEnd] = useState('#EC4899');
  const pickerRef = useRef(null);

  useEffect(() => {
    // Parse the existing gradient value if it exists
    if (value && typeof value === 'string') {
      if (value.startsWith('linear-gradient')) {
        setGradientType('linear');
        
        // Try to extract direction
        const dirMatch = value.match(/linear-gradient\((.*?),/);
        if (dirMatch && dirMatch[1]) {
          // Clean up any additional spaces
          const direction = dirMatch[1].trim();
          if (direction.startsWith('to ')) {
            setGradientDirection(direction);
          }
        }
        
        // Try to extract colors
        const colorMatches = value.match(/(#[0-9a-f]{3,8}|rgba?\([^)]+\))/gi);
        if (colorMatches && colorMatches.length >= 2) {
          setGradientStart(colorMatches[0]);
          setGradientEnd(colorMatches[1]);
        }
      } else if (value.startsWith('radial-gradient')) {
        setGradientType('radial');
        
        // Try to extract colors
        const colorMatches = value.match(/(#[0-9a-f]{3,8}|rgba?\([^)]+\))/gi);
        if (colorMatches && colorMatches.length >= 2) {
          setGradientStart(colorMatches[0]);
          setGradientEnd(colorMatches[1]);
        }
      }
    }
  }, [value]);

  // Common gradients
  const gradients = [
    {
      name: 'Blue to Purple',
      value: 'linear-gradient(to right, #3B82F6, #8B5CF6)'
    },
    {
      name: 'Green to Blue',
      value: 'linear-gradient(to right, #10B981, #3B82F6)'
    },
    {
      name: 'Yellow to Red',
      value: 'linear-gradient(to right, #F59E0B, #EF4444)'
    },
    {
      name: 'Pink to Purple',
      value: 'linear-gradient(to right, #EC4899, #8B5CF6)'
    },
  ];

  const radialGradients = [
    {
      name: 'Blue Center',
      value: 'radial-gradient(circle, #3B82F6, #1E3A8A)'
    },
    {
      name: 'Red Center',
      value: 'radial-gradient(circle, #EF4444, #7F1D1D)'
    },
    {
      name: 'Green Center',
      value: 'radial-gradient(circle, #10B981, #064E3B)'
    },
    {
      name: 'Purple Center',
      value: 'radial-gradient(circle, #8B5CF6, #4C1D95)'
    },
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

  const handleGradientSelect = (gradientValue) => {
    onChange(gradientValue);
    setShowPicker(false);
  };

  const updateCustomGradient = () => {
    let gradientString = '';
    
    if (gradientType === 'linear') {
      gradientString = `linear-gradient(${gradientDirection}, ${gradientStart}, ${gradientEnd})`;
    } else {
      gradientString = `radial-gradient(circle, ${gradientStart}, ${gradientEnd})`;
    }
    
    onChange(gradientString);
  };

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      <div 
        className="w-8 h-8 rounded border border-gray-300 cursor-pointer overflow-hidden"
        style={{ background: value || 'linear-gradient(to right, #3B82F6, #8B5CF6)' }}
        onClick={() => setShowPicker(!showPicker)}
      >
        {!value && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-white">
            <MdGradient size={16} />
          </div>
        )}
      </div>
      
      {showPicker && (
        <div className="absolute left-0 top-10 bg-white shadow-lg rounded-md p-3 z-10 w-72 border">
          {/* Gradient Type Selector */}
          <div className="mb-3">
            <label className="block text-xs text-gray-500 mb-1">Gradient Type</label>
            <div className="flex space-x-2">
              <button
                className={`flex-1 py-1 px-3 text-xs rounded border ${
                  gradientType === 'linear' ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'border-gray-300'
                }`}
                onClick={() => {
                  setGradientType('linear');
                  setTimeout(updateCustomGradient, 0);
                }}
              >
                Linear
              </button>
              <button
                className={`flex-1 py-1 px-3 text-xs rounded border ${
                  gradientType === 'radial' ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'border-gray-300'
                }`}
                onClick={() => {
                  setGradientType('radial');
                  setTimeout(updateCustomGradient, 0);
                }}
              >
                Radial
              </button>
            </div>
          </div>

          {/* Linear Gradient Direction Selector */}
          {gradientType === 'linear' && (
            <div className="mb-3">
              <label className="block text-xs text-gray-500 mb-1">Direction</label>
              <select
                value={gradientDirection}
                onChange={(e) => {
                  setGradientDirection(e.target.value);
                  setTimeout(updateCustomGradient, 0);
                }}
                className="w-full rounded-md border border-gray-300 px-3 py-1 text-xs"
              >
                <option value="to right">Left to Right</option>
                <option value="to left">Right to Left</option>
                <option value="to bottom">Top to Bottom</option>
                <option value="to top">Bottom to Top</option>
                <option value="to bottom right">Top Left to Bottom Right</option>
                <option value="to bottom left">Top Right to Bottom Left</option>
                <option value="to top right">Bottom Left to Top Right</option>
                <option value="to top left">Bottom Right to Top Left</option>
              </select>
            </div>
          )}

          {/* Gradient Color Selectors */}
          <div className="mb-3 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Start Color</label>
              <div className="flex items-center">
                <ColorPicker
                  value={gradientStart}
                  onChange={(color) => {
                    setGradientStart(color);
                    setTimeout(updateCustomGradient, 0);
                  }}
                  className="mr-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">End Color</label>
              <div className="flex items-center">
                <ColorPicker
                  value={gradientEnd}
                  onChange={(color) => {
                    setGradientEnd(color);
                    setTimeout(updateCustomGradient, 0);
                  }}
                  className="mr-2"
                />
              </div>
            </div>
          </div>

          {/* Gradient Preview */}
          <div className="mb-3">
            <label className="block text-xs text-gray-500 mb-1">Preview</label>
            <div 
              className="h-10 w-full rounded-md border"
              style={{ 
                background: gradientType === 'linear' 
                  ? `linear-gradient(${gradientDirection}, ${gradientStart}, ${gradientEnd})`
                  : `radial-gradient(circle, ${gradientStart}, ${gradientEnd})`
              }}
            />
          </div>

          {/* Gradient Presets */}
          <div className="mb-2">
            <label className="block text-xs text-gray-500 mb-1">Presets - Linear</label>
            <div className="grid grid-cols-2 gap-2">
              {gradients.map((gradient, index) => (
                <div
                  key={`linear-${index}`}
                  className={`h-8 rounded-md border cursor-pointer transition-all ${
                    value === gradient.value ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ background: gradient.value }}
                  onClick={() => handleGradientSelect(gradient.value)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Presets - Radial</label>
            <div className="grid grid-cols-2 gap-2">
              {radialGradients.map((gradient, index) => (
                <div
                  key={`radial-${index}`}
                  className={`h-8 rounded-md border cursor-pointer transition-all ${
                    value === gradient.value ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ background: gradient.value }}
                  onClick={() => handleGradientSelect(gradient.value)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 