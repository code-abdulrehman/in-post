import { MdCheck, MdDelete } from 'react-icons/md';
import { FaPlus, FaUser, FaMagic } from 'react-icons/fa';
import { BsPcDisplay } from "react-icons/bs";

const PalettesTab = ({
  colorPalettes,
  currentPaletteId,
  setCurrentPalette,
  handleStartDeletePalette,
  handleColorSelect,
  handleStartCreatePalette,
  handleStartAiPaletteGeneration,
  setActiveTab
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-medium text-gray-700">Available Palettes</h4>
        <div className="flex space-x-1">
          <button
            className="flex items-center text-xs bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-2 py-1 rounded"
            onClick={() => handleStartAiPaletteGeneration(false)}
          >
            <FaMagic size={10} className="mr-1" /> AI
          </button>
          <button
            className="flex items-center text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-2 py-1 rounded"
            onClick={handleStartCreatePalette}
          >
            <FaPlus size={10} className="mr-1" /> New
          </button>
        </div>
      </div>
      
      <div className="space-y-3 min-h-[300px] overflow-y-auto pr-1">
        {Object.keys(colorPalettes).map(paletteId => (
          <div 
            key={paletteId} 
            onClick={() => setCurrentPalette(paletteId)}
            className={`p-3 border rounded-md ${currentPaletteId === paletteId ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'}`}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1">
                
                {(!colorPalettes[paletteId].isCustom && !paletteId.startsWith('ai-')) && (
                  <span className="ml-1 text-xs text-gray-500">
                    <BsPcDisplay size={12} />
                  </span>
                )}

                {(colorPalettes[paletteId].isCustom && !paletteId.startsWith('ai-')) && (
                  <span className="ml-1 text-xs text-gray-500">
                    <FaUser size={12} />
                  </span>
                )}
                {/* Add AI badge for AI-generated palettes */}
                {paletteId.startsWith('ai-') && (
                  <span className="ml-1 text-xs text-purple-400">
                    <FaMagic size={12} />
                  </span>
                )}
                <h4 className="text-sm font-medium text-gray-700 w-20 overflow-hidden text-ellipsis whitespace-nowrap">{colorPalettes[paletteId].name}</h4>
                </div>
                <div className="flex items-center justify-end gap-1" >
               
                  {currentPaletteId === paletteId && (
                   <span className="ml-2 text-xs bg-indigo-200 text-indigo-600 px-1.5 py-0.5 rounded">
                     <MdCheck size={12} />
                   </span>
                 )}
                {colorPalettes[paletteId].isCustom && (
                  <button
                    className="px-2 py-0.5 text-xs bg-red-50 hover:bg-red-100 text-red-600 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartDeletePalette(paletteId);
                    }}
                    title="Delete palette"
                  >
                    <MdDelete size={12} />
                  </button>
                )}
                </div>
              </div>
              
            </div>
            
            <div className="grid grid-cols-5 gap-1 mt-2">
              {colorPalettes[paletteId].colors.slice(0, 10).map((color, idx) => (
                <div
                  key={`${paletteId}-${idx}`}
                  className="w-full aspect-square rounded overflow-hidden border cursor-pointer"
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleColorSelect(color.value);
                    setActiveTab('colors');
                  }}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PalettesTab; 