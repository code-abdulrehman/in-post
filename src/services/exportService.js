/**
 * Services for exporting canvas designs to different formats
 */

/**
 * Export a Konva stage as PNG image
 * @param {Object} stage - Konva stage
 * @param {Object} options - Export options
 * @returns {string} Data URL
 */
export function exportAsPNG(stage, options = {}) {
  if (!stage) {
    console.error('Invalid stage object provided to exportAsPNG');
    return '';
  }
  
  // Try different methods of accessing toDataURL depending on what's available
  const toDataURLMethod = getDataURLMethod(stage);
  
  if (!toDataURLMethod) {
    console.error('Stage does not have toDataURL method');
    return '';
  }
  
  return toDataURLMethod({
    pixelRatio: options.pixelRatio || 2,
    mimeType: 'image/png',
    ...options
  });
}

/**
 * Export a Konva stage as JPG image
 * @param {Object} stage - Konva stage
 * @param {Object} options - Export options
 * @returns {string} Data URL
 */
export function exportAsJPG(stage, options = {}) {
  if (!stage) {
    console.error('Invalid stage object provided to exportAsJPG');
    return '';
  }
  
  // Try different methods of accessing toDataURL depending on what's available
  const toDataURLMethod = getDataURLMethod(stage);
  
  if (!toDataURLMethod) {
    console.error('Stage does not have toDataURL method');
    return '';
  }
  
  return toDataURLMethod({
    pixelRatio: options.pixelRatio || 2,
    mimeType: 'image/jpeg',
    quality: options.quality || 0.9,
    ...options
  });
}

/**
 * Get the appropriate toDataURL method from a stage object
 * @param {Object} stage - Konva stage or wrapper
 * @returns {Function|null} toDataURL method or null
 */
function getDataURLMethod(stage) {
  console.log("Export service - stage type:", typeof stage);
  
  try {
    // Import Konva directly
    const Konva = require('konva');
    
    // Method 1: Direct toDataURL method on the stage object
    if (typeof stage.toDataURL === 'function') {
      console.log("Using direct toDataURL method");
      return (options) => stage.toDataURL(options);
    }
    
    // Method 2: Access through getStage() method
    if (stage.getStage && typeof stage.getStage().toDataURL === 'function') {
      console.log("Using getStage().toDataURL method");
      return (options) => stage.getStage().toDataURL(options);
    }
    
    // Method 3: Access through _stage property (Vue Konva 3.x)
    if (stage._stage && typeof stage._stage.toDataURL === 'function') {
      console.log("Using _stage.toDataURL method");
      return (options) => stage._stage.toDataURL(options);
    }
    
    // Try to convert to a canvas and draw manually as last resort
    if (stage.content && stage.content.getContext) {
      console.log("Using canvas context directly");
      return (options) => {
        const ctx = stage.content.getContext('2d');
        return stage.content.toDataURL(options.mimeType, options.quality);
      };
    }
    
  } catch (error) {
    console.error('Error in getDataURLMethod:', error);
  }
  
  console.error('No toDataURL method found on stage. Stage object:', stage);
  return null;
}

/**
 * Export a Konva stage as PDF document
 * @param {Object} stage - Konva stage
 * @param {Object} options - Export options
 * @returns {Blob} PDF blob
 */
export async function exportAsPDF(stage, options = {}) {
  // This requires jspdf library to be installed
  // npm install jspdf
  
  // Since we don't have the library yet, this is a stub
  // We will use the PNG data URL and convert it to PDF
  
  // Mock implementation - in a real app, import jsPDF and use it
  console.log('PDF export would use jsPDF to convert the image to PDF');
  
  const dataUrl = exportAsPNG(stage, options);
  
  // In a real implementation, it would look like this:
  /*
  import { jsPDF } from 'jspdf';
  
  const dataUrl = exportAsPNG(stage);
  const pdf = new jsPDF({
    orientation: options.orientation || 'landscape',
    unit: 'px',
    format: [stage.width(), stage.height()]
  });
  
  const imgProps = pdf.getImageProperties(dataUrl);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
  pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
  return pdf.output('blob');
  */
  
  // For now, just simulate a PDF by returning the PNG data
  return dataUrl;
}

/**
 * Export a Konva stage as SVG
 * @param {Object} stage - Konva stage
 * @param {Object} options - Export options
 * @returns {string} SVG string
 */
export function exportAsSVG(stage, options = {}) {
  // This is a placeholder - Konva doesn't natively support SVG export
  // In a real app, you would need to convert the Konva objects to SVG format
  
  console.log('SVG export would require custom implementation to convert Konva objects to SVG');
  
  // Mock implementation
  const width = stage.width();
  const height = stage.height();
  
  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="white"/>
      <text x="50%" y="50%" font-family="Arial" font-size="20" text-anchor="middle">
        SVG Export (Placeholder)
      </text>
    </svg>
  `;
}

/**
 * Download a file from data
 * @param {string|Blob} data - The data to download
 * @param {string} filename - The filename to save as
 * @param {string} type - The MIME type
 */
export function downloadFile(data, filename, type) {
  const link = document.createElement('a');
  
  if (data instanceof Blob) {
    link.href = URL.createObjectURL(data);
  } else {
    link.href = data;
  }
  
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object if we created one
  if (data instanceof Blob) {
    setTimeout(() => URL.revokeObjectURL(link.href), 100);
  }
}

/**
 * Save the current design as a project file
 * @param {Object} projectData - The project data to save
 * @param {string} filename - The filename to save as
 */
export function saveProject(projectData, filename = 'design.inpost') {
  const json = JSON.stringify(projectData);
  const blob = new Blob([json], { type: 'application/json' });
  downloadFile(blob, filename, 'application/json');
}

/**
 * Load a project from a file
 * @param {File} file - The file to load
 * @returns {Promise<Object>} The loaded project data
 */
export function loadProject(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const projectData = JSON.parse(e.target.result);
        resolve(projectData);
      } catch (error) {
        reject(new Error('Invalid project file format'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading project file'));
    };
    
    reader.readAsText(file);
  });
} 