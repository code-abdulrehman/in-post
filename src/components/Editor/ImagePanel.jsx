import { useState, useRef } from 'react';
import { useStore } from '../../store';
import { MdCloudUpload, MdDelete, MdImage } from 'react-icons/md';
import { toast } from 'react-toastify';

export default function ImagePanel() {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const { addElement, addToHistory } = useStore();

  const handleAddImage = (imgUrl) => {
    addElement({
      type: 'image',
      src: imgUrl,
      x: 400,
      y: 300,
      width: 300,
      height: 250,
      rotation: 0
    });
    addToHistory('Add image');
    toast.success('Image added to canvas');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.type.match('image.*')) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          // Add to gallery first
          setUploadedImages(prev => [...prev, e.target.result]);
        };
        
        reader.readAsDataURL(file);
      } else {
        toast.error('Only image files are supported');
      }
    }
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="image-panel">
      <h3 className="text-sm font-medium mb-3">Add Images</h3>
      
      {/* Upload area */}
      <div 
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer mb-4 transition-colors duration-200 ${
          isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
        }`}
        onClick={() => fileInputRef.current.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          multiple
          onChange={handleFileInputChange} 
        />
        <MdCloudUpload className="mx-auto text-3xl text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">
          upload or drag and drop
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Supports: JPG, PNG, GIF, SVG, WebP
        </p>
      </div>
      
      {/* Image gallery */}
      {uploadedImages.length > 0 ? (
        <div>
          <h3 className="text-sm font-medium mb-2">Your Images</h3>
          <div className="grid grid-cols-2 gap-2">
            {uploadedImages.map((imgUrl, index) => (
              <div 
                key={index} 
                className="relative group border rounded-md overflow-hidden"
              >
                <img 
                  src={imgUrl} 
                  alt={`Uploaded ${index + 1}`} 
                  className="w-full h-20 object-cover cursor-pointer" 
                  onClick={() => handleAddImage(imgUrl)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button 
                    className="bg-indigo-600 text-white p-1 rounded-full"
                    onClick={() => handleAddImage(imgUrl)}
                    title="Add to Canvas"
                  >
                    <MdImage size={16} />
                  </button>
                  <button 
                    className="bg-red-500 text-white p-1 rounded-full ml-2"
                    onClick={() => removeImage(index)}
                    title="Remove"
                  >
                    <MdDelete size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-6">
          <MdImage className="mx-auto text-3xl mb-2" />
          <p className="text-sm">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
} 