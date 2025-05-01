<template>
  <div class="layer-manager">
    <div class="layer-list">
      <div 
        v-for="layer in layers" 
        :key="layer.id" 
        class="layer-item"
        :class="{ 'selected': selectedLayer === layer.id }"
        @click="selectLayer(layer.id)"
      >
        <div class="layer-visibility">
          <i :class="layer.visible ? 'pi pi-eye' : 'pi pi-eye-slash'" @click.stop="toggleVisibility(layer.id)"></i>
        </div>
        <div class="layer-info">
          <span class="layer-name">{{ layer.name }}</span>
          <span class="layer-type">{{ layer.type }}</span>
        </div>
        <div class="layer-actions">
          <i class="pi pi-trash" @click.stop="deleteLayer(layer.id)"></i>
        </div>
      </div>
    </div>
    
    <div class="layer-controls">
      <Button icon="pi pi-arrow-up" @click="moveLayerUp" :disabled="!canMoveUp" />
      <Button icon="pi pi-arrow-down" @click="moveLayerDown" :disabled="!canMoveDown" />
    </div>
  </div>
</template>

<script setup>

import { computed, ref } from 'vue';

// Sample layers - in a real app, these would come from props or a store
const layers = ref([
  { id: 1, name: 'Background', type: 'Rectangle', visible: true },
  { id: 2, name: 'Heading', type: 'Text', visible: true },
  { id: 3, name: 'Logo', type: 'Image', visible: true }
]);

const selectedLayer = ref(null);

// Computed properties for layer control buttons
const selectedIndex = computed(() => {
  return layers.value.findIndex(layer => layer.id === selectedLayer.value);
});

const canMoveUp = computed(() => {
  return selectedLayer.value !== null && selectedIndex.value > 0;
});

const canMoveDown = computed(() => {
  return selectedLayer.value !== null && selectedIndex.value < layers.value.length - 1;
});

// Layer actions
function selectLayer(id) {
  selectedLayer.value = id;
  emit('select-layer', id);
}

function toggleVisibility(id) {
  const layer = layers.value.find(l => l.id === id);
  if (layer) {
    layer.visible = !layer.visible;
    emit('toggle-visibility', { id, visible: layer.visible });
  }
}

function deleteLayer(id) {
  const index = layers.value.findIndex(l => l.id === id);
  if (index !== -1) {
    layers.value.splice(index, 1);
    emit('delete-layer', id);
    
    if (selectedLayer.value === id) {
      selectedLayer.value = null;
    }
  }
}

function moveLayerUp() {
  if (canMoveUp.value) {
    const index = selectedIndex.value;
    const temp = layers.value[index];
    layers.value[index] = layers.value[index - 1];
    layers.value[index - 1] = temp;
    emit('reorder-layers', layers.value.map(l => l.id));
  }
}

function moveLayerDown() {
  if (canMoveDown.value) {
    const index = selectedIndex.value;
    const temp = layers.value[index];
    layers.value[index] = layers.value[index + 1];
    layers.value[index + 1] = temp;
    emit('reorder-layers', layers.value.map(l => l.id));
  }
}

const emit = defineEmits(['select-layer', 'toggle-visibility', 'delete-layer', 'reorder-layers']);
</script>

<style scoped>
.layer-manager {
  width: 100%;
}

.layer-list {
  max-height: 250px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.layer-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.layer-item:hover {
  background-color: #f8f9fa;
}

.layer-item.selected {
  background-color: #e7f4ff;
}

.layer-visibility {
  margin-right: 8px;
  font-size: 16px;
  color: #666;
}

.layer-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.layer-name {
  font-size: 12px;
  color: #333;
}

.layer-type {
  font-size: 10px;
  color: #888;
}

.layer-actions {
  opacity: 0.5;
  transition: opacity 0.2s;
}

.layer-item:hover .layer-actions {
  opacity: 1;
}

.layer-controls {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
  gap: 4px;
}

/* Custom styles for PrimeVue components */
:deep(.p-button) {
  padding: 0.25rem;
}

:deep(.p-button .p-button-icon) {
  font-size: 0.75rem;
}
</style> 