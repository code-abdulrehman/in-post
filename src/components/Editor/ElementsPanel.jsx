import { useStore } from '../../store';
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
} from 'react-icons/md';

export default function ElementsPanel() {
  const { addElement, addToHistory } = useStore();

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
    }
  ];

  const handleAddShape = (shape) => {
    const baseProps = {
      x: 400,
      y: 300,
      rotation: shape.rotation || 0,
    };

    const specificProps = { ...shape };
    delete specificProps.name;
    delete specificProps.icon;

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

  // Group shapes into categories for better organization
  const basicShapes = shapes.filter(shape => 
    ['Rectangle', 'Circle', 'Triangle', 'Hexagon', 'Star', 'Diamond', 'Rounded Rectangle'].includes(shape.name)
  );
  
  const lineShapes = shapes.filter(shape => 
    ['Line', 'Arrow'].includes(shape.name)
  );

  return (
    <div className="bg-white border-b border-gray-200">
      <h3 className="font-medium text-sm mb-3">Shapes</h3>
      
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
              <span className="text-xs truncate w-full text-center">{shape.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Line Shapes */}
      <div className="mb-4">
        <h4 className="text-xs text-gray-500 mb-2">Lines & Connectors</h4>
        <div className="grid grid-cols-3 gap-2">
          {lineShapes.map((shape) => (
            <button
              key={shape.name}
              className="p-2 rounded-md hover:bg-gray-50 border border-gray-200 flex flex-col items-center justify-center"
              onClick={() => handleAddShape(shape)}
              title={shape.name}
            >
              <div className="text-gray-700 mb-1">{shape.icon}</div>
              <span className="text-xs truncate w-full text-center">{shape.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="text-xs text-gray-500 mt-3 border-t border-gray-100 pt-2">
        Tip: Select a shape after adding to toggle between filled and outlined styles
      </div>
    </div>
  );
} 