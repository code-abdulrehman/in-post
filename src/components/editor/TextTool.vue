<template>
  <div class="text-tool">
    <div class="text-styles">
      <div class="text-style" @click="addText('heading')">
        <span class="heading-style">Heading</span>
      </div>
      <div class="text-style" @click="addText('subheading')">
        <span class="subheading-style">Subheading</span>
      </div>
      <div class="text-style" @click="addText('body')">
        <span class="body-style">Body Text</span>
      </div>
      <div class="text-style" @click="addText('caption')">
        <span class="caption-style">Caption</span>
      </div>
    </div>
  </div>
</template>

<script setup>
function addText(style) {
  let textConfig = {
    type: 'text',
    text: ''
  };
  
  switch (style) {
    case 'heading':
      textConfig.text = 'Heading Text';
      textConfig.fontSize = 32;
      textConfig.fontFamily = 'Arial';
      textConfig.fontWeight = 'bold';
      break;
    case 'subheading':
      textConfig.text = 'Subheading Text';
      textConfig.fontSize = 24;
      textConfig.fontFamily = 'Arial';
      textConfig.fontWeight = 'bold';
      break;
    case 'body':
      textConfig.text = 'Body Text';
      textConfig.fontSize = 16;
      textConfig.fontFamily = 'Arial';
      break;
    case 'caption':
      textConfig.text = 'Caption Text';
      textConfig.fontSize = 12;
      textConfig.fontFamily = 'Arial';
      textConfig.fontStyle = 'italic';
      break;
  }
  
  // Emit the event to add text
  emit('add-text', textConfig);
}

const emit = defineEmits(['add-text']);
</script>

<style scoped>
.text-tool {
  width: 100%;
}

.text-styles {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.text-style {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.text-style:hover {
  background-color: #f5f5f5;
  transform: translateY(-2px);
}

.heading-style {
  font-size: 18px;
  font-weight: bold;
  display: block;
}

.subheading-style {
  font-size: 16px;
  font-weight: bold;
  display: block;
}

.body-style {
  font-size: 14px;
  display: block;
}

.caption-style {
  font-size: 12px;
  font-style: italic;
  display: block;
}
</style> 