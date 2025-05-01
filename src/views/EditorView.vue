<template>
  <div class="editor-container">
    <!-- Top Toolbar -->
    <div class="editor-toolbar">
      <div class="logo-section">
        <h2>InPost Editor</h2>
      </div>
      <div class="actions-section">
        <Button icon="pi pi-save" label="Save" class="mr-2" @click="saveProject" />
        <Button icon="pi pi-download" label="Export" @click="toggleExportDialog" severity="success" />
      </div>
    </div>

    <!-- Main Editor Area -->
    <div class="editor-main">
      <!-- Left Sidebar -->
      <div class="editor-sidebar left-sidebar">
        <Tabs v-model:value="activeLeftTab">
          <TabList>
            <Tab value="editor">Editor</Tab>
            <Tab value="templates">Templates</Tab>
          </TabList>
          <TabPanels>
            <!-- Editor Panel -->
            <TabPanel value="editor">
              <Accordion v-model:activeIndex="activeLeftAccordion">
                <AccordionPanel value="0">
                  <AccordionHeader>Sizing</AccordionHeader>
                  <AccordionContent>
                    <div class="tool-section">
                      <CanvasSizeSelector @size-change="handleCanvasSizeChange" v-if="!showInitialSizeSelector" />
                    </div>
                  </AccordionContent>
                </AccordionPanel>
                
                <AccordionPanel value="1">
                  <AccordionHeader>Layouts</AccordionHeader>
                  <AccordionContent>
                    <div class="tool-section">
                      <div class="layouts-grid">
                        <div
                          v-for="(layout, index) in layouts"
                          :key="`layout-${index}`"
                          class="layout-item"
                          @click="applyLayout(layout)"
                        >
                          <div class="layout-preview">{{ layout.icon }}</div>
                          <span class="layout-name">{{ layout.name }}</span>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionPanel>
                
                <AccordionPanel value="2">
                  <AccordionHeader>Shapes</AccordionHeader>
                  <AccordionContent>
                    <div class="tool-section">
                      <div class="element-grid">
                        <Button icon="pi pi-stop" @click="addRectangle" severity="primary" v-tooltip.top="'Add Rectangle'" />
                        <Button icon="pi pi-circle" @click="addCircle" severity="success" v-tooltip.top="'Add Circle'" />
                        <Button icon="pi pi-minus" @click="addLine" severity="info" v-tooltip.top="'Add Line'" />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionPanel>
                
                <AccordionPanel value="3">
                  <AccordionHeader>Text</AccordionHeader>
                  <AccordionContent>
                    <div class="tool-section">
                      <Button label="Add Text" icon="pi pi-pencil" class="w-full mb-2" severity="primary" @click="addText" />
                      <TextTool @add-text="handleAddText" />
                    </div>
                  </AccordionContent>
                </AccordionPanel>
                
                <AccordionPanel value="4">
                  <AccordionHeader>Images</AccordionHeader>
                  <AccordionContent>
                    <div class="tool-section">
                      <FileUploader @file-uploaded="handleImageUpload" />
                    </div>
                  </AccordionContent>
                </AccordionPanel>
                
                <AccordionPanel value="5">
                  <AccordionHeader>Background</AccordionHeader>
                  <AccordionContent>
                    <div class="tool-section">
                      <h4>Colors</h4>
                      <div class="color-picker">
                      <div
                        v-for="color in backgroundColors"
                        :key="color"
                        class="color-swatch"
                        :style="{ backgroundColor: color }"
                        @click="setBackgroundColor(color)"
                      ></div>
                    </div>
                    
                    <h4 class="mt-3">Patterns</h4>
                    <div class="patterns-grid">
                      <div
                        v-for="(pattern, index) in backgroundPatterns"
                        :key="`pattern-${index}`"
                        class="pattern-swatch"
                        :style="{ backgroundImage: pattern.value }"
                        @click="setBackgroundPattern(pattern.value)"
                        ></div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionPanel>
              </Accordion>
            </TabPanel>
            
            <!-- Templates Panel -->
            <TabPanel value="templates">
              <div class="tool-section">
                <div class="templates-grid">
                  <div 
                    v-for="(template, index) in templates" 
                    :key="index" 
                    class="template-item"
                    @click="applyTemplate(template)"
                  >
                    <img :src="template.thumbnail" :alt="template.name" />
                    <span>{{ template.name }}</span>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>

      <!-- Center Canvas Area -->
      <div class="canvas-area">
        <DesignCanvas ref="canvas" :class="{ 'hidden': showInitialSizeSelector }" />
      </div>

      <!-- Right Sidebar -->
      <div class="editor-sidebar right-sidebar">
        <Tabs v-model:value="activeRightTab">
          <TabList>
            <Tab v-for="tab in rightSidebarTabs" :key="tab.value" :value="tab.value">
              {{ tab.title }}
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel v-for="tab in rightSidebarTabs" :key="tab.value" :value="tab.value">
              <component :is="tab.component" 
                v-bind="tab.props" 
                v-on="tab.events" />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>

    <!-- Initial Canvas Size Dialog -->
    <InitialCanvasSizeSelector 
      :visible="showInitialSizeSelector" 
      @size-selected="handleInitialSizeSelection" 
    />

    <!-- Export Dialog -->
    <Dialog v-model:visible="exportDialogVisible" header="Export Design" modal>
      <div class="export-options">
        <h3>Choose Format</h3>
        <div class="format-options">
          <div 
            v-for="format in exportFormats" 
            :key="format.id"
            class="format-option"
            :class="{ 'selected': selectedFormat === format.id }"
            @click="selectedFormat = format.id"
          >
            <i :class="format.icon"></i>
            <span>{{ format.name }}</span>
          </div>
        </div>
        <div class="export-actions mt-4">
          <Button label="Cancel" icon="pi pi-times" @click="exportDialogVisible = false" class="p-button-text" />
          <Button label="Export" icon="pi pi-download" @click="exportDesign" severity="success" />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import Accordion from 'primevue/accordion';
