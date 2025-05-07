import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define preset color palettes
const presetPalettes = {
  // Pastel Colors
  pastel: {
    id: 'pastel',
    name: 'Pastel Colors',
    colors: [
      { value: '#FADBD8', name: 'Pastel Pink' },
      { value: '#F5CBA7', name: 'Pastel Orange' },
      { value: '#F9E79F', name: 'Pastel Yellow' },
      { value: '#ABEBC6', name: 'Pastel Green' },
      { value: '#AED6F1', name: 'Pastel Blue' },
      { value: '#D5DBDB', name: 'Pastel Gray' },
      { value: '#D2B4DE', name: 'Pastel Purple' },
      { value: '#F2D7D5', name: 'Pastel Rose' },
      { value: '#FDEDEC', name: 'Pastel Coral' },
      { value: '#EAF2F8', name: 'Pastel Sky' }
    ]
  },
  // Neon Palette
  neon: {
    id: 'neon',
    name: 'Neon Colors',
    colors: [
      { value: '#5465FF', name: 'Neon Blue' },
      { value: '#788BFF', name: 'Cornflower Blue' },
      { value: '#9BB1FF', name: 'Jordy Blue' },
      { value: '#BFD7FF', name: 'Periwinkle' },
      { value: '#E2FDFF', name: 'Light Cyan' },
      { value: '#FF0000', name: 'Neon Red' },
      { value: '#00FF00', name: 'Neon Green' },
      { value: '#FF00FF', name: 'Neon Pink' },
      { value: '#FFFF00', name: 'Neon Yellow' },
      { value: '#00FFFF', name: 'Neon Cyan' }
    ]
  },
  // Earth Tones
  earth: {
    id: 'earth',
    name: 'Earth Tones',
    colors: [
      { value: '#A0522D', name: 'Sienna' },
      { value: '#8B4513', name: 'Saddle Brown' },
      { value: '#CD853F', name: 'Peru' },
      { value: '#D2B48C', name: 'Tan' },
      { value: '#DEB887', name: 'Burlywood' },
      { value: '#F5DEB3', name: 'Wheat' },
      { value: '#556B2F', name: 'Dark Olive Green' },
      { value: '#6B8E23', name: 'Olive Drab' },
      { value: '#BDB76B', name: 'Dark Khaki' },
      { value: '#F0E68C', name: 'Khaki' }
    ]
  },
  // Monochrome
  monochrome: {
    id: 'monochrome',
    name: 'Monochrome',
    colors: [
      { value: '#000000', name: 'Black' },
      { value: '#1A1A1A', name: 'Ebony' },
      { value: '#333333', name: 'Dark Charcoal' },
      { value: '#4D4D4D', name: 'Charcoal' },
      { value: '#666666', name: 'Dark Gray' },
      { value: '#808080', name: 'Gray' },
      { value: '#999999', name: 'Medium Gray' },
      { value: '#B3B3B3', name: 'Light Gray' },
      { value: '#CCCCCC', name: 'Silver' },
      { value: '#FFFFFF', name: 'White' }
    ]
  },
  // Ocean
  ocean: {
    id: 'ocean',
    name: 'Ocean Colors',
    colors: [
      { value: '#1E3A8A', name: 'Deep Blue' },
      { value: '#1E40AF', name: 'Royal Blue' },
      { value: '#2563EB', name: 'Bright Blue' },
      { value: '#3B82F6', name: 'Sky Blue' },
      { value: '#60A5FA', name: 'Light Blue' },
      { value: '#93C5FD', name: 'Powder Blue' },
      { value: '#BFDBFE', name: 'Baby Blue' },
      { value: '#00A3A3', name: 'Teal' },
      { value: '#20B2AA', name: 'Light Sea Green' },
      { value: '#48D1CC', name: 'Medium Turquoise' }
    ]
  },
  // Project palette to store user's colors
  project: {
    id: 'project',
    name: 'Project Colors',
    colors: [],
    isCustom: true
  }
};

export const useStore = create(
  persist(
    (set, get) => ({
      // Projects management
      projects: [],
      currentProjectId: null,
      
      // Color Palettes
      colorPalettes: presetPalettes,
      currentPaletteId: 'pastel',
      
      // Set current palette
      setCurrentPalette: (paletteId) => {
        if (get().colorPalettes[paletteId]) {
          set({ currentPaletteId: paletteId });
        }
      },
      
      // Add a custom palette
      addPalette: (id, name, colors) => {
        set((state) => ({
          colorPalettes: {
            ...state.colorPalettes,
            [id]: {
              id,
              name,
              colors,
              isCustom: true
            }
          }
        }));
      },
      
      // Update an existing palette
      updatePalette: (id, name, colors) => {
        const palette = get().colorPalettes[id];
        if (palette && palette.isCustom) {
          set((state) => ({
            colorPalettes: {
              ...state.colorPalettes,
              [id]: {
                ...palette,
                name,
                colors
              }
            }
          }));
        }
      },
      
      // Delete a custom palette
      deletePalette: (id) => {
        const palette = get().colorPalettes[id];
        if (palette && palette.isCustom) {
          const newPalettes = { ...get().colorPalettes };
          delete newPalettes[id];
          
          set((state) => ({
            colorPalettes: newPalettes,
            currentPaletteId: state.currentPaletteId === id ? 'pastel' : state.currentPaletteId
          }));
        }
      },
      
      // Add a color to a palette
      addColorToPalette: (color, name, paletteId = 'project') => {
        const palette = get().colorPalettes[paletteId];
        if (palette && palette.isCustom) {
          set((state) => ({
            colorPalettes: {
              ...state.colorPalettes,
              [paletteId]: {
                ...palette,
                colors: [
                  ...palette.colors,
                  {
                    value: color,
                    name: name || `Color ${palette.colors.length + 1}`,
                    id: Date.now().toString()
                  }
                ]
              }
            }
          }));
        }
      },
      
      // Remove a color from a palette
      removeColorFromPalette: (colorIndex, paletteId = 'project') => {
        const palette = get().colorPalettes[paletteId];
        if (palette && palette.isCustom) {
          const newColors = [...palette.colors];
          newColors.splice(colorIndex, 1);
          
          set((state) => ({
            colorPalettes: {
              ...state.colorPalettes,
              [paletteId]: {
                ...palette,
                colors: newColors
              }
            }
          }));
        }
      },
      
      // Reset palettes to defaults
      resetPalettes: () => {
        set({
          colorPalettes: presetPalettes,
          currentPaletteId: 'pastel'
        });
      },
      
      createProject: (name, width, height, background) => {
        const id = `project-${Date.now()}`;
        const newProject = {
          id,
          name,
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          canvasSize: { width, height },
          canvasBackground: background || '#ffffff',
          elements: [],
        };
        
        set((state) => ({
          projects: [...state.projects, newProject],
          currentProjectId: id,
          // Reset the canvas state for the new project
          elements: [],
          canvasSize: { width, height },
          canvasBackground: background || '#ffffff',
        }));
        
        return id;
      },
      
      loadProject: (id) => {
        const { projects } = get();
        const project = projects.find(p => p.id === id);
        
        if (project) {
          set({
            currentProjectId: id,
            elements: project.elements || [],
            canvasSize: project.canvasSize,
            canvasBackground: project.canvasBackground,
          });
          
          // Update last modified time
          set((state) => ({
            projects: state.projects.map(p => 
              p.id === id 
                ? { ...p, lastModified: new Date().toISOString() }
                : p
            )
          }));
          
          return true;
        }
        
        return false;
      },
      
      saveCurrentProject: () => {
        const { currentProjectId, elements, canvasSize, canvasBackground } = get();
        
        if (currentProjectId) {
          set((state) => ({
            projects: state.projects.map(p => 
              p.id === currentProjectId 
                ? { 
                    ...p, 
                    elements,
                    canvasSize,
                    canvasBackground,
                    lastModified: new Date().toISOString() 
                  }
                : p
            )
          }));
          return true;
        }
        
        return false;
      },
      
      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter(p => p.id !== id),
          currentProjectId: state.currentProjectId === id ? null : state.currentProjectId,
        }));
      },
      
      renameProject: (id, newName) => {
        set((state) => ({
          projects: state.projects.map(p => 
            p.id === id 
              ? { ...p, name: newName, lastModified: new Date().toISOString() }
              : p
          )
        }));
      },

      // Application state
      currentRoute: '/', // '/' for landing page, '/editor' for editor
      setRoute: (route) => {
        set({ currentRoute: route });
        // Don't use direct JS navigation, let React Router handle it
      },

      // Canvas state
      canvasSize: { width: 800, height: 600 },
      canvasBackground: '#ffffff',
      showGrid: false,
      cursorPosition: { x: 0, y: 0 },
      canvasScale: 1,
      
      setCanvasSize: (width, height) => {
        // Handle both cases: passed as an object or as separate parameters
        if (typeof width === 'object' && width.width !== undefined && width.height !== undefined) {
          set({ canvasSize: { width: width.width, height: width.height } });
        } else {
          set({ canvasSize: { width, height } });
        }
      },
      setCanvasBackground: (color) => set({ canvasBackground: color }),
      toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
      setCursorPosition: (x, y) => set({ cursorPosition: { x, y } }),
      setCanvasScale: (scale) => set({ canvasScale: scale }),

      // Elements state
      elements: [],
      selectedElementId: null,
      
      addElement: (element) => {
        const newElementId = Date.now().toString();
        set((state) => ({
          elements: [...state.elements, { ...element, id: newElementId }],
        }));
        return newElementId;
      },
      
      updateElement: (id, updates) => set((state) => ({
        elements: state.elements.map(el => 
          el.id === id ? { ...el, ...updates } : el
        ),
      })),
      
      deleteElement: (id) => set((state) => ({
        elements: state.elements.filter(el => el.id !== id),
        selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
      })),
      
      duplicateElement: (id) => {
        const { elements, canvasSize } = get();
        const elementToDuplicate = elements.find(el => el.id === id);
        if (elementToDuplicate) {
          const newElementId = Date.now().toString();
          
          // Calculate the center position of the canvas
          const canvasCenterX = canvasSize.width / 2;
          const canvasCenterY = canvasSize.height / 2;
          
          // Calculate the element's width and height (if available)
          const width = elementToDuplicate.width || 100; // default width if not defined
          const height = elementToDuplicate.height || 100; // default height if not defined
          
          // Position the element at the center of the canvas, considering its size
          const x = canvasCenterX - (width / 2);
          const y = canvasCenterY - (height / 2);
          
          const newElement = {
            ...elementToDuplicate, // Keep all properties exactly the same
            id: newElementId,
            x: x,
            y: y,
            name: `${elementToDuplicate.name || elementToDuplicate.type} copy`,
          };
          
          set((state) => ({
            elements: [...state.elements, newElement],
            selectedElementId: newElementId,
          }));
          return newElementId;
        }
        return null;
      },
      
      selectElement: (id) => set({ selectedElementId: id }),
      clearSelection: () => set({ selectedElementId: null }),
      
      renameElement: (id, newName) => set((state) => ({
        elements: state.elements.map(el => 
          el.id === id ? { ...el, name: newName } : el
        ),
      })),
      
      // Layers management
      moveElementUp: (id) => set((state) => {
        const elements = [...state.elements];
        const index = elements.findIndex(el => el.id === id);
        if (index < elements.length - 1) {
          [elements[index], elements[index + 1]] = [elements[index + 1], elements[index]];
        }
        return { elements };
      }),
      
      moveElementDown: (id) => set((state) => {
        const elements = [...state.elements];
        const index = elements.findIndex(el => el.id === id);
        if (index > 0) {
          [elements[index], elements[index - 1]] = [elements[index - 1], elements[index]];
        }
        return { elements };
      }),
      
      // Move element to top (front)
      moveElementToTop: (id) => set((state) => {
        const elements = [...state.elements];
        const index = elements.findIndex(el => el.id === id);
        if (index !== -1 && index !== elements.length - 1) {
          const element = elements.splice(index, 1)[0];
          elements.push(element);
        }
        return { elements };
      }),
      
      // Move element to bottom (back)
      moveElementToBottom: (id) => set((state) => {
        const elements = [...state.elements];
        const index = elements.findIndex(el => el.id === id);
        if (index !== -1 && index !== 0) {
          const element = elements.splice(index, 1)[0];
          elements.unshift(element);
        }
        return { elements };
      }),
      
      // History tracking
      history: [],
      historyIndex: -1,
      
      addToHistory: (action) => set((state) => {
        const newHistory = state.historyIndex < state.history.length - 1
          ? state.history.slice(0, state.historyIndex + 1)
          : [...state.history];
        
        const maxHistorySize = 50;
        const elements = [...state.elements];
        
        newHistory.push({
          action,
          elements,
          timestamp: Date.now()
        });
        
        if (newHistory.length > maxHistorySize) {
          newHistory.shift();
        }
        
        return {
          history: newHistory,
          historyIndex: newHistory.length - 1
        };
      }),
      
      undo: () => set((state) => {
        if (state.historyIndex > 0) {
          const prevState = state.history[state.historyIndex - 1];
          return {
            elements: prevState.elements,
            historyIndex: state.historyIndex - 1
          };
        }
        return state;
      }),
      
      redo: () => set((state) => {
        if (state.historyIndex < state.history.length - 1) {
          const nextState = state.history[state.historyIndex + 1];
          return {
            elements: nextState.elements,
            historyIndex: state.historyIndex + 1
          };
        }
        return state;
      }),
    }),
    {
      name: 'inpost-storage',
      getStorage: () => ({
        getItem: (name) => {
          // Try to get from localStorage first
          const localValue = localStorage.getItem(name);
          if (localValue !== null) {
            return Promise.resolve(localValue);
          }
          
          // Fall back to sessionStorage if localStorage fails
          const sessionValue = sessionStorage.getItem(name);
          return Promise.resolve(sessionValue);
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, value);
          } catch (error) {
            console.warn('Failed to save to localStorage, falling back to sessionStorage', error);
            try {
              sessionStorage.setItem(name, value);
            } catch (sessionError) {
              console.error('Failed to save to sessionStorage as well', sessionError);
            }
          }
          return Promise.resolve();
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
          sessionStorage.removeItem(name);
          return Promise.resolve();
        }
      })
    }
  )
); 