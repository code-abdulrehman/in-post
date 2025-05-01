<template>
  <div class="file-uploader">
    <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="onDrop">
      <i class="pi pi-upload"></i>
      <p>Click or drop files here</p>
    </div>
    <input type="file" ref="fileInput" @change="onFileSelected" accept="image/*" style="display: none" />
    
    <div class="uploaded-files" v-if="uploadedFiles.length > 0">
      <div v-for="(file, index) in uploadedFiles" :key="index" class="file-item" @click="useImage(file)">
        <img :src="file.url" alt="Uploaded image" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const fileInput = ref(null);
const uploadedFiles = ref([]);

function triggerFileInput() {
  fileInput.value.click();
}

function onFileSelected(event) {
  const files = event.target.files;
  if (files.length > 0) {
    processFiles(files);
  }
}

function onDrop(event) {
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    processFiles(files);
  }
}

function processFiles(files) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    if (file.type.match('image.*')) {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        uploadedFiles.value.push({
          name: file.name,
          url: e.target.result,
          type: file.type
        });
      };
      
      reader.readAsDataURL(file);
    }
  }
}

function useImage(file) {
  // Emit event to parent
  emit('select-image', file);
}

const emit = defineEmits(['select-image']);
</script>

<style scoped>
.file-uploader {
  width: 100%;
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.upload-area:hover {
  background-color: #f5f5f5;
}

.upload-area i {
  font-size: 24px;
  margin-bottom: 10px;
  color: #666;
}

.upload-area p {
  margin: 0;
  color: #666;
}

.uploaded-files {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.file-item {
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #ddd;
}

.file-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-item:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style> 