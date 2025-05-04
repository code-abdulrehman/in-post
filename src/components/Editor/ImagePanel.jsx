import { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store';
import { MdCloudUpload, MdDelete, MdImage, MdError } from 'react-icons/md';
import { toast } from 'react-toastify';

// IndexedDB configuration
const DB_NAME = 'inPostUserDB';
const DB_VERSION = 1;
const STORE_NAME = 'userImages';
const MAX_IMAGES = 10;

// Maximum width/height for images added to canvas
const MAX_IMAGE_DIMENSION = 400;

export default function ImagePanel() {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageDimensions, setImageDimensions] = useState({});
  const fileInputRef = useRef(null);
  const { addElement, addToHistory } = useStore();

  // Initialize IndexedDB and load saved images on component mount
  useEffect(() => {
    initDB();
  }, []);

  // Initialize the IndexedDB database
  const initDB = async () => {
    try {
      setIsLoading(true);
      
      // Open database connection
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      // Handle database upgrade (first time or version change)
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
      
      // Handle successful database open
      request.onsuccess = (event) => {
        const db = event.target.result;
        loadImagesFromDB(db);
      };
      
      // Handle database error
      request.onerror = (event) => {
        console.error('IndexedDB error:', event.target.error);
        toast.error('Failed to initialize image storage');
        setIsLoading(false);
      };
    } catch (err) {
      console.error('IndexedDB initialization error:', err);
      toast.error('Failed to initialize image storage');
      setIsLoading(false);
    }
  };

  // Load images from IndexedDB
  const loadImagesFromDB = (db) => {
    try {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('timestamp');
      const getAllRequest = index.getAll();
      
      getAllRequest.onsuccess = () => {
        const images = getAllRequest.result || [];
        setUploadedImages(images.map(img => img.data));
        setIsLoading(false);
        
        // Preload images to get their dimensions
        images.forEach(img => {
          getImageDimensions(img.data);
        });
      };
      
      getAllRequest.onerror = (event) => {
        console.error('Error loading images:', event.target.error);
        setIsLoading(false);
      };
    } catch (err) {
      console.error('Error in loadImagesFromDB:', err);
      setIsLoading(false);
    }
  };

  // Get image dimensions
  const getImageDimensions = (imgUrl) => {
    return new Promise((resolve) => {
      if (imageDimensions[imgUrl]) {
        resolve(imageDimensions[imgUrl]);
        return;
      }
      
      const img = new Image();
      img.onload = () => {
        const dimensions = {
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height
        };
        
        setImageDimensions(prev => ({
          ...prev,
          [imgUrl]: dimensions
        }));
        
        resolve(dimensions);
      };
      
      img.onerror = () => {
        // Default dimensions if image fails to load
        const defaultDimensions = { width: 300, height: 200, aspectRatio: 1.5 };
        setImageDimensions(prev => ({
          ...prev,
          [imgUrl]: defaultDimensions
        }));
        resolve(defaultDimensions);
      };
      
      img.src = imgUrl;
    });
  };

  // Save image to IndexedDB
  const saveImageToDB = async (imageData) => {
    return new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction([STORE_NAME], 'readwrite');
          const store = transaction.objectStore(STORE_NAME);
          
          // Check if we already have 10 images
          const countRequest = store.count();
          
          countRequest.onsuccess = () => {
            const count = countRequest.result;
            
            if (count >= MAX_IMAGES) {
              // Get the oldest image to delete
              const index = store.index('timestamp');
              const cursorRequest = index.openCursor();
              
              cursorRequest.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                  // Delete the oldest image
                  store.delete(cursor.value.id);
                  
                  // Add the new image
                  const newImage = { 
                    data: imageData, 
                    timestamp: Date.now() 
                  };
                  
                  const addRequest = store.add(newImage);
                  
                  addRequest.onsuccess = () => {
                    resolve(true);
                  };
                  
                  addRequest.onerror = (event) => {
                    console.error('Error adding image:', event.target.error);
                    reject(event.target.error);
                  };
                }
              };
            } else {
              // Add the new image if we have less than 10
              const newImage = { 
                data: imageData, 
                timestamp: Date.now() 
              };
              
              const addRequest = store.add(newImage);
              
              addRequest.onsuccess = () => {
                resolve(true);
              };
              
              addRequest.onerror = (event) => {
                console.error('Error adding image:', event.target.error);
                reject(event.target.error);
              };
            }
          };
        };
        
        request.onerror = (event) => {
          console.error('Error opening database:', event.target.error);
          reject(event.target.error);
        };
      } catch (err) {
        console.error('Error in saveImageToDB:', err);
        reject(err);
      }
    });
  };

  // Delete image from IndexedDB
  const deleteImageFromDB = async (imageData) => {
    return new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction([STORE_NAME], 'readwrite');
          const store = transaction.objectStore(STORE_NAME);
          
          // Find the image to delete
          const getAllRequest = store.getAll();
          
          getAllRequest.onsuccess = () => {
            const images = getAllRequest.result || [];
            const imageToDelete = images.find(img => img.data === imageData);
            
            if (imageToDelete) {
              const deleteRequest = store.delete(imageToDelete.id);
              
              deleteRequest.onsuccess = () => {
                resolve(true);
              };
              
              deleteRequest.onerror = (event) => {
                console.error('Error deleting image:', event.target.error);
                reject(event.target.error);
              };
            } else {
              // Image not found, still consider it a success
              resolve(true);
            }
          };
        };
        
        request.onerror = (event) => {
          console.error('Error opening database:', event.target.error);
          reject(event.target.error);
        };
      } catch (err) {
        console.error('Error in deleteImageFromDB:', err);
        reject(err);
      }
    });
  };

  const handleAddImage = async (imgUrl) => {
    try {
      // Get or calculate image dimensions
      let dimensions = imageDimensions[imgUrl];
      
      if (!dimensions) {
        dimensions = await getImageDimensions(imgUrl);
      }
      
      // Calculate size while preserving aspect ratio
      let width, height;
      
      if (dimensions.width > dimensions.height) {
        // Landscape image
        width = Math.min(dimensions.width, MAX_IMAGE_DIMENSION);
        height = width / dimensions.aspectRatio;
      } else {
        // Portrait or square image
        height = Math.min(dimensions.height, MAX_IMAGE_DIMENSION);
        width = height * dimensions.aspectRatio;
      }
      
      // Add element to canvas with proper dimensions
    addElement({
      type: 'image',
      src: imgUrl,
        x: 400, // Center position
      y: 300,
        width: Math.round(width),
        height: Math.round(height),
        rotation: 0,
        originalAspectRatio: dimensions.aspectRatio // Store for reference
      });
      
    addToHistory('Add image');
      toast.success('Image added to canvas with original aspect ratio');
    } catch (err) {
      console.error('Error adding image to canvas:', err);
      toast.error('Failed to add image to canvas');
    }
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
        
        reader.onload = async (e) => {
          try {
            const imageData = e.target.result;
            
            // Get dimensions before saving
            await getImageDimensions(imageData);
            
            // Save to IndexedDB
            await saveImageToDB(imageData);
            
            // Update the UI
            setUploadedImages(prev => {
              // If we've reached the max, remove the oldest from UI
              if (prev.length >= MAX_IMAGES) {
                return [...prev.slice(1), imageData];
              }
              return [...prev, imageData];
            });
          } catch (err) {
            console.error('Error processing image:', err);
            toast.error('Failed to save image');
          }
        };
        
        reader.readAsDataURL(file);
      } else {
        toast.error('Only image files are supported');
      }
    }
  };

  const removeImage = async (index) => {
    try {
      const imageToRemove = uploadedImages[index];
      
      // Remove from IndexedDB
      await deleteImageFromDB(imageToRemove);
      
      // Update UI
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
      
      // Remove from dimensions cache
      setImageDimensions(prev => {
        const newDimensions = {...prev};
        delete newDimensions[imageToRemove];
        return newDimensions;
      });
      
      toast.success('Image removed');
    } catch (err) {
      console.error('Error removing image:', err);
      toast.error('Failed to remove image');
    }
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
        <p className="text-xs text-gray-400 mt-1">
          Max: {MAX_IMAGES} images (oldest will be replaced)
        </p>
      </div>
      
      {/* Image gallery */}
      {isLoading ? (
        <div className="text-center text-gray-500 py-6">
          <div className="animate-spin mx-auto h-8 w-8 border-2 border-indigo-500 rounded-full border-t-transparent mb-2"></div>
          <p className="text-sm">Loading your images...</p>
        </div>
      ) : uploadedImages.length > 0 ? (
        <div>
          <h3 className="text-sm font-medium mb-2">Your Images ({uploadedImages.length}/{MAX_IMAGES})</h3>
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
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 24 24' fill='none' stroke='%23d1d5db' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
                  }}
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
                {imageDimensions[imgUrl] && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center truncate">
                    {imageDimensions[imgUrl].width} × {imageDimensions[imgUrl].height}
                  </div>
                )}
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