import { useState } from 'react';
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
  FiMousePointer
} from 'react-icons/fi';
import { RiFontSizeAi } from "react-icons/ri";
import ColorPickerWithPalette from '../../../ui/ColorPickerWithPalette';
import TextEnhancerPanel from '../TextEnhancerPanel';

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
  GOOGLE_FONTS
}) {
  if (!selectedElement) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-gray-400">
        <FiMousePointer size={24} className="mb-2" />
        <p className="text-sm text-center">Select an element to edit its properties</p>
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
      
      {/* Element Actions (always shown) */}
      <div className="mt-4 border-t border-gray-200 pt-4">
        <div className="flex space-x-2">
          <button
            onClick={() => {
              if (!selectedElement.locked) {
                duplicateElement(selectedElementId);
                addToHistory('Duplicate element');
              }
            }}
            className={`flex-1 py-2 px-3 flex items-center justify-center rounded-md text-sm 
              ${selectedElement.locked 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            disabled={selectedElement.locked}
          >
            <FiCopy className="mr-2" /> Duplicate
          </button>
          <button
            onClick={() => {
              if (!selectedElement.locked) {
                deleteElement(selectedElementId);
                addToHistory('Delete element');
              }
            }}
            className={`flex-1 py-2 px-3 flex items-center justify-center rounded-md text-sm 
              ${selectedElement.locked 
                ? 'bg-red-100 text-red-300 cursor-not-allowed' 
                : 'bg-red-500 hover:bg-red-600 text-white'}`}
            disabled={selectedElement.locked}
          >
            <FiTrash className="mr-2" /> Delete
          </button>
        </div>
      </div>
    </>
  );
} 