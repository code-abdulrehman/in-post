import { useState } from 'react';
import axios from 'axios';
import { useStore } from '../../../store';
import { RiGeminiFill } from '@remixicon/react';

export default function TextEnhancerPanel({
  value,
  onChange,
  placeholder = 'Enter text to enhance with AI',
  rows = 3,
  className,
  enhanceTextWithAI,
  isAiProcessing,
  aiFeaturesEnabled = true,
}) {
  const aiDisabled = !aiFeaturesEnabled;

  return (
    <div className="text-enhancer-panel">
      <h3 className="text-sm font-medium mb-3">
        AI Text Enhancer
        {aiDisabled && <span className="ml-2 text-xs font-normal text-stone-400">(offline)</span>}
      </h3>
      
      <div className="mb-4 overflow-hidden w-full relative">
        <button 
          type="button"
          className={`absolute right-1 top-1 transition-all duration-200 group ${
            aiDisabled ? 'cursor-not-allowed text-stone-300' : 'text-orange-600 hover:text-orange-700'
          }`}
          title={aiDisabled ? 'AI unavailable' : 'AI text suggestions'}
          onClick={enhanceTextWithAI}
          disabled={aiDisabled || isAiProcessing || !value?.trim()}
        >
          <RiGeminiFill 
            size={18} 
            className={`${isAiProcessing ? 'animate-spin' : aiDisabled ? '' : 'group-hover:rotate-90'} duration-300`}
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
