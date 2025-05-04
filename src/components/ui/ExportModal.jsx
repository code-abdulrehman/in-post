import { useState, useRef } from 'react';
import { useStore } from '../../store';
import { MdClose, MdDownload, MdImage, MdPhotoLibrary, MdCode } from 'react-icons/md';
import { FaCode } from 'react-icons/fa';
import { FiEdit, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function ExportModal({ onClose }) {
  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState(1);
  const [scale, setScale] = useState(2);
  const [loading, setLoading] = useState(false);
  const [includeWatermark, setIncludeWatermark] = useState(true);
  const [watermarkText, setWatermarkText] = useState('Powered by inPost');
  const [editingWatermarkText, setEditingWatermarkText] = useState(false);
  const { elements, canvasSize, canvasBackground, currentProjectId } = useStore();
  const stageRef = useRef(null);

  const formats = [
    { id: 'png', name: 'PNG', icon: <MdImage />, description: 'Best for images with transparency' },
    { id: 'jpg', name: 'JPG', icon: <MdPhotoLibrary />, description: 'Smaller file size, no transparency' },
    { id: 'webp', name: 'WebP', icon: <MdPhotoLibrary />, description: 'Modern format with good compression' },
    { id: 'inpost.json', name: 'inPost Project', icon: <FaCode />, description: 'Save project to edit later' },
  ];

  // Get position coordinates for watermark
  const getWatermarkCoordinates = () => {
    const padding = 10; // padding from edges
    return { 
      x: canvasSize.width - padding, 
      y: canvasSize.height - padding, 
      align: 'right', 
      verticalAlign: 'bottom' 
    };
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      
      // Handle inPost project file export
      if (format === 'inpost.json') {
        exportInPostProject();
        return;
      }
      
      // Get the Konva stage instance
      const stage = window.konvaStage;
      
      if (!stage) {
        toast.error('Could not access the canvas for export');
        setLoading(false);
        return;
      }

      // First ensure background is properly rendered for export
      const layer = stage.findOne('Layer');
      let backgroundRect = layer.findOne('#background-rect');
      
      // If no background rect exists and we need one, create it temporarily
      const needsTempBackground = !backgroundRect && (
        typeof canvasBackground === 'string' || 
        (typeof canvasBackground === 'object' && canvasBackground.type === 'pattern')
      );
      
      if (needsTempBackground) {
        backgroundRect = new window.Konva.Rect({
          id: 'background-rect',
          x: 0,
          y: 0,
          width: canvasSize.width,
          height: canvasSize.height,
          fill: typeof canvasBackground === 'string' 
            ? canvasBackground 
            : '#ffffff'
        });
        layer.add(backgroundRect);
        backgroundRect.moveToBottom();
        layer.draw();
      }

      // Add watermark text as a temporary node for export (only if includeWatermark is true)
      let watermark = null;
      if (includeWatermark && watermarkText.trim()) {
        const position = getWatermarkCoordinates();
        
        watermark = new window.Konva.Text({
          x: position.x,
          y: position.y,
          text: watermarkText.trim(),
          fontSize: 12,
          fontFamily: 'Arial',
          fill: 'rgba(0,0,0,0.75)',
          align: position.align,
          verticalAlign: position.verticalAlign,
          opacity: 0.75
        });
        
        // Adjust anchor point based on position
        if (position.align === 'right') {
          watermark.offsetX(watermark.width());
        }
        
        if (position.verticalAlign === 'bottom') {
          watermark.offsetY(watermark.height());
        }
        
        // Add watermark to layer
        layer.add(watermark);
        layer.draw();
      }

      let dataUrl;
      let filename = `design.${format}`;
      
      // For raster formats (PNG, JPG, WebP)
      dataUrl = stage.toDataURL({ 
        pixelRatio: scale,
        mimeType: `image/${format}`,
        quality: quality
      });
      
      // Create download link
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up - remove the temporary background if it was added
      if (needsTempBackground && backgroundRect) {
        backgroundRect.remove();
      }
      
      // Remove watermark if it was added
      if (watermark) {
        watermark.remove();
      }
      
      layer.draw();
      setLoading(false);
      onClose();
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Failed to export: ' + err.message);
      setLoading(false);
    }
  };
  
  // Export inPost project file
  const exportInPostProject = () => {
    try {
      const { elements, canvasSize, canvasBackground } = useStore.getState();
      
      // Create project data
      const projectData = {
        version: '1.0.0',
        name: 'inPost Design',
        createdAt: new Date().toISOString(),
        canvasSize,
        canvasBackground,
        elements
      };
      
      // Convert to JSON string
      const jsonString = JSON.stringify(projectData, null, 2);
      
      // Create and download file
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'design.inpost.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      toast.success('Exported as inPost project file');
      onClose();
    } catch (err) {
      console.error('Project export error:', err);
      toast.error('Failed to export project: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle save watermark text after editing
  const handleSaveWatermarkText = () => {
    setEditingWatermarkText(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Export Design</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <MdClose size={24} />
          </button>
        </div>
        
        <div className="p-4">
          <h3 className="font-medium mb-3">Choose Format</h3>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            {formats.map((item) => (
              <div 
                key={item.id}
                className={`border rounded-md p-3 cursor-pointer transition-all ${
                  format === item.id 
                    ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-300' 
                    : 'hover:border-gray-300'
                }`}
                onClick={() => setFormat(item.id)}
              >
                <div className="flex items-center mb-1">
                  <div className={`text-xl ${format === item.id ? 'text-indigo-600' : 'text-gray-500'}`}>
                    {item.icon}
                  </div>
                  <div className="font-medium ml-2">{item.name}</div>
                </div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            ))}
          </div>
          
          {/* Options for raster formats */}
          {format !== 'inpost.json' && (
            <>
              <h3 className="font-medium mb-3">Options</h3>
              
              {/* Quality slider - only for JPG and WebP */}
              {(format === 'jpg' || format === 'webp') && (
                <div className="mb-4">
                  <label className="block text-sm text-gray-700 mb-1">
                    Quality: {Math.round(quality * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}

              {/* Scale slider */}
              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-1">
                  Scale: {scale}x
                </label>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="0.5"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Higher scale = larger file but better quality
                </p>
              </div>
              
              {/* Watermark section */}
              <div className="mb-4 border border-gray-200 rounded-md overflow-y-auto bg-white">
                <div className="bg-gray-50 p-2 flex justify-between items-center">
                  <h3 className="font-medium text-sm">Watermark</h3>
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={includeWatermark}
                      onChange={() => setIncludeWatermark(!includeWatermark)}
                      id="watermark-toggle"
                    />
                    <label htmlFor="watermark-toggle" className="flex items-center cursor-pointer">
                      <div className="relative w-8 h-4">
                        <div className={`block w-8 h-4 rounded-full ${includeWatermark ? 'bg-indigo-400' : 'bg-gray-300'}`}></div>
                        <div className={`absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform ${includeWatermark ? 'transform translate-x-4' : ''}`}></div>
                      </div>
                    </label>
                  </div>
                </div>
                
                {includeWatermark && (
                  <div className="p-3">
                    {/* Watermark text with edit mode */}
                    <div className="mb-3">
                      {editingWatermarkText ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={watermarkText}
                            onChange={(e) => setWatermarkText(e.target.value)}
                            className="flex-grow rounded-md border border-gray-300 px-2 py-1 text-sm"
                            autoFocus
                          />
                          <button 
                            className="ml-2 text-gray-500 hover:text-green-600" 
                            onClick={handleSaveWatermarkText}
                          >
                            <FiCheck size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 truncate max-w-[80%]">
                            {watermarkText || 'Powered by inPost'}
                          </span>
                          <button 
                            className="text-gray-500 hover:text-indigo-600"
                            onClick={() => setEditingWatermarkText(true)}
                          >
                            <FiEdit size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 mr-2"
          >
            Cancel
          </button>
          
          <button
            onClick={handleExport}
            disabled={loading}
            className={`px-4 py-2 rounded-md flex items-center ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {loading ? 'Exporting...' : (
              <>
                <MdDownload className="mr-1" /> Export {format.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 