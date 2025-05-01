<template>
  <div class="canvas-container" v-force-render>
    <v-stage
      ref="stage"
      :config="stageConfig"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      @mousemove="handleMouseMove"
      :width="stageConfig.width"
      :height="stageConfig.height"
    >
      <v-layer ref="layer">
        <v-text
          v-for="(text, i) in textElements"
          :key="`text-${text.id || i}`"
          :config="text"
          @transformend="handleTransformEnd(i, 'text')"
          @dragend="handleDragEnd(i, 'text')"
        />
        <v-rect
          v-for="(rect, i) in rectangles"
          :key="`rect-${rect.id || i}`"
          :config="rect"
          @transformend="handleTransformEnd(i, 'rect')"
          @dragend="handleDragEnd(i, 'rect')"
        />
        <v-circle
          v-for="(circle, i) in circles"
          :key="`circle-${circle.id || i}`"
          :config="circle"
          @transformend="handleTransformEnd(i, 'circle')"
          @dragend="handleDragEnd(i, 'circle')"
        />
        <v-image
          v-for="(img, i) in images"
          :key="`img-${img.id || i}`"
          :config="img"
          @transformend="handleTransformEnd(i, 'image')"
          @dragend="handleDragEnd(i, 'image')"
        />
        <v-line
          v-for="(line, i) in lines"
          :key="`line-${line.id || i}`"
          :config="line"
          @transformend="handleTransformEnd(i, 'line')"
          @dragend="handleDragEnd(i, 'line')"
        />
        <v-transformer ref="transformer" />
      </v-layer>
    </v-stage>
    <!-- Add debug info for development -->
    <div class="debug-info" v-if="isDebugMode">
      <p>Canvas Size: {{ stageConfig.width }}x{{ stageConfig.height }}</p>
      <p>Elements: {{ totalElements }}</p>
      <button @click="forceRedraw">Force Redraw</button>
      <button @click="dumpElements">Dump Elements</button>
    </div>
  </div>
</template>

<script setup>
import Konva from '@/plugins/konva-adapter';
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';

// Canvas configurations
const stageConfig = reactive({
  width: 800,
  height: 600,
  draggable: false
});

// Debug mode for development
const isDebugMode = ref(true);

// Elements on canvas
const textElements = ref([]);
const rectangles = ref([]);
const circles = ref([]);
const images = ref([]);
const lines = ref([]);

// Computed property for total elements
const totalElements = computed(() => {
  return textElements.value.length + 
         rectangles.value.length + 
         circles.value.length + 
         images.value.length + 
         lines.value.length;
});

// References
const stage = ref(null);
const layer = ref(null);
const transformer = ref(null);

// Selected element
const selectedId = ref(null);
const selectedType = ref(null);

// Selected element reference for sharing with parent
const selectedElement = ref(null);

// Handle mouse events
const isDrawing = ref(false);

// Debug function to dump elements to console
function dumpElements() {
  console.log("Current Rectangles:", JSON.stringify(rectangles.value));
  console.log("Current Circles:", JSON.stringify(circles.value));
  console.log("Current Texts:", JSON.stringify(textElements.value));
  console.log("Current Images:", JSON.stringify(images.value.map(img => ({...img, image: '[Image Object]'}))));
  console.log("Current Lines:", JSON.stringify(lines.value));
}

