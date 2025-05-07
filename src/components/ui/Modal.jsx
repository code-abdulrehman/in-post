import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../redux/slices/uiSlice';

/**
 * Reusable Modal component
 * @param {Object} props
 * @param {ReactNode} props.children - Modal content
 * @param {string} props.title - Modal title
 * @param {function} props.onClose - Function to call when modal is closed
 * @param {string} props.size - Modal size: 'sm', 'md', 'lg', 'xl', 'full'
 * @param {boolean} props.closeOnEsc - Whether to close the modal when Escape key is pressed
 * @param {boolean} props.closeOnOutsideClick - Whether to close the modal when clicking outside
 * @param {boolean} props.showCloseButton - Whether to show the close button
 * @param {string} props.className - Additional class names for the modal
 */
const Modal = ({
  children,
  title,
  onClose,
  size = 'md',
  closeOnEsc = true,
  closeOnOutsideClick = true,
  showCloseButton = true,
  className = '',
}) => {
  const dispatch = useDispatch();
  const modalRef = useRef(null);
  
  // Handle size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    full: 'max-w-full',
  };
  
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && closeOnEsc) {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeOnEsc]);
  
  // Close modal when clicking outside
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target) && closeOnOutsideClick) {
      handleClose();
    }
  };
  
  // Handle modal close
  const handleClose = () => {
    // If onClose prop is provided, call it
    if (onClose) {
      onClose();
    }
    
    // Dispatch close modal action to Redux store
    dispatch(closeModal());
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div 
        className="flex items-center justify-center min-h-screen p-4 text-center sm:p-0"
        onClick={handleOutsideClick}
      >
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" 
          aria-hidden="true"
        ></div>
        
        {/* Modal panel */}
        <div 
          ref={modalRef}
          className={`relative inline-block bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${sizeClasses[size] || 'max-w-md'} w-full ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal header */}
          {(title || showCloseButton) && (
            <div className="px-4 py-3 sm:px-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              {title && (
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100" id="modal-title">
                  {title}
                </h3>
              )}
              
              {showCloseButton && (
                <button
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                  onClick={handleClose}
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          )}
          
          {/* Modal content */}
          <div className="px-4 py-3 sm:px-6 sm:py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal; 