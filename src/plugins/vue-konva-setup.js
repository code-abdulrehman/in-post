// Import our Konva adapter
import Konva from './konva-adapter';

// Import Vue Konva using the default entry point
import VueKonva from 'vue-konva';

// Custom directive for forcing layer and stage redraw
const forceRenderDirective = {
  // Called when the bound element's parent component
  // and all its children are mounted.
  mounted(el, binding) {
    console.log('ForceRender directive mounted', el, binding);
    
    // Wait a tick for Vue to finish rendering
    setTimeout(() => {
      // Try to find Konva elements
      try {
        // Find stage element
        const stageEl = el.querySelector('.konvajs-content') ? 
          el : el.closest('.konvajs-content');
          
        if (stageEl) {
          const konvaStage = stageEl._konvaNode;
          if (konvaStage && typeof konvaStage.draw === 'function') {
            console.log('ForceRender: Found Konva stage, drawing');
            konvaStage.draw();
          }
        }
        
        // Find layer elements
        const layerEls = el.querySelectorAll('.konvajs-content canvas');
        if (layerEls && layerEls.length) {
          console.log('ForceRender: Found Konva layers, drawing');
          layerEls.forEach(layerEl => {
            if (layerEl._konvaNode && typeof layerEl._konvaNode.draw === 'function') {
              layerEl._konvaNode.draw();
            }
          });
        }
      } catch (error) {
        console.error('ForceRender directive error:', error);
      }
    }, 100);
  },
  
  // Called after VNode has been updated
  updated(el) {
    console.log('ForceRender directive updated', el);
    // Similar to mounted but with a shorter timeout
    setTimeout(() => {
      try {
        // Find Konva elements and force redraw
        const stageEl = el.querySelector('.konvajs-content') ? 
          el : el.closest('.konvajs-content');
          
        if (stageEl && stageEl._konvaNode) {
          stageEl._konvaNode.draw();
        }
      } catch (error) {
        console.error('ForceRender directive update error:', error);
      }
    }, 50);
  }
};

// Export a function to setup Vue Konva with our adapter
export default function setupVueKonva(app) {
  // Make sure Konva is available
  if (!Konva) {
    console.error('Konva adapter failed to load properly');
    return;
  }

  // Register Vue Konva with our adapter
  try {
    // Override Vue Konva's internal Konva reference
    if (VueKonva.Konva) {
      VueKonva.Konva = Konva;
    }
    
    // Install Vue Konva
    app.use(VueKonva);
    
    // Register our custom directive
    app.directive('force-render', forceRenderDirective);
    
    console.log('Vue Konva setup successful!');
  } catch (error) {
    console.error('Failed to setup Vue Konva:', error);
  }
} 