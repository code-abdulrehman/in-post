import React from 'react';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to perform this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div 
        className="animate-in fade-in duration-200 max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="mt-2 text-sm text-gray-500">{message}</p>
        </div>
        <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3">
          <button
            type="button"
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 text-sm rounded-md text-white transition-colors ${
              isDanger 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 