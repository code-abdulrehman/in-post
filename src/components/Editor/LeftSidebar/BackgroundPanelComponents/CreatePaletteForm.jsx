import { FaPlus } from 'react-icons/fa';

const CreatePaletteForm = ({
  newPaletteName,
  setNewPaletteName,
  getSelectedColor,
  handleCancelCreatePalette,
  handleSavePalette
}) => {
  return (
    <div>
      <div className="mb-3">
        <label className="block text-xs text-gray-500 mb-1">Palette Name</label>
        <input
          type="text"
          value={newPaletteName}
          onChange={(e) => setNewPaletteName(e.target.value)}
          className="w-full px-3 py-1 text-sm border rounded"
          placeholder="My Custom Palette"
        />
      </div>
      
      <div className="mb-3">
        <div className="p-2 bg-gray-50 rounded text-xs text-gray-600 border">
          <div className="flex items-center">
            <FaPlus size={10} className="mr-1 text-indigo-600" /> 
            <span>New palette will be created with your current selected color</span>
          </div>
          <div className="flex items-center mt-2">
            <div 
              className="w-5 h-5 rounded border mr-2"
              style={{ backgroundColor: getSelectedColor() }}
            ></div>
            <span>Selected color: {getSelectedColor()}</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 mt-4">
        <button
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded"
          onClick={handleCancelCreatePalette}
        >
          Cancel
        </button>
        <button
          className="px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded"
          onClick={handleSavePalette}
          disabled={!newPaletteName.trim()}
        >
          Create Palette
        </button>
      </div>
    </div>
  );
};

export default CreatePaletteForm;
