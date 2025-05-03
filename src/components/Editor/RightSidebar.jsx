import { useState, useEffect } from 'react';
import { useStore } from '../../store';
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
import ColorPicker from '../ui/ColorPicker';
import { toast } from 'react-toastify';

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
    selectElement
  } = useStore();
  
  const selectedElement = elements.find(el => el.id === selectedElementId);
  
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
        width: 1,
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
        const borderWidth = element.border?.width || 2;
        
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
  
  return (
    <div className="h-full w-64 bg-white border-l border-gray-200 flex flex-col">
      {/* Tab navigation */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
            activeTab === 'properties'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('properties')}
        >
          <div className="flex items-center justify-center">
            <FiSliders className="mr-1" /> Properties
          </div>
        </button>
        <button
          className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
            activeTab === 'layers'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('layers')}
        >
          <div className="flex items-center justify-center">
            <FiLayers className="mr-1" /> Layers
          </div>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div className="p-3">
            {selectedElement ? (
              <>
                {/* <h3 className="font-medium text-sm mb-3">Element Properties</h3> */}
                
                {selectedElement.locked ? (
                  <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-700 flex items-center">
                    <FiLock className="mr-2" /> This element is locked. Unlock it in the Layers panel to edit.
                  </div>
                ) : (
                  <>
                    {/* Shape Fill/Outline Toggle - only for shapes */}
                    {['rectangle', 'circle', 'triangle', 'star', 'polygon'].includes(selectedElement.type) && (
                      <div className="mb-3 border border-gray-200 rounded-md overflow-hidden">
                        <button 
                          className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100"
                          onClick={(e) => {
                            // Only toggle if clicked directly on the button or its direct children
                            if (e.target === e.currentTarget || 
                                e.target.parentElement === e.currentTarget ||
                                e.target.parentElement?.parentElement === e.currentTarget) {
                              togglePropertyGroup('shape');
                            }
                          }}
                        >
                          <div className="flex items-center">
                            <FiSquare className="mr-2 text-gray-600" />
                            <span className="text-sm font-medium">Shape Properties</span>
                          </div>
                          {activePropertyGroup === 'shape' ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                        
                        {activePropertyGroup === 'shape' && (
                          <div className="p-3 border-t border-gray-200">
                            {/* Shape Style Toggle */}
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Shape Style
                              </label>
                              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                                <button
                                  className={`flex-1 py-2 px-3 text-center text-sm ${
                                    shapeFillType === 'filled' 
                                      ? 'bg-indigo-500 text-white font-medium' 
                                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                  }`}
                                  onClick={() => handleShapeFillTypeChange('filled')}
                                >
                                  <FiSquare className="inline-block mr-1" style={{fill: shapeFillType === 'filled' ? 'currentColor' : 'none'}} /> Filled
                                </button>
                                <button
                                  className={`flex-1 py-2 px-3 text-center text-sm ${
                                    shapeFillType === 'outlined' 
                                      ? 'bg-indigo-500 text-white font-medium' 
                                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                  }`}
                                  onClick={() => handleShapeFillTypeChange('outlined')}
                                >
                                  <FiSquare className="inline-block mr-1" style={{ fill: 'none', stroke: 'currentColor' }} /> Outlined
                                </button>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Choose between filled or outlined shape style
                              </p>
                            </div>
                            
                            {/* Add curved shape options */}
                            {selectedElement.type === 'rectangle' && (
                              <div className="mb-3">
                                <label className="block text-xs text-gray-500 mb-1">
                                  Corner Rounding
                                </label>
                                <input
                                  type="range"
                                  min="0"
                                  max="50"
                                  value={selectedElement.border?.radius || 0}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleBorderPropertyChange('radius', parseInt(e.target.value), e);
                                  }}
                                  className="w-full"
                                />
                                <div className="flex justify-between mt-1">
                                  <span className="text-xs">0</span>
                                  <span className="text-xs">{selectedElement.border?.radius || 0}px</span>
                                  <span className="text-xs">50px</span>
                                </div>
                              </div>
                            )}
                            
                            <div className="mb-3">
                              <label className="block text-xs text-gray-500 mb-1">
                                {shapeFillType === 'filled' ? 'Fill Color' : 'Outline Color'}
                              </label>
                              <div className="flex items-center">
                                <ColorPicker
                                  value={shapeFillType === 'filled' 
                                    ? (selectedElement.fill || '#3B82F6')
                                    : (selectedElement.border?.color || '#3B82F6')}
                                  onChange={(value) => {
                                    if (shapeFillType === 'filled') {
                                      handlePropertyChange('fill', value);
                                    } else {
                                      handleBorderPropertyChange('color', value);
                                    }
                                  }}
                                  className="mr-2"
                                />
                                <input
                                  type="text"
                                  value={shapeFillType === 'filled' 
                                    ? (selectedElement.fill || '#3B82F6')
                                    : (selectedElement.border?.color || '#3B82F6')}
                                  onChange={(e) => {
                                    if (shapeFillType === 'filled') {
                                      handlePropertyChange('fill', e.target.value);
                                    } else {
                                      handleBorderPropertyChange('color', e.target.value);
                                    }
                                  }}
                                  className="flex-1 rounded-md border border-gray-300 px-3 py-1 text-sm"
                                />
                              </div>
                            </div>
                            
                            {/* Outline width control */}
                            {(['rectangle', 'circle', 'triangle', 'star', 'polygon'].includes(selectedElement.type)) && (
                              <div className="mb-3">
                                <label className="block text-xs text-gray-500 mb-1">
                                  Outline Width: {selectedElement.border?.width || 0}px
                                </label>
                                <input
                                  type="range"
                                  min="0"
                                  max="10"
                                  value={selectedElement.border?.width || 0}
                                  onChange={(e) => {
                                    // Ensure we have a valid border object with enabled=true
                                    const currentBorder = selectedElement.border || {
                                      enabled: true,
                                      color: selectedElement.fill || '#ffffffff',
                                      width: 0,
                                      style: 'solid'
                                    };
                                    handleBorderPropertyChange('width', parseInt(e.target.value));
                                    if (!currentBorder.enabled) {
                                      handleBorderPropertyChange('enabled', true);
                                    }
                                  }}
                                  className="w-full"
                                />
                              </div>
                            )}
                            
                            {/* Specific size controls based on shape type */}
                            {selectedElement.type === 'rectangle' && (
                              <div className="grid grid-cols-2 gap-2 mb-3">
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Width</label>
                                  <input
                                    type="number"
                                    value={Math.round(selectedElement.width) || 100}
                                    min={1}
                                    onChange={(e) => handlePropertyChange('width', parseInt(e.target.value))}
                                    className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Height</label>
                                  <input
                                    type="number"
                                    value={Math.round(selectedElement.height) || 100}
                                    min={1}
                                    onChange={(e) => handlePropertyChange('height', parseInt(e.target.value))}
                                    className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                                  />
                                </div>
                              </div>
                            )}
                            
                            {/* Radius for circle and regular polygons */}
                            {['circle', 'triangle', 'polygon'].includes(selectedElement.type) && (
                              <div className="mb-3">
                                <label className="block text-xs text-gray-500 mb-1">{['circle', 'triangle', 'polygon'].includes(selectedElement.type) ? 'Size' : 'Radius'}</label>
                                <input
                                  type="number"
                                  value={Math.round(selectedElement.radius) || 50}
                                  min={1}
                                  onChange={(e) => handlePropertyChange('radius', parseInt(e.target.value))}
                                  className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                                />
                              </div>
                            )}
                            
                            {/* Special properties for star */}
                            {selectedElement.type === 'star' && (
                              <>
                                <div className="mb-3">
                                  <label className="block text-xs text-gray-500 mb-1">Points</label>
                                  <input
                                    type="number"
                                    value={selectedElement.numPoints || 5}
                                    min={3}
                                    max={20}
                                    onChange={(e) => handlePropertyChange('numPoints', parseInt(e.target.value))}
                                    className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                                  />
                                </div>
                                <div className="mb-3">
                                  <label className="block text-xs text-gray-500 mb-1">Inner Radius</label>
                                  <input
                                    type="number"
                                    value={Math.round(selectedElement.innerRadius) || 25}
                                    min={1}
                                    onChange={(e) => handlePropertyChange('innerRadius', parseInt(e.target.value))}
                                    className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Line specific properties */}
                    {selectedElement.type === 'line' && (
                      <div className="mb-3 border border-gray-200 rounded-md overflow-hidden">
                        <button 
                          className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100"
                          onClick={(e) => {
                            // Only toggle if clicked directly on the button or its direct children
                            if (e.target === e.currentTarget || 
                                e.target.parentElement === e.currentTarget ||
                                e.target.parentElement?.parentElement === e.currentTarget) {
                              togglePropertyGroup('line');
                            }
                          }}
                        >
                          <div className="flex items-center">
                            <FiMaximize className="mr-2 text-gray-600" />
                            <span className="text-sm font-medium">Line Properties</span>
                          </div>
                          {activePropertyGroup === 'line' ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                        
                        {activePropertyGroup === 'line' && (
                          <div className="p-3 border-t border-gray-200">
                            <div className="mb-3">
                              <label className="block text-xs text-gray-500 mb-1">Stroke Color</label>
                              <div className="flex items-center">
                                <ColorPicker
                                  value={selectedElement.stroke || '#3B82F6'}
                                  onChange={(value) => handlePropertyChange('stroke', value)}
                                  className="mr-2"
                                />
                                <input
                                  type="text"
                                  value={selectedElement.stroke || '#3B82F6'}
                                  onChange={(e) => handlePropertyChange('stroke', e.target.value)}
                                  className="flex-1 rounded-md border border-gray-300 px-3 py-1 text-sm"
                                />
                              </div>
                            </div>
                            <div className="mb-3">
                              <label className="block text-xs text-gray-500 mb-1">Stroke Width</label>
                              <input
                                type="number"
                                value={selectedElement.strokeWidth || 1}
                                min={1}
                                max={20}
                                onChange={(e) => handlePropertyChange('strokeWidth', parseInt(e.target.value))}
                                className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Text Element Properties */}
                    {selectedElement.type === 'text' && (
                      <>
                        {/* Content Group */}
                        <div className="mb-3 border border-gray-200 rounded-md overflow-hidden">
                          <button 
                            className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100"
                            onClick={(e) => {
                              // Only toggle if clicked directly on the button or its direct children
                              if (e.target === e.currentTarget || 
                                  e.target.parentElement === e.currentTarget ||
                                  e.target.parentElement?.parentElement === e.currentTarget) {
                                togglePropertyGroup('content');
                              }
                            }}
                          >
                            <div className="flex items-center">
                              <FiType className="mr-2 text-gray-600" />
                              <span className="text-sm font-medium">Text Content</span>
                            </div>
                            {activePropertyGroup === 'content' ? <FiChevronUp /> : <FiChevronDown />}
                          </button>
                          
                          {activePropertyGroup === 'content' && (
                            <div className="p-3 border-t border-gray-200">
                              <div className="mb-3">
                                <textarea
                                  value={selectedElement.text}
                                  onChange={(e) => handlePropertyChange('text', e.target.value)}
                                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm min-h-8 max-h-40 focus:outline-none"
                                  rows={3}
                                />
                              </div>
                              
                              <div className="mb-3">
                                <label className="block text-xs text-gray-500 mb-1">Text (box) width</label>
                                <div className="flex space-x-2 mb-1">
                                  <input
                                    type="number"
                                    value={Math.round(selectedElement.width || 300)}
                                    min={100}
                                    max={2000}
                                    onChange={(e) => handlePropertyChange('width', parseInt(e.target.value))}
                                    className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                                  />
                                </div>
                                <div className="grid grid-cols-4 gap-1 mt-1">
                                  {[
                                    { label: 'Narrow', value: 200 },
                                    { label: 'Medium', value: 300 },
                                    { label: 'Wide', value: 500 },
                                    { label: 'Full', value: 800 }
                                  ].map(preset => (
                                    <button
                                      key={preset.value}
                                      className={`text-xs py-1 px-2 border rounded-md ${
                                        Math.abs(selectedElement.width - preset.value) < 10
                                          ? 'bg-indigo-50 border-indigo-300 text-indigo-600'
                                          : 'border-gray-300 hover:bg-gray-50'
                                      }`}
                                      onClick={() => handlePropertyChange('width', preset.value)}
                                    >
                                      {preset.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="mb-2">
                                <label className="block text-xs text-gray-500 mb-1">Text Color</label>
                                <div className="flex items-center">
                                  <ColorPicker
                                    value={selectedElement.fill || '#000000'}
                                    onChange={(value) => handlePropertyChange('fill', value)}
                                    className="mr-2"
                                  />
                                  <input
                                    type="text"
                                    value={selectedElement.fill || '#000000'}
                                    onChange={(e) => handlePropertyChange('fill', e.target.value)}
                                    className="flex-1 rounded-md border border-gray-300 px-3 py-1 text-sm"
                                  />
                                </div>
                              </div>
                              
                              <div className="mb-2">
                                <label className="block text-xs text-gray-500 mb-1">Text Alignment</label>
                                <select
                                  value={selectedElement.align || 'left'}
                                  onChange={(e) => handlePropertyChange('align', e.target.value)}
                                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                >
                                  <option value="left">Left Aligned</option>
                                  <option value="center">Center Aligned</option>
                                  <option value="right">Right Aligned</option>
                                  <option value="justify">Justified</option>
                                </select>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Font Properties Group */}
                        <div className="mb-3 border border-gray-200 rounded-md overflow-hidden">
                          <button 
                            className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100"
                            onClick={(e) => {
                              // Only toggle if clicked directly on the button or its direct children
                              if (e.target === e.currentTarget || 
                                  e.target.parentElement === e.currentTarget ||
                                  e.target.parentElement?.parentElement === e.currentTarget) {
                                togglePropertyGroup('font');
                              }
                            }}
                          >
                            <div className="flex items-center">
                              <RiFontSizeAi className="mr-2 text-gray-600" />
                              <span className="text-sm font-medium">Font Options</span>
                            </div>
                            {activePropertyGroup === 'font' ? <FiChevronUp /> : <FiChevronDown />}
                          </button>
                          
                          {activePropertyGroup === 'font' && (
                            <div className="p-3 border-t border-gray-200">
                              <div className="mb-2">
                                <label className="block text-xs text-gray-500 mb-1">Font Family</label>
                                <select
                                  value={selectedElement.fontFamily || 'Arial'}
                                  onChange={(e) => handlePropertyChange('fontFamily', e.target.value)}
                                  className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                                  style={{ fontFamily: selectedElement.fontFamily || 'Arial' }}
                                >
                                  {GOOGLE_FONTS.map(font => (
                                    <option 
                                      key={font.value} 
                                      value={font.value}
                                      style={{ fontFamily: font.value }}
                                    >
                                      {font.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              
                              <div className="mb-2">
                                <label className="block text-xs text-gray-500 mb-1">Font Size</label>
                                <input
                                  type="number"
                                  value={selectedElement.fontSize || 24}
                                  min={8}
                                  max={200}
                                  onChange={(e) => handlePropertyChange('fontSize', parseInt(e.target.value))}
                                  className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                                />
                              </div>
                              
                              <div className="mb-2">
                                <label className="block text-xs text-gray-500 mb-1">Font Weight</label>
                                <select
                                  value={selectedElement.fontWeight || 'normal'}
                                  onChange={(e) => handlePropertyChange('fontWeight', e.target.value)}
                                  className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                                >
                                  <option value="normal">Normal</option>
                                  <option value="bold">Bold</option>
                                  <option value="bolder">Bolder</option>
                                  <option value="lighter">Lighter</option>
                                  <option value="100">100</option>
                                  <option value="200">200</option>
                                  <option value="300">300</option>
                                  <option value="400">400</option>
                                  <option value="500">500</option>
                                  <option value="600">600</option>
                                  <option value="700">700</option>
                                  <option value="800">800</option>
                                  <option value="900">900</option>
                                </select>
                              </div>
                              
                              <div className="mb-2">
                                <label className="block text-xs text-gray-500 mb-1">Font Style</label>
                                <div className="flex border border-gray-300 rounded-md overflow-hidden">
                                  <button
                                    className={`flex-1 py-1 text-center ${selectedElement.fontStyle === 'normal' || !selectedElement.fontStyle ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600'}`}
                                    onClick={() => handlePropertyChange('fontStyle', 'normal')}
                                  >
                                    Normal
                                  </button>
                                  <button
                                    className={`flex-1 py-1 text-center ${selectedElement.fontStyle === 'italic' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600'}`}
                                    onClick={() => handlePropertyChange('fontStyle', 'italic')}
                                  >
                                    Italic
                                  </button>
                                </div>
                              </div>
                              
                              <div className="mb-2">
                                <label className="block text-xs text-gray-500 mb-1">Text Decoration</label>
                                <div className="flex border border-gray-300 rounded-md overflow-hidden">
                                  <button
                                    className={`flex-1 py-1 text-center ${selectedElement.textDecoration === 'none' || !selectedElement.textDecoration ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600'}`}
                                    onClick={() => handlePropertyChange('textDecoration', 'none')}
                                  >
                                    None
                                  </button>
                                  <button
                                    className={`flex-1 py-1 text-center ${selectedElement.textDecoration === 'underline' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600'}`}
                                    onClick={() => handlePropertyChange('textDecoration', 'underline')}
                                    style={{ textDecoration: 'underline' }}
                                  >
                                    Under
                                  </button>
                                  <button
                                    className={`flex-1 py-1 text-center ${selectedElement.textDecoration === 'line-through' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600'}`}
                                    onClick={() => handlePropertyChange('textDecoration', 'line-through')}
                                    style={{ textDecoration: 'line-through' }}
                                  >
                                    Strike
                                  </button>
                                </div>
                              </div>
                              
                              <div className="mb-2">
                                <label className="block text-xs text-gray-500 mb-1">
                                  Line Height: {selectedElement.lineHeight || 1.2}
                                </label>
                                <input
                                  type="range"
                                  min="0.8"
                                  max="3"
                                  step="0.1"
                                  value={selectedElement.lineHeight || 1.2}
                                  onChange={(e) => handlePropertyChange('lineHeight', parseFloat(e.target.value))}
                                  className="w-full"
                                />
                              </div>
                              
                              <div className="mb-2">
                                <label className="block text-xs text-gray-500 mb-1">
                                  Letter Spacing: {selectedElement.letterSpacing || 0}px
                                </label>
                                <input
                                  type="range"
                                  min="-5"
                                  max="10"
                                  value={selectedElement.letterSpacing || 0}
                                  onChange={(e) => handlePropertyChange('letterSpacing', parseInt(e.target.value))}
                                  className="w-full"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    
                    {/* Text Path specific properties */}
                    {selectedElement?.type === 'textPath' && (
                      <>
                        {/* Content Group */}
                        <div className="mb-3 border border-gray-200 rounded-md overflow-hidden">
                          <button 
                            className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100"
                            onClick={(e) => {
                              // Only toggle if clicked directly on the button or its direct children
                              if (e.target === e.currentTarget || 
                                  e.target.parentElement === e.currentTarget ||
                                  e.target.parentElement?.parentElement === e.currentTarget) {
                                togglePropertyGroup('textPath');
                              }
                            }}
                          >
                            <div className="flex items-center">
                              <FiType className="mr-2 text-gray-600" />
                              <span className="text-sm font-medium">Curved Text</span>
                            </div>
                            {activePropertyGroup === 'textPath' ? <FiChevronUp /> : <FiChevronDown />}
                          </button>
                          
                          {activePropertyGroup === 'textPath' && (
                            <div className="p-3 border-t border-gray-200">
                              <div className="mb-3">
                                <textarea
                                  value={selectedElement.text}
                                  onChange={(e) => handlePropertyChange('text', e.target.value)}
                                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm min-h-8 max-h-40 focus:outline-none"
                                  rows={3}
                                />
                              </div>
                              
                              <div className="mb-3">
                                <label className="block text-xs text-gray-500 mb-1">Text Color</label>
                                <div className="flex items-center">
                                  <ColorPicker
                                    value={selectedElement.fill || '#000000'}
                                    onChange={(value) => handlePropertyChange('fill', value)}
                                    className="mr-2"
                                  />
                                  <input
                                    type="text"
                                    value={selectedElement.fill || '#000000'}
                                    onChange={(e) => handlePropertyChange('fill', e.target.value)}
                                    className="flex-1 rounded-md border border-gray-300 px-3 py-1 text-sm"
                                  />
                                </div>
                              </div>
                              
                              <div className="mb-3">
                                <label className="block text-xs text-gray-500 mb-1">Path Data (SVG Path)</label>
                                <textarea
                                  value={selectedElement.pathData}
                                  onChange={(e) => handlePropertyChange('pathData', e.target.value)}
                                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm min-h-8 max-h-40 focus:outline-none"
                                  rows={2}
                                  placeholder="e.g., M10,90 C100,30 200,90 290,90"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  Use SVG path data format. Example: M0,50 C100,0 200,100 300,50
                                </p>
                              </div>
                              
                              <div className="mb-3">
                                <label className="block text-xs text-gray-500 mb-1">Path Presets</label>
                                <div className="grid grid-cols-3 gap-2 mt-1">
                                  <button
                                    className="text-xs py-1 px-2 border rounded-md hover:bg-gray-50"
                                    onClick={() => handlePropertyChange('pathData', 'M10,90 C100,30 200,90 290,90')}
                                  >
                                    Wave
                                  </button>
                                  <button
                                    className="text-xs py-1 px-2 border rounded-md hover:bg-gray-50"
                                    onClick={() => handlePropertyChange('pathData', 'M10,90 Q150,10 290,90')}
                                  >
                                    Arc
                                  </button>
                                  <button
                                    className="text-xs py-1 px-2 border rounded-md hover:bg-gray-50"
                                    onClick={() => handlePropertyChange('pathData', 'M150,25 A45,45 0 1,1 150,115 A45,45 0 1,1 150,25')}
                                  >
                                    Circle
                                  </button>
                                  <button
                                    className="text-xs py-1 px-2 border rounded-md hover:bg-gray-50"
                                    onClick={() => handlePropertyChange('pathData', 'M50,25 L250,25 L250,115 L50,115 Z')}
                                  >
                                    Square
                                  </button>
                                  <button
                                    className="text-xs py-1 px-2 border rounded-md hover:bg-gray-50"
                                    onClick={() => handlePropertyChange('pathData', 'M50,100 L150,30 L250,100 Z')}
                                  >
                                    Triangle
                                  </button>
                                  <button
                                    className="text-xs py-1 px-2 border rounded-md hover:bg-gray-50"
                                    onClick={() => handlePropertyChange('pathData', 'M10,90 C50,10 150,150 290,70')}
                                  >
                                    S-Curve
                                  </button>
                                  <button
                                    className="text-xs py-1 px-2 border rounded-md hover:bg-gray-50"
                                    onClick={() => handlePropertyChange('pathData', 'M10,90 L50,50 L90,90 L130,50 L170,90 L210,50 L250,90 L290,50')}
                                  >
                                    ZigZag
                                  </button>
                                  <button
                                    className="text-xs py-1 px-2 border rounded-md hover:bg-gray-50"
                                    onClick={() => handlePropertyChange('pathData', 'M150,30 C120,10 80,30 60,70 C40,110 80,130 150,170 C220,130 260,110 240,70 C220,30 180,10 150,30')}
                                  >
                                    Heart
                                  </button>
                                  <button
                                    className="text-xs py-1 px-2 border rounded-md hover:bg-gray-50"
                                    onClick={() => handlePropertyChange('pathData', 'M150,70 C120,70 120,50 150,50 C180,50 180,30 150,30 C120,30 90,50 90,70 C90,100 120,120 150,120 C190,120 210,90 210,70 C210,40 180,20 150,20')}
                                  >
                                    Spiral
                                  </button>
                                  <button
                                    className="text-xs py-1 px-2 border rounded-md hover:bg-gray-50"
                                    onClick={() => handlePropertyChange('pathData', 'M50,70 C50,40 80,40 100,70 C120,100 150,100 170,70 C190,40 220,40 220,70 C220,100 190,100 170,70 C150,40 120,40 100,70 C80,100 50,100 50,70')}
                                  >
                                    Infinity
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Font Properties Group - same as for text */}
                        <div className="mb-3 border border-gray-200 rounded-md overflow-hidden">
                          <button 
                            className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100"
                            onClick={(e) => {
                              // Only toggle if clicked directly on the button or its direct children
                              if (e.target === e.currentTarget || 
                                  e.target.parentElement === e.currentTarget ||
                                  e.target.parentElement?.parentElement === e.currentTarget) {
                                togglePropertyGroup('font');
                              }
                            }}
                          >
                            <div className="flex items-center">
                              <RiFontSizeAi className="mr-2 text-gray-600" />
                              <span className="text-sm font-medium">Font Options</span>
                            </div>
                            {activePropertyGroup === 'font' ? <FiChevronUp /> : <FiChevronDown />}
                          </button>
                          
                          {/* Use the same font options as regular text, just copied */}
                          {activePropertyGroup === 'font' && (
                            <div className="p-3 border-t border-gray-200">
                              <div className="mb-2">
                                <label className="block text-xs text-gray-500 mb-1">Font Family</label>
                                <select
                                  value={selectedElement.fontFamily || 'Arial'}
                                  onChange={(e) => handlePropertyChange('fontFamily', e.target.value)}
                                  className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                                  style={{ fontFamily: selectedElement.fontFamily || 'Arial' }}
                                >
                                  {GOOGLE_FONTS.map(font => (
                                    <option 
                                      key={font.value} 
                                      value={font.value}
                                      style={{ fontFamily: font.value }}
                                    >
                                      {font.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              
                              <div className="mb-2">
                                <label className="block text-xs text-gray-500 mb-1">Font Size</label>
                                <input
                                  type="number"
                                  value={selectedElement.fontSize || 24}
                                  min={8}
                                  max={200}
                                  onChange={(e) => handlePropertyChange('fontSize', parseInt(e.target.value))}
                                  className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                                />
                              </div>
                              
                              <div className="mb-2">
                                <label className="block text-xs text-gray-500 mb-1">Font Weight</label>
                                <select
                                  value={selectedElement.fontWeight || 'normal'}
                                  onChange={(e) => handlePropertyChange('fontWeight', e.target.value)}
                                  className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                                >
                                  <option value="normal">Normal</option>
                                  <option value="bold">Bold</option>
                                  <option value="bolder">Bolder</option>
                                  <option value="lighter">Lighter</option>
                                  <option value="100">100</option>
                                  <option value="200">200</option>
                                  <option value="300">300</option>
                                  <option value="400">400</option>
                                  <option value="500">500</option>
                                  <option value="600">600</option>
                                  <option value="700">700</option>
                                  <option value="800">800</option>
                                  <option value="900">900</option>
                                </select>
                              </div>
                              
                              <div className="mb-2">
                                <label className="block text-xs text-gray-500 mb-1">Font Style</label>
                                <div className="flex border border-gray-300 rounded-md overflow-hidden">
                                  <button
                                    className={`flex-1 py-1 text-center ${selectedElement.fontStyle === 'normal' || !selectedElement.fontStyle ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600'}`}
                                    onClick={() => handlePropertyChange('fontStyle', 'normal')}
                                  >
                                    Normal
                                  </button>
                                  <button
                                    className={`flex-1 py-1 text-center ${selectedElement.fontStyle === 'italic' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600'}`}
                                    onClick={() => handlePropertyChange('fontStyle', 'italic')}
                                  >
                                    Italic
                                  </button>
                                </div>
                              </div>
                              
                              <div className="mb-2">
                                <label className="block text-xs text-gray-500 mb-1">Text Decoration</label>
                                <div className="flex border border-gray-300 rounded-md overflow-hidden">
                                  <button
                                    className={`flex-1 py-1 text-center ${selectedElement.textDecoration === 'none' || !selectedElement.textDecoration ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600'}`}
                                    onClick={() => handlePropertyChange('textDecoration', 'none')}
                                  >
                                    None
                                  </button>
                                  <button
                                    className={`flex-1 py-1 text-center ${selectedElement.textDecoration === 'underline' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600'}`}
                                    onClick={() => handlePropertyChange('textDecoration', 'underline')}
                                    style={{ textDecoration: 'underline' }}
                                  >
                                    Under
                                  </button>
                                  <button
                                    className={`flex-1 py-1 text-center ${selectedElement.textDecoration === 'line-through' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600'}`}
                                    onClick={() => handlePropertyChange('textDecoration', 'line-through')}
                                    style={{ textDecoration: 'line-through' }}
                                  >
                                    Strike
                                  </button>
                                </div>
                              </div>
                              
                              <div className="mb-2">
                                <label className="block text-xs text-gray-500 mb-1">
                                  Letter Spacing: {selectedElement.letterSpacing || 0}px
                                </label>
                                <input
                                  type="range"
                                  min="-5"
                                  max="10"
                                  value={selectedElement.letterSpacing || 0}
                                  onChange={(e) => handlePropertyChange('letterSpacing', parseInt(e.target.value))}
                                  className="w-full"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    
                    {/* Image specific properties */}
                    {selectedElement.type === 'image' && (
                      <div className="mb-3 border border-gray-200 rounded-md overflow-hidden">
                        <button 
                          className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100"
                          onClick={(e) => {
                            // Only toggle if clicked directly on the button or its direct children
                            if (e.target === e.currentTarget || 
                                e.target.parentElement === e.currentTarget ||
                                e.target.parentElement?.parentElement === e.currentTarget) {
                              togglePropertyGroup('image');
                            }
                          }}
                        >
                          <div className="flex items-center">
                            <FiSun className="mr-2 text-gray-600" />
                            <span className="text-sm font-medium">Image Filters</span>
                            
                            {/* Add enable toggle directly in the header */}
                            <div className="ml-2 flex items-center" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                id="filter-toggle"
                                checked={!!selectedElement?.filters}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  const currentGroup = activePropertyGroup;
                                  
                                  if (e.target.checked) {
                                    handleFilterPropertyChange('brightness', 100, e);
                                    handleFilterPropertyChange('contrast', 100, e);
                                    handleFilterPropertyChange('saturation', 100, e);
                                    handleFilterPropertyChange('blur', 0, e);
                                    handleFilterPropertyChange('grayscale', 0, e);
                                  } else {
                                    updateElement(selectedElementId, { filters: null });
                                  }
                                  
                                  // Make sure our property group stays open
                                  setTimeout(() => keepPropertyGroupOpen(currentGroup), 0);
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="mr-1"
                              />
                              <label 
                                htmlFor="filter-toggle" 
                                className="text-xs text-gray-700" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  const newValue = !selectedElement?.filters;
                                  const currentGroup = activePropertyGroup;
                                  
                                  if (newValue) {
                                    handleFilterPropertyChange('brightness', 100, e);
                                    handleFilterPropertyChange('contrast', 100, e);
                                    handleFilterPropertyChange('saturation', 100, e);
                                    handleFilterPropertyChange('blur', 0, e);
                                    handleFilterPropertyChange('grayscale', 0, e);
                                  } else {
                                    updateElement(selectedElementId, { filters: null });
                                  }
                                  
                                  // Make sure our property group stays open
                                  setTimeout(() => keepPropertyGroupOpen(currentGroup), 0);
                                }}
                              >
                                Enable
                              </label>
                            </div>
                          </div>
                          {activePropertyGroup === 'image' ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                        
                        {activePropertyGroup === 'image' && selectedElement?.filters && (
                          <div className="p-3 border-t border-gray-200">
                            {/* Filter preview */}
                            <div className="mb-3 relative w-full h-24 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                              {selectedElement?.src && (
                                <div 
                                  className="w-full h-full bg-contain bg-center bg-no-repeat"
                                  style={{
                                    backgroundImage: `url(${selectedElement?.src})`,
                                    filter: generateFilterString(selectedElement?.filters)
                                  }}
                                />
                              )}
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="text-xs text-gray-500 bg-white bg-opacity-75 px-2 py-1 rounded">
                                  Filter Preview
                                </span>
                              </div>
                            </div>
                            
                            <div className="mb-2">
                              <label className="block text-xs text-gray-500 mb-1">
                                Brightness: {selectedElement?.filters?.brightness || 100}%
                              </label>
                              <div className="flex items-center">
                                <input
                                  type="range"
                                  min="0"
                                  max="200"
                                  value={selectedElement?.filters?.brightness || 100}
                                  onChange={(e) => handleFilterPropertyChange('brightness', parseInt(e.target.value))}
                                  className="flex-1 mr-2"
                                  disabled={selectedElement?.locked}
                                />
                                <select
                                  value={selectedElement?.filters?.brightness || 100}
                                  onChange={(e) => handleFilterPropertyChange('brightness', parseInt(e.target.value))}
                                  className="w-20 rounded-md border border-gray-300 px-1 py-1 text-sm"
                                  disabled={selectedElement?.locked}
                                >
                                  <option value="50">50%</option>
                                  <option value="75">75%</option>
                                  <option value="100">100%</option>
                                  <option value="125">125%</option>
                                  <option value="150">150%</option>
                                  <option value="175">175%</option>
                                  <option value="200">200%</option>
                                </select>
                              </div>
                            </div>
                            
                            <div className="mb-2">
                              <label className="block text-xs text-gray-500 mb-1">
                                Contrast: {selectedElement?.filters?.contrast || 100}%
                              </label>
                              <div className="flex items-center">
                                <input
                                  type="range"
                                  min="0"
                                  max="200"
                                  value={selectedElement?.filters?.contrast || 100}
                                  onChange={(e) => handleFilterPropertyChange('contrast', parseInt(e.target.value))}
                                  className="flex-1 mr-2"
                                  disabled={selectedElement?.locked}
                                />
                                <select
                                  value={selectedElement?.filters?.contrast || 100}
                                  onChange={(e) => handleFilterPropertyChange('contrast', parseInt(e.target.value))}
                                  className="w-20 rounded-md border border-gray-300 px-1 py-1 text-sm"
                                  disabled={selectedElement?.locked}
                                >
                                  <option value="50">50%</option>
                                  <option value="75">75%</option>
                                  <option value="100">100%</option>
                                  <option value="125">125%</option>
                                  <option value="150">150%</option>
                                  <option value="175">175%</option>
                                  <option value="200">200%</option>
                                </select>
                              </div>
                            </div>
                            
                            <div className="mb-2">
                              <label className="block text-xs text-gray-500 mb-1">
                                Saturation: {selectedElement?.filters?.saturation || 100}%
                              </label>
                              <div className="flex items-center">
                                <input
                                  type="range"
                                  min="0"
                                  max="200"
                                  value={selectedElement?.filters?.saturation || 100}
                                  onChange={(e) => handleFilterPropertyChange('saturation', parseInt(e.target.value))}
                                  className="flex-1 mr-2"
                                  disabled={selectedElement?.locked}
                                />
                                <select
                                  value={selectedElement?.filters?.saturation || 100}
                                  onChange={(e) => handleFilterPropertyChange('saturation', parseInt(e.target.value))}
                                  className="w-20 rounded-md border border-gray-300 px-1 py-1 text-sm"
                                  disabled={selectedElement?.locked}
                                >
                                  <option value="0">0%</option>
                                  <option value="50">50%</option>
                                  <option value="100">100%</option>
                                  <option value="150">150%</option>
                                  <option value="200">200%</option>
                                </select>
                              </div>
                            </div>
                            
                            <div className="mb-2">
                              <label className="block text-xs text-gray-500 mb-1">
                                Blur: {selectedElement?.filters?.blur || 0}px
                              </label>
                              <div className="flex items-center">
                                <input
                                  type="range"
                                  min="0"
                                  max="10"
                                  value={selectedElement?.filters?.blur || 0}
                                  onChange={(e) => handleFilterPropertyChange('blur', parseInt(e.target.value))}
                                  className="flex-1 mr-2"
                                  disabled={selectedElement?.locked}
                                />
                                <select
                                  value={selectedElement?.filters?.blur || 0}
                                  onChange={(e) => handleFilterPropertyChange('blur', parseInt(e.target.value))}
                                  className="w-20 rounded-md border border-gray-300 px-1 py-1 text-sm"
                                  disabled={selectedElement?.locked}
                                >
                                  <option value="0">0px</option>
                                  <option value="1">1px</option>
                                  <option value="2">2px</option>
                                  <option value="3">3px</option>
                                  <option value="5">5px</option>
                                  <option value="8">8px</option>
                                  <option value="10">10px</option>
                                </select>
                              </div>
                            </div>
                            
                            <div className="mb-2">
                              <label className="block text-xs text-gray-500 mb-1">
                                Grayscale: {selectedElement?.filters?.grayscale || 0}%
                              </label>
                              <div className="flex items-center">
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={selectedElement?.filters?.grayscale || 0}
                                  onChange={(e) => handleFilterPropertyChange('grayscale', parseInt(e.target.value))}
                                  className="flex-1 mr-2"
                                  disabled={selectedElement?.locked}
                                />
                                <select
                                  value={selectedElement?.filters?.grayscale || 0}
                                  onChange={(e) => handleFilterPropertyChange('grayscale', parseInt(e.target.value))}
                                  className="w-20 rounded-md border border-gray-300 px-1 py-1 text-sm"
                                  disabled={selectedElement?.locked}
                                >
                                  <option value="0">0%</option>
                                  <option value="25">25%</option>
                                  <option value="50">50%</option>
                                  <option value="75">75%</option>
                                  <option value="100">100%</option>
                                </select>
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <button
                                onClick={handleFilterReset}
                                className="w-full py-2 px-3 rounded-md text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center"
                                disabled={selectedElement?.locked}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Reset All Filters
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Position and size for all elements */}
                    <div className="mb-3 border border-gray-200 rounded-md overflow-hidden">
                      <button 
                        className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100"
                        onClick={(e) => {
                          // Only toggle if clicked directly on the button or its direct children
                          if (e.target === e.currentTarget || 
                              e.target.parentElement === e.currentTarget ||
                              e.target.parentElement?.parentElement === e.currentTarget) {
                            togglePropertyGroup('position');
                          }
                        }}
                      >
                        <div className="flex items-center">
                          <FiMaximize className="mr-2 text-gray-600" />
                          <span className="text-sm font-medium">Position & Size</span>
                        </div>
                        {activePropertyGroup === 'position' ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                      
                      {activePropertyGroup === 'position' && (
                        <div className="p-3 border-t border-gray-200">
                          <div className="mb-3">
                            <label className="block text-xs text-gray-500 mb-1">Alignment</label>
                            <select
                              value="custom"
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === 'center') {
                                  // Center in canvas
                                  const canvasWidth = 800; // Default canvas width
                                  const canvasHeight = 600; // Default canvas height
                                  const newX = canvasWidth / 2;
                                  const newY = canvasHeight / 2;
                                  handlePropertyChange('x', newX);
                                  handlePropertyChange('y', newY);
                                } else if (value === 'topleft') {
                                  handlePropertyChange('x', 50);
                                  handlePropertyChange('y', 50);
                                } else if (value === 'topright') {
                                  handlePropertyChange('x', 750);
                                  handlePropertyChange('y', 50);
                                } else if (value === 'bottomleft') {
                                  handlePropertyChange('x', 50);
                                  handlePropertyChange('y', 550);
                                } else if (value === 'bottomright') {
                                  handlePropertyChange('x', 750);
                                  handlePropertyChange('y', 550);
                                }
                              }}
                              className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm mb-3"
                              disabled={selectedElement?.locked}
                            >
                              <option value="custom">Custom Position</option>
                              <option value="center">Center in Canvas</option>
                              <option value="topleft">Top Left</option>
                              <option value="topright">Top Right</option>
                              <option value="bottomleft">Bottom Left</option>
                              <option value="bottomright">Bottom Right</option>
                            </select>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">X Position</label>
                              <input
                                type="number"
                                value={Math.round(selectedElement?.x) || 0}
                                onChange={(e) => handlePropertyChange('x', parseInt(e.target.value))}
                                className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                                disabled={selectedElement?.locked}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Y Position</label>
                              <input
                                type="number"
                                value={Math.round(selectedElement?.y) || 0}
                                onChange={(e) => handlePropertyChange('y', parseInt(e.target.value))}
                                className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                                disabled={selectedElement?.locked}
                              />
                            </div>
                          </div>
                          
                          {/* Width and height for rectangle, text, and image */}
                          {['image'].includes(selectedElement?.type) && (
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Width</label>
                                <input
                                  type="number"
                                  value={Math.round(selectedElement?.width) || 100}
                                  min={1}
                                  onChange={(e) => handlePropertyChange('width', parseInt(e.target.value))}
                                  className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                                  disabled={selectedElement?.locked}
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Height</label>
                                <input
                                  type="number"
                                  value={Math.round(selectedElement?.height) || 100}
                                  min={1}
                                  onChange={(e) => handlePropertyChange('height', parseInt(e.target.value))}
                                  className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                                  disabled={selectedElement?.locked}
                                />
                              </div>
                            </div>
                          )}
                          
                          {/* Rotation for all */}
                          <div className="mb-3">
                            <label className="block text-xs text-gray-500 mb-1">Rotation: {Math.round(selectedElement?.rotation || 0)}°</label>
                            <div className="flex items-center">
                              <input
                                type="range"
                                min="0"
                                max="360"
                                value={Math.round(selectedElement?.rotation || 0)}
                                onChange={(e) => handlePropertyChange('rotation', parseInt(e.target.value))}
                                className="flex-1 mr-2"
                                disabled={selectedElement?.locked}
                              />
                              <select
                                value={selectedElement?.rotation || 0}
                                onChange={(e) => handlePropertyChange('rotation', parseInt(e.target.value))}
                                className="w-20 rounded-md border border-gray-300 px-1 py-1 text-sm"
                                disabled={selectedElement?.locked}
                              >
                                <option value="0">0°</option>
                                <option value="45">45°</option>
                                <option value="90">90°</option>
                                <option value="135">135°</option>
                                <option value="180">180°</option>
                                <option value="225">225°</option>
                                <option value="270">270°</option>
                                <option value="315">315°</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Opacity for all elements */}
                    <div className="mb-3 border border-gray-200 rounded-md overflow-hidden">
                      <button 
                        className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100"
                        onClick={(e) => {
                          // Only toggle if clicked directly on the button or its direct children
                          if (e.target === e.currentTarget || 
                              e.target.parentElement === e.currentTarget ||
                              e.target.parentElement?.parentElement === e.currentTarget) {
                            togglePropertyGroup('styling');
                          }
                        }}
                      >
                        <div className="flex items-center">
                          <FiDroplet className="mr-2 text-gray-600" />
                          <span className="text-sm font-medium">Styling & Effects</span>
                        </div>
                        {activePropertyGroup === 'styling' ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                      
                      {activePropertyGroup === 'styling' && (
                        <div className="p-3 border-t border-gray-200">
                          <div className="mb-3">
                            <label className="block text-xs text-gray-500 mb-1">
                              Opacity: {Math.round(((selectedElement.opacity !== undefined ? selectedElement.opacity : 1) * 100))}%
                            </label>
                            <div className="flex items-center">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={Math.round(((selectedElement.opacity !== undefined ? selectedElement.opacity : 1) * 100))}
                                onChange={(e) => handlePropertyChange('opacity', parseInt(e.target.value) / 100)}
                                className="flex-1 mr-2"
                              />
                              <select
                                value={Math.round(((selectedElement.opacity !== undefined ? selectedElement.opacity : 1) * 100))}
                                onChange={(e) => handlePropertyChange('opacity', parseInt(e.target.value) / 100)}
                                className="w-20 rounded-md border border-gray-300 px-1 py-1 text-sm"
                              >
                                <option value="100">100%</option>
                                <option value="75">75%</option>
                                <option value="50">50%</option>
                                <option value="25">25%</option>
                                <option value="0">0%</option>
                              </select>
                            </div>
                          </div>
                        
                          {/* Enhanced Border Properties - for applicable elements */}
                          {['rectangle', 'circle', 'triangle', 'star', 'polygon', 'text', 'image'].includes(selectedElement.type) && (
                            <div className="mb-3">
                              <div className="flex items-center mb-2">
                                <input
                                  type="checkbox"
                                  id="border-toggle"
                                  checked={selectedElement?.border?.enabled || false}
                                  onChange={(e) => {
                                    // Completely isolate this event
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handleBorderPropertyChange('enabled', e.target.checked, e);
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  className="mr-1"
                                />
                                <label 
                                  htmlFor="border-toggle" 
                                  className="text-xs text-gray-700"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    const newValue = !(selectedElement?.border?.enabled || false);
                                    handleBorderPropertyChange('enabled', newValue, e);
                                  }}
                                >
                                  Enable Border
                                </label>
                              </div>
                            
                              {selectedElement?.border?.enabled && (
                                <div className="pl-1 border-l-2 border-gray-100">
                                  <div className="mb-2">
                                    <label className="block text-xs text-gray-500 mb-1">Border Color</label>
                                    <div className="flex items-center">
                                      <ColorPicker
                                        value={selectedElement?.border?.color || '#000000'}
                                        onChange={(value) => handleBorderPropertyChange('color', value)}
                                        className="mr-2"
                                      />
                                      <input
                                        type="text"
                                        value={selectedElement?.border?.color || '#000000'}
                                        onChange={(e) => handleBorderPropertyChange('color', e.target.value, e)}
                                        className="flex-1 rounded-md border border-gray-300 px-3 py-1 text-sm"
                                      />
                                    </div>
                                  </div>
                                
                                  <div className="mb-2">
                                    <label className="block text-xs text-gray-500 mb-1">
                                      Width: {selectedElement?.border?.width || 0}px
                                    </label>
                                    <input
                                      type="range"
                                      min="0"
                                      max="20"
                                      value={selectedElement?.border?.width || 0}
                                      onChange={(e) => handleBorderPropertyChange('width', parseInt(e.target.value))}
                                      className="w-full"
                                      disabled={selectedElement?.locked}
                                    />
                                  </div>
                                
                                  <div className="mb-2">
                                    <label className="block text-xs text-gray-500 mb-1">Border Style</label>
                                    <select
                                      value={selectedElement?.border?.style || 'solid'}
                                      onChange={(e) => handleBorderPropertyChange('style', e.target.value, e)}
                                      className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                                      disabled={selectedElement?.locked}
                                    >
                                      <option value="solid">Solid</option>
                                      <option value="dashed">Dashed</option>
                                      <option value="dotted">Dotted</option>
                                    </select>
                                  </div>
                                
                                  {/* Border radius (for rectangle, text) */}
                                  {(['rectangle', 'text', 'image'].includes(selectedElement?.type)) && (
                                    <div className="mb-2">
                                      <label className="block text-xs text-gray-500 mb-1">
                                        Corner Radius: {selectedElement?.border?.radius || 0}px
                                      </label>
                                      <input
                                        type="range"
                                        min="0"
                                        max="50"
                                        value={selectedElement?.border?.radius || 0}
                                        onChange={(e) => handleBorderPropertyChange('radius', parseInt(e.target.value))}
                                        className="w-full"
                                        disabled={selectedElement?.locked}
                                      />
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        
                          {/* Element shadow properties */}
                          <div className="mb-3">
                            <div className="flex items-center mb-2">
                              <input
                                type="checkbox"
                                id="shadow-toggle"
                                checked={selectedElement?.shadow?.enabled || false}
                                onChange={(e) => {
                                  // Completely isolate this event
                                  e.stopPropagation();
                                  e.preventDefault();
                                  handleShadowPropertyChange('enabled', e.target.checked, e);
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="mr-1"
                              />
                              <label 
                                htmlFor="shadow-toggle" 
                                className="text-xs text-gray-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  const newValue = !(selectedElement?.shadow?.enabled || false);
                                  handleShadowPropertyChange('enabled', newValue, e);
                                }}
                              >
                                Enable Shadow
                              </label>
                            </div>
                          
                            {selectedElement?.shadow?.enabled && (
                              <div className="pl-1 border-l-2 border-gray-100">
                                <div className="mb-2">
                                  <label className="block text-xs text-gray-500 mb-1">Shadow Color</label>
                                  <div className="flex items-center">
                                    <ColorPicker
                                      value={selectedElement?.shadow?.color || 'rgba(0,0,0,0.5)'}
                                      onChange={(value) => handleShadowPropertyChange('color', value)}
                                      className="mr-2"
                                    />
                                    <input
                                      type="text"
                                      value={selectedElement?.shadow?.color || 'rgba(0,0,0,0.5)'}
                                      onChange={(e) => handleShadowPropertyChange('color', e.target.value, e)}
                                      className="flex-1 rounded-md border border-gray-300 px-3 py-1 text-sm"
                                      placeholder="rgba(0,0,0,0.5)"
                                      disabled={selectedElement?.locked}
                                    />
                                  </div>
                                </div>
                              
                                <div className="mb-2">
                                  <label className="block text-xs text-gray-500 mb-1">
                                    Blur: {selectedElement?.shadow?.blur || 5}px
                                  </label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    value={selectedElement?.shadow?.blur || 5}
                                    onChange={(e) => handleShadowPropertyChange('blur', parseInt(e.target.value))}
                                    className="w-full"
                                    disabled={selectedElement?.locked}
                                  />
                                </div>
                              
                                <div className="mb-2">
                                  <label className="block text-xs text-gray-500 mb-1">
                                    Spread: {selectedElement?.shadow?.spread || 0}px
                                  </label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    value={selectedElement?.shadow?.spread || 0}
                                    onChange={(e) => handleShadowPropertyChange('spread', parseInt(e.target.value))}
                                    className="w-full"
                                    disabled={selectedElement?.locked}
                                  />
                                </div>
                              
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">X Offset</label>
                                    <input
                                      type="number"
                                      value={selectedElement?.shadow?.offsetX || 5}
                                      onChange={(e) => handleShadowPropertyChange('offsetX', parseInt(e.target.value))}
                                      className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                                      disabled={selectedElement?.locked}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">Y Offset</label>
                                    <input
                                      type="number"
                                      value={selectedElement?.shadow?.offsetY || 5}
                                      onChange={(e) => handleShadowPropertyChange('offsetY', parseInt(e.target.value))}
                                      className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                                      disabled={selectedElement?.locked}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
                
                {/* Add Element Actions at the bottom - show even for locked elements */}
                <div className="mt-4 border-t border-gray-200 pt-4">
                  {/* <h3 className="font-medium text-sm mb-3">Element Actions</h3> */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        if (!selectedElement.locked) {
                          duplicateElement(selectedElementId);
                          addToHistory('Duplicate element');
                        }
                      }}
                      className={`flex-1 py-2 px-3 flex items-center justify-center rounded-md text-sm 
                        ${selectedElement.locked 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                      disabled={selectedElement.locked}
                    >
                      <FiCopy className="mr-2" /> Duplicate
                    </button>
                    <button
                      onClick={() => {
                        if (!selectedElement.locked) {
                          deleteElement(selectedElementId);
                          addToHistory('Delete element');
                        }
                      }}
                      className={`flex-1 py-2 px-3 flex items-center justify-center rounded-md text-sm 
                        ${selectedElement.locked 
                          ? 'bg-red-100 text-red-300 cursor-not-allowed' 
                          : 'bg-red-500 hover:bg-red-600 text-white'}`}
                      disabled={selectedElement.locked}
                    >
                      <FiTrash className="mr-2" /> Delete
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                <FiMousePointer size={24} className="mb-2" />
                <p className="text-sm">Select an element to edit its properties</p>
              </div>
            )}
          </div>
        )}
        
        {/* Layers Tab */}
        {activeTab === 'layers' && (
          <div className="p-3">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-sm">Layers</h3>
              <div className="flex space-x-1">
                <button
                  disabled={!selectedElementId}
                  onClick={() => {
                    if (selectedElementId) {
                      moveElementToTop(selectedElementId);
                      addToHistory('Move to front');
                    }
                  }}
                  className={`p-1 rounded hover:bg-gray-100 ${!selectedElementId ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700'}`}
                  title="Move to Front"
                >
                  <FiCornerUpLeft size={14} />
                </button>
                <button
                  disabled={!selectedElementId}
                  onClick={() => {
                    if (selectedElementId) {
                      moveElementUp(selectedElementId);
                      addToHistory('Move layer up');
                    }
                  }}
                  className={`p-1 rounded hover:bg-gray-100 ${!selectedElementId ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700'}`}
                  title="Move Layer Up"
                >
                  <FiArrowUp size={14} />
                </button>
                <button
                  disabled={!selectedElementId}
                  onClick={() => {
                    if (selectedElementId) {
                      moveElementDown(selectedElementId);
                      addToHistory('Move layer down');
                    }
                  }}
                  className={`p-1 rounded hover:bg-gray-100 ${!selectedElementId ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700'}`}
                  title="Move Layer Down"
                >
                  <FiArrowDown size={14} />
                </button>
                <button
                  disabled={!selectedElementId}
                  onClick={() => {
                    if (selectedElementId) {
                      moveElementToBottom(selectedElementId);
                      addToHistory('Move to back');
                    }
                  }}
                  className={`p-1 rounded hover:bg-gray-100 ${!selectedElementId ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700'}`}
                  title="Move to Back"
                >
                  <FiCornerUpLeft size={14} style={{ transform: 'rotate(180deg)' }} />
                </button>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-md overflow-hidden">
              {elements.length === 0 ? (
                <div className="p-3 text-center text-gray-500 text-sm">
                  No elements on canvas yet
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {/* Render layers in reverse (top to bottom) */}
                  {[...elements].reverse().map((element) => (
                    <div 
                      key={element.id}
                      className={`flex items-center p-2 cursor-pointer group ${
                        selectedElementId === element.id ? 'bg-indigo-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => selectElement(element.id)}
                    >
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVisibilityToggle(element.id);
                          }}
                          className="text-gray-500 hover:text-gray-700"
                          title={element.visible === false ? "Show Layer" : "Hide Layer"}
                        >
                          {element.visible === false ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                        </button>
                        
                        <button
                          onClick={(e) => handleLockToggle(element.id, e)}
                          className="text-gray-500 hover:text-gray-700"
                          title={element.locked ? "Unlock Layer" : "Lock Layer"}
                        >
                          {element.locked ? <FiLock size={14} className="text-yellow-500" /> : <FiUnlock size={14} />}
                        </button>
                      </div>
                      
                      <div 
                        className="w-5 h-5 flex items-center justify-center text-xs mx-2 bg-gray-100 rounded"
                        style={{ color: element.fill || element.stroke || '#000' }}
                      >
                        {getElementTypeIcon(element.type)}
                      </div>
                      
                      <div className="flex-1 text-sm truncate">
                        {editingLayerId === element.id ? (
                          <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={newLayerName}
                              onChange={(e) => setNewLayerName(e.target.value)}
                              className="flex-1 min-w-0 py-0 px-1 text-sm border border-gray-300 rounded"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleSaveRename(element.id, e);
                                } else if (e.key === 'Escape') {
                                  setEditingLayerId(null);
                                }
                              }}
                            />
                            <button
                              onClick={(e) => handleSaveRename(element.id, e)}
                              className="ml-1 text-indigo-600"
                            >
                              <FiCheck size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className={element.locked ? "text-gray-400" : "" + 'w-24 overflow-hidden text-ellipsis whitespace-nowrap'}>
                              {element.name || getElementName(element)}
                            </span>
                            
                            {/* Edit button always visible (not only on hover) */}
                            <button
                              onClick={(e) => handleStartRename(element, e)}
                              className={`ml-2 text-gray-500 hover:text-gray-700 ${
                                element.locked ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              disabled={element.locked}
                            >
                              <FiEdit size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {/* Remove duplicate/copy button from layer items - only keep delete button */}
                      <div className="flex items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!element.locked) {
                              deleteElement(element.id);
                            }
                          }}
                          className={`text-gray-500 hover:text-red-600 p-1 rounded hover:bg-gray-100 ${
                            element.locked ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={element.locked}
                          title="Delete Layer"
                        >
                          <FiTrash size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              *Layers at the top of the list appear in front on the canvas
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 