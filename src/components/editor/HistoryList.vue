<template>
  <div class="history-list">
    <div class="history-header">
      <h3>Edit History</h3>
      <small>{{ historyItems.length }} changes</small>
    </div>
    
    <div class="history-items">
      <div 
        v-for="(item, index) in historyItems" 
        :key="index"
        class="history-item py-1 flex justify-between items-center px-2 border-b-[1px]"
        :class="{ 'active': currentIndex === index }"
        @click="goToState(index)"
      >
        <div class="history-item-content">
          <i :class="getActionIcon(item.action)"></i>
          <span>{{ item.description }}</span>
        </div>
        <small>{{ formatTime(item.timestamp) }}</small>
      </div>
      
      <div v-if="historyItems.length === 0" class="no-history">
        <p>No history yet</p>
        <p class="text-sm text-gray-500">Changes to your design will appear here</p>
      </div>
    </div>
    
    <div class="history-controls">
      <Button icon="pi pi-undo" @click="undo" :disabled="!canUndo" v-tooltip.top="'Undo'" />
      <Button icon="pi pi-refresh" @click="redo" :disabled="!canRedo" v-tooltip.top="'Redo'" />
      <Button icon="pi pi-history" @click="refreshHistory" v-tooltip.top="'Refresh History'" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';

// History items from localStorage
const historyItems = ref([]);
const currentIndex = ref(0);

// Get or create history array in localStorage
function loadHistory() {
  try {
    const saved = localStorage.getItem('canvasHistory');
    if (saved) {
      const history = JSON.parse(saved);
      if (Array.isArray(history)) {
        historyItems.value = history;
        currentIndex.value = history.length - 1;
        return;
      }
    }
    // If no valid history, initialize with empty array
    historyItems.value = [];
    saveHistory();
  } catch (error) {
    console.error('Failed to load history:', error);
    historyItems.value = [];
  }
}

// Save history to localStorage
function saveHistory() {
  try {
    localStorage.setItem('canvasHistory', JSON.stringify(historyItems.value));
  } catch (error) {
    console.error('Failed to save history:', error);
  }
}

// Detect what type of change was made by comparing states
function detectChangeType(prevState, newState) {
  if (!prevState || !newState) return { action: 'modify', description: 'Canvas Updated' };
  
  try {
    const oldState = typeof prevState === 'string' ? JSON.parse(prevState) : prevState;
    const currentState = typeof newState === 'string' ? JSON.parse(newState) : newState;
    
    // Check rectangles
    if (oldState.rectangles?.length !== currentState.rectangles?.length) {
      if (oldState.rectangles?.length < currentState.rectangles?.length) {
        return { action: 'create', description: 'Added Rectangle' };
      } else {
        return { action: 'delete', description: 'Deleted Rectangle' };
      }
    }
    
    // Check circles
    if (oldState.circles?.length !== currentState.circles?.length) {
      if (oldState.circles?.length < currentState.circles?.length) {
        return { action: 'create', description: 'Added Circle' };
      } else {
        return { action: 'delete', description: 'Deleted Circle' };
      }
    }
    
    // Check text elements
    if (oldState.textElements?.length !== currentState.textElements?.length) {
      if (oldState.textElements?.length < currentState.textElements?.length) {
        return { action: 'create', description: 'Added Text' };
      } else {
        return { action: 'delete', description: 'Deleted Text' };
      }
    }
    
    // Check lines
    if (oldState.lines?.length !== currentState.lines?.length) {
      if (oldState.lines?.length < currentState.lines?.length) {
        return { action: 'create', description: 'Added Line' };
      } else {
        return { action: 'delete', description: 'Deleted Line' };
      }
    }
    
    // Check images
    if (oldState.images?.length !== currentState.images?.length) {
      if (oldState.images?.length < currentState.images?.length) {
        return { action: 'create', description: 'Added Image' };
      } else {
        return { action: 'delete', description: 'Deleted Image' };
      }
    }
    
    // If we got here, it's likely a move or property change
    return { action: 'move', description: 'Moved Elements' };
    
  } catch (error) {
    console.error('Error detecting change type:', error);
    return { action: 'modify', description: 'Canvas Updated' };
  }
}