import AccordionContent from 'primevue/accordioncontent';
import AccordionHeader from 'primevue/accordionheader';
import AccordionPanel from 'primevue/accordionpanel';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Tab from 'primevue/tab';
import TabList from 'primevue/tablist';
import TabPanel from 'primevue/tabpanel';
import TabPanels from 'primevue/tabpanels';
import Tabs from 'primevue/tabs';
import { onMounted, reactive, ref, watch } from 'vue';

// Import custom components
import CanvasSizeSelector from '@/components/editor/CanvasSizeSelector.vue';
import DesignCanvas from '@/components/editor/DesignCanvas.vue';
import ElementProperties from '@/components/editor/ElementProperties.vue';
import FileUploader from '@/components/editor/FileUploader.vue';
import HistoryList from '@/components/editor/HistoryList.vue';
import InitialCanvasSizeSelector from '@/components/editor/InitialCanvasSizeSelector.vue';
import LayerManager from '@/components/editor/LayerManager.vue';
import TextTool from '@/components/editor/TextTool.vue';

// Import export service
import {
  downloadFile,
  exportAsJPG, exportAsPDF,
  exportAsPNG,
  exportAsSVG,
  loadProject as loadProjectFromFile,
  saveProject as saveProjectToFile
} from '@/services/exportService';

// Canvas reference
const canvas = ref(null);

// Canvas initialization state
const canvasInitialized = ref(false);
const showInitialSizeSelector = ref(true);

// Selected element state
const selectedElement = ref(null);

