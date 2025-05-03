import { useState, useEffect } from 'react';

// Custom hook for loading images in Konva components
const useImage = (src, crossOrigin) => {
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (!src) {
      setStatus('failed');
      return;
    }

    const img = new Image();
    
    if (crossOrigin) {
      img.crossOrigin = crossOrigin;
    }

    const onLoad = () => {
      setImage(img);
      setStatus('loaded');
    };

    const onError = () => {
      setStatus('failed');
    };

    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);
    
    img.src = src;

    return () => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
    };
  }, [src, crossOrigin]);

  return [image, status];
};

export default useImage; 