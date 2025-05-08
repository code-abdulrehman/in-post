import { useState } from 'react';
import { useStore } from '../../../store';
import { 
  MdSquare, 
  MdCircle, 
  MdChangeHistory, 
  MdTimeline, 
  MdStarRate, 
  MdHexagon,
  MdArrowForward,
  MdStop,
  MdRoundedCorner,
  MdCategory,
  MdStyle,
  MdBrush,
  MdEdit,
  MdGesture,
  MdCreate
} from 'react-icons/md';

import { RiShapesFill } from 'react-icons/ri';
import { FaPen, FaPaintBrush, FaDrawPolygon } from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';

// Only use MdIcons since they're the only ones working properly in canvas
const iconLibrary = MdIcons;

export default function ElementsPanel() {
  const { addElement, addToHistory, setDrawingMode } = useStore();
  const [activeTab, setActiveTab] = useState('shapes');
  const [iconSearch, setIconSearch] = useState('');

  // Simplified shape list with only one version per shape type
  const shapes = [
    { type: 'rectangle', name: 'Rectangle', icon: <MdSquare size={24} />, fill: '#3B82F6', width: 100, height: 80 },
    { type: 'circle', name: 'Circle', icon: <MdCircle size={24} />, fill: '#10B981', radius: 50 },
    { type: 'triangle', name: 'Triangle', icon: <MdChangeHistory size={24} />, fill: '#F59E0B', sides: 3, radius: 50 },
    { type: 'line', name: 'Line', icon: <MdTimeline size={24} />, stroke: '#6366F1', strokeWidth: 4, points: [0, 0, 100, 0] },
    { type: 'star', name: 'Star', icon: <MdStarRate size={24} />, fill: '#F59E0B', numPoints: 5, innerRadius: 30, outerRadius: 50 },
    { type: 'polygon', name: 'Hexagon', icon: <MdHexagon size={24} />, fill: '#8B5CF6', sides: 6, radius: 50 },
    { 
      type: 'rectangle', 
      name: 'Rounded Rectangle', 
      icon: <MdRoundedCorner size={24} />, 
      fill: '#EC4899', 
      width: 100, 
      height: 80, 
      border: { enabled: true, radius: 15, width: 0 }
    },
    { 
      type: 'arrow', 
      name: 'Arrow', 
      icon: <MdArrowForward size={24} />, 
      stroke: '#EF4444', 
      strokeWidth: 4, 
      points: [0, 0, 100, 0, 100, 0, 80, -20, 100, 0, 80, 20], 
      tension: 0
    },
    { 
      type: 'diamond', 
      name: 'Diamond', 
      icon: <MdStop size={24} />, 
      fill: '#0EA5E9', 
      sides: 4, 
      radius: 50, 
      rotation: 45
    },
    // Gesture Drawing Button
    { 
      type: 'gesture', 
      name: 'Gesture Drawing', 
      icon: <MdGesture size={24} />, 
      description: 'Free hand drawing tool',
      isDrawingTool: true,
      drawingTool: {
        type: 'pen',
        name: 'Free Pen',
        stroke: '#000000',
        strokeWidth: 2,
        tension: 0.5,
        lineCap: 'round',
        lineJoin: 'round'
      }
    }
  ];

  // Drawing tools - keep this for functionality but hide from UI
  const drawingTools = [
    { 
      type: 'pen', 
      name: 'Fine Pen', 
      icon: <FaPen size={24} />, 
      description: 'Precise drawing with a fine tip pen',
      stroke: '#000000',
      strokeWidth: 1.5,
      tension: 0.4,
      lineCap: 'round',
      lineJoin: 'round'
    },
    { 
      type: 'brush', 
      name: 'Paint Brush', 
      icon: <FaPaintBrush size={24} />, 
      description: 'Fluid strokes with a paint brush',
      stroke: '#3B82F6',
      strokeWidth: 6,
      tension: 0.6,
      lineCap: 'round',
      lineJoin: 'round'
    },
    { 
      type: 'marker', 
      name: 'Marker', 
      icon: <MdEdit size={24} />, 
      description: 'Bold strokes with a marker',
      stroke: '#EF4444',
      strokeWidth: 4,
      tension: 0.3,
      lineCap: 'square',
      lineJoin: 'round'
    },
    { 
      type: 'pencil', 
      name: 'Pencil', 
      icon: <MdCreate size={24} />, 
      description: 'Soft sketch-like strokes',
      stroke: '#6B7280',
      strokeWidth: 1,
      tension: 0.2,
      lineCap: 'round',
      lineJoin: 'round'
    },
    { 
      type: 'watercolor', 
      name: 'Watercolor', 
      icon: <FaDrawPolygon size={24} />, 
      description: 'Flowing watercolor-like strokes',
      stroke: '#8B5CF6',
      strokeWidth: 8,
      tension: 0.8,
      lineCap: 'round',
      lineJoin: 'round'
    },
    { 
      type: 'dotted', 
      name: 'Dotted Line', 
      icon: <MdTimeline size={24} />, 
      description: 'Create dotted line patterns',
      stroke: '#10B981',
      strokeWidth: 2,
      tension: 0.5,
      lineCap: 'round',
      lineJoin: 'round',
      dash: [1, 5]
    },
    { 
      type: 'dashed', 
      name: 'Dashed Line', 
      icon: <MdTimeline size={24} />, 
      description: 'Create dashed line patterns',
      stroke: '#F59E0B',
      strokeWidth: 2,
      tension: 0.5,
      lineCap: 'butt',
      lineJoin: 'miter',
      dash: [6, 4]
    }
  ];

  // Filter only MD icons based on the search query
  const filteredIcons = Object.entries(iconLibrary).filter(([key, Icon]) =>
    key.toLowerCase().includes(iconSearch.toLowerCase())
  );

  const handleAddShape = (shape) => {
    // Check if this is a drawing tool
    if (shape.isDrawingTool) {
      handleActivateDrawingTool(shape.drawingTool);
      return;
    }
    
    const baseProps = {
      x: 400,
      y: 300,
      rotation: shape.rotation || 0,
    };

    const specificProps = { ...shape };
    delete specificProps.name;
    delete specificProps.icon;
    delete specificProps.description;
    delete specificProps.isDrawingTool;
    delete specificProps.drawingTool;

    // Special handling for arrow
    if (shape.type === 'arrow') {
      specificProps.type = 'line';
      specificProps.lineCap = 'round';
      specificProps.lineJoin = 'round';
    }
    
    // Special handling for diamond
    if (shape.name === 'Diamond') {
      specificProps.type = 'polygon';
    }

    const element = {
      ...baseProps,
      ...specificProps,
    };

    addElement(element);
    addToHistory(`Add ${shape.name}`);
  };

  // Handle adding an icon to the canvas
  const handleAddIcon = (iconName, Icon) => {
    addElement({
      type: 'customIcon',
      iconName,
      x: 400,
      y: 300,
      width: 50,
      height: 50,
      rotation: 0,
      fill: '#000000'
    });
    addToHistory(`Add ${iconName} icon`);
  };

  // Handle activating drawing mode
  const handleActivateDrawingTool = (tool) => {
    // Enable drawing mode in the store
    if (tool.type === 'pen') {
      setDrawingMode({
        enabled: true,
        tool: 'pen',
        stroke: tool.stroke || '#000000',
        strokeWidth: tool.strokeWidth || 1.5,
        tension: tool.tension || 0.4,
        lineCap: tool.lineCap || 'round',
        lineJoin: tool.lineJoin || 'round'
      });
      addToHistory(`Activated ${tool.name} tool`);
      
      // Signal to automatically open the drawing properties tab
      sessionStorage.setItem('open_drawing_panel', 'true');
    } else if (tool.type === 'brush') {
      setDrawingMode({
        enabled: true,
        tool: 'brush',
        stroke: tool.stroke || '#3B82F6',
        strokeWidth: tool.strokeWidth || 6,
        tension: tool.tension || 0.6,
        lineCap: tool.lineCap || 'round',
        lineJoin: tool.lineJoin || 'round'
      });
      addToHistory(`Activated ${tool.name} tool`);
      
      // Signal to automatically open the drawing properties tab
      sessionStorage.setItem('open_drawing_panel', 'true');
    } else if (tool.type === 'marker') {
      setDrawingMode({
        enabled: true,
        tool: 'marker',
        stroke: tool.stroke || '#EF4444',
        strokeWidth: tool.strokeWidth || 4,
        tension: tool.tension || 0.3,
        lineCap: tool.lineCap || 'square',
        lineJoin: tool.lineJoin || 'round'
      });
      addToHistory(`Activated ${tool.name} tool`);
      
      // Signal to automatically open the drawing properties tab
      sessionStorage.setItem('open_drawing_panel', 'true');
    } else if (tool.type === 'pencil') {
      setDrawingMode({
        enabled: true,
        tool: 'pencil',
        stroke: tool.stroke || '#6B7280',
        strokeWidth: tool.strokeWidth || 1,
        tension: tool.tension || 0.2,
        lineCap: tool.lineCap || 'round',
        lineJoin: tool.lineJoin || 'round'
      });
      addToHistory(`Activated ${tool.name} tool`);
      
      // Signal to automatically open the drawing properties tab
      sessionStorage.setItem('open_drawing_panel', 'true');
    } else if (tool.type === 'watercolor') {
      setDrawingMode({
        enabled: true,
        tool: 'watercolor',
        stroke: tool.stroke || '#8B5CF6',
        strokeWidth: tool.strokeWidth || 8,
        tension: tool.tension || 0.8,
        lineCap: tool.lineCap || 'round',
        lineJoin: tool.lineJoin || 'round'
      });
      addToHistory(`Activated ${tool.name} tool`);
      
      // Signal to automatically open the drawing properties tab
      sessionStorage.setItem('open_drawing_panel', 'true');
    } else if (tool.type === 'dotted') {
      setDrawingMode({
        enabled: true,
        tool: 'dotted',
        stroke: tool.stroke || '#10B981',
        strokeWidth: tool.strokeWidth || 2,
        tension: tool.tension || 0.5,
        lineCap: tool.lineCap || 'round',
        lineJoin: tool.lineJoin || 'round',
        dash: tool.dash || [1, 5]
      });
      addToHistory(`Activated ${tool.name} tool`);
      
      // Signal to automatically open the drawing properties tab
      sessionStorage.setItem('open_drawing_panel', 'true');
    } else if (tool.type === 'dashed') {
      setDrawingMode({
        enabled: true,
        tool: 'dashed',
        stroke: tool.stroke || '#F59E0B',
        strokeWidth: tool.strokeWidth || 2,
        tension: tool.tension || 0.5,
        lineCap: tool.lineCap || 'butt',
        lineJoin: tool.lineJoin || 'miter',
        dash: tool.dash || [6, 4]
      });
      addToHistory(`Activated ${tool.name} tool`);
      
      // Signal to automatically open the drawing properties tab
      sessionStorage.setItem('open_drawing_panel', 'true');
    }
  };

  // Group shapes into categories for better organization
  const basicShapes = shapes.filter(shape => 
    ['Rectangle', 'Circle', 'Triangle', 'Hexagon', 'Star', 'Diamond', 'Rounded Rectangle'].includes(shape.name)
  );
  
  const lineShapes = shapes.filter(shape => 
    ['Line', 'Arrow', 'Gesture Drawing'].includes(shape.name)
  );

  return (
    <div className="bg-white">
      <h3 className="font-medium text-sm mb-3">Shapes & Icons</h3>
      
      {/* Subtabs */}
      <div className="flex border-b mb-4">
        <button
          className={`flex-1 py-2 text-sm font-medium ${activeTab === 'shapes' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('shapes')}
        >
          <div className="flex items-center justify-center">
            <RiShapesFill className="mr-1" /> Shapes
          </div>
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${activeTab === 'icons' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('icons')}
        >
          <div className="flex items-center justify-center">
            <MdStyle className="mr-1" /> Icons
          </div>
        </button>
      </div>
      
      {/* Shapes Tab */}
      {activeTab === 'shapes' && (
        <>
          {/* Basic Shapes */}
          <div className="mb-4">
            <h4 className="text-xs text-gray-500 mb-2">Basic Shapes</h4>
            <div className="grid grid-cols-3 gap-2">
              {basicShapes.map((shape) => (
                <button
                  key={shape.name}
                  className="p-2 rounded-md hover:bg-gray-50 border border-gray-200 flex flex-col items-center justify-center"
                  onClick={() => handleAddShape(shape)}
                  title={shape.name}
                >
                  <div className="text-gray-700 mb-1">{shape.icon}</div>
                  <span className="text-[10px] truncate w-full text-center">{shape.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Line Shapes */}
          <div className="mb-4">
            <h4 className="text-xs text-gray-500 mb-2">Lines & Drawing</h4>
            <div className="grid grid-cols-3 gap-2">
              {lineShapes.map((shape) => (
                <button
                  key={shape.name}
                  className={`p-2 rounded-md hover:bg-gray-50 border ${shape.name === 'Gesture Drawing' ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200'} flex flex-col items-center justify-center`}
                  onClick={() => handleAddShape(shape)}
                  title={shape.name}
                >
                  <div className={`${shape.name === 'Gesture Drawing' ? 'text-indigo-600' : 'text-gray-700'} mb-1`}>{shape.icon}</div>
                  <span className="text-xs truncate w-full text-center">{shape.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="text-xs text-gray-500 mt-3 border-t border-gray-100 pt-2">
            Tip: Select a shape after adding to toggle between filled and outlined styles
          </div>
        </>
      )}
      
      {/* Icons Tab */}
      {activeTab === 'icons' && (
        <>          
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search svg icons..."
            value={iconSearch}
            onChange={(e) => setIconSearch(e.target.value)}
            className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm mb-2"
          />
          
          {/* Display filtered icons */}
          <div className="grid grid-cols-3 gap-3 overflow-y-auto">
            {filteredIcons.slice(0, 30).map(([key, Icon]) => (
              <button
                key={key}
                className="p-2 rounded-md hover:bg-gray-50 border border-gray-200 flex flex-col items-center justify-center"
                onClick={() => handleAddIcon(key, Icon)}
                title={key}
              >
                <div className="text-gray-700 mb-1">{<Icon size={24} />}</div>
                <span className="text-[10px] truncate w-full text-center">{key.substring(2)}</span>
              </button>
            ))}
          </div>
          
          {filteredIcons.length > 30 && (
            <div className="text-xs text-gray-500 mt-2 text-center">
              Showing 30 of {filteredIcons.length} results. Refine your search to see more.
            </div>
          )}
          
          {filteredIcons.length === 0 && (
            <div className="text-sm text-gray-500 py-4 text-center">
              No icons found. Try a different search term.
            </div>
          )}
        </>
      )}
    </div>
  );
} 