import { useRef, useEffect, useState } from 'react';
import { Image } from 'react-konva';

const URLImage = ({ src, cssFilter, ...props }) => {
  const imageRef = useRef(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    if (!src) {
      setError(true);
      setLoading(false);
      return;
    }

    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      setImage(img);
      setLoading(false);
      setError(false);
    };
    
    img.onerror = () => {
      console.error('Error loading image:', src);
      setError(true);
      setLoading(false);
    };
    
    img.src = src;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  // Apply CSS filters through a wrapper element
  useEffect(() => {
    if (!imageRef.current || !cssFilter) return;
    
    try {
      // Get the DOM node associated with this Konva element
      const node = imageRef.current;
      
      // Create a unique ID for this image
      const imageId = `image-${props.id}`;
      
      // Find or create a wrapper div for this image
      let wrapper = document.getElementById(imageId);
      if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.id = imageId;
        wrapper.style.position = 'absolute';
        wrapper.style.pointerEvents = 'none';
        wrapper.className = 'image-filter-wrapper';
        document.body.appendChild(wrapper);
      }
      
      // Position the wrapper over the image
      const stage = node.getStage();
      const transform = node.getAbsoluteTransform();
      const box = node.getClientRect();
      
      wrapper.style.left = `${box.x}px`;
      wrapper.style.top = `${box.y}px`;
      wrapper.style.width = `${box.width}px`;
      wrapper.style.height = `${box.height}px`;
      wrapper.style.transform = `rotate(${props.rotation || 0}deg)`;
      wrapper.style.transformOrigin = 'center center';
      wrapper.style.zIndex = '50';
      wrapper.style.filter = cssFilter;
      wrapper.style.opacity = props.opacity !== undefined ? props.opacity : 1;
      
      // Add the image as background
      wrapper.style.backgroundImage = `url(${src})`;
      wrapper.style.backgroundSize = 'contain';
      wrapper.style.backgroundPosition = 'center';
      wrapper.style.backgroundRepeat = 'no-repeat';
      
      // Hide the actual Konva image by making it transparent
      if (cssFilter) {
        node.opacity(0);
      } else {
        node.opacity(props.opacity !== undefined ? props.opacity : 1);
        wrapper.style.opacity = 0;
      }
      
      // Update on canvas changes
      const updateWrapperPosition = () => {
        const newBox = node.getClientRect();
        wrapper.style.left = `${newBox.x}px`;
        wrapper.style.top = `${newBox.y}px`;
        wrapper.style.width = `${newBox.width}px`;
        wrapper.style.height = `${newBox.height}px`;
        wrapper.style.transform = `rotate(${props.rotation || 0}deg)`;
      };
      
      stage.on('dragmove', updateWrapperPosition);
      stage.on('transform', updateWrapperPosition);
      stage.on('scale', updateWrapperPosition);
      
      return () => {
        // Remove event listeners
        stage.off('dragmove', updateWrapperPosition);
        stage.off('transform', updateWrapperPosition);
        stage.off('scale', updateWrapperPosition);
        
        // Remove the wrapper when component unmounts
        if (wrapper && document.body.contains(wrapper)) {
          document.body.removeChild(wrapper);
        }
      };
    } catch (err) {
      console.error('Error applying CSS filters to image:', err);
    }
  }, [image, cssFilter, props.id, props.rotation, props.opacity, src]);

  if (error) {
    // Return a placeholder for error state
    return (
      <Image
        {...props}
        fill="#f8f8f8"
        stroke="#ddd"
        opacity={0.5}
        strokeWidth={2}
      />
    );
  }

  if (loading) {
    // Return a placeholder while loading
    return (
      <Image
        {...props}
        fill="#f0f0f0"
        opacity={0.3}
      />
    );
  }

  return (
    <Image
      ref={imageRef}
      {...props}
      image={image}
      perfectDrawEnabled={true}
    />
  );
};

export default URLImage; 