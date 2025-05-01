// This shim provides a compatibility layer for Vue Konva to use Konva 8+
import * as KonvaOriginal from 'konva';

// Create wrapper with default export
const Konva = { ...KonvaOriginal };
Konva.default = Konva;

// Make global
if (typeof window !== 'undefined') {
  window.Konva = Konva;
}

export default Konva;
export * from 'konva';