// Export dialog state
const exportDialogVisible = ref(false);
const selectedFormat = ref('png');
const exportFormats = [
  { id: 'png', name: 'PNG Image', icon: 'pi pi-image' },
  { id: 'jpg', name: 'JPG Image', icon: 'pi pi-image' },
  { id: 'pdf', name: 'PDF Document', icon: 'pi pi-file-pdf' },
  { id: 'svg', name: 'SVG Vector', icon: 'pi pi-file' },
  { id: '.inpost', name: 'InPost', icon: 'pi pi-code' },
];

// Template data
const templates = reactive([
  { 
    name: 'Social Media Post', 
    thumbnail: '/templates/social-post.jpg',
    width: 1080,
    height: 1080,
    elements: [] // Would contain actual elements data
  },
  { 
    name: 'Instagram Story', 
    thumbnail: '/templates/instagram-story.jpg',
    width: 1080,
    height: 1920,
    elements: []
  },
  { 
    name: 'Facebook Cover', 
    thumbnail: '/templates/facebook-cover.jpg',
    width: 820,
    height: 312,
    elements: []
  }
]);

// Add new reactive state
const activeLeftTab = ref('editor');
const activeLeftAccordion = ref(['0']); // Default open the first panel
const activeRightTab = ref('properties');

// Add this with other reactive state
const rightSidebarTabs = ref([
  { 
    title: 'Properties', 
    value: 'properties', 
    component: ElementProperties,
    props: { 'selected-element': selectedElement },
    events: { 'update-element': updateElement }
  },
  { 
    title: 'Layers', 
    value: 'layers', 
    component: LayerManager,
    props: {},
    events: { 'layer-updated': refreshCanvas }
  },
  { 
    title: 'History', 
    value: 'history', 
    component: HistoryList,
    props: {},
    events: { 'restore-state': restoreState }
  }
]);

// Sample layout data
const layouts = ref([
  { name: 'Single Column', icon: '⬜', config: { type: 'single' } },
  { name: 'Two Column', icon: '⏸', config: { type: 'two-column' } },
  { name: 'Three Column', icon: '☰', config: { type: 'three-column' } },
  { name: 'Grid', icon: '▦', config: { type: 'grid' } },
]);

// Update the color palette to standard UI colors
const backgroundColors = ref([
  '#FFFFFF', // White
  '#F3F4F6', // Light Gray (neutral-100)
  '#3B82F6', // Primary (blue-500)
  '#10B981', // Success (emerald-500)
  '#F59E0B', // Warning (amber-500)
  '#EF4444', // Danger (red-500)
  '#8B5CF6', // Purple (violet-500)
  '#EC4899', // Pink (pink-500)
  '#6366F1', // Indigo (indigo-500)
]);

// Sample background patterns
const backgroundPatterns = ref([
  { name: 'Dots', value: 'radial-gradient(#000 1px, transparent 1px)' },
  { name: 'Lines', value: 'linear-gradient(#E0E0E0 1px, transparent 1px)' },
  { name: 'Grid', value: 'linear-gradient(#E0E0E0 1px, transparent 1px), linear-gradient(90deg, #E0E0E0 1px, transparent 1px)' },
  { name: 'Diagonal', value: 'repeating-linear-gradient(45deg, #f5f5f5, #f5f5f5 10px, #ffffff 10px, #ffffff 20px)' },
]);

// Save editor preferences to localStorage
function saveEditorPreferences() {
  const preferences = {
    activeLeftAccordion: activeLeftAccordion.value,
    activeLeftTab: activeLeftTab.value,
    activeRightTab: activeRightTab.value,
    lastSavedAt: new Date().toISOString()
  };
  
  try {
    localStorage.setItem('editorPreferences', JSON.stringify(preferences));
    console.log('Editor preferences saved to localStorage');
  } catch (error) {
    console.error('Failed to save editor preferences:', error);
  }
}