function handleMouseDown(e) {
  if (e.target === e.target.getStage()) {
    // Clicked on empty space - deselect
    selectedId.value = null;
    selectedType.value = null;
    selectedElement.value = null;
    transformer.value.nodes([]);
    return;
  }

  // Get the clicked shape
  const clickedOnTransformer = e.target.getParent().className === 'Transformer';
  if (clickedOnTransformer) {
    return;
  }

  // Find the parent - the actual shape
  const shape = e.target;
  // Set the selected element
  selectedId.value = shape.id();
  
  // Determine type
  if (shape.className === 'Text') {
    selectedType.value = 'text';
    const index = textElements.value.findIndex(item => item.id === selectedId.value);
    if (index !== -1) {
      selectedElement.value = {
        type: 'text',
        index,
        ...textElements.value[index]
      };
    }
  } else if (shape.className === 'Rect') {
    selectedType.value = 'rect';
    const index = rectangles.value.findIndex(item => item.id === selectedId.value);
    if (index !== -1) {
      selectedElement.value = {
        type: 'rect',
        index,
        ...rectangles.value[index]
      };
    }
  } else if (shape.className === 'Circle') {
    selectedType.value = 'circle';
    const index = circles.value.findIndex(item => item.id === selectedId.value);
    if (index !== -1) {
      selectedElement.value = {
        type: 'circle',
        index,
        ...circles.value[index]
      };
    }
  } else if (shape.className === 'Image') {
    selectedType.value = 'image';
    const index = images.value.findIndex(item => item.id === selectedId.value);
    if (index !== -1) {
      selectedElement.value = {
        type: 'image',
        index,
        ...images.value[index]
      };
    }
  } else if (shape.className === 'Line') {
    selectedType.value = 'line';
    const index = lines.value.findIndex(item => item.id === selectedId.value);
    if (index !== -1) {
      selectedElement.value = {
        type: 'line',
        index,
        ...lines.value[index]
      };
    }
  }

  // Attach transformer
  transformer.value.nodes([shape]);
}

function handleMouseUp() {
  isDrawing.value = false;
}

function handleMouseMove() {
  if (!isDrawing.value) return;
}

