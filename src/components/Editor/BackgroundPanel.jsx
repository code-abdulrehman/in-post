import { useState } from 'react';
import { useStore } from '../../store';
import { MdCheck, MdAdd, MdColorLens } from 'react-icons/md';
import ColorPicker from '../ui/ColorPicker';

export default function BackgroundPanel() {
  const { canvasBackground, setCanvasBackground, addToHistory } = useStore();
  const [activeTab, setActiveTab] = useState('colors');
  const [patternColor, setPatternColor] = useState('rgba(0, 0, 0, 0.2)');
  const [patternBackgroundColor, setPatternBackgroundColor] = useState('#FFFFFF');
  const [useMixedBackground, setUseMixedBackground] = useState(false);

  const colors = [
    { value: '#FFFFFF', name: 'White' },
    { value: '#F3F4F6', name: 'Light Gray' },
    { value: '#E5E7EB', name: 'Gray' },
    { value: '#3B82F6', name: 'Blue' },
    { value: '#10B981', name: 'Green' },
    { value: '#F59E0B', name: 'Yellow' },
    { value: '#EF4444', name: 'Red' },
    { value: '#8B5CF6', name: 'Purple' },
    { value: '#EC4899', name: 'Pink' },
    { value: '#6366F1', name: 'Indigo' },
    { value: '#000000', name: 'Black' },
    { value: 'rgba(59, 130, 246, 0.5)', name: 'Semi-transparent Blue' },
  ];

  const patterns = [
    { 
      name: 'Dots', 
      value: {
        type: 'pattern',
        value: 'radial-gradient(rgba(0, 0, 0, 0.2) 1px, transparent 1px)',
        size: '10px 10px'
      }
    },
    { 
      name: 'Grid Lines', 
      value: {
        type: 'pattern',
        value: 'linear-gradient(rgba(0, 0, 0, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.15) 1px, transparent 1px)',
        size: '20px 20px'
      }
    },
    { 
      name: 'Horizontal Lines', 
      value: {
        type: 'pattern',
        value: 'linear-gradient(rgba(0, 0, 0, 0.15) 1px, transparent 1px)',
        size: '10px 10px'
      }
    },
    { 
      name: 'Diagonal Stripes', 
      value: {
        type: 'pattern',
        value: 'repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 10px, transparent 10px, transparent 20px)',
        size: '20px 20px'
      }
    },
  ];

  const handleColorSelect = (color) => {
    setCanvasBackground(color);
    addToHistory('Change background color');
  };

  const handlePatternSelect = (pattern) => {
    if (useMixedBackground) {
      // Create custom pattern with background color
      const customPattern = {
        ...pattern.value,
        backgroundColor: patternBackgroundColor
      };
      setCanvasBackground(customPattern);
    } else {
      setCanvasBackground(pattern.value);
    }
    addToHistory('Change background pattern');
  };

  const handleCustomPatternChange = (color) => {
    setPatternColor(color);
    updateCustomPattern();
  };

  const handlePatternBackgroundColorChange = (color) => {
    setPatternBackgroundColor(color);
    updateCustomPattern();
  };

  const updateCustomPattern = () => {
    // Create a custom pattern using the selected colors
    const customPattern = {
      type: 'pattern',
      value: `radial-gradient(${patternColor} 1px, transparent 1px)`,
      size: '10px 10px',
      backgroundColor: patternBackgroundColor
    };
    setCanvasBackground(customPattern);
    addToHistory('Update custom pattern');
  };

  const getSelectedColor = () => {
    if (typeof canvasBackground === 'string') {
      return canvasBackground;
    }
    return '#FFFFFF';
  };

  const isSelectedPattern = (pattern) => {
    if (typeof canvasBackground === 'object' && canvasBackground.type === 'pattern') {
      return canvasBackground.value === pattern.value.value;
    }
    return false;
  };

  const renderPatternPreview = (pattern) => {
    let backgroundColor = '#FFFFFF';
    
    // If using mixed backgrounds, use the selected background color
    if (useMixedBackground && typeof canvasBackground === 'object' && canvasBackground.backgroundColor) {
      backgroundColor = canvasBackground.backgroundColor;
    }
    
    return (
      <div
        className="h-20 w-full rounded relative"
        style={{
          backgroundColor: backgroundColor,
          backgroundImage: pattern.value.value,
          backgroundSize: pattern.value.size,
          backgroundRepeat: 'repeat'
        }}
      >
        {isSelectedPattern(pattern) && (
          <div className="absolute top-1 right-1 bg-indigo-500 text-white rounded-full p-1">
            <MdCheck size={14} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="background-panel">
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
          className={`flex-1 py-2 text-sm font-medium ${activeTab === 'patterns' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('patterns')}
        >
          <div className="flex items-center justify-center">
            <MdAdd className="mr-1" /> Patterns
          </div>
        </button>
      </div>

      {/* Colors Tab */}
      {activeTab === 'colors' && (
        <div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {colors.map((color) => (
              <div
                key={color.value}
                className="relative cursor-pointer aspect-square rounded overflow-hidden border"
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
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="block text-xs text-gray-500 mb-1">Custom Color</label>
            <div className="flex rounded-md overflow-hidden border">
              <input
                type="color"
                value={getSelectedColor().startsWith('#') ? getSelectedColor() : '#FFFFFF'}
                onChange={(e) => handleColorSelect(e.target.value)}
                className="w-10 h-10 p-0 border-0"
              />
              <input
                type="text"
                value={getSelectedColor()}
                onChange={(e) => handleColorSelect(e.target.value)}
                className="flex-1 px-2 py-1 text-sm"
                placeholder="#FFFFFF or rgba(0,0,0,0.5)"
              />
            </div>
          </div>
        </div>
      )}

      {/* Patterns Tab */}
      {activeTab === 'patterns' && (
        <div>
          {/* Option to mix pattern with background color */}
          <div className="mb-3 flex items-center">
            <input
              type="checkbox"
              id="mix-bg"
              checked={useMixedBackground}
              onChange={() => setUseMixedBackground(!useMixedBackground)}
              className="mr-2"
            />
            <label htmlFor="mix-bg" className="text-sm">Mix with background color</label>
          </div>

          {useMixedBackground && (
            <div className="mb-4 p-3 border rounded-md bg-gray-50">
              <label className="block text-xs text-gray-500 mb-1">Background Color</label>
              <div className="flex items-center mb-3">
                <ColorPicker
                  value={patternBackgroundColor}
                  onChange={handlePatternBackgroundColorChange}
                  className="mr-2"
                />
                <span className="text-sm">{patternBackgroundColor}</span>
              </div>

              <label className="block text-xs text-gray-500 mb-1">Pattern Color</label>
              <div className="flex items-center">
                <ColorPicker
                  value={patternColor}
                  onChange={handleCustomPatternChange}
                  className="mr-2"
                />
                <span className="text-sm">{patternColor}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {patterns.map((pattern, index) => (
              <div
                key={index}
                className={`border rounded-md overflow-hidden cursor-pointer transition-all p-1 ${
                  isSelectedPattern(pattern) ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handlePatternSelect(pattern)}
              >
                {renderPatternPreview(pattern)}
                <div className="text-xs font-medium text-center mt-1">
                  {pattern.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 