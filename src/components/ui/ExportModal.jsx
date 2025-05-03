import { useState, useRef } from 'react';
import { useStore } from '../../store';
import { MdClose, MdDownload, MdImage, MdPhotoLibrary, MdCode, } from 'react-icons/md';
import { FaCode } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function ExportModal({ onClose }) {
  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState(1);
  const [scale, setScale] = useState(2);
  const [loading, setLoading] = useState(false);
  const { elements, canvasSize, canvasBackground, currentProjectId } = useStore();
  const stageRef = useRef(null);

  const formats = [
    { id: 'png', name: 'PNG', icon: <MdImage />, description: 'Best for images with transparency' },
    { id: 'jpg', name: 'JPG', icon: <MdPhotoLibrary />, description: 'Smaller file size, no transparency' },
    { id: 'webp', name: 'WebP', icon: <MdPhotoLibrary />, description: 'Modern format with good compression' },
    { id: 'inpost.json', name: 'inPost Project', icon: <FaCode />, description: 'Save project to edit later' },
  ];

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

      // Add watermark text as a temporary node for export
      const watermark = new window.Konva.Text({
        x: canvasSize.width - 10,
        y: canvasSize.height - 10,
        text: 'Powered by inPost',
        fontSize: 12,
        fontFamily: 'Arial',
        fill: 'rgba(0,0,0,0.5)',
        align: 'right',
        verticalAlign: 'bottom',
        opacity: 0.75
      });
      
      // Adjust anchor point to bottom right
      watermark.offsetX(watermark.width());
      watermark.offsetY(watermark.height());
      
      // Add watermark to layer
      layer.add(watermark);
      layer.draw();

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
      
      // Clean up the temporary watermark
      watermark.destroy();
      
      // Clean up the temporary background if we created one
      if (needsTempBackground && backgroundRect) {
        backgroundRect.destroy();
      }
      
      layer.draw();
      
      toast.success(`Exported as ${format.toUpperCase()}`);
      onClose();
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Failed to export: ' + err.message);
    } finally {
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
          {(['png', 'jpg', 'webp'].includes(format)) && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quality {format === 'png' ? '(Scale)' : ''}
                </label>
                <input
                  type="range"
                  min={format === 'png' ? 1 : 0.1}
                  max={format === 'png' ? 4 : 1}
                  step={format === 'png' ? 0.5 : 0.1}
                  value={format === 'png' ? scale : quality}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (format === 'png') {
                      setScale(val);
                    } else {
                      setQuality(val);
                    }
                  }}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{format === 'png' ? 'Original' : 'Lower quality'}</span>
                  <span>
                    {format === 'png' 
                      ? `${scale}x (${canvasSize.width * scale} × ${canvasSize.height * scale}px)` 
                      : 'Best quality'}
                  </span>
                </div>
              </div>
              
              {/* Watermark notice */}
              <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                <p>Exported images will include "Powered by inPost" watermark in the bottom-right corner.</p>
              </div>
            </>
          )}
          
          <div className="border-t pt-4 mt-4 flex justify-end">
            <button 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleExport}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exporting...
                </span>
              ) : (
                <span className="flex items-center">
                  <MdDownload className="mr-1" />
                  Export
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 