// Load editor preferences from localStorage
function loadEditorPreferences() {
  try {
    const saved = localStorage.getItem('editorPreferences');
    if (saved) {
      const preferences = JSON.parse(saved);
      if (preferences.activeLeftAccordion) {
        activeLeftAccordion.value = preferences.activeLeftAccordion;
      }
      if (preferences.activeLeftTab) {
        activeLeftTab.value = preferences.activeLeftTab;
      }
      if (preferences.activeRightTab) {
        activeRightTab.value = preferences.activeRightTab;
      }
      console.log('Editor preferences loaded from localStorage');
    }
  } catch (error) {
    console.error('Failed to load editor preferences:', error);
  }
}

// Watch for changes to save preferences
watch(activeLeftAccordion, () => {
  saveEditorPreferences();
}, { deep: true });

// Watch for changes to active right tab
watch(activeRightTab, () => {
  saveEditorPreferences();
});

// Watch for left tab changes
watch(activeLeftTab, () => {
  saveEditorPreferences();
});

// Handle initial canvas size selection
function handleInitialSizeSelection(size) {
  console.log('Initial canvas size selected:', size);
  
  // Make sure we have a canvas reference
  if (!canvas.value) {
    console.error('Canvas reference not available');
    return;
  }
  
  // Update canvas size
  if (size && typeof size.width === 'number' && typeof size.height === 'number') {
    try {
      canvas.value.setCanvasSize(size.width, size.height);
      
      // Update UI state
      canvasInitialized.value = true;
      showInitialSizeSelector.value = false;
      
      // Log to console
      console.log(`Canvas initialized with size ${size.width}x${size.height}`);
      
      // Add a default rectangle to ensure the canvas is working properly
      setTimeout(() => {
        canvas.value.addRectangle({
          x: size.width / 2 - 50,
          y: size.height / 2 - 50,
          width: 100,
          height: 100,
          fill: '#3B82F6'
        });
        console.log('Added default rectangle to initialize canvas');
      }, 300);
    } catch (error) {
      console.error('Error initializing canvas:', error);
    }
  } else {
    console.error('Invalid size object:', size);
  }
}

// Canvas element functions - fix the element creation
function addRectangle() {
  if (!canvas.value) {
    console.error('Canvas not available');
    return;
  }
  
  try {
    canvas.value.addRectangle({
      x: 100,
      y: 100,
      width: 150,
      height: 100,
      fill: '#3B82F6' // Primary blue
    });
    console.log('Rectangle added successfully');
  } catch (error) {
    console.error('Failed to add rectangle:', error);
  }
}

function addCircle() {
  if (!canvas.value) {
    console.error('Canvas not available');
    return;
  }
  
  try {
    canvas.value.addCircle({
      x: 100,
      y: 100,
      radius: 50,
      fill: '#10B981' // Success green
    });
    console.log('Circle added successfully');
  } catch (error) {
    console.error('Failed to add circle:', error);
  }
}

function addLine() {
  if (!canvas.value) {
    console.error('Canvas not available');
    return;
  }
  
  try {
    canvas.value.addLine({
      points: [50, 50, 200, 50],
      stroke: '#6366F1', // Indigo
      strokeWidth: 4
    });
    console.log('Line added successfully');
  } catch (error) {
    console.error('Failed to add line:', error);
  }
}

function addText() {
  if (!canvas.value) {
    console.error('Canvas not available');
    return;
  }
  
  try {
    canvas.value.addText({
      text: 'Your text here',
      x: 100,
      y: 100,
      fontSize: 24,
      fill: '#000000'
    });
    console.log('Text added successfully');
  } catch (error) {
    console.error('Failed to add text:', error);
  }
}

function handleAddText(textConfig) {
  if (!canvas.value) {
    console.error('Canvas not available');
    return;
  }
  
  try {
    canvas.value.addText(textConfig);
    console.log('Custom text added successfully');
  } catch (error) {
    console.error('Failed to add custom text:', error);
  }
}

function handleImageUpload(imageData) {
  if (!canvas.value) {
    console.error('Canvas not available');
    return;
  }
  
  try {
    canvas.value.addImage({
      src: imageData.url,
      x: 100,
      y: 100
    });
    console.log('Image added successfully');
  } catch (error) {
    console.error('Failed to add image:', error);
  }
}

