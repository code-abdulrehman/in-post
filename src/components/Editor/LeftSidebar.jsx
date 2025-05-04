import { useState } from 'react';
import { useStore } from '../../store';
import { 
  MdTextFields,  
} from 'react-icons/md';
import { TbLayoutSidebarLeftCollapseFilled, TbLayoutSidebarRightCollapseFilled } from "react-icons/tb";
import { BsArrowsCollapseVertical, BsArrowsCollapse } from "react-icons/bs";
import { RiShapesFill } from "react-icons/ri";
import { BiSolidColorFill } from "react-icons/bi";
import { PiImageSquareDuotone } from "react-icons/pi";
import { LuFullscreen } from "react-icons/lu";
import ElementsPanel from './ElementsPanel';
import TextPanel from './TextPanel';
import ImagePanel from './ImagePanel';
import BackgroundPanel from './BackgroundPanel';
import CanvasSettingsPanel from './CanvasSettingsPanel';

export default function LeftSidebar({ showTabs, setShowTabs }) {
  const [activeTab, setActiveTab] = useState('elements');
  const [isCollapsed, setIsCollapsed] = useState(false); // New state
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

  if (isCollapsed) {
    return (
      <div className="h-[8%] m-2">
        <div className="p-[9px] px-3 rounded-2xl border border-gray-300 absolute top-16 bg-white border w-72 border-gray-200 flex justify-between items-center rounded-2xl">
        <h2 className="text-lg font-medium ">Design Tools</h2>
        <div className="flex items-center space-x-2">

        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={() => setIsCollapsed(false)}
        >
          <TbLayoutSidebarRightCollapseFilled size={20} />
        </button>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 border border-gray-300 bg-white h-[98%] m-2 mt-[6px] rounded-2xl flex flex-col overflow-hidden">
      <div className="p-2 px-3 border-b border-gray-300 flex justify-between items-center group">
        <h2 className="text-lg font-medium">Design Tools</h2>
        <div className="flex items-center space-x-2">
          <button 
            className="text-gray-500 hover:text-gray-700 group-hover:inline hidden transition-all duration-300"
            onClick={() => setShowTabs(!showTabs)}
          >
            {showTabs ? <BsArrowsCollapseVertical size={20} /> : <BsArrowsCollapse size={20} />}
          </button>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setIsCollapsed(true)}
          >
            <TbLayoutSidebarLeftCollapseFilled size={20} />
          </button>
        </div>
      </div>

      <div className={`flex items-start h-full overflow-y-auto ${showTabs ? "flex-col" : "flex-row"}`}>
        {showTabs ? (
          <div className="bg-indigo-100 border-b border-gray-300 grid grid-cols-5 gap-1 w-full sticky top-0">
            {/* Tab buttons (same as before) */}
            {renderButtons('hr')}
          </div>
        ) : (
          <div className='bg-indigo-100 h-full border-r border-gray-300'>
            <div className="p-1 grid grid-rows-5 gap-1 w-[12%]">
              {renderButtons('vr')}
            </div>
          </div>
        )}

        <div className={`p-4 overflow-hidden ${showTabs ? "w-full" : "w-[88%]"}`}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );

  function renderButtons(layoutType) {
    return (
      <>
        <TabButton layoutType={layoutType} icon={RiShapesFill} label="Shapes" tab="elements" />
        <TabButton layoutType={layoutType} icon={MdTextFields} label="Text" tab="text" />
        <TabButton layoutType={layoutType} icon={PiImageSquareDuotone} label="Images" tab="images" />
        <TabButton layoutType={layoutType} icon={BiSolidColorFill} label="Colors" tab="background" />
        <TabButton layoutType={layoutType} icon={LuFullscreen} label="Canvas" tab="canvas" />
      </>
    );
  }

  function TabButton({ icon: Icon, label, tab, layoutType }) {
    const isActive = activeTab === tab;
    var isHorizontal = layoutType === "hr";
  
    return (
      <button
        className={`flex flex-col items-center justify-center text-xs 
          ${isActive 
            ? isHorizontal 
              ? "bg-white text-indigo-700 border-b-2 border-indigo-600" 
              : "bg-white text-indigo-700 hover:bg-indigo-50 border-none rounded"
            : "hover:bg-indigo-50"
          } ${isHorizontal ? "p-1 gap-[1px]" : "py-4 gap-2"}`}
        onClick={() => setActiveTab(tab)}
      >
        <Icon 
          size={isHorizontal ? 20 : 16} 
          className={`transition-transform ${isHorizontal ? 'rotate-0 mb-0' : 'rotate-90 mb-1'}`} 
        />
        <span className={`${isHorizontal ? 'rotate-0' : 'rotate-90'} transition-transform`}>
          {label}
        </span>
      </button>
    );
  }
  
}
