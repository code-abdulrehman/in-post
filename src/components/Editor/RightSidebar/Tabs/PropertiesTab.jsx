import { useState, useEffect } from 'react';
import { 
  FiSquare, 
  FiType, 
  FiMaximize, 
  FiDroplet, 
  FiChevronDown, 
  FiChevronUp,
  FiCopy,
  FiTrash,
  FiLock,
  FiMousePointer,
  FiEdit,
  FiSliders,
  FiX
} from 'react-icons/fi';
import { RiFontSizeAi } from "react-icons/ri";
import { FaPen, FaPaintBrush, FaEraser, FaPalette } from 'react-icons/fa';
import ColorPickerWithPalette from '../../../ui/ColorPickerWithPalette';
import TextEnhancerPanel from '../TextEnhancerPanel';
import { useStore } from '../../../../store';

export default function PropertiesTab({ 
  selectedElement, 
  selectedElementId,
  handlePropertyChange,
  handleBorderPropertyChange,
  handleShadowPropertyChange,
  handleFilterPropertyChange,
  handleShapeFillTypeChange,
  togglePropertyGroup,
  activePropertyGroup,
  shapeFillType,
  isAiProcessing,
  enhanceTextWithAI,
  duplicateElement,
  deleteElement,
  addToHistory,
  GOOGLE_FONTS,
  drawingMode,
  handleDrawingPropertyChange
}) {
  const [showFreeDrawingProps, setShowFreeDrawingProps] = useState(false);
  const { disableDrawingMode } = useStore();
  
  // Effect to ensure UI updates when drawing mode changes
  useEffect(() => {
    // Force rerender when drawing mode changes to ensure buttons update
    if (drawingMode.enabled && activePropertyGroup !== 'drawing') {
      togglePropertyGroup('drawing', true);
    }
  }, [drawingMode.tool, drawingMode.enabled]);

  if (!selectedElement && !drawingMode.enabled) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-gray-400">
        <FiMousePointer size={24} className="mb-2" />
        <p className="text-sm text-center">Select an element to edit its properties</p>
      </div>
    );
  }

  // Render drawing properties if in drawing mode
  if (drawingMode.enabled) {
    console.log("Drawing mode is enabled:", drawingMode);
    return (
      <div className="mb-3 border border-gray-200 rounded-md overflow-hidden">
        <button 
          className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100"
          onClick={(e) => {
            // Only toggle if clicked directly on the button or its direct children
            if (e.target === e.currentTarget || 
                e.target.parentElement === e.currentTarget ||
                e.target.parentElement?.parentElement === e.currentTarget) {
              togglePropertyGroup('drawing');
            }
          }}
        >
          <div className="flex items-center">
            <FiEdit className="mr-2 text-gray-600" />
            <span className="text-sm font-medium">Drawing Tools</span>
          </div>
          {activePropertyGroup === 'drawing' ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        
        {activePropertyGroup === 'drawing' && (
          <div className="p-3 border-t border-gray-200">
            {/* Cancel Drawing Button */}
            <div className="mb-4">
              <button 
                onClick={() => disableDrawingMode()}
                className="w-full py-2 px-3 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-md flex items-center justify-center"
              >
                <FiX className="mr-2" /> Exit Drawing Mode
              </button>
            </div>
            
            {/* Current Tool Indicator */}
            <div className="mb-4 bg-indigo-50 p-3 rounded-md border border-indigo-100">
              <h5 className="text-sm font-medium text-indigo-700 mb-1 flex items-center">
                {drawingMode.tool === 'pen' && <FaPen className="mr-2" />}
                {drawingMode.tool === 'brush' && <FaPaintBrush className="mr-2" />}
                {drawingMode.tool === 'marker' && <FiEdit className="mr-2" />}
                {drawingMode.tool === 'pencil' && <FiEdit className="mr-2" />}
                {drawingMode.tool === 'watercolor' && <FaPaintBrush className="mr-2" />}
                {drawingMode.tool === 'dotted' && <FiSliders className="mr-2" />}
                {drawingMode.tool === 'dashed' && <FiSliders className="mr-2" />}
                Active Tool: {drawingMode.tool ? drawingMode.tool.charAt(0).toUpperCase() + drawingMode.tool.slice(1) : 'None'}
              </h5>
              <p className="text-xs text-indigo-600">
                Current tool: {JSON.stringify(drawingMode.tool)}
              </p>
            </div>
            
            {/* Tool Presets */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Drawing Tools
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  className={`p-2 rounded-md border ${drawingMode.tool === 'pen' ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'border-gray-200 hover:bg-gray-50'} flex flex-col items-center`}
                  onClick={() => {
                    handleDrawingPropertyChange('tool', 'pen');
                    handleDrawingPropertyChange('strokeWidth', 1.5);
                    handleDrawingPropertyChange('tension', 0.4);
                    handleDrawingPropertyChange('lineCap', 'round');
                    handleDrawingPropertyChange('lineJoin', 'round');
                    handleDrawingPropertyChange('dash', null);
                    // Force active property group to stay open
                    togglePropertyGroup('drawing', true);
                  }}
                >
                  <FaPen className={`mb-1 ${drawingMode.tool === 'pen' ? 'text-indigo-600' : 'text-gray-600'}`} />
                  <span className={`text-xs text-center ${drawingMode.tool === 'pen' ? 'font-medium text-indigo-700' : ''}`}>Fine Pen</span>
                </button>
                <button 
                  className={`p-2 rounded-md border ${drawingMode.tool === 'brush' ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'border-gray-200 hover:bg-gray-50'} flex flex-col items-center`}
                  onClick={() => {
                    handleDrawingPropertyChange('tool', 'brush');
                    handleDrawingPropertyChange('strokeWidth', 8);
                    handleDrawingPropertyChange('tension', 0.6);
                    handleDrawingPropertyChange('lineCap', 'round');
                    handleDrawingPropertyChange('lineJoin', 'round');
                    handleDrawingPropertyChange('dash', null);
                    // Force active property group to stay open
                    togglePropertyGroup('drawing', true);
                  }}
                >
                  <FaPaintBrush className={`mb-1 ${drawingMode.tool === 'brush' ? 'text-indigo-600' : 'text-gray-600'}`} />
                  <span className={`text-xs text-center ${drawingMode.tool === 'brush' ? 'font-medium text-indigo-700' : ''}`}>Brush</span>
                </button>
                <button 
                  className={`p-2 rounded-md border ${drawingMode.tool === 'marker' ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'border-gray-200 hover:bg-gray-50'} flex flex-col items-center`}
                  onClick={() => {
                    handleDrawingPropertyChange('tool', 'marker');
                    handleDrawingPropertyChange('strokeWidth', 4);
                    handleDrawingPropertyChange('tension', 0.3);
                    handleDrawingPropertyChange('lineCap', 'square');
                    handleDrawingPropertyChange('lineJoin', 'round');
                    handleDrawingPropertyChange('dash', null);
                    // Force active property group to stay open
                    togglePropertyGroup('drawing', true);
                  }}
                >
                  <FiEdit className={`mb-1 ${drawingMode.tool === 'marker' ? 'text-indigo-600' : 'text-gray-600'}`} />
                  <span className={`text-xs text-center ${drawingMode.tool === 'marker' ? 'font-medium text-indigo-700' : ''}`}>Marker</span>
                </button>
                <button 
                  className={`p-2 rounded-md border ${drawingMode.tool === 'pencil' ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'border-gray-200 hover:bg-gray-50'} flex flex-col items-center`}
                  onClick={() => {
                    handleDrawingPropertyChange('tool', 'pencil');
                    handleDrawingPropertyChange('strokeWidth', 1);
                    handleDrawingPropertyChange('tension', 0.2);
                    handleDrawingPropertyChange('lineCap', 'round');
                    handleDrawingPropertyChange('lineJoin', 'round');
                    handleDrawingPropertyChange('dash', null);
                    // Force active property group to stay open
                    togglePropertyGroup('drawing', true);
                  }}
                >
                  <FiEdit className={`mb-1 ${drawingMode.tool === 'pencil' ? 'text-indigo-600' : 'text-gray-600'}`} />
                  <span className={`text-xs text-center ${drawingMode.tool === 'pencil' ? 'font-medium text-indigo-700' : ''}`}>Pencil</span>
                </button>
                <button 
                  className={`p-2 rounded-md border ${drawingMode.tool === 'watercolor' ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'border-gray-200 hover:bg-gray-50'} flex flex-col items-center`}
                  onClick={() => {
                    handleDrawingPropertyChange('tool', 'watercolor');
                    handleDrawingPropertyChange('strokeWidth', 8);
                    handleDrawingPropertyChange('tension', 0.8);
                    handleDrawingPropertyChange('lineCap', 'round');
                    handleDrawingPropertyChange('lineJoin', 'round');
                    handleDrawingPropertyChange('dash', null);
                    // Force active property group to stay open
                    togglePropertyGroup('drawing', true);
                  }}
                >
                  <FaPaintBrush className={`mb-1 ${drawingMode.tool === 'watercolor' ? 'text-indigo-600' : 'text-gray-600'}`} />
                  <span className={`text-xs text-center ${drawingMode.tool === 'watercolor' ? 'font-medium text-indigo-700' : ''}`}>Watercolor</span>
                </button>
                <button 
                  className={`p-2 rounded-md border ${drawingMode.tool === 'dotted' ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'border-gray-200 hover:bg-gray-50'} flex flex-col items-center`}
                  onClick={() => {
                    handleDrawingPropertyChange('tool', 'dotted');
                    handleDrawingPropertyChange('strokeWidth', 2);
                    handleDrawingPropertyChange('tension', 0.5);
                    handleDrawingPropertyChange('lineCap', 'round');
                    handleDrawingPropertyChange('lineJoin', 'round');
                    handleDrawingPropertyChange('dash', [1, 5]);
                    // Force active property group to stay open
                    togglePropertyGroup('drawing', true);
                  }}
                >
                  <FiSliders className={`mb-1 ${drawingMode.tool === 'dotted' ? 'text-indigo-600' : 'text-gray-600'}`} />
                  <span className={`text-xs text-center ${drawingMode.tool === 'dotted' ? 'font-medium text-indigo-700' : ''}`}>Dotted</span>
                </button>
                <button 
                  className={`p-2 rounded-md border ${drawingMode.tool === 'dashed' ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'border-gray-200 hover:bg-gray-50'} flex flex-col items-center`}
                  onClick={() => {
                    handleDrawingPropertyChange('tool', 'dashed');
                    handleDrawingPropertyChange('strokeWidth', 2);
                    handleDrawingPropertyChange('tension', 0.5);
                    handleDrawingPropertyChange('lineCap', 'butt');
                    handleDrawingPropertyChange('lineJoin', 'miter');
                    handleDrawingPropertyChange('dash', [6, 4]);
                    // Force active property group to stay open
                    togglePropertyGroup('drawing', true);
                  }}
                >
                  <FiSliders className={`mb-1 ${drawingMode.tool === 'dashed' ? 'text-indigo-600' : 'text-gray-600'}`} />
                  <span className={`text-xs text-center ${drawingMode.tool === 'dashed' ? 'font-medium text-indigo-700' : ''}`}>Dashed</span>
                </button>
              </div>
            </div>
            
            {/* Drawing Tool Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Line End Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  className={`py-2 px-3 text-center text-sm ${
                    drawingMode.lineCap === 'round' 
                      ? 'bg-indigo-500 text-white ring-2 ring-indigo-200' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  } rounded-md`}
                  onClick={() => handleDrawingPropertyChange('lineCap', 'round')}
                >
                  Round
                </button>
                <button
                  className={`py-2 px-3 text-center text-sm ${
                    drawingMode.lineCap === 'butt' 
                      ? 'bg-indigo-500 text-white ring-2 ring-indigo-200' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  } rounded-md`}
                  onClick={() => handleDrawingPropertyChange('lineCap', 'butt')}
                >
                  Flat
                </button>
                <button
                  className={`py-2 px-3 text-center text-sm ${
                    drawingMode.lineCap === 'square' 
                      ? 'bg-indigo-500 text-white ring-2 ring-indigo-200' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  } rounded-md`}
                  onClick={() => handleDrawingPropertyChange('lineCap', 'square')}
                >
                  Square
                </button>
              </div>
            </div>
            
            {/* Line Style (Dash Pattern) */}
            {(drawingMode.tool === 'dotted' || drawingMode.tool === 'dashed') && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Line Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    className={`py-2 px-3 text-center text-sm ${
                      !drawingMode.dash 
                        ? 'bg-indigo-500 text-white ring-2 ring-indigo-200' 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                    } rounded-md`}
                    onClick={() => handleDrawingPropertyChange('dash', null)}
                  >
                    Solid
                  </button>
                  <button
                    className={`py-2 px-3 text-center text-sm ${
                      JSON.stringify(drawingMode.dash) === JSON.stringify([1, 5]) 
                        ? 'bg-indigo-500 text-white ring-2 ring-indigo-200' 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                    } rounded-md`}
                    onClick={() => handleDrawingPropertyChange('dash', [1, 5])}
                  >
                    Dotted
                  </button>
                  <button
                    className={`py-2 px-3 text-center text-sm ${
                      JSON.stringify(drawingMode.dash) === JSON.stringify([6, 4]) 
                        ? 'bg-indigo-500 text-white ring-2 ring-indigo-200' 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                    } rounded-md`}
                    onClick={() => handleDrawingPropertyChange('dash', [6, 4])}
                  >
                    Dashed
                  </button>
                </div>
              </div>
            )}
            
            {/* Stroke Color */}
            <div className="mb-4">
              <label className="block text-xs text-gray-500 mb-1">
                Stroke Color
              </label>
              <div className="flex items-end">
                <ColorPickerWithPalette
                  value={drawingMode.stroke}
                  onChange={(value) => handleDrawingPropertyChange('stroke', value)}
                  className="mr-2"
                />
                <input
                  type="text"
                  value={drawingMode.stroke}
                  onChange={(e) => handleDrawingPropertyChange('stroke', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                />
              </div>
            </div>
            
            {/* Stroke Width */}
            <div className="mb-4">
              <label className="block text-xs text-gray-500 mb-1">
                Stroke Width: {drawingMode.strokeWidth}px
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={drawingMode.strokeWidth}
                onChange={(e) => handleDrawingPropertyChange('strokeWidth', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs">1px</span>
                <span className="text-xs">{drawingMode.strokeWidth}px</span>
                <span className="text-xs">20px</span>
              </div>
            </div>
            
            {/* Smoothing/Tension for curves */}
            <div className="mb-4">
              <label className="block text-xs text-gray-500 mb-1">
                Smoothing: {(drawingMode.tension || 0.5).toFixed(1)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={drawingMode.tension || 0.5}
                onChange={(e) => handleDrawingPropertyChange('tension', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs">Sharp</span>
                <span className="text-xs">Smooth</span>
              </div>
            </div>

            
            {/* Color Presets */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Presets
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { color: '#000000', width: 2, name: 'Black' },
                  { color: '#FF0000', width: 3, name: 'Red' },
                  { color: '#0000FF', width: 3, name: 'Blue' },
                  { color: '#00CC00', width: 3, name: 'Green' },
                  { color: '#FF9900', width: 3, name: 'Orange' },
                  { color: '#9900FF', width: 3, name: 'Purple' },
                  { color: '#FF00FF', width: 3, name: 'Pink' },
                  { color: '#00CCCC', width: 3, name: 'Cyan' }
                ].map((preset, index) => (
                  <button
                    key={index}
                    className="p-2 rounded-md border border-gray-200 hover:bg-gray-50 flex flex-col items-center"
                    onClick={() => {
                      handleDrawingPropertyChange('stroke', preset.color);
                    }}
                    style={{
                      borderColor: preset.color === drawingMode.stroke ? preset.color : 'rgb(229,231,235)',
                      borderWidth: preset.color === drawingMode.stroke ? '2px' : '1px'
                    }}
                  >
                    <div 
                      className="w-full rounded-sm mb-1"
                      style={{ 
                        backgroundColor: preset.color,
                        height: '12px'
                      }} 
                    />
                    <span className="text-xs text-center">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Thickness Presets */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thickness Presets
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { color: drawingMode.stroke, width: 1, name: 'Fine' },
                  { color: drawingMode.stroke, width: 3, name: 'Small' },
                  { color: drawingMode.stroke, width: 5, name: 'Medium' },
                  { color: drawingMode.stroke, width: 10, name: 'Thick' }
                ].map((preset, index) => (
                  <button
                    key={index}
                    className="p-2 rounded-md border border-gray-200 hover:bg-gray-50 flex flex-col items-center"
                    onClick={() => {
                      handleDrawingPropertyChange('strokeWidth', preset.width);
                    }}
                    style={{
                      borderColor: preset.width === drawingMode.strokeWidth ? '#6366F1' : 'rgb(229,231,235)',
                      borderWidth: preset.width === drawingMode.strokeWidth ? '2px' : '1px',
                      backgroundColor: preset.width === drawingMode.strokeWidth ? '#EEF2FF' : 'white'
                    }}
                  >
                    <div 
                      className="w-full rounded-sm mb-1"
                      style={{ 
                        backgroundColor: preset.color,
                        height: `${Math.min(preset.width * 1.5, 12)}px`
                      }} 
                    />
                    <span className="text-xs text-center">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Instructions */}
            <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-md">
              <h6 className="font-medium mb-1">Gesture Drawing Instructions:</h6>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Select your preferred drawing tool from the options above</li>
                <li>Customize color, thickness, and line style</li>
                <li>Draw on the canvas by clicking and dragging</li>
                <li>Release to complete your drawing</li>
              </ol>
              <p className="mt-2">Your drawing will be added as a new element that you can move, resize, and edit later.</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {selectedElement.locked ? (
        <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-700 flex items-center">
          <FiLock className="mr-2" /> This element is locked. Unlock it in the Layers panel to edit.
        </div>
      ) : (
        <>
          {/* Shape Fill/Outline Toggle - only for shapes */}
          {['rectangle', 'circle', 'triangle', 'star', 'polygon'].includes(selectedElement.type) && (
            <div className="mb-3 border border-gray-200 rounded-md overflow-hidden">
              <button 
                className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100"
                onClick={(e) => {
                  // Only toggle if clicked directly on the button or its direct children
                  if (e.target === e.currentTarget || 
                      e.target.parentElement === e.currentTarget ||
                      e.target.parentElement?.parentElement === e.currentTarget) {
                    togglePropertyGroup('shape');
                  }
                }}
              >
                <div className="flex items-center">
                  <FiSquare className="mr-2 text-gray-600" />
                  <span className="text-sm font-medium">Shape Properties</span>
                </div>
                {activePropertyGroup === 'shape' ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              
              {activePropertyGroup === 'shape' && (
                <div className="p-3 border-t border-gray-200">
                  {/* Shape Style Toggle */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shape Style
                    </label>
                    <div className="flex border border-gray-300 rounded-md overflow-hidden">
                      <button
                        className={`flex-1 py-2 px-3 text-center text-sm ${
                          shapeFillType === 'filled' 
                            ? 'bg-indigo-500 text-white' 
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                        onClick={() => handleShapeFillTypeChange('filled')}
                      >
                        <FiSquare className="inline-block mr-1" style={{fill: shapeFillType === 'filled' ? 'currentColor' : 'none'}} /> Filled
                      </button>
                      <button
                        className={`flex-1 py-2 px-3 text-center text-sm ${
                          shapeFillType === 'outlined' 
                            ? 'bg-indigo-500 text-white' 
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                        onClick={() => handleShapeFillTypeChange('outlined')}
                      >
                        <FiSquare className="inline-block mr-1" style={{ fill: 'none', stroke: 'currentColor' }} /> Outlined
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Choose between filled or outlined shape style
                    </p>
                  </div>
                  
                  {/* Add curved shape options */}
                  {selectedElement.type === 'rectangle' && (
                    <div className="mb-3">
                      <label className="block text-xs text-gray-500 mb-1">
                        Corner Rounding
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={selectedElement.border?.radius || 0}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleBorderPropertyChange('radius', parseInt(e.target.value), e);
                        }}
                        className="w-full"
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs">0</span>
                        <span className="text-xs">{selectedElement.border?.radius || 0}px</span>
                        <span className="text-xs">50px</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Fill/Border Color */}
                  <div className="mb-3">
                    <label className="block text-xs text-gray-500 mb-1">
                      {shapeFillType === 'filled' ? 'Fill Color' : 'Outline Color'}
                    </label>
                    <div className="flex items-end">
                      <ColorPickerWithPalette
                        value={shapeFillType === 'filled' 
                          ? (selectedElement.fill || '#3B82F6')
                          : (selectedElement.border?.color || '#3B82F6')}
                        onChange={(value) => {
                          if (shapeFillType === 'filled') {
                            handlePropertyChange('fill', value);
                          } else {
                            handleBorderPropertyChange('color', value);
                          }
                        }}
                        className="mr-2"
                      />
                      <input
                        type="text"
                        value={shapeFillType === 'filled' 
                          ? (selectedElement.fill || '#3B82F6')
                          : (selectedElement.border?.color || '#3B82F6')}
                        onChange={(e) => {
                          if (shapeFillType === 'filled') {
                            handlePropertyChange('fill', e.target.value);
                          } else {
                            handleBorderPropertyChange('color', e.target.value);
                          }
                        }}
                        className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                      />
                    </div>
                  </div>
                  
                  {/* More shape properties would be here */}
                </div>
              )}
            </div>
          )}
          
          {/* Free Drawing Properties */}
          {selectedElement.type === 'freeDrawing' && (
            <div className="mb-3 border border-gray-200 rounded-md overflow-hidden">
              <button 
                className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100"
                onClick={(e) => {
                  // Only toggle if clicked directly on the button or its direct children
                  if (e.target === e.currentTarget || 
                      e.target.parentElement === e.currentTarget ||
                      e.target.parentElement?.parentElement === e.currentTarget) {
                    togglePropertyGroup('drawing');
                  }
                }}
              >
                <div className="flex items-center">
                  <FiEdit className="mr-2 text-gray-600" />
                  <span className="text-sm font-medium">Drawing Properties</span>
                </div>
                {activePropertyGroup === 'drawing' ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              
              {activePropertyGroup === 'drawing' && (
                <div className="p-3 border-t border-gray-200">
                  {/* Tool Type Indicator */}
                  <div className="mb-4 bg-indigo-50 p-3 rounded-md border border-indigo-100">
                    <h5 className="text-sm font-medium text-indigo-700 mb-1 flex items-center">
                      <FiEdit className="mr-2" />
                      Drawing Style: {selectedElement.tool ? selectedElement.tool.charAt(0).toUpperCase() + selectedElement.tool.slice(1) : 'Free Drawing'}
                    </h5>
                  </div>
                  
                  {/* Stroke Color */}
                  <div className="mb-3">
                    <label className="block text-xs text-gray-500 mb-1">
                      Stroke Color
                    </label>
                    <div className="flex items-end">
                      <ColorPickerWithPalette
                        value={selectedElement.stroke}
                        onChange={(value) => handlePropertyChange('stroke', value)}
                        className="mr-2"
                      />
                      <input
                        type="text"
                        value={selectedElement.stroke}
                        onChange={(e) => handlePropertyChange('stroke', e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                      />
                    </div>
                  </div>
                  
                  {/* Stroke Width */}
                  <div className="mb-3">
                    <label className="block text-xs text-gray-500 mb-1">
                      Stroke Width: {selectedElement.strokeWidth}px
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={selectedElement.strokeWidth}
                      onChange={(e) => handlePropertyChange('strokeWidth', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs">1px</span>
                      <span className="text-xs">{selectedElement.strokeWidth}px</span>
                      <span className="text-xs">20px</span>
                    </div>
                  </div>
                  
                  {/* Smoothing/Tension */}
                  <div className="mb-3">
                    <label className="block text-xs text-gray-500 mb-1">
                      Smoothing: {selectedElement.tension ? selectedElement.tension.toFixed(1) : '0.5'}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={selectedElement.tension || 0.5}
                      onChange={(e) => handlePropertyChange('tension', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs">Sharp</span>
                      <span className="text-xs">Smooth</span>
                    </div>
                  </div>
                  
                  {/* Line Cap Style */}
                  <div className="mb-3">
                    <label className="block text-xs text-gray-500 mb-1">
                      Line End Style
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        className={`py-2 px-3 text-center text-sm ${
                          selectedElement.lineCap === 'round' 
                            ? 'bg-indigo-500 text-white ring-2 ring-indigo-200' 
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                        } rounded-md`}
                        onClick={() => handlePropertyChange('lineCap', 'round')}
                      >
                        Round
                      </button>
                      <button
                        className={`py-2 px-3 text-center text-sm ${
                          selectedElement.lineCap === 'butt' 
                            ? 'bg-indigo-500 text-white ring-2 ring-indigo-200' 
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                        } rounded-md`}
                        onClick={() => handlePropertyChange('lineCap', 'butt')}
                      >
                        Flat
                      </button>
                      <button
                        className={`py-2 px-3 text-center text-sm ${
                          selectedElement.lineCap === 'square' 
                            ? 'bg-indigo-500 text-white ring-2 ring-indigo-200' 
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                        } rounded-md`}
                        onClick={() => handlePropertyChange('lineCap', 'square')}
                      >
                        Square
                      </button>
                    </div>
                  </div>
                  
                  {/* Line Style (Dash Pattern) */}
                  <div className="mb-3">
                    <label className="block text-xs text-gray-500 mb-1">
                      Line Style
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        className={`py-2 px-3 text-center text-sm ${
                          !selectedElement.dash 
                            ? 'bg-indigo-500 text-white ring-2 ring-indigo-200' 
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                        } rounded-md`}
                        onClick={() => handlePropertyChange('dash', null)}
                      >
                        Solid
                      </button>
                      <button
                        className={`py-2 px-3 text-center text-sm ${
                          JSON.stringify(selectedElement.dash) === JSON.stringify([1, 5]) 
                            ? 'bg-indigo-500 text-white ring-2 ring-indigo-200' 
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                        } rounded-md`}
                        onClick={() => handlePropertyChange('dash', [1, 5])}
                      >
                        Dotted
                      </button>
                      <button
                        className={`py-2 px-3 text-center text-sm ${
                          JSON.stringify(selectedElement.dash) === JSON.stringify([6, 4]) 
                            ? 'bg-indigo-500 text-white ring-2 ring-indigo-200' 
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                        } rounded-md`}
                        onClick={() => handlePropertyChange('dash', [6, 4])}
                      >
                        Dashed
                      </button>
                    </div>
                  </div>
                  
                  {/* Quick Style Presets */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quick Styles
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        className="p-2 border border-gray-200 rounded-md hover:bg-gray-50"
                        onClick={() => {
                          handlePropertyChange('strokeWidth', 2);
                          handlePropertyChange('tension', 0.4);
                          handlePropertyChange('lineCap', 'round');
                          handlePropertyChange('lineJoin', 'round');
                          handlePropertyChange('dash', null);
                        }}
                      >
                        <div className="text-center">
                          <FaPen className="mx-auto mb-1 text-gray-700" />
                          <span className="text-xs">Fine Pen</span>
                        </div>
                      </button>
                      <button
                        className="p-2 border border-gray-200 rounded-md hover:bg-gray-50"
                        onClick={() => {
                          handlePropertyChange('strokeWidth', 6);
                          handlePropertyChange('tension', 0.6);
                          handlePropertyChange('lineCap', 'round');
                          handlePropertyChange('lineJoin', 'round');
                          handlePropertyChange('dash', null);
                        }}
                      >
                        <div className="text-center">
                          <FaPaintBrush className="mx-auto mb-1 text-gray-700" />
                          <span className="text-xs">Brush</span>
                        </div>
                      </button>
                      <button
                        className="p-2 border border-gray-200 rounded-md hover:bg-gray-50"
                        onClick={() => {
                          handlePropertyChange('strokeWidth', 1);
                          handlePropertyChange('tension', 0.2);
                          handlePropertyChange('lineCap', 'round');
                          handlePropertyChange('lineJoin', 'round');
                          handlePropertyChange('dash', null);
                        }}
                      >
                        <div className="text-center">
                          <FiEdit className="mx-auto mb-1 text-gray-700" />
                          <span className="text-xs">Pencil</span>
                        </div>
                      </button>
                      <button
                        className="p-2 border border-gray-200 rounded-md hover:bg-gray-50"
                        onClick={() => {
                          handlePropertyChange('strokeWidth', 2);
                          handlePropertyChange('tension', 0.5);
                          handlePropertyChange('lineCap', 'round');
                          handlePropertyChange('lineJoin', 'round');
                          handlePropertyChange('dash', [6, 4]);
                        }}
                      >
                        <div className="text-center">
                          <FiSliders className="mx-auto mb-1 text-gray-700" />
                          <span className="text-xs">Dashed</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Text Element Properties */}
          {selectedElement.type === 'text' && (
            <>
              {/* Content Group */}
              <div className="mb-3 border border-gray-200 rounded-md overflow-hidden">
                <button 
                  className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100"
                  onClick={(e) => {
                    // Only toggle if clicked directly on the button or its direct children
                    if (e.target === e.currentTarget || 
                        e.target.parentElement === e.currentTarget ||
                        e.target.parentElement?.parentElement === e.currentTarget) {
                      togglePropertyGroup('content');
                    }
                  }}
                >
                  <div className="flex items-center">
                    <FiType className="mr-2 text-gray-600" />
                    <span className="text-sm font-medium">Text Content</span>
                  </div>
                  {activePropertyGroup === 'content' ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                
                {activePropertyGroup === 'content' && (
                  <div className="p-3 border-t border-gray-200">
                    <div className="mb-3">
                      <TextEnhancerPanel 
                        value={selectedElement.text}
                        onChange={(e) => handlePropertyChange('text', e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm min-h-8 max-h-40 focus:outline-none"
                        rows={3}
                        enhanceTextWithAI={enhanceTextWithAI}
                        isAiProcessing={isAiProcessing}
                      />
                    </div>
                    
                    {/* Width control */}
                    <div className="mb-3">
                      <label className="block text-xs text-gray-500 mb-1">Text (box) width</label>
                      <div className="flex space-x-2 mb-1">
                        <input
                          type="number"
                          value={Math.round(selectedElement.width || 300)}
                          min={100}
                          max={2000}
                          onChange={(e) => handlePropertyChange('width', parseInt(e.target.value))}
                          className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                        />
                      </div>
                      <div className="flex justify-between gap-1 mt-1">
                        {[
                          { label: 'Narrow', value: 200 },
                          { label: 'Medium', value: 300 },
                          { label: 'Wide', value: 500 },
                          { label: 'Full', value: 800 }
                        ].map(preset => (
                          <button
                            key={preset.value}
                            className={`text-xs py-1 px-1.5 border rounded-md ${
                              Math.abs(selectedElement.width - preset.value) < 10
                                ? 'bg-indigo-50 border-indigo-300 text-indigo-600'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                            onClick={() => handlePropertyChange('width', preset.value)}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Text color */}
                    <div className="mb-2">
                      <label className="block text-xs text-gray-500 mb-1">Text Color</label>
                      <div className="flex items-end">
                        <ColorPickerWithPalette
                          value={selectedElement.fill || '#000000'}
                          onChange={(value) => handlePropertyChange('fill', value)}
                          className="mr-2"
                        />
                        <input
                          type="text"
                          value={selectedElement.fill || '#000000'}
                          onChange={(e) => handlePropertyChange('fill', e.target.value)}
                          className="w-full flex-1 rounded-md border border-gray-300 px-3 py-1 text-sm"
                        />
                      </div>
                    </div>
                    
                    {/* Text alignment */}
                    <div className="mb-2">
                      <label className="block text-xs text-gray-500 mb-1">Text Alignment</label>
                      <select
                        value={selectedElement.align || 'left'}
                        onChange={(e) => handlePropertyChange('align', e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      >
                        <option value="left">Left Aligned</option>
                        <option value="center">Center Aligned</option>
                        <option value="right">Right Aligned</option>
                        <option value="justify">Justified</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Font Properties Group */}
              <div className="mb-3 border border-gray-200 rounded-md overflow-hidden">
                <button 
                  className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100"
                  onClick={(e) => {
                    // Only toggle if clicked directly on the button or its direct children
                    if (e.target === e.currentTarget || 
                        e.target.parentElement === e.currentTarget ||
                        e.target.parentElement?.parentElement === e.currentTarget) {
                      togglePropertyGroup('font');
                    }
                  }}
                >
                  <div className="flex items-center">
                    <RiFontSizeAi className="mr-2 text-gray-600" />
                    <span className="text-sm font-medium">Font Options</span>
                  </div>
                  {activePropertyGroup === 'font' ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                
                {activePropertyGroup === 'font' && (
                  <div className="p-3 border-t border-gray-200">
                    {/* Font family */}
                    <div className="mb-2">
                      <label className="block text-xs text-gray-500 mb-1">Font Family</label>
                      <select
                        value={selectedElement.fontFamily || 'Arial'}
                        onChange={(e) => handlePropertyChange('fontFamily', e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                        style={{ fontFamily: selectedElement.fontFamily || 'Arial' }}
                      >
                        {GOOGLE_FONTS.map(font => (
                          <option 
                            key={font.value} 
                            value={font.value}
                            style={{ fontFamily: font.value }}
                          >
                            {font.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Font size */}
                    <div className="mb-2">
                      <label className="block text-xs text-gray-500 mb-1">Font Size</label>
                      <input
                        type="number"
                        value={selectedElement.fontSize || 24}
                        min={8}
                        max={200}
                        onChange={(e) => handlePropertyChange('fontSize', parseInt(e.target.value))}
                        className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                      />
                    </div>
                    
                    {/* More font properties would be here */}
                  </div>
                )}
              </div>
            </>
          )}
          
          {/* Position and size panel */}
          <div className="mb-3 border border-gray-200 rounded-md overflow-hidden">
            <button 
              className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100"
              onClick={(e) => {
                // Only toggle if clicked directly on the button or its direct children
                if (e.target === e.currentTarget || 
                    e.target.parentElement === e.currentTarget ||
                    e.target.parentElement?.parentElement === e.currentTarget) {
                  togglePropertyGroup('position');
                }
              }}
            >
              <div className="flex items-center">
                <FiMaximize className="mr-2 text-gray-600" />
                <span className="text-sm font-medium">Position & Size</span>
              </div>
              {activePropertyGroup === 'position' ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {activePropertyGroup === 'position' && (
              <div className="p-3 border-t border-gray-200">
                {/* Position controls */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">X Position</label>
                    <input
                      type="number"
                      value={Math.round(selectedElement?.x) || 0}
                      onChange={(e) => handlePropertyChange('x', parseInt(e.target.value))}
                      className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                      disabled={selectedElement?.locked}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Y Position</label>
                    <input
                      type="number"
                      value={Math.round(selectedElement?.y) || 0}
                      onChange={(e) => handlePropertyChange('y', parseInt(e.target.value))}
                      className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                      disabled={selectedElement?.locked}
                    />
                  </div>
                </div>
                
                {/* More position and size controls would be here */}
              </div>
            )}
          </div>
          
          {/* Styling and effects panel */}
          <div className="mb-3 border border-gray-200 rounded-md overflow-hidden">
            <button 
              className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100"
              onClick={(e) => {
                if (e.target === e.currentTarget || 
                    e.target.parentElement === e.currentTarget ||
                    e.target.parentElement?.parentElement === e.currentTarget) {
                  togglePropertyGroup('styling');
                }
              }}
            >
              <div className="flex items-center">
                <FiDroplet className="mr-2 text-gray-600" />
                <span className="text-sm font-medium">Styling & Effects</span>
              </div>
              {activePropertyGroup === 'styling' ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {activePropertyGroup === 'styling' && (
              <div className="p-3 border-t border-gray-200">
                {/* Opacity control */}
                <div className="mb-3">
                  <label className="block text-xs text-gray-500 mb-1">
                    Opacity: {Math.round(((selectedElement.opacity !== undefined ? selectedElement.opacity : 1) * 100))}%
                  </label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={Math.round(((selectedElement.opacity !== undefined ? selectedElement.opacity : 1) * 100))}
                      onChange={(e) => handlePropertyChange('opacity', parseInt(e.target.value) / 100)}
                      className="flex-1 mr-2"
                    />
                    <select
                      value={Math.round(((selectedElement.opacity !== undefined ? selectedElement.opacity : 1) * 100))}
                      onChange={(e) => handlePropertyChange('opacity', parseInt(e.target.value) / 100)}
                      className="w-20 rounded-md border border-gray-300 px-1 py-1 text-sm"
                    >
                      <option value="100">100%</option>
                      <option value="75">75%</option>
                      <option value="50">50%</option>
                      <option value="25">25%</option>
                      <option value="0">0%</option>
                    </select>
                  </div>
                </div>
                {/* More styling controls would be here */}
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-400 mb-1">Element Actions</p>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded flex items-center"
              onClick={() => {
                duplicateElement(selectedElementId);
                addToHistory(`Duplicate ${selectedElement.type}`);
              }}
            >
              <FiCopy className="mr-1" /> Duplicate
            </button>
            <button
              className="px-3 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-700 rounded flex items-center"
              onClick={() => {
                deleteElement(selectedElementId);
                addToHistory(`Delete ${selectedElement.type}`);
              }}
            >
              <FiTrash className="mr-1" /> Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 