function updateElement(updates) {
  // Update the selected element properties
  console.log('Updating element:', updates);
}

function handleCanvasSizeChange(size) {
  console.log('Canvas size changed:', size);
  
  // Make sure we have a canvas reference
  if (!canvas.value) {
    console.error('Canvas reference not available');
    return;
  }
  
  // Update canvas size - size should be an object with width and height
  if (size && typeof size.width === 'number' && typeof size.height === 'number') {
    canvas.value.setCanvasSize(size.width, size.height);
    console.log(`Canvas resized to ${size.width}x${size.height}`);
    
    // You might want to dispatch an event or notify other components about the resize
    // This could be useful for responsive UI adjustments
  } else {
    console.error('Invalid size object:', size);
  }
}

function refreshCanvas() {
  // Refresh the canvas after layer changes
  console.log('Refreshing canvas');
}

function restoreState(data) {
  console.log('Restoring state from history:', data);
  
  // If we have the canvas ref
  if (canvas.value) {
    try {
      // Force the canvas to load state from localStorage
      canvas.value.loadCanvasState();
      
      // Refresh the canvas with a slight delay to ensure state is fully applied
      setTimeout(() => {
        canvas.value.forceRedraw();
        console.log('Canvas refreshed after history state change');
      }, 50);
    } catch (error) {
      console.error('Error restoring canvas state:', error);
    }
  } else {
    console.error('Canvas reference not available for state restoration');
  }
}

function applyTemplate(template) {
  // Apply template to canvas
  console.log('Applying template:', template);
}

function applyLayout(layout) {
  console.log('Applying layout:', layout);
  // Implement layout application logic
}

function setBackgroundColor(color) {
  console.log('Setting background color:', color);
  // Implementation to set canvas background color
  if (canvas.value) {
    // Update canvas background color
    const konvaStage = canvas.value.getStage();
    if (konvaStage) {
      konvaStage.container().style.backgroundColor = color;
    }
  }
}

function setBackgroundPattern(pattern) {
  console.log('Setting background pattern:', pattern);
  // Implementation to set canvas background pattern
  if (canvas.value) {
    // Update canvas background pattern
    const konvaStage = canvas.value.getStage();
    if (konvaStage) {
      konvaStage.container().style.backgroundImage = pattern;
      konvaStage.container().style.backgroundSize = '20px 20px';
    }
  }
}

function exportDesign() {
  try {
    // Get the stage reference from the canvas
    console.log("Getting stage from canvas.value:", canvas.value);
    const stage = canvas.value.getStage();
    
    console.log("Stage object:", stage);
    
    if (!stage) {
      console.error('Cannot find stage');
      return;
    }

    let data;
    let filename;

    switch (selectedFormat.value) {
      case 'png':
        data = exportAsPNG(stage);
        filename = 'design.png';
        break;
      case 'jpg':
        data = exportAsJPG(stage);
        filename = 'design.jpg';
        break;
      case 'pdf':
        exportAsPDF(stage).then(pdfData => {
          downloadFile(pdfData, 'design.pdf', 'application/pdf');
        }).catch(error => {
          console.error('PDF export error:', error);
        });
        exportDialogVisible.value = false;
        return;
      case 'svg':
        data = exportAsSVG(stage);
        filename = 'design.svg';
        break;
    }

    if (data) {
      downloadFile(data, filename);
      console.log(`Successfully exported as ${filename}`);
    } else {
      console.error('Export returned no data');
    }
  } catch (error) {
    console.error('Error during export:', error);
  }

  exportDialogVisible.value = false;
}

