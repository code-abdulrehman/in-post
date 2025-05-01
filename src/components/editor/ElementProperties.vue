<template>
  <div class="element-properties">
    <div class="property-group">
      <h4>Dimensions</h4>
      <div class="property-row">
        <label>Width:</label>
        <input type="number" v-model="properties.width" @change="updateElement" />
      </div>
      <div class="property-row">
        <label>Height:</label>
        <input type="number" v-model="properties.height" @change="updateElement" />
      </div>
    </div>
    
    <div class="property-group">
      <h4>Position</h4>
      <div class="property-row">
        <label>X:</label>
        <input type="number" v-model="properties.x" @change="updateElement" />
      </div>
      <div class="property-row">
        <label>Y:</label>
        <input type="number" v-model="properties.y" @change="updateElement" />
      </div>
    </div>
    
    <div class="property-group">
      <h4>Appearance</h4>
      <div class="property-row">
        <label>Color:</label>
        <input type="color" v-model="properties.fill" @change="updateElement" />
      </div>
      <div class="property-row">
        <label>Opacity:</label>
        <Slider v-model="properties.opacity" :min="0" :max="1" :step="0.1" @change="updateElement" />
      </div>
    </div>
    
    <div class="property-group" v-if="element?.type === 'text'">
      <h4>Text Options</h4>
      <div class="property-row">
        <label>Font Size:</label>
        <input type="number" v-model="properties.fontSize" @change="updateElement" />
      </div>
      <div class="property-row">
        <label>Font:</label>
        <Dropdown v-model="properties.fontFamily" :options="fontOptions" @change="updateElement" />
      </div>
    </div>
    
    <div class="actions">
      <Button label="Delete" icon="pi pi-trash" severity="danger" @click="deleteElement" />
    </div>
  </div>
</template>

<script setup>

import { reactive, watch } from 'vue';

const props = defineProps({
  element: {
    type: Object,
    required: true
  }
});

const properties = reactive({
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  fill: '#000000',
  opacity: 1,
  fontSize: 16,
  fontFamily: 'Arial'
});

const fontOptions = [
  { label: 'Arial', value: 'Arial' },
  { label: 'Helvetica', value: 'Helvetica' },
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Courier New', value: 'Courier New' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Verdana', value: 'Verdana' }
];

// Watch for changes in element
watch(() => props.element, (newElement) => {
  if (newElement) {
    // Update properties from element
    Object.assign(properties, newElement);
  }
}, { deep: true, immediate: true });

function updateElement() {
  // Emit update event to parent
  emit('update-element', { id: props.element.id, properties });
}

function deleteElement() {
  // Emit delete event to parent
  emit('delete-element', props.element.id);
}

const emit = defineEmits(['update-element', 'delete-element']);
</script>

<style scoped>
.element-properties {
  width: 100%;
}

.property-group {
  margin-bottom: 16px;
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
}

.property-group h4 {
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

.property-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.property-row label {
  flex: 0 0 80px;
  font-size: 12px;
  color: #666;
}

input[type="number"],
input[type="text"] {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
}

input[type="color"] {
  width: 100%;
  height: 24px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0;
}

.actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style> 