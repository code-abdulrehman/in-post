// This adapter file makes newer Konva versions (8+) compatible with Vue Konva 3.x
import * as KonvaModule from 'konva';

// Create a "default" export that Vue Konva expects
const Konva = { ...KonvaModule };

// Add a default property that points to itself (needed for Vue Konva)
Konva.default = Konva;

// Debug logging
console.log('Initializing Konva adapter with version:', Konva.version);

// Add specific polyfills for compatibility between Konva 9.x and Vue-Konva 3.x
const classes = ['Rect', 'Circle', 'Text', 'Line', 'Image', 'Layer', 'Stage', 'Group', 'Transformer'];

classes.forEach(className => {
  if (typeof Konva[className] === 'function') {
    const prototype = Konva[className].prototype;
    
    // Ensure setAttrs is available (critical for Vue-Konva rendering)
    if (!prototype.setAttrs && prototype._setAttrs) {
      console.log(`Adding setAttrs polyfill to ${className}`);
      prototype.setAttrs = function(attrs) {
        if (!this.attrs) {
          this.attrs = {};
        }
        Object.assign(this.attrs, attrs);
        this._setAttrs(attrs);
        return this;
      };
    }
    
    // Ensure getAttr/getAttrs methods are available
    if (!prototype.getAttr) {
      console.log(`Adding getAttr polyfill to ${className}`);
      prototype.getAttr = function(attr) {
        return this.attrs[attr];
      };
    }
    
    if (!prototype.getAttrs) {
      console.log(`Adding getAttrs polyfill to ${className}`);
      prototype.getAttrs = function() {
        return this.attrs;
      };
    }
    
    // Add any other polyfills needed here
  }
});

// Add specific fixes for Layer and Stage if needed
if (typeof Konva.Layer === 'function') {
  const LayerPrototype = Konva.Layer.prototype;
  
  // Ensure batchDraw works reliably
  const originalBatchDraw = LayerPrototype.batchDraw;
  LayerPrototype.batchDraw = function() {
    try {
      return originalBatchDraw.call(this);
    } catch (e) {
      console.warn('Error in Layer.batchDraw, falling back to draw()', e);
      try {
        return this.draw();
      } catch (e2) {
        console.error('Failed to draw layer', e2);
      }
    }
    return this;
  };
}

// Make Konva available globally for debugging and to ensure Vue Konva can find it
if (typeof window !== 'undefined') {
  window.Konva = Konva;
}

console.log('Konva adapter loaded and configured');

export default Konva; 