// Project functions
function saveProject() {
  // Get the stage reference
  const stage = canvas.value.getStage();
  
  if (!stage) {
    console.error('Cannot find stage');
    return;
  }

  try {
    // Get canvas dimensions - try multiple approaches
    let width = 800;
    let height = 600;
    
    if (typeof stage.width === 'function') {
      width = stage.width();
      height = stage.height();
    } else if (stage.width !== undefined) {
      width = stage.width;
      height = stage.height;
    } else if (stage.attrs) {
      width = stage.attrs.width;
      height = stage.attrs.height;
    }

    // Get all canvas elements
    const projectData = {
      version: '1.0',
      name: 'Untitled Design',
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      canvas: {
        width: width,
        height: height,
      },
      elements: {
        // We'll need to pass this data from the DesignCanvas component
        // For now, we'll use empty arrays to prevent errors
        text: [],
        rectangles: [],
        circles: [],
        images: [],
        lines: []
      }
    };

    saveProjectToFile(projectData);
  } catch (error) {
    console.error('Error saving project:', error);
  }
}

function loadProject(file) {
  loadProjectFromFile(file)
    .then(projectData => {
      // Clear the canvas
      canvas.value.clearCanvas();
      
      // Set canvas size
      canvas.value.setCanvasSize(
        projectData.canvas.width, 
        projectData.canvas.height
      );
      
      // Load elements
      if (projectData.elements.text) {
        projectData.elements.text.forEach(text => {
          canvas.value.addText(text);
        });
      }
      
      if (projectData.elements.rectangles) {
        projectData.elements.rectangles.forEach(rect => {
          canvas.value.addRectangle(rect);
        });
      }
      
      if (projectData.elements.circles) {
        projectData.elements.circles.forEach(circle => {
          canvas.value.addCircle(circle);
        });
      }
      
      if (projectData.elements.lines) {
        projectData.elements.lines.forEach(line => {
          canvas.value.addLine(line);
        });
      }
      
      // Images require special handling since they need to be loaded
      if (projectData.elements.images) {
        projectData.elements.images.forEach(image => {
          if (image.src) {
            canvas.value.addImage(image);
          }
        });
      }
    })
    .catch(error => {
      console.error('Failed to load project:', error);
      // Show error notification
    });
}

function toggleExportDialog() {
  exportDialogVisible.value = true;
}

onMounted(() => {
  // Load saved preferences
  loadEditorPreferences();
  
  // Initial setup
});
</script>

<style>
/* Add your global styles here */
.editor-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid #e0e0e0;
  height: 60px;
  background-color: #f8fafc; /* slate-50 */
}

.editor-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.editor-sidebar {
  width: 250px;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
}

.right-sidebar {
  border-right: none;
  border-left: 1px solid #e0e0e0;
}

.canvas-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  overflow: auto;
  position: relative;
}

/* Add a checkered background pattern to indicate transparency */
.canvas-area::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(45deg, #e0e0e0 25%, transparent 25%), 
    linear-gradient(-45deg, #e0e0e0 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #e0e0e0 75%),
    linear-gradient(-45deg, transparent 75%, #e0e0e0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  opacity: 0.5;
  z-index: 0;
}

/* Ensure canvas is above the checkered background */
.canvas-container {
  position: relative;
  z-index: 1;
}

.tool-section {
  margin-bottom: 6px;
  padding: 8px;
}

.tool-section h3 {
  font-size: 14px;
  margin-bottom: 8px;
}

.element-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 5px;
}

.template-item {
  cursor: pointer;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 4px;
  text-align: center;
}

.template-item img {
  width: 100%;
  height: auto;
}

.export-options {
  width: 100%;
  padding: 16px;
}

.format-options {
  display: flex;
  gap: 16px;
  margin-top: 16px;
  flex-wrap: wrap;
  max-width: 340px;
  justify-content: center;
}

.format-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: auto;
  justify-content: center;
  width: 150px;
  height: 120px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.format-option:hover {
  background-color: #f5f5f5;
}

.format-option.selected {
  background-color: #e7f4ff;
  border-color: #007bff;
}

.format-option i {
  font-size: 24px;
  margin-bottom: 8px;
}

.export-actions {
  display: flex;
  justify-content: flex-end;
}

/* Add this to hide the canvas when needed */
.hidden {
  display: none;
}

/* Layout grid */
.layouts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 5px;
}

