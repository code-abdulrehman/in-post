import { useState } from 'react';
import { useStore } from '../../../store';
import { 
  MdTextFields,  
  MdColorLens
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
import TabButton from './TabButton';

export default function LeftSidebar({ showTabs, setShowTabs }) {
  const [activeTab, setActiveTab] = useState('elements');
  const [isCollapsed, setIsCollapsed] = useState(false);
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
    <div className={`${showTabs ? "w-72" : "w-12 hover:w-72"} border border-gray-300 bg-white h-[98%] m-2 mt-[6px] rounded-2xl flex flex-col overflow-hidden group transition-all duration-300 `}>
      <div className="p-2 border-b border-gray-300 flex justify-between items-center group">
        <h2 className={` ${showTabs ? "inline" :"hidden group-hover:inline "} text-lg font-medium pl-2`}>Design Tools</h2>
        <div className="flex items-center space-x-1">
          <button 
            className={`text-gray-500 hover:text-gray-700 group-hover:inline transition-all duration-300 ${showTabs ? "" : "hidden group-hover:inline"}`}
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

      <div className={`flex items-start h-full overflow-auto ${showTabs ? "flex-col" : "flex-row"}`}>
        {showTabs ? (
          <div className="bg-indigo-100 border-b border-gray-300 grid grid-cols-5 gap-1 w-full sticky top-0">
            {/* Tab buttons */}
            {renderButtons('hr')}
          </div>
        ) : (
          <div className={` ${showTabs ? "" : "w-full group-hover:max-w-12 group-hover:border-r"} border-gray-300 h-full sticky top-0`}>
            <div className={`${showTabs ? "grid grid-rows-5" : "flex flex-col items-center w-full"} p-0.5 gap-1 w-full `}>
              {renderButtons('vr')}
            </div>
          </div>
        )}

        <div className={`p-4 overflow-y-auto flex-1 ${showTabs ? "w-full block" : "w-0 hidden group-hover:block group-hover:w-auto transition-all duration-300 "}`}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );

  function renderButtons(layoutType) {
    return (
      <>
        <TabButton 
          layoutType={layoutType} 
          icon={RiShapesFill} 
          label="Shapes" 
          tab="elements" 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabButton 
          layoutType={layoutType} 
          icon={MdTextFields} 
          label="Text" 
          tab="text" 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabButton 
          layoutType={layoutType} 
          icon={PiImageSquareDuotone} 
          label="Images" 
          tab="images" 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabButton 
          layoutType={layoutType} 
          icon={BiSolidColorFill} 
          label="Colors" 
          tab="background" 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabButton 
          layoutType={layoutType} 
          icon={LuFullscreen} 
          label="Canvas" 
          tab="canvas" 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </>
    );
  }
} 