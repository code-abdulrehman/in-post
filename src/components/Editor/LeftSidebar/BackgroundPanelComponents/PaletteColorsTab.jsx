import { MdCheck, MdAdd, MdDelete } from 'react-icons/md';
import { FaMagic } from 'react-icons/fa';

const PaletteColorsTab = ({
  colorPalettes,
  currentPaletteId,
  currentPaletteColors,
  isCustomPalette,
  getSelectedColor,
  handleColorSelect,
  handleStartDeleteColor,
  handleStartAiPaletteGeneration,
  handleAddToPalette,
  newColor,
  setNewColor,
  bgOpacity,
  handleBgOpacityChange,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2 gap-2">
        <h4 className="text-sm font-medium text-gray-700 w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {colorPalettes[currentPaletteId]?.name || 'Colors'}
        </h4>
        <span className="text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded">
          Active
        </span>
      </div>
      
      {/* AI Palette Generation Button */}
      <div className="mb-3 p-2 border border-dashed border-purple-300 rounded-md bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaMagic className="mr-2 text-purple-500" size={14} />
            <span className="text-xs font-medium text-purple-700">AI Color Magic</span>
          </div>
          <div className="flex space-x-1">
            <button
              className="flex items-center text-xs bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-2 py-1 rounded shadow-sm"
              onClick={() => handleStartAiPaletteGeneration(false)}
            >
              <FaMagic size={8} className="mr-1 animate-pulse" /> Generate
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {currentPaletteColors.length > 0 ? (
          currentPaletteColors.slice(0, 12).map((color, index) => (
            <div
              key={`${color.value}-${index}`}
              className="relative cursor-pointer aspect-square rounded overflow-hidden border group"
              onClick={() => handleColorSelect(color.value)}
              title={color.name}
            >
              <div 
                className="w-full h-full"
                style={{ backgroundColor: color.value }}
              ></div>
              {getSelectedColor() === color.value && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <MdCheck 
                    size={16} 
                    className={color.value === '#FFFFFF' || color.value === '#F3F4F6' || color.value.includes('rgba') ? 'text-gray-800' : 'text-white'} 
                  />
                </div>
              )}
              {isCustomPalette && (
                <div className="absolute top-0 right-0 hidden group-hover:block">
                  <button
                    className="p-1 bg-red-500 text-white rounded-bl"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartDeleteColor(currentPaletteId, index);
                    }}
                  >
                    <MdDelete size={12} />
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-4 text-center py-4 text-sm text-gray-500 border rounded">
            No colors in this palette
          </div>
        )}
      </div>

      {isCustomPalette && (
        <div className="mb-4 p-2 border border-gray-200 rounded-md bg-gray-50">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Quick Add to Palette</h4>
          <div className="flex items-center">
            <input 
              type="color" 
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
            />
            <span className="mx-1 text-xs text-gray-500 flex-1">
              {newColor}
            </span>
            <button
              className="px-1 py-1 text-xs bg-indigo-500 hover:bg-indigo-600 text-white rounded flex items-center"
              onClick={() => handleAddToPalette(newColor)}
            >
              <MdAdd size={14} className="mr-1" /> Add to Palette
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 mb-4">
        <label className="block text-xs text-gray-500 mb-1">
          Background Opacity: {bgOpacity}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={bgOpacity}
          onChange={handleBgOpacityChange}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default PaletteColorsTab; 