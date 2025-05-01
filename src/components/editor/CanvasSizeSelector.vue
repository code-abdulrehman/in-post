<template>
  <div class="canvas-size-selector">
    <div class="size-presets">
      <div 
        v-for="preset in presets" 
        :key="preset.name"
        class="size-preset"
        :class="{ 'active': selectedPreset === preset.name }"
        @click="selectPreset(preset)"
      >
        <div class="preset-icon" :style="getPresetStyle(preset)"></div>
        <div class="preset-info">
          <span class="preset-name">{{ preset.name }}</span>
          <span class="preset-dimensions">{{ preset.width }}×{{ preset.height }}</span>
        </div>
      </div>
    </div>
    
    <div class="custom-size">
      <div class="dimension-inputs">
        <div class="dimension-input">
          <label>Width</label>
          <InputNumber v-model="customWidth" :min="1" :max="3000" class="w-full" />
        </div>
        <div class="dimension-input">
          <label>Height</label>
          <InputNumber v-model="customHeight" :min="1" :max="3000" class="w-full" />
        </div>
        <Button label="Apply" @click="applyCustomSize" class="w-full mt-2" size="small" />
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref } from 'vue';

const presets = [
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'LinkedIn Post', width: 1200, height: 627 },
  { name: 'Twitter Post', width: 1200, height: 675 },
  { name: 'Facebook Post', width: 1200, height: 630 },
  { name: 'YouTube Thumbnail', width: 1280, height: 720 }
];

const selectedPreset = ref('');
const customWidth = ref(800);
const customHeight = ref(600);

function getPresetStyle(preset) {
  const ratio = preset.width / preset.height;
  const presetSize = 30; // Smaller size for sidebar
  let width, height;
  
  if (ratio >= 1) {
    width = presetSize;
    height = presetSize / ratio;
  } else {
    height = presetSize;
    width = presetSize * ratio;
  }
  
  return {
    width: `${width}px`,
    height: `${height}px`
  };
}

function selectPreset(preset) {
  selectedPreset.value = preset.name;
  customWidth.value = preset.width;
  customHeight.value = preset.height;
  emit('size-change', { width: preset.width, height: preset.height });
}

function applyCustomSize() {
  selectedPreset.value = '';
  emit('size-change', { width: customWidth.value, height: customHeight.value });
}

const emit = defineEmits(['size-change']);
</script>

<style scoped>
.canvas-size-selector {
  width: 100%;
}

.size-presets {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 10px;
}

.size-preset {
  display: flex;
  align-items: center;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 12px;
}

.size-preset:hover {
  background-color: #f5f5f5;
}

.size-preset.active {
  background-color: #e7f4ff;
  border-color: #007bff;
}

.preset-icon {
  background-color: #ddd;
  margin-right: 8px;
  border-radius: 2px;
}

.preset-info {
  display: flex;
  flex-direction: column;
}

.preset-name {
  font-size: 12px;
  font-weight: 500;
}

.preset-dimensions {
  font-size: 10px;
  color: #666;
}

.custom-size h4 {
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 500;
}

.dimension-inputs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.dimension-input {
  flex: 1;
  min-width: 70px;
}

.dimension-input label {
  display: block;
  font-size: 10px;
  margin-bottom: 2px;
  color: #666;
}

/* Custom styles for PrimeVue components */
:deep(.p-inputnumber) {
  width: 100%;
}

:deep(.p-inputnumber-input) {
  width: 100%;
  font-size: 11px;
  padding: 3px 6px;
  height: 30px;
}

:deep(.p-button) {
  font-size: 12px;
}
</style> 