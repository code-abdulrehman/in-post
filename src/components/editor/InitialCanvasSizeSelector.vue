<template>
  <Dialog 
    :visible="visible" 
    modal 
    :closable="false" 
    header="Select Canvas Size" 
    :style="{ width: '500px' }"
  >
    <div class="initial-canvas-selector">
      <p class="instructions">Please select a canvas size to start with. You can change this later.</p>
      
      <h3>Preset Sizes</h3>
      <div class="preset-grid">
        <div 
          v-for="preset in presets" 
          :key="preset.name"
          class="preset-item"
          @click="selectPreset(preset)"
        >
          <div class="preset-preview" :style="getPresetStyle(preset)"></div>
          <div class="preset-info">
            <div class="preset-name">{{ preset.name }}</div>
            <div class="preset-dimensions">{{ preset.width }}×{{ preset.height }}</div>
          </div>
        </div>
      </div>
      
      <h3>Custom Size</h3>
      <div class="custom-size">
        <div class="dimension-inputs">
          <span class="p-float-label">
            <InputNumber 
              id="width" 
              v-model="customWidth" 
              :min="1" 
              :max="3000" 
              class="w-full"
            />
            <label for="width">Width (px)</label>
          </span>
          
          <span class="p-float-label">
            <InputNumber 
              id="height" 
              v-model="customHeight" 
              :min="1" 
              :max="3000" 
              class="w-full"
            />
            <label for="height">Height (px)</label>
          </span>
        </div>
      </div>
      
      <div class="selector-actions">
        <Button 
          label="Start with Custom Size" 
          icon="pi pi-check" 
          @click="applyCustomSize" 
          class="w-full"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup>

import Dialog from 'primevue/dialog';
import { ref } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['size-selected']);

const customWidth = ref(1200);
const customHeight = ref(630);

const presets = [
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'LinkedIn Post', width: 1200, height: 627 },
  { name: 'Twitter Post', width: 1200, height: 675 },
  { name: 'Facebook Post', width: 1200, height: 630 },
  { name: 'YouTube Thumbnail', width: 1280, height: 720 },
  { name: 'Instagram Story', width: 1080, height: 1920 }
];

function getPresetStyle(preset) {
  const ratio = preset.width / preset.height;
  let width, height;
  
  // Set max dimensions for preview
  const maxSize = 100;
  
  if (ratio >= 1) {
    width = maxSize;
    height = maxSize / ratio;
  } else {
    height = maxSize;
    width = maxSize * ratio;
  }
  
  return {
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: '#e0e0e0'
  };
}

function selectPreset(preset) {
  console.log(`Selected preset: ${preset.name} (${preset.width}x${preset.height})`);
  emit('size-selected', { width: preset.width, height: preset.height });
}

function applyCustomSize() {
  console.log(`Selected custom size: ${customWidth.value}x${customHeight.value}`);
  emit('size-selected', { width: customWidth.value, height: customHeight.value });
}
</script>

<style scoped>
.initial-canvas-selector {
  display: flex;
  flex-direction: column;
  /* gap: 16px; */
}

.instructions {
  margin-bottom: 10px;
  color: #555;
  font-size: 14px;
  line-height: 1.4;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.preset-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background-color: white;
}

.preset-item:hover {
  border-color: #007bff;
  background-color: #f5f8ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.preset-preview {
  margin-bottom: 10px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.preset-name {
  font-weight: 500;
  font-size: 14px;
  text-align: center;
  margin-bottom: 2px;
}

.preset-dimensions {
  font-size: 12px;
  color: #666;
  text-align: center;
}

.custom-size {
  margin-bottom: 20px;
  background-color: #f8f8f8;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.dimension-inputs {
  display: flex;
  gap: 16px;
}

.dimension-inputs > span {
  flex: 1;
}

h3 {
  font-size: 16px;
  margin-bottom: 12px;
  color: #333;
  font-weight: 600;
  position: relative;
}

h3::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 40px;
  height: 2px;
  background-color: #007bff;
}

.selector-actions {
  margin-top: 20px;
}

:deep(.p-button) {
  transition: all 0.3s;
}

:deep(.p-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style> 