// Add an entry to history
function addHistoryEntry(action, description, state) {
  // If no explicit action/description, try to detect the change
  if (!action || !description) {
    // Get the last state to compare with
    const prevState = historyItems.value.length > 0 
      ? historyItems.value[historyItems.value.length - 1].state 
      : null;
    
    const detectedChange = detectChangeType(prevState, state);
    action = detectedChange.action;
    description = detectedChange.description;
  }
  
  const entry = {
    action,
    description, 
    timestamp: Date.now(),
    state: state || localStorage.getItem('canvasState')
  };
  
  // Important: We DO NOT remove future history when adding a new entry
  // after undoing. Instead, we insert it after the current position.
  if (currentIndex.value < historyItems.value.length - 1) {
    // Insert new entry after current index
    const newHistory = [
      ...historyItems.value.slice(0, currentIndex.value + 1),
      entry
    ];
    historyItems.value = newHistory;
    currentIndex.value = newHistory.length - 1;
  } else {
    // Normal case: just append to the end
    historyItems.value.push(entry);
    currentIndex.value = historyItems.value.length - 1;
  }
  
  // Limit history size to prevent performance issues
  if (historyItems.value.length > 100) {
    historyItems.value = historyItems.value.slice(historyItems.value.length - 100);
    currentIndex.value = Math.min(currentIndex.value, historyItems.value.length - 1);
  }
  
  saveHistory();
}

// Listen for canvas changes with better detection of action types
function setupCanvasStateListener() {
  let previousState = localStorage.getItem('canvasState');
  let debounceTimer = null;
  
  // Watch for changes to localStorage
  window.addEventListener('storage', (event) => {
    if (event.key === 'canvasState' && event.newValue !== previousState) {
      // Debounce to avoid too many entries
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        addHistoryEntry(null, null, event.newValue);
        previousState = event.newValue;
      }, 300);
    }
  });
  
  // Also check every second for changes (for same-window changes)
  setInterval(() => {
    const currentState = localStorage.getItem('canvasState');
    if (currentState !== previousState) {
      // Debounce to avoid too many entries
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        addHistoryEntry(null, null, currentState);
        previousState = currentState;
      }, 300);
    }
  }, 1000);
}

// Function to refresh history from localStorage
function refreshHistory() {
  loadHistory();
}

// Computed properties for undo/redo controls
const canUndo = computed(() => {
  return currentIndex.value > 0;
});

const canRedo = computed(() => {
  return currentIndex.value < historyItems.value.length - 1;
});

// Define emits
const emit = defineEmits(['undo', 'redo', 'goto-state']);

// History actions
function undo() {
  if (canUndo.value) {
    currentIndex.value--;
    const historyItem = historyItems.value[currentIndex.value];
    
    // Restore the state from history
    if (historyItem.state) {
      localStorage.setItem('canvasState', historyItem.state);
    }
    
    emit('undo', historyItem);
  }
}

function redo() {
  if (canRedo.value) {
    currentIndex.value++;
    const historyItem = historyItems.value[currentIndex.value];
    
    // Restore the state from history
    if (historyItem.state) {
      localStorage.setItem('canvasState', historyItem.state);
    }
    
    emit('redo', historyItem);
  }
}

function goToState(index) {
  if (index !== currentIndex.value) {
    const direction = index > currentIndex.value ? 'redo' : 'undo';
    currentIndex.value = index;
    const historyItem = historyItems.value[index];
    
    // Restore the state from history
    if (historyItem.state) {
      localStorage.setItem('canvasState', historyItem.state);
    }
    
    emit('goto-state', { index, item: historyItem, direction });
  }
}

// Helper functions
function getActionIcon(action) {
  switch (action) {
    case 'create': return 'pi pi-plus';
    case 'modify': return 'pi pi-pencil';
    case 'move': return 'pi pi-arrows-alt';
    case 'delete': return 'pi pi-trash';
    default: return 'pi pi-circle';
  }
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Initialize on component mount
onMounted(() => {
  loadHistory();
  setupCanvasStateListener();
  
  // Add initial history entry if empty
  if (historyItems.value.length === 0) {
    const canvasState = localStorage.getItem('canvasState');
    if (canvasState) {
      addHistoryEntry('create', 'Initial Canvas', canvasState);
    }
  }
});
</script>

<style scoped>
.history-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #e0e0e0;
}

.history-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.history-items {
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 250px);
}

.history-item {
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-item:hover {
  background-color: #f9f9f9;
}

.history-item-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.history-item.active {
  background-color: #e7f3ff;
}

.history-controls {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  border-top: 1px solid #e0e0e0;
  gap: 8px;
}

.no-history {
  padding: 24px 16px;
  text-align: center;
  color: #666;
}

/* Custom styles for PrimeVue components */
:deep(.p-button) {
  padding: 0.5rem;
}

:deep(.p-button .p-button-icon) {
  font-size: 1rem;
}
</style> 