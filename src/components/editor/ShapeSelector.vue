<template>
  <div class="shape-selector">
    <div class="shape-grid">
      <div class="shape-item" @click="addShape('rectangle')">
        <div class="shape-preview rectangle"></div>
        <span>Rectangle</span>
      </div>
      <div class="shape-item" @click="addShape('circle')">
        <div class="shape-preview circle"></div>
        <span>Circle</span>
      </div>
      <div class="shape-item" @click="addShape('triangle')">
        <div class="shape-preview triangle"></div>
        <span>Triangle</span>
      </div>
      <div class="shape-item" @click="addShape('star')">
        <div class="shape-preview star">★</div>
        <span>Star</span>
      </div>
    </div>
  </div>
</template>

<script setup>
function addShape(type) {
  // Emit event to parent
  emit('add-shape', { type });
}

const emit = defineEmits(['add-shape']);
</script>

<style scoped>
.shape-selector {
  width: 100%;
}

.shape-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.shape-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.shape-item:hover {
  background-color: #e9ecef;
}

.shape-preview {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
}

.rectangle {
  background-color: #3498db;
  border-radius: 2px;
}

.circle {
  background-color: #e74c3c;
  border-radius: 50%;
}

.triangle {
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 35px solid #2ecc71;
}

.star {
  font-size: 35px;
  color: #f1c40f;
}

span {
  font-size: 12px;
  color: #666;
}
</style> 