.layout-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s;
}

.layout-item:hover {
  border-color: #007bff;
  background-color: #f0f7ff;
  transform: translateY(-2px);
}

.layout-preview {
  font-size: 24px;
  margin-bottom: 5px;
}

.layout-name {
  font-size: 12px;
  text-align: center;
}

/* Color picker */
.color-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 5px;
}

.color-swatch {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  border: 1px solid #ddd;
  cursor: pointer;
  transition: transform 0.2s;
}

.color-swatch:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

/* Patterns grid */
.patterns-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 5px;
}

.pattern-swatch {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  border: 1px solid #ddd;
  cursor: pointer;
  background-size: 10px 10px;
  transition: transform 0.2s;
}

.pattern-swatch:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

/* Section headers */
.tool-section h4 {
  font-size: 13px;
  margin: 10px 0 8px 0;
  color: #555;
  font-weight: 500;
}

/* Ensure tabs work well in sidebars */
.editor-sidebar :deep(.p-tabview-panels),
.editor-sidebar :deep(.p-tabpanel) {
  padding: 0;
}

.editor-sidebar :deep(.p-tabview-nav),
.editor-sidebar :deep(.p-tablist) {
  border: none;
}

.editor-sidebar :deep(.p-accordion .p-accordion-header) {
  margin-bottom: 2px;
}

.editor-sidebar :deep(.p-accordion .p-accordion-content) {
  padding: 5px;
  border: none;
}

/* Make tabs in sidebar more compact */
.editor-sidebar :deep(.p-tabview .p-tabview-nav li .p-tabview-nav-link),
.editor-sidebar :deep(.p-tablist li .p-tab) {
  padding: 10px 15px;
  font-size: 14px;
}

/* UI Color Variables */
:root {
  --color-primary: #3B82F6; /* blue-500 */
  --color-secondary: #6B7280; /* gray-500 */
  --color-success: #10B981; /* emerald-500 */
  --color-info: #6366F1; /* indigo-500 */
  --color-warning: #F59E0B; /* amber-500 */
  --color-danger: #EF4444; /* red-500 */
  --color-light: #F3F4F6; /* gray-100 */
  --color-dark: #1F2937; /* gray-800 */
}

/* Button styling enhancements */
:deep(.p-button.p-button-primary) {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

:deep(.p-button.p-button-success) {
  background-color: var(--color-success);
  border-color: var(--color-success);
}

:deep(.p-button.p-button-info) {
  background-color: var(--color-info);
  border-color: var(--color-info);
}

:deep(.p-button.p-button-warning) {
  background-color: var(--color-warning);
  border-color: var(--color-warning);
}

:deep(.p-button.p-button-danger) {
  background-color: var(--color-danger);
  border-color: var(--color-danger);
}

/* Accordion styling */
.editor-sidebar :deep(.p-accordion .p-accordion-header .p-accordion-header-link) {
  background-color: var(--color-light);
  color: var(--color-dark);
  border: none;
  border-radius: 4px;
  margin-bottom: 2px;
  font-weight: 500;
}

.editor-sidebar :deep(.p-accordion .p-accordion-header:not(.p-disabled).p-highlight .p-accordion-header-link) {
  background-color: var(--color-primary);
  color: white;
}

.editor-sidebar :deep(.p-accordion .p-accordion-content) {
  border: none;
  background-color: white;
  padding: 8px;
}

/* Tab styling */
.editor-sidebar :deep(.p-tablist) {
  background-color: var(--color-light);
  border-radius: 4px 4px 0 0;
}

.editor-sidebar :deep(.p-tab.p-highlight) {
  background-color: var(--color-primary);
  color: white;
}
</style> 