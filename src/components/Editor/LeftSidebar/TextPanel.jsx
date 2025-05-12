import { useState } from 'react';
import { useStore } from '../../../store';
import { MdTitle, MdSubtitles, MdFormatQuote, MdFormatListBulleted, MdTimeline } from 'react-icons/md';
import { RiGeminiFill } from '@remixicon/react';

export default function TextPanel() {
  const { addElement, addToHistory } = useStore();
  const [customText, setCustomText] = useState('');
  const [textWidth, setTextWidth] = useState(300); // Default width for text elements
  const [isTextPath, setIsTextPath] = useState(false); // Toggle for text path mode
  const [selectedPath, setSelectedPath] = useState('wave'); // Default path

  const textStyles = [
    { 
      name: 'Heading', 
      icon: <MdTitle size={24} />, 
      text: 'Heading Text', 
      fontSize: 32, 
      fontFamily: 'Arial', 
      fontStyle: 'bold',
      fill: '#000000'
    },
    { 
      name: 'Subheading', 
      icon: <MdSubtitles size={24} />, 
      text: 'Subheading Text', 
      fontSize: 24, 
      fontFamily: 'Arial', 
      fontStyle: 'bold',
      fill: '#333333'
    },
    { 
      name: 'Body Text', 
      icon: <MdFormatListBulleted size={24} />, 
      text: 'Body text goes here. You can edit this text and adjust its width in the properties panel.', 
      fontSize: 16, 
      fontFamily: 'Arial',
      fill: '#444444' 
    },
    { 
      name: 'Caption', 
      icon: <MdFormatQuote size={24} />, 
      text: 'Caption text', 
      fontSize: 12, 
      fontFamily: 'Arial', 
      fontStyle: 'italic',
      fill: '#666666'
    },
    { 
      name: 'Accent Text', 
      icon: <MdTitle size={24} />, 
      text: 'Accent Text', 
      fontSize: 28, 
      fontFamily: 'Montserrat', 
      fontWeight: 'bold',
      fill: '#3B82F6' 
    },
    { 
      name: 'Quote', 
      icon: <MdFormatQuote size={24} />, 
      text: '"This is a beautiful quote that stands out on the page."', 
      fontSize: 20, 
      fontFamily: 'Georgia', 
      fontStyle: 'italic',
      fill: '#10B981' 
    },
  ];

  // Predefined path options
  const pathOptions = [
    { 
      name: 'Wave', 
      value: 'wave',
      data: 'M10,90 C100,30 200,90 290,90' 
    },
    { 
      name: 'Arc', 
      value: 'arc',
      data: 'M10,90 Q150,10 290,90' 
    },
    { 
      name: 'Circle', 
      value: 'circle',
      data: 'M150,25 A45,45 0 1,1 150,115 A45,45 0 1,1 150,25' 
    },
    { 
      name: 'Square', 
      value: 'square',
      data: 'M50,25 L250,25 L250,115 L50,115 Z' 
    },
    { 
      name: 'Triangle', 
      value: 'triangle',
      data: 'M50,100 L150,30 L250,100 Z' 
    },
    { 
      name: 'S-Curve', 
      value: 'scurve',
      data: 'M10,90 C50,10 150,150 290,70' 
    },
    { 
      name: 'ZigZag', 
      value: 'zigzag',
      data: 'M10,90 L50,50 L90,90 L130,50 L170,90 L210,50 L250,90 L290,50' 
    },
    { 
      name: 'Heart', 
      value: 'heart',
      data: 'M150,30 C120,10 80,30 60,70 C40,110 80,130 150,170 C220,130 260,110 240,70 C220,30 180,10 150,30' 
    },
    { 
      name: 'Spiral', 
      value: 'spiral',
      data: 'M150,70 C120,70 120,50 150,50 C180,50 180,30 150,30 C120,30 90,50 90,70 C90,100 120,120 150,120 C190,120 210,90 210,70 C210,40 180,20 150,20' 
    },
    { 
      name: 'Infinity', 
      value: 'infinity',
      data: 'M50,70 C50,40 80,40 100,70 C120,100 150,100 170,70 C190,40 220,40 220,70 C220,100 190,100 170,70 C150,40 120,40 100,70 C80,100 50,100 50,70' 
    }
  ];

  const handleAddText = (style) => {
    if (isTextPath) {
      // Add text path
      const selectedPathData = pathOptions.find(p => p.value === selectedPath)?.data || pathOptions[0].data;
      
      addElement({
        type: 'textPath',
        text: style.text,
        x: 400,
        y: 300,
        fontSize: style.fontSize,
        fontFamily: style.fontFamily,
        fontStyle: style.fontStyle,
        fill: style.fill,
        pathData: selectedPathData,
        rotation: 0
      });
      addToHistory('Add curved text');
    } else {
      // Add regular text
      addElement({
        type: 'text',
        text: style.text,
        x: 400,
        y: 300,
        fontSize: style.fontSize,
        fontFamily: style.fontFamily,
        fontStyle: style.fontStyle,
        fill: style.fill,
        width: textWidth, // Use the selected width
        rotation: 0,
        align: 'center'
      });
      addToHistory('Add text');
    }
  };

  const handleAddCustomText = () => {
    if (!customText.trim()) return;
    
    if (isTextPath) {
      // Add custom text path
      const selectedPathData = pathOptions.find(p => p.value === selectedPath)?.data || pathOptions[0].data;
      
      addElement({
        type: 'textPath',
        text: customText,
        x: 400,
        y: 300,
        fontSize: 18,
        fontFamily: 'Arial',
        fill: '#000000',
        pathData: selectedPathData,
        rotation: 0
      });
      
      addToHistory('Add custom curved text');
    } else {
      // Add regular custom text
      addElement({
        type: 'text',
        text: customText,
        x: 400,
        y: 300,
        fontSize: 18,
        fontFamily: 'Arial',
        fill: '#000000',
        width: textWidth, // Use the selected width
        rotation: 0,
        align: 'center'
      });
      
      addToHistory('Add custom text');
    }
    
    setCustomText('');
  };

  const handleWidthChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setTextWidth(value);
    }
  };

  return (
    <div className="text-panel">
      <h3 className="text-sm font-medium mb-3">Add Text</h3>
      
      {/* Text Mode Toggle */}
      <div className="mb-3">
        <div className="flex border border-gray-300 rounded-md overflow-hidden">
          <button
            className={`flex-1 p-2 text-center text-sm ${
              !isTextPath 
                ? 'bg-indigo-500 text-white' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setIsTextPath(false)}
          >
            Regular
          </button>
          <button
            className={`flex-1 p-2 text-center text-sm ${
              isTextPath 
                ? 'bg-indigo-500 text-white' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setIsTextPath(true)}
          >
            <MdTimeline className="inline-block mr-1" /> Curved
          </button>
        </div>
      </div>
      
      
      {/* Text style presets */}
      <div className="space-y-2">
        <div className="text-xs text-gray-500 mb-1">Text Style Presets</div>
        {textStyles.map((style, index) => (
          <div 
            key={index}
            className="flex items-center p-2 border rounded-md cursor-pointer hover:bg-gray-50 hover:border-indigo-300"
            onClick={() => handleAddText(style)}
          >
            <div className="text-gray-700 mr-3">{style.icon}</div>
            <div className="flex-1">
              <div 
                className="text-sm"
                style={{ 
                  fontWeight: style.fontStyle === 'bold' ? 'bold' : 'normal',
                  fontStyle: style.fontStyle === 'italic' ? 'italic' : 'normal',
                  fontSize: `${style.fontSize * 0.75}px`,
                  color: style.fill
                }}
              >
                {style.name}
              </div>
              <div className="text-xs text-gray-500">{style.fontSize}px {style.fontFamily}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 