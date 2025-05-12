import { useState, useEffect } from 'react';
import { useStore } from '../../../store';
import axios from 'axios';
import { 
  FiSliders, 
  FiLayers, 
  FiEye, 
  FiEyeOff, 
  FiArrowUp, 
  FiArrowDown,
  FiTrash, 
  FiCopy,
  FiSquare,
  FiCircle,
  FiImage,
  FiType,
  FiStar,
  FiEdit,
  FiCheck,
  FiLock,
  FiUnlock,
  FiChevronDown,
  FiChevronUp,
  FiDroplet,
  FiMaximize,
  FiSun,
  FiMousePointer,
  FiBold,
  FiCornerUpLeft
} from 'react-icons/fi';
import { RiFontSizeAi } from "react-icons/ri";
import { toast } from 'react-toastify';
import PropertiesTab from './Tabs/PropertiesTab';
import LayersTab from './Tabs/LayersTab';
import { baseUrl } from '../../../utils/constant';

// Common Google Font options
const GOOGLE_FONTS = [
  { name: 'Arial', value: 'Arial', type: 'system' },
  { name: 'Roboto', value: 'Roboto', url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap' },
  { name: 'Open Sans', value: 'Open Sans', url: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap' },
  { name: 'Lato', value: 'Lato', url: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap' },
  { name: 'Montserrat', value: 'Montserrat', url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap' },
  { name: 'Poppins', value: 'Poppins', url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap' },
  { name: 'Oswald', value: 'Oswald', url: 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap' },
  { name: 'Raleway', value: 'Raleway', url: 'https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&display=swap' },
  { name: 'Playfair Display', value: 'Playfair Display', url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap' },
  { name: 'Merriweather', value: 'Merriweather', url: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap' },
  { name: 'Dancing Script', value: 'Dancing Script', url: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap' },
  { name: 'Pacifico', value: 'Pacifico', url: 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap' },
  { name: 'Times New Roman', value: 'Times New Roman', type: 'system' },
  { name: 'Courier New', value: 'Courier New', type: 'system' },
  { name: 'Georgia', value: 'Georgia', type: 'system' },
  { name: 'Verdana', value: 'Verdana', type: 'system' }
];

export default function RightSidebar() {
  const [activeTab, setActiveTab] = useState('properties');
  const [activePropertyGroup, setActivePropertyGroup] = useState('content'); // Default open group
  const [editingLayerId, setEditingLayerId] = useState(null);
  const [newLayerName, setNewLayerName] = useState('');
  const [showShadowProperties, setShowShadowProperties] = useState(true);
  const [showBorderProperties, setShowBorderProperties] = useState(true);
  const [showImageFilters, setShowImageFilters] = useState(false);
  const [showTextProperties, setShowTextProperties] = useState(true);
  const [showPositionProperties, setShowPositionProperties] = useState(false);
  const [showFontProperties, setShowFontProperties] = useState(true);
  const [showLayoutProperties, setShowLayoutProperties] = useState(true);
  const [showImageProperties, setShowImageProperties] = useState(true);
  const [loadedFonts, setLoadedFonts] = useState([]);
  const [shapeFillType, setShapeFillType] = useState('filled'); // 'filled' or 'outlined'
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  
  const { 
    elements, 
    selectedElementId, 
    updateElement,
    deleteElement,
    duplicateElement,
    moveElementUp,
    moveElementDown,
    moveElementToTop,
    moveElementToBottom,
    addToHistory,
    renameElement,
    selectElement,
    drawingMode,
    setDrawingMode,
    disableDrawingMode
  } = useStore();
  
  const selectedElement = elements.find(el => el.id === selectedElementId);
  
  // Set default property group to "drawing" when in drawing mode
  useEffect(() => {
    if (drawingMode.enabled) {
      setActivePropertyGroup('drawing');
      // When drawing mode is enabled, switch to properties tab automatically
      if (activeTab !== 'properties') {
        setActiveTab('properties');
      }
    }
  }, [drawingMode.enabled]);
  
  // Disable drawing mode when selecting an element that's not a drawing
  useEffect(() => {
    if (selectedElementId && drawingMode.enabled) {
      // If user has selected an element, disable drawing mode
      disableDrawingMode();
    }
  }, [selectedElementId]);
  
  // Auto-open properties tab and drawing panel when tool is activated from the left sidebar
  useEffect(() => {
    const shouldOpenDrawingPanel = sessionStorage.getItem('open_drawing_panel');
    if (shouldOpenDrawingPanel === 'true' && drawingMode.enabled) {
      // Switch to properties tab if not already selected
      if (activeTab !== 'properties') {
        setActiveTab('properties');
      }
      
      // Open the drawing properties group
      setActivePropertyGroup('drawing');
      
      // Clear the signal
      sessionStorage.removeItem('open_drawing_panel');
    }
  }, [drawingMode.enabled, activeTab]);
  
  // Toggle property group - close others when opening one
  const togglePropertyGroup = (groupName, forceState = null) => {
    if (forceState !== null) {
      // If forceState is provided, use it (either true or false)
      setActivePropertyGroup(forceState ? groupName : null);
    } else if (activePropertyGroup === groupName) {
      // If it's the current active group and no force state, toggle it off
      setActivePropertyGroup(null);
    } else {
      // Otherwise, set it as the active group
      setActivePropertyGroup(groupName);
    }
  };
  
  // Keeps the current property group open and prevents it from changing
  const keepPropertyGroupOpen = (groupName) => {
    // Only act if there's a selected property group and it's the one we want to keep open
    if (activePropertyGroup === groupName) {
      // This forces the property group to stay open by setting it again
      setActivePropertyGroup(groupName);
    }
  };
  
  // Load saved settings from session storage
  useEffect(() => {
    try {
      // Load shadow settings
      const savedShadowSettings = sessionStorage.getItem('shadow_settings');
      if (savedShadowSettings) {
        setShowShadowProperties(JSON.parse(savedShadowSettings).enabled || false);
      }
      
      // Load border settings
      const savedBorderSettings = sessionStorage.getItem('border_settings');
      if (savedBorderSettings) {
        setShowBorderProperties(JSON.parse(savedBorderSettings).enabled || false);
      }
      
      // Load image filter settings
      const savedFilterSettings = sessionStorage.getItem('image_filters');
      if (savedFilterSettings) {
        setShowImageFilters(!!JSON.parse(savedFilterSettings));
      }
    } catch (e) {
      console.log('Error loading settings from session storage');
    }
  }, []);
  
  // Load Google Fonts when needed
  useEffect(() => {
    if (selectedElement?.type === 'text') {
      const currentFont = selectedElement.fontFamily;
      const fontToLoad = GOOGLE_FONTS.find(font => 
        font.value === currentFont && font.url && !loadedFonts.includes(font.value)
      );
      
      if (fontToLoad) {
        // Create a new link element
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = fontToLoad.url;
        
        // Add to document head
        document.head.appendChild(linkElement);
        
        // Keep track of loaded fonts
        setLoadedFonts(prev => [...prev, fontToLoad.value]);
      }
    }
  }, [selectedElement?.fontFamily]);
  
  // Detect if selected shape is filled or outlined and set shapeFillType accordingly
  useEffect(() => {
    if (selectedElement && ['rectangle', 'circle', 'triangle', 'star', 'polygon'].includes(selectedElement.type)) {
      // Consider it outlined if fill is transparent and border is enabled
      if (selectedElement.fill === 'transparent' && selectedElement.border?.enabled) {
        setShapeFillType('outlined');
      } else {
        setShapeFillType('filled');
      }
      
      // Set appropriate property group to open by default for shapes
      setActivePropertyGroup('shape');
    } else if (selectedElement?.type === 'text') {
      // For text elements, open content group by default
      setActivePropertyGroup('content');
    } else if (selectedElement?.type === 'image') {
      // For image elements, open position group by default
      setActivePropertyGroup('position');
    }
  }, [selectedElement]);
  
  // Handle property changes
  const handlePropertyChange = (property, value) => {
    if (selectedElementId) {
      // Check if the element is locked before allowing changes
      const element = elements.find(el => el.id === selectedElementId);
      if (element && element.locked) {
        return; // Don't allow changes to locked elements
      }
      
      updateElement(selectedElementId, { [property]: value });
      addToHistory(`Update ${property}`);
    }
  };
  
  // Handle border/stroke property changes - create a nested object structure
  const handleBorderPropertyChange = (property, value, event) => {
    // If an event was passed, completely stop propagation and prevent default
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    // Remember the current property group before making changes
    const currentGroup = activePropertyGroup;
    
    if (selectedElementId) {
      // Check if the element is locked before allowing changes
      const element = elements.find(el => el.id === selectedElementId);
      if (element && element.locked) {
        return; // Don't allow changes to locked elements
      }
      
      // Create or update the border object
      const currentBorder = element.border || {
        enabled: true,
        color: '#000000',
        width: 0, // Changed from 1 to 0
        style: 'solid',
        radius: 0
      };
      
      const updatedBorder = { ...currentBorder, [property]: value };
      
      // If we're toggling the enabled state off, keep the border object but disable it
      if (property === 'enabled' && value === false) {
        updateElement(selectedElementId, { border: updatedBorder });
      } 
      // If we're toggling the enabled state on or changing other properties when enabled
      else if (updatedBorder.enabled) {
        updateElement(selectedElementId, { border: updatedBorder });
      }
      
      // Save border state to session storage
      try {
        sessionStorage.setItem('border_settings', JSON.stringify(updatedBorder));
      } catch (e) {
        console.log('Error saving border settings to session storage');
      }
      
      addToHistory(`Update border ${property}`);
      
      // Make sure our property group stays open after the update
      setTimeout(() => keepPropertyGroupOpen(currentGroup), 0);
    }
  };
  
  // Handle shadow property changes - create a nested object structure
  const handleShadowPropertyChange = (property, value, event) => {
    // If an event was passed, completely stop propagation and prevent default
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    // Remember the current property group before making changes
    const currentGroup = activePropertyGroup;
    
    if (selectedElementId) {
      // Check if the element is locked before allowing changes
      const element = elements.find(el => el.id === selectedElementId);
      if (element && element.locked) {
        return; // Don't allow changes to locked elements
      }
      
      // Create or update the shadow object
      const currentShadow = element.shadow || {
        enabled: true,
        color: 'rgba(0,0,0,0.5)',
        blur: 5,
        offsetX: 5,
        offsetY: 5,
        spread: 0
      };
      
      const updatedShadow = { ...currentShadow, [property]: value };
      
      // If we're toggling the enabled state off, keep the shadow object but disable it
      if (property === 'enabled' && value === false) {
        updateElement(selectedElementId, { shadow: updatedShadow });
      } 
      // If we're toggling the enabled state on or changing other properties when enabled
      else if (updatedShadow.enabled) {
        updateElement(selectedElementId, { shadow: updatedShadow });
      }
      
      // Save shadow state to session storage
      try {
        sessionStorage.setItem('shadow_settings', JSON.stringify(updatedShadow));
      } catch (e) {
        console.log('Error saving shadow settings to session storage');
      }
      
      addToHistory(`Update shadow ${property}`);
      
      // Make sure our property group stays open after the update
      setTimeout(() => keepPropertyGroupOpen(currentGroup), 0);
    }
  };
  
  // Handle image filter property changes
  const handleFilterPropertyChange = (property, value, event) => {
    // If an event was passed, completely stop propagation and prevent default
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    // Remember the current property group before making changes
    const currentGroup = activePropertyGroup;
    
    if (selectedElementId) {
      // Check if the element is locked before allowing changes
      const element = elements.find(el => el.id === selectedElementId);
      if (element && element.locked || element.type !== 'image') {
        return; // Don't allow changes to locked elements or non-image elements
      }
      
      // Create or update the filters object
      const currentFilters = element.filters || {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        blur: 0,
        grayscale: 0
      };
      
      const updatedFilters = { ...currentFilters, [property]: value };
      updateElement(selectedElementId, { filters: updatedFilters });
      
      // Save filter settings to session storage
      try {
        sessionStorage.setItem('image_filters', JSON.stringify(updatedFilters));
      } catch (e) {
        console.log('Error saving filter settings to session storage');
      }
      
      addToHistory(`Update image ${property}`);
      
      // Make sure our property group stays open after the update
      setTimeout(() => keepPropertyGroupOpen(currentGroup), 0);
    }
  };
  
  // Handle shape fill type toggle (filled vs outlined)
  const handleShapeFillTypeChange = (type) => {
    setShapeFillType(type);
    
    if (!selectedElementId) return;
    const element = elements.find(el => el.id === selectedElementId);
    if (element && element.locked) return;
    
    if (['rectangle', 'circle', 'triangle', 'star', 'polygon'].includes(element?.type)) {
      if (type === 'outlined') {
        // Store the current fill color in a custom property so we can restore it later
        const currentFill = element.fill || '#000000';
        
        // If the element already has a border enabled, use its color
        // Otherwise use the fill color for the border
        const borderColor = element.border?.enabled ? element.border.color : currentFill;
        const borderWidth = element.border?.width || 0; // Changed from 2 to 0 to allow starting from 0
        
        // Preserve cornerRadius for shapes that support it
        const updatedProps = { 
          fill: 'transparent',
          _previousFill: currentFill, // Store the fill to restore it later
          border: {
            ...element.border,
            enabled: true,
            color: borderColor,
            width: borderWidth,
            style: element.border?.style || 'solid'
          }
        };
        
        // Make sure we don't lose the cornerRadius when toggling
        if (element.cornerRadius !== undefined) {
          updatedProps.cornerRadius = element.cornerRadius;
        }
        
        updateElement(selectedElementId, updatedProps);
      } else {
        // Restore fill color - use the stored previous fill if available, 
        // otherwise use the border color or default
        const fillToUse = element._previousFill || element.border?.color || '#000000';
        
        const updatedElement = {
          fill: fillToUse,
        };
        
        // Preserve cornerRadius for shapes that support it
        if (element.cornerRadius !== undefined) {
          updatedElement.cornerRadius = element.cornerRadius;
        }
        
        // Optionally, we can disable the border when switching to filled
        // or keep it enabled with the current settings
        // Let's keep the border but make it match the fill color
        if (element.border) {
          updatedElement.border = {
            ...element.border,
            color: fillToUse
          };
        }
        
        updateElement(selectedElementId, updatedElement);
      }
      addToHistory(`Change shape to ${type}`);
    }
  };
  
  const handleVisibilityToggle = (id) => {
    const element = elements.find(el => el.id === id);
    if (element) {
      updateElement(id, { visible: element.visible === false ? true : false });
      addToHistory('Toggle visibility');
    }
  };
  
  const handleLockToggle = (id, e) => {
    e.stopPropagation();
    const element = elements.find(el => el.id === id);
    if (element) {
      updateElement(id, { locked: element.locked === true ? false : true });
      addToHistory(element.locked ? 'Unlock element' : 'Lock element');
    }
  };
  
  // Helper to generate CSS filter string from filter properties
  const generateFilterString = (filters) => {
    if (!filters) return '';
    
    const filterString = [
      `brightness(${filters.brightness || 100}%)`,
      `contrast(${filters.contrast || 100}%)`,
      `saturate(${filters.saturation || 100}%)`,
      filters.blur > 0 ? `blur(${filters.blur}px)` : '',
      filters.grayscale > 0 ? `grayscale(${filters.grayscale}%)` : '',
    ].filter(Boolean).join(' ');
    
    return filterString;
  };
  
  const getElementTypeIcon = (type) => {
    switch (type) {
      case 'rectangle': return '■';
      case 'circle': return '●';
      case 'triangle': return '▲';
      case 'line': return '―';
      case 'star': return '★';
      case 'polygon': return '⬢';
      case 'text': return 'T';
      case 'image': return '🖼️';
      case 'diamond': return '◆';
      case 'speech': return '💬';
      case 'arrow': return '→';
      default: return '■';
    }
  };
  
  const getElementName = (element) => {
    switch (element.type) {
      case 'text': return `Text: ${element.text.substring(0, 10)}${element.text.length > 10 ? '...' : ''}`;
      case 'image': return `Image`;
      default: return `${element.type.charAt(0).toUpperCase() + element.type.slice(1)}`;
    }
  };
  
  // Handle starting rename
  const handleStartRename = (element, e) => {
    e.stopPropagation();
    
    // Don't allow renaming locked elements
    if (element.locked) return;
    
    setEditingLayerId(element.id);
    setNewLayerName(element.name || getElementName(element));
  };

  // Handle saving rename
  const handleSaveRename = (id, e) => {
    e.stopPropagation();
    if (newLayerName.trim()) {
      renameElement(id, newLayerName.trim());
    }
    setEditingLayerId(null);
  };
  
  // Define a proper reset filter function
  const handleFilterReset = () => {
    if (selectedElement && selectedElement.type === 'image') {
      // Reset all filters to default values
      const defaultFilters = {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        blur: 0,
        grayscale: 0
      };
      
      handlePropertyChange('filters', defaultFilters);
      toast.info('Image filters reset to default');
    }
  };
  
  // New function to handle AI text enhancement
  const enhanceTextWithAI = async () => {
    if (!selectedElement?.text?.trim()) return;
    
    setIsAiProcessing(true);
    
    try {
      const response = await axios.post(`${baseUrl}/api/text/gen`, {
        text: `Enhance this text to be more engaging and professional: ${selectedElement.text}`
      });
      
      if (response.data.success) {
        // Replace current text with enhanced text
        handlePropertyChange('text', response.data.data);
      } else {
        console.error('Error enhancing text:', response.data.error);
        alert('Failed to enhance text. Please try again.');
      }
    } catch (error) {
      console.error('Error calling AI API:', error);
      alert('Failed to connect to AI service. Please try again later.');
    } finally {
      setIsAiProcessing(false);
    }
  };

  // Handle drawing property changes
  const handleDrawingPropertyChange = (property, value) => {
    if (drawingMode.enabled) {
      console.log(`Changing drawing property: ${property} to:`, value);
      
      // Create a completely new object to ensure React detects the changes
      const updatedDrawingMode = {
        ...drawingMode,
        [property]: value
      };
      
      // Force state update with the new drawingMode object
      setDrawingMode(updatedDrawingMode);
      console.log('Updated drawing mode:', updatedDrawingMode);
      
      // Keep track of current property group to ensure it stays open
      const currentGroup = activePropertyGroup;
      
      // Make sure our property group stays open after the update
      setTimeout(() => keepPropertyGroupOpen(currentGroup), 0);
      
      // Add to history when changing tools
      if (property === 'tool') {
        addToHistory(`Switch to ${value} drawing tool`);
      }
    }
  };

  return (
    <div className="w-72 border border-gray-300 bg-white h-[98%] m-2 mt-[6px] rounded-2xl flex flex-col overflow-hidden">
      <div className="p-2 px-3 border-b border-gray-300 flex justify-between items-center">
        <h2 className="text-sm font-medium">Canvas Editor</h2>
        <div className="flex rounded-md overflow-hidden border border-gray-200">
          <button 
            className={`p-2 ${activeTab === 'properties' ? 'bg-indigo-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('properties')}
            title="Properties"
          >
            <FiSliders size={16} />
          </button>
          <button 
            className={`p-2 ${activeTab === 'layers' ? 'bg-indigo-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('layers')}
            title="Layers"
          >
            <FiLayers size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'properties' ? (
          <PropertiesTab
            selectedElement={selectedElement}
            selectedElementId={selectedElementId}
            handlePropertyChange={handlePropertyChange}
            handleBorderPropertyChange={handleBorderPropertyChange}
            handleShadowPropertyChange={handleShadowPropertyChange}
            handleFilterPropertyChange={handleFilterPropertyChange}
            handleShapeFillTypeChange={handleShapeFillTypeChange}
            togglePropertyGroup={togglePropertyGroup}
            activePropertyGroup={activePropertyGroup}
            shapeFillType={shapeFillType}
            isAiProcessing={isAiProcessing}
            enhanceTextWithAI={enhanceTextWithAI}
            duplicateElement={duplicateElement}
            deleteElement={deleteElement}
            addToHistory={addToHistory}
            GOOGLE_FONTS={GOOGLE_FONTS}
            drawingMode={drawingMode}
            handleDrawingPropertyChange={handleDrawingPropertyChange}
          />
        ) : (
          <LayersTab
            elements={elements}
            selectedElementId={selectedElementId}
            selectElement={selectElement}
            moveElementToTop={moveElementToTop}
            moveElementUp={moveElementUp}
            moveElementDown={moveElementDown}
            moveElementToBottom={moveElementToBottom}
            handleVisibilityToggle={handleVisibilityToggle}
            handleLockToggle={handleLockToggle}
            handleStartRename={handleStartRename}
            handleSaveRename={handleSaveRename}
            deleteElement={deleteElement}
            editingLayerId={editingLayerId}
            newLayerName={newLayerName}
            setNewLayerName={setNewLayerName}
            addToHistory={addToHistory}
            getElementTypeIcon={getElementTypeIcon}
            getElementName={getElementName}
          />
        )}
      </div>
    </div>
  );
} 