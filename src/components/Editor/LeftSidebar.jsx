import { useState } from 'react';
import { useStore } from '../../store';
import { 
  MdAddCircle, 
  MdTextFields, 
  MdImage, 
  MdColorLens, 
  MdToggleOff, 
  MdToggleOn
} from 'react-icons/md';
import ElementsPanel from './ElementsPanel';
import TextPanel from './TextPanel';
import ImagePanel from './ImagePanel';
import BackgroundPanel from './BackgroundPanel';
import CanvasSettingsPanel from './CanvasSettingsPanel';
import ColorPicker from '../ui/ColorPicker';

export default function LeftSidebar({ showTabs, setShowTabs }) {
  const [activeTab, setActiveTab] = useState('elements');
  const { canvasBackground } = useStore();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'elements':
        return <ElementsPanel />;
      case 'text':
        return <TextPanel />;
      case 'images':
        return <ImagePanel />;
      case 'background':
        return <BackgroundPanel />;
      case 'canvas':
        return <CanvasSettingsPanel />;
      default:
        return <ElementsPanel />;
    }
  };

  return (
    <>
      <div className="w-64 border-r border-gray-200 bg-white h-full flex flex-col">
        <div className="p-3 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium">Design Tools</h2>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setShowTabs(!showTabs)}
          >
            {showTabs ? <MdToggleOn size={24} /> : <MdToggleOff size={24} />}
          </button>
        </div>
        
        {showTabs ? (
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-2 text-sm font-medium ${activeTab === 'elements' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('elements')}
            >
              Elements
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium ${activeTab === 'text' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('text')}
            >
              Text
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium ${activeTab === 'images' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('images')}
            >
              Images
            </button>
          </div>
        ) : (
          <div className="bg-gray-50 p-2 grid grid-cols-5 gap-1">
            <button
              className={`p-2 rounded flex flex-col items-center justify-center text-xs ${activeTab === 'elements' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveTab('elements')}
            >
              <MdAddCircle size={20} className="mb-1" />
              <span>Add</span>
            </button>
            <button
              className={`p-2 rounded flex flex-col items-center justify-center text-xs ${activeTab === 'text' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveTab('text')}
            >
              <MdTextFields size={20} className="mb-1" />
              <span>Text</span>
            </button>
            <button
              className={`p-2 rounded flex flex-col items-center justify-center text-xs ${activeTab === 'images' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveTab('images')}
            >
              <MdImage size={20} className="mb-1" />
              <span>Images</span>
            </button>
            <button
              className={`p-2 rounded flex flex-col items-center justify-center text-xs ${activeTab === 'background' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveTab('background')}
            >
              <MdColorLens size={20} className="mb-1" />
              <span>BG</span>
            </button>
            <button
              className={`p-2 rounded flex flex-col items-center justify-center text-xs ${activeTab === 'canvas' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveTab('canvas')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
              </svg>
              <span>Canvas</span>
            </button>
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto p-4">
          {renderTabContent()}
        </div>
      </div>
    </>
  );
} 