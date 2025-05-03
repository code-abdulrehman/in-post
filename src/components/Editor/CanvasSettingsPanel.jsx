import { useState } from 'react';
import { useStore } from '../../store';
import { MdCheck } from 'react-icons/md';

export default function CanvasSettingsPanel() {
  const { 
    canvasSize, 
    setCanvasSize, 
    addToHistory, 
    showGrid, 
    toggleGrid,
    canvasScale,
    setCanvasScale
  } = useStore();
  const [width, setWidth] = useState(canvasSize.width);
  const [height, setHeight] = useState(canvasSize.height);

  const presets = [
    { name: 'Instagram Post', width: 1080, height: 1080 },
    { name: 'Facebook Post', width: 1200, height: 630 },
    { name: 'Twitter Post', width: 1200, height: 675 },
    { name: 'LinkedIn Post', width: 1200, height: 627 },
    { name: 'YouTube Thumbnail', width: 1280, height: 720 },
    { name: 'Instagram Story', width: 1080, height: 1920 },
  ];

  const handleSizeChange = () => {
    if (width > 0 && height > 0 && (width !== canvasSize.width || height !== canvasSize.height)) {
      setCanvasSize({ width, height });
      addToHistory('Change canvas size');
    }
  };

  const handlePresetClick = (preset) => {
    setWidth(preset.width);
    setHeight(preset.height);
    setCanvasSize({ width: preset.width, height: preset.height });
    addToHistory('Change canvas size');
  };

  // Handle zoom change
  const handleZoomChange = (e) => {
    const zoomValue = parseFloat(e.target.value);
    setCanvasScale(zoomValue);
  };

  return (
    <div className="canvas-settings-panel">
      <h3 className="text-sm font-medium mb-3">Canvas Settings</h3>

      <div className="mb-4">
        <label className="block text-xs text-gray-500 mb-1">Canvas Size</label>
        <div className="flex space-x-2">
          <div className="flex-1">
            <input
              type="number"
              min="1"
              max="5000"
              value={width}
              onChange={(e) => setWidth(parseInt(e.target.value))}
              className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
              placeholder="Width"
            />
            <span className="text-xs text-gray-500 mt-1 block">Width (px)</span>
          </div>
          <div className="flex-1">
            <input
              type="number"
              min="1"
              max="5000"
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value))}
              className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
              placeholder="Height"
            />
            <span className="text-xs text-gray-500 mt-1 block">Height (px)</span>
          </div>
        </div>
        <button
          onClick={handleSizeChange}
          className="mt-2 w-full py-1 px-3 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
        >
          Apply Size
        </button>
      </div>

      <div className="mb-4">
        <h4 className="text-xs font-medium mb-2">Common Sizes</h4>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((preset) => (
            <div
              key={`${preset.width}-${preset.height}`}
              className="border rounded-md p-2 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50"
              onClick={() => handlePresetClick(preset)}
            >
              <div 
                className="mx-auto mb-1 bg-gray-100 border border-gray-200"
                style={{
                  width: `${Math.min(50, (preset.width / preset.height) * 30)}px`,
                  height: `${Math.min(40, (preset.height / preset.width) * 30)}px`,
                }}
              ></div>
              <div className="text-xs font-medium">{preset.name}</div>
              <div className="text-xs text-gray-500">{preset.width} × {preset.height}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Zoom Control */}
      <div className="mb-4">
        <h4 className="text-xs font-medium mb-2">Canvas Zoom</h4>
        <div className="mb-1">
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={canvasScale}
            onChange={handleZoomChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>50%</span>
            <span>{Math.round(canvasScale * 100)}%</span>
            <span>200%</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCanvasScale(1)}
            className="flex-1 py-1 px-2 bg-gray-100 rounded-md text-xs hover:bg-gray-200"
          >
            Reset to 100%
          </button>
          <button
            onClick={() => setCanvasScale(Math.max(0.5, canvasScale - 0.1))}
            className="flex-1 py-1 px-2 bg-gray-100 rounded-md text-xs hover:bg-gray-200"
          >
            Zoom Out
          </button>
          <button
            onClick={() => setCanvasScale(Math.min(2, canvasScale + 0.1))}
            className="flex-1 py-1 px-2 bg-gray-100 rounded-md text-xs hover:bg-gray-200"
          >
            Zoom In
          </button>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-xs font-medium mb-2">Display Options</h4>
        <div 
          className="flex items-center justify-between p-2 border rounded-md cursor-pointer hover:bg-gray-50"
          onClick={toggleGrid}
        >
          <span className="text-sm">Show Grid</span>
          <div className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors duration-300 ${showGrid ? 'bg-indigo-600' : 'bg-gray-300'}`}>
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${showGrid ? 'translate-x-5' : 'translate-x-0'}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
} 