function handleTransformEnd(index, type) {
  // Update properties after transformation
  const node = transformer.value.nodes()[0];
  if (!node) return;

  if (type === 'text') {
    textElements.value[index] = {
      ...textElements.value[index],
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY()
    };
  } else if (type === 'rect') {
    rectangles.value[index] = {
      ...rectangles.value[index],
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY()
    };
  } else if (type === 'circle') {
    circles.value[index] = {
      ...circles.value[index],
      x: node.x(),
      y: node.y(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY()
    };
  } else if (type === 'image') {
    images.value[index] = {
      ...images.value[index],
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY()
    };
  } else if (type === 'line') {
    lines.value[index] = {
      ...lines.value[index],
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY()
    };
  }

  // Save current state to localStorage
  saveCanvasState();
}

function handleDragEnd(index, type) {
  // Update properties after dragging
  const node = transformer.value.nodes()[0];
  if (!node) return;

  if (type === 'text') {
    textElements.value[index].x = node.x();
    textElements.value[index].y = node.y();
  } else if (type === 'rect') {
    rectangles.value[index].x = node.x();
    rectangles.value[index].y = node.y();
  } else if (type === 'circle') {
    circles.value[index].x = node.x();
    circles.value[index].y = node.y();
  } else if (type === 'image') {
    images.value[index].x = node.x();
    images.value[index].y = node.y();
  } else if (type === 'line') {
    lines.value[index].x = node.x();
    lines.value[index].y = node.y();
  }
  
  // Save the updated state
  saveCanvasState();
}

// Functions to add elements
function addText(text) {
  console.log("Adding text element:", text);
  const newText = {
    id: `text-${Date.now()}`,
    text: text.text || 'New Text',
    x: text.x || 100,
    y: text.y || 100,
    fontSize: text.fontSize || 20,
    fontFamily: text.fontFamily || 'Arial',
    fill: text.fill || '#000000',
    draggable: true
  };
  
  textElements.value.push(newText);
  console.log("Added text element. Current elements:", textElements.value);
  saveCanvasState();
  return newText.id;
}

function addRectangle(rect) {
  console.log("Adding rectangle element:", rect);
  
  // Make sure we have proper defaults
  const x = rect.x || 150;
  const y = rect.y || 150;
  const width = rect.width || 100;
  const height = rect.height || 50;
  const fill = rect.fill || '#3B82F6';
  
  const newRect = {
    id: `rect-${Date.now()}`,
    x: x,
    y: y,
    width: width,
    height: height,
    fill: fill,
    opacity: rect.opacity || 1,
    stroke: '#000000',
    strokeWidth: 0,
    draggable: true,
    name: 'rectangle'
  };
  
  // Add the element to our state
  rectangles.value.push(newRect);
  console.log("Added rectangle element. Current elements:", rectangles.value);
  
  // Force Vue to update and then trigger a redraw
  nextTick(() => {
    console.log("Vue update completed, forcing Konva redraw");
    
    // Direct layer manipulation if available
    const konvaLayer = getLayerNode();
    if (konvaLayer) {
      try {
        // Alternative direct approach - create the Konva node directly
        const rectNode = new Konva.Rect({
          id: newRect.id,
          x: x,
          y: y,
          width: width,
          height: height,
          fill: fill,
          opacity: rect.opacity || 1,
          stroke: '#000000',
          strokeWidth: 0,
          draggable: true,
          name: 'rectangle-direct'
        });
        
        // Add directly to the layer
        konvaLayer.add(rectNode);
        konvaLayer.batchDraw();
        console.log("Rectangle added directly to layer");
      } catch (error) {
        console.error("Error adding rectangle directly:", error);
        
        // Fall back to normal redraw
        try {
          konvaLayer.batchDraw();
        } catch (e) {
          console.error("Error in fallback redraw:", e);
        }
      }
    }
    
    // Also force stage update
    const konvaStage = getStageNode();
    if (konvaStage) {
      try {
        konvaStage.batchDraw();
      } catch (error) {
        console.error("Error redrawing stage:", error);
      }
    }
  });
  
  saveCanvasState();
  return newRect.id;
}

function addCircle(circle) {
  console.log("Adding circle element:", circle);
  
  // Make sure we have proper defaults
  const x = circle.x || 200;
  const y = circle.y || 200;
  const radius = circle.radius || 50;
  const fill = circle.fill || '#10B981';
  
  const newCircle = {
    id: `circle-${Date.now()}`,
    x: x,
    y: y,
    radius: radius,
    fill: fill,
    opacity: circle.opacity || 1,
    stroke: '#000000',
    strokeWidth: 0,
    draggable: true,
    name: 'circle'
  };
  
  // Add to our state
  circles.value.push(newCircle);
  console.log("Added circle element. Current elements:", circles.value);
  
  // Force Vue to update and then trigger a redraw
  nextTick(() => {
    console.log("Vue update completed, forcing Konva redraw");
    
    // Direct layer manipulation if available
    const konvaLayer = getLayerNode();
    if (konvaLayer) {
      try {
        // Alternative direct approach - create the Konva node directly
        const circleNode = new Konva.Circle({
          id: newCircle.id,
          x: x,
          y: y,
          radius: radius,
          fill: fill,
          opacity: circle.opacity || 1,
          stroke: '#000000',
          strokeWidth: 0,
          draggable: true,
          name: 'circle-direct'
        });
        
        // Add directly to the layer
        konvaLayer.add(circleNode);
        konvaLayer.batchDraw();
        console.log("Circle added directly to layer");
      } catch (error) {
        console.error("Error adding circle directly:", error);
        
        // Fall back to normal redraw
        try {
          konvaLayer.batchDraw();
        } catch (e) {
          console.error("Error in fallback redraw:", e);
        }
      }
    }
    
    // Also force stage update
    const konvaStage = getStageNode();
    if (konvaStage) {
      try {
        konvaStage.batchDraw();
      } catch (error) {
        console.error("Error redrawing stage:", error);
      }
    }
  });
  
  saveCanvasState();
  return newCircle.id;
}

function addLine(line) {
  console.log("Adding line element:", line);
  const newLine = {
    id: `line-${Date.now()}`,
    points: line?.points || [50, 50, 200, 50],
    stroke: line?.stroke || '#6366F1',
    strokeWidth: line?.strokeWidth || 4,
    lineCap: line?.lineCap || 'round',
    lineJoin: line?.lineJoin || 'round',
    draggable: true
  };
  
  lines.value.push(newLine);
  console.log("Added line element. Current elements:", lines.value);
  saveCanvasState();
  return newLine.id;
}

function addImage(img) {
  console.log("Adding image element:", img);
  // Load the image
  const imageObj = new Image();
  
  imageObj.onload = () => {
    console.log("Image loaded successfully:", imageObj.width, imageObj.height);
    const newImage = {
      id: `image-${Date.now()}`,
      x: img.x || 100,
      y: img.y || 100,
      image: imageObj,
      width: img.width || imageObj.width,
      height: img.height || imageObj.height,
      opacity: img.opacity || 1,
      draggable: true
    };
    
    images.value.push(newImage);
    console.log("Added image element. Current elements:", images.value);
    saveCanvasState();
    return newImage.id;
  };
  
  imageObj.onerror = (error) => {
    console.error("Failed to load image:", error);
    // Add a placeholder rectangle instead
    const placeholderRect = {
      id: `rect-${Date.now()}`,
      x: img.x || 150,
      y: img.y || 150,
      width: img.width || 100,
      height: img.height || 100,
      fill: '#cccccc',
      opacity: 0.7,
      draggable: true,
      name: 'Image placeholder'
    };
    
    rectangles.value.push(placeholderRect);
    return placeholderRect.id;
  };
  
  // Set source with setTimeout to ensure error handling works
  setTimeout(() => {
    imageObj.src = img.src;
  }, 0);
}

function setCanvasSize(width, height) {
  console.log(`Setting canvas size to ${width}x${height}`);
  
  // Update the stage configuration
  stageConfig.width = width;
  stageConfig.height = height;
  
  // If using a ref to get the Konva stage
  console.log('Stage ref type:', typeof stage.value, stage.value);
  
  // Access stage directly
  if (stage.value) {
    if (typeof stage.value.getStage === 'function') {
      console.log('Using getStage method');
      const konvaStage = stage.value.getStage();
      konvaStage.width(width);
      konvaStage.height(height);
      console.log('Updated Konva stage size directly');
    } else {
      console.log('Using direct stage access');
      stage.value.width(width);
      stage.value.height(height);
      console.log('Updated Konva stage size via direct access');
    }
    
    // Save canvas size to localStorage
    saveCanvasSize(width, height);
  } else {
    console.error('No stage reference available');
  }
}

function deleteSelectedElement() {
  if (!selectedId.value || !selectedType.value) return;
  
  if (selectedType.value === 'text') {
    const index = textElements.value.findIndex(item => item.id === selectedId.value);
    if (index !== -1) {
      textElements.value.splice(index, 1);
    }
  } else if (selectedType.value === 'rect') {
    const index = rectangles.value.findIndex(item => item.id === selectedId.value);
    if (index !== -1) {
      rectangles.value.splice(index, 1);
    }
  } else if (selectedType.value === 'circle') {
    const index = circles.value.findIndex(item => item.id === selectedId.value);
    if (index !== -1) {
      circles.value.splice(index, 1);
    }
  } else if (selectedType.value === 'image') {
    const index = images.value.findIndex(item => item.id === selectedId.value);
    if (index !== -1) {
      images.value.splice(index, 1);
    }
  } else if (selectedType.value === 'line') {
    const index = lines.value.findIndex(item => item.id === selectedId.value);
    if (index !== -1) {
      lines.value.splice(index, 1);
    }
  }
  
  // Clear selection after delete
  selectedId.value = null;
  selectedType.value = null;
  selectedElement.value = null;
  transformer.value.nodes([]);
  
  // Save the updated state
  saveCanvasState();
}

// Helper functions for accessing Konva nodes
function getLayerNode() {
  if (!layer.value) return null;
  
  // Try different methods to get the Konva layer
  if (typeof layer.value.getNode === 'function') {
    return layer.value.getNode();
  }
  
  if (typeof layer.value.getLayer === 'function') {
    return layer.value.getLayer();
  }
  
  // Access internal properties that Vue Konva might be using
  if (layer.value._layer) {
    return layer.value._layer;
  }
  
  // Last resort, return the object itself and hope it works
  return layer.value;
}

function getStageNode() {
  if (!stage.value) return null;
  
  // Try different methods to get the Konva stage
  if (typeof stage.value.getStage === 'function') {
    return stage.value.getStage();
  }
  
  // Access internal properties that Vue Konva might be using
  if (stage.value._stage) {
    return stage.value._stage;
  }
  
  // Last resort, return the object itself and hope it works
  return stage.value;
}

// Replace existing getStage function with our more robust version
function getStage() {
  console.log("Getting stage...");
  return getStageNode();
}

function clearCanvas() {
  textElements.value = [];
  rectangles.value = [];
  circles.value = [];
  images.value = [];
  lines.value = [];
  
  // Clear selection
  selectedId.value = null;
  selectedType.value = null;
  selectedElement.value = null;
  transformer.value.nodes([]);
  
  // Clear localStorage
  localStorage.removeItem('canvasState');
}

// Setup watchers to react to element changes
watch([textElements, rectangles, circles, images, lines], () => {
  console.log("Canvas elements updated, refreshing...");
  
  // Force a refresh of the layer to ensure elements render
  const konvaLayer = getLayerNode();
  if (konvaLayer) {
    try {
      konvaLayer.batchDraw();
      console.log("Layer batch draw triggered");
    } catch (error) {
      console.error("Error refreshing layer:", error);
    }
  }
  
  // Also force a stage update
  const konvaStage = getStageNode();
  if (konvaStage) {
    try {
      konvaStage.batchDraw();
      console.log("Stage batch draw triggered");
    } catch (error) {
      console.error("Error refreshing stage:", error);
    }
  }
}, { deep: true });

// LocalStorage functions
function saveCanvasState() {
  const canvasState = {
    textElements: textElements.value,
    rectangles: rectangles.value,
    circles: circles.value,
    lines: lines.value,
    images: images.value.map(img => {
      // Store just the src for images, not the full image object
      if (img.image && img.image.src) {
        return {
          ...img,
          src: img.image.src,
          image: null
        };
      }
      return img;
    })
  };
  
  try {
    localStorage.setItem('canvasState', JSON.stringify(canvasState));
    console.log('Canvas state saved to localStorage');
  } catch (error) {
    console.error('Failed to save canvas state:', error);
  }
}

function loadCanvasState() {
  try {
    // First try to get from localStorage normally
    const saved = localStorage.getItem('canvasState');
    
    // If we have data
    if (saved) {
      let state;
      
      // Handle both JSON string and already parsed object
      try {
        // Try parsing if it's a string
        if (typeof saved === 'string') {
          state = JSON.parse(saved);
          console.log('Parsed state from string:', state);
        } else {
          // Already an object
          state = saved;
          console.log('Using state object directly:', state);
        }
      } catch (parseError) {
        console.error('Error parsing canvas state:', parseError);
        console.log('Attempting to clean and parse the data...');
        
        // This is a fallback for if the string has extra quotes
        try {
          // Try to clean the string if it might be double-quoted
          const cleanedString = saved.replace(/^"/, '').replace(/"$/, '').replace(/\\"/g, '"');
          state = JSON.parse(cleanedString);
          console.log('Parsed state from cleaned string:', state);
        } catch (cleanError) {
          console.error('Failed to clean and parse state:', cleanError);
          return;
        }
      }
      
      console.log('Loading saved state, found elements:', 
        state.textElements?.length || 0, 'texts,', 
        state.rectangles?.length || 0, 'rectangles,',
        state.circles?.length || 0, 'circles,',
        state.lines?.length || 0, 'lines,',
        state.images?.length || 0, 'images');
      
      // Load text elements
      if (state.textElements && Array.isArray(state.textElements)) {
        textElements.value = state.textElements;
        console.log('Loaded text elements:', textElements.value);
      }
      
      // Load rectangles
      if (state.rectangles && Array.isArray(state.rectangles)) {
        rectangles.value = state.rectangles;
        console.log('Loaded rectangles:', rectangles.value);
      }
      
      // Load circles
      if (state.circles && Array.isArray(state.circles)) {
        circles.value = state.circles;
        console.log('Loaded circles:', circles.value);
      }
      
      // Load lines
      if (state.lines && Array.isArray(state.lines)) {
        lines.value = state.lines;
        console.log('Loaded lines:', lines.value);
      }
      
      // Load images (need to reload actual image objects)
      if (state.images && Array.isArray(state.images)) {
        state.images.forEach(img => {
          if (img.src) {
            addImage({ ...img, src: img.src });
          }
        });
      }
      
      console.log('Canvas state loaded from localStorage');
      
      // Force a redraw after loading elements
      nextTick(() => {
        forceRedraw();
        console.log('Forced canvas redraw after loading state');
      });
    }
  } catch (error) {
    console.error('Failed to load canvas state:', error);
  }
}

function saveCanvasSize(width, height) {
  try {
    localStorage.setItem('canvasSize', JSON.stringify({ width, height }));
    console.log('Canvas size saved to localStorage');
  } catch (error) {
    console.error('Failed to save canvas size:', error);
  }
}

function loadCanvasSize() {
  try {
    const saved = localStorage.getItem('canvasSize');
    if (saved) {
      const size = JSON.parse(saved);
      if (size && size.width && size.height) {
        setCanvasSize(size.width, size.height);
        console.log('Canvas size loaded from localStorage');
      }
    }
  } catch (error) {
    console.error('Failed to load canvas size:', error);
  }
}

// Force a manual redraw function for debugging
function forceRedraw() {
  console.log("Force redraw requested");
  const konvaStage = getStageNode();
  const konvaLayer = getLayerNode();
  
  if (konvaLayer) {
    try {
      // First clear the layer
      konvaLayer.clear();
      
      // Make sure all elements are properly added to layer
      const allNodes = konvaLayer.getChildren();
      console.log(`Layer has ${allNodes?.length || 0} nodes`);
      
      // If no nodes are visible, try creating the nodes directly
      if (!allNodes || allNodes.length === 0) {
        console.log("No nodes found in layer, forcing node creation");
        
        // Try to recreate rectangle nodes
        rectangles.value.forEach(rect => {
          try {
            const rectNode = new Konva.Rect({
              id: rect.id,
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
              fill: rect.fill,
              opacity: rect.opacity || 1,
              draggable: true
            });
            konvaLayer.add(rectNode);
          } catch (e) {
            console.error("Error creating rectangle:", e);
          }
        });
        
        // Try to recreate circle nodes
        circles.value.forEach(circle => {
          try {
            const circleNode = new Konva.Circle({
              id: circle.id,
              x: circle.x,
              y: circle.y,
              radius: circle.radius,
              fill: circle.fill,
              opacity: circle.opacity || 1,
              draggable: true
            });
            konvaLayer.add(circleNode);
          } catch (e) {
            console.error("Error creating circle:", e);
          }
        });
        
        // Try to recreate line nodes
        lines.value.forEach(line => {
          try {
            const lineNode = new Konva.Line({
              id: line.id,
              points: line.points,
              stroke: line.stroke,
              strokeWidth: line.strokeWidth || 4,
              draggable: true
            });
            konvaLayer.add(lineNode);
          } catch (e) {
            console.error("Error creating line:", e);
          }
        });
        
        // Try to recreate text nodes
        textElements.value.forEach(text => {
          try {
            const textNode = new Konva.Text({
              id: text.id,
              x: text.x,
              y: text.y,
              text: text.text,
              fontSize: text.fontSize,
              fontFamily: text.fontFamily,
              fill: text.fill,
              draggable: true
            });
            konvaLayer.add(textNode);
          } catch (e) {
            console.error("Error creating text:", e);
          }
        });
      }
      
      // Now redraw
      konvaLayer.batchDraw();
      console.log("Layer manually redrawn");
    } catch (error) {
      console.error("Error manually redrawing layer:", error);
    }
  }
  
  if (konvaStage) {
    try {
      konvaStage.batchDraw();
      console.log("Stage manually redrawn");
    } catch (error) {
      console.error("Error manually redrawing stage:", error);
    }
  }
}

onMounted(() => {
  // Initial setup after component is mounted
  console.log('DesignCanvas mounted, initializing...');

  // Add key event listeners
  window.addEventListener('keydown', (e) => {
    // Delete on Delete key or Backspace
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId.value) {
      deleteSelectedElement();
    }
  });
  
  // Give time for Vue Konva to initialize the stage properly
  nextTick(() => {
    console.log("Initial nextTick - checking stage initialization");
    
    // Try to initialize the stage right away
    const konvaStage = getStageNode();
    const konvaLayer = getLayerNode();
    
    if (konvaStage && konvaLayer) {
      console.log("Stage and layer already available, doing initial draw");
      try {
        konvaStage.draw();
        konvaLayer.draw();
        console.log("Initial draw completed successfully");
      } catch (error) {
        console.error("Error during initial draw:", error);
      }
    } else {
      console.log("Stage or layer not immediately available, will retry after delay");
    }
  });
  
  // Load saved state from localStorage after a short delay
  // to ensure the canvas is fully mounted
  setTimeout(() => {
    console.log("Delayed initialization running");
    // Ensure the stage and layer are properly initialized
    const konvaStage = getStageNode();
    const konvaLayer = getLayerNode();
    
    if (konvaStage && konvaLayer) {
      console.log("Stage and layer refs are available after delay");
      
      // Force an initial draw of the stage
      try {
        // Clear and redraw the layer to ensure proper rendering
        konvaLayer.clear();
        konvaLayer.draw();
        
        // Then draw the stage
        konvaStage.draw();
        
        console.log("Initial stage and layer draw completed");
        
        // For safety, add dummy element and then remove it to force redraw
        const tempCircle = new Konva.Circle({
          x: -50, 
          y: -50, 
          radius: 5,
          fill: 'red'
        });
        
        konvaLayer.add(tempCircle);
        konvaLayer.draw();
        
        setTimeout(() => {
          tempCircle.destroy();
          konvaLayer.draw();
          console.log("Initialization complete with test element");
        }, 100);
        
      } catch (error) {
        console.error("Error during initialization draw:", error);
      }
    } else {
      console.warn("Stage or layer refs not available after delay, canvas may not render properly");
    }
    
    // Now load saved state
    loadCanvasSize();
    loadCanvasState();
  }, 500);
});

// Expose methods and properties to parent components
defineExpose({
  addRectangle,
  addCircle,
  addText,
  addImage,
  addLine,
  setCanvasSize,
  deleteSelectedElement,
  getStage,
  clearCanvas,
  saveCanvasState,
  loadCanvasState
});
</script>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: auto;
  background-color: #f0f0f0;
  padding: 20px;
  position: relative;
}

/* Add a shadow and border to make the canvas stand out */
:deep(.konvajs-content) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid #e0e0e0;
  background-color: white;
}

/* Debug panel styling */
.debug-info {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 1000;
}

.debug-info p {
  margin: 5px 0;
}

.debug-info button {
  background-color: #3B82F6;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 5px;
}

.debug-info button:hover {
  background-color: #2563EB;
}
</style> 