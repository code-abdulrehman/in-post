import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      // Projects management
      projects: [],
      currentProjectId: null,
      
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
        // Handle navigation based on route name
        if (route === 'home') {
          window.location.href = '/';
        } else if (route === 'editor') {
          window.location.href = '/app';
        }
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
        const { elements } = get();
        const elementToDuplicate = elements.find(el => el.id === id);
        if (elementToDuplicate) {
          const newElementId = Date.now().toString();
          const newElement = {
            ...elementToDuplicate,
            id: newElementId,
            x: elementToDuplicate.x + 20,
            y: elementToDuplicate.y + 20,
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
      name: 'inpost-designer-storage',
      partialize: (state) => ({
        projects: state.projects,
        elements: state.elements,
        canvasSize: state.canvasSize,
        canvasBackground: state.canvasBackground,
      }),
    }
  )
); 