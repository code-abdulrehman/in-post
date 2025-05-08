import { FaMagic } from 'react-icons/fa';
import { IoMdRefresh } from 'react-icons/io';

const AIPaletteDialog = ({
  aiPrompt,
  setAiPrompt,
  isGeneratingPalette,
  useCurrentBackground,
  getSelectedColor,
  generateRandomPrompt,
  handleGenerateAiPalette,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <FaMagic className="mr-2 text-purple-500" /> Generate AI Background Palette
        </h3>
        
        {useCurrentBackground && (
          <div className="mb-4 p-3 border-l-4 border-indigo-500 bg-indigo-50 rounded">
            <div className="flex items-center mb-2">
              <div 
                className="w-6 h-6 mr-2 rounded border border-gray-300" 
                style={{ backgroundColor: getSelectedColor() }}
              ></div>
              <p className="text-sm font-medium text-indigo-700">New palette will be created with your current background color</p>
            </div>
            <p className="text-xs text-indigo-600">
              The AI will create a harmonious palette that includes this color
            </p>
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-2">
            Describe the color palette you want:
          </label>
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded min-h-[100px] max-h-[150px] overflow-y-auto focus:outline-none"
            placeholder="e.g. Sunset over the ocean, Autumn forest colors, Corporate professional palette"
            disabled={isGeneratingPalette}
          />
          <div className="flex justify-between mt-2">
            <div className="text-xs text-gray-500">
              Try to be descriptive for best results
            </div>
            <button
              className="text-xs text-purple-600 hover:text-purple-800 flex items-center"
              onClick={generateRandomPrompt}
              disabled={isGeneratingPalette}
            >
              <IoMdRefresh className="mr-1" /> Random idea
            </button>
          </div>
        </div>
        
        <div className="p-3 border border-gray-200 rounded-md mb-4 bg-gray-50">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Suggested Prompts:</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              "Modern website design",
              "Luxury brand colors",
              "Nature inspired greens",
              "Bold and vibrant",
              "Calm and soothing",
              "Corporate professional",
              "Vintage retro style",
              "Tech startup look"
            ].map((prompt, idx) => (
              <button
                key={idx}
                className="text-xs text-left p-1.5 hover:bg-purple-100 rounded text-gray-700 transition-colors"
                onClick={() => setAiPrompt(prompt)}
                disabled={isGeneratingPalette}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
            onClick={onClose}
            disabled={isGeneratingPalette}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded text-sm flex items-center"
            onClick={handleGenerateAiPalette}
            disabled={isGeneratingPalette || !aiPrompt.trim()}
          >
            {isGeneratingPalette ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <FaMagic className="mr-2" /> Generate Palette
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIPaletteDialog; 