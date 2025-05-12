import { useState } from 'react';
import axios from 'axios';
import { useStore } from '../../../store';
import { RiGeminiFill } from '@remixicon/react';

export default function TextEnhancerPanel({ value, onChange, placeholder="Enter text to enhance with AI", rows=3, className, enhanceTextWithAI, isAiProcessing }) {

  return (
    <div className="text-enhancer-panel">
      <h3 className="text-sm font-medium mb-3">AI Text Enhancer</h3>
      
      <div className="mb-4 overflow-hidden w-full relative">
        <button 
          className="absolute right-1 top-1 text-indigo-600 hover:text-indigo-700 transition-all duration-200 group"
          title="AI Text Suggestions"
          onClick={enhanceTextWithAI}
          disabled={isAiProcessing || !value?.trim()}
        >
          <RiGeminiFill 
            size={18} 
            className={`${isAiProcessing ? 'animate-spin' : 'group-hover:rotate-90'} duration-300`}
          />
        </button>

        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-2 py-1 pr-6 border border-gray-300 rounded-md text-sm focus:outline-none min-h-8 max-h-40 ${className || ''}`}
          rows={rows}
        />
      </div>
    </div>
  );
}
