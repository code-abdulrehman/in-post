import React from 'react';

export default function TabButton({ icon: Icon, label, tab, layoutType, activeTab, setActiveTab }) {
  const isActive = activeTab === tab;
  const isHorizontal = layoutType === "hr";

  return (
    <button
      className={`flex flex-col items-center justify-center text-xs 
        ${isActive 
          ? isHorizontal 
            ? "bg-white text-indigo-700 border-b-2 border-indigo-600" 
            : "bg-white text-indigo-700 border-0 rounded"
          : "hover:bg-indigo-50"
        } ${isHorizontal ? "p-1 gap-[1px]" : "py-4 gap-2 w-8"}`}
      onClick={() => setActiveTab(tab)}
    >
      <Icon 
        size={isHorizontal ? 20 : 14} 
        className={`transition-transform ${isHorizontal ? 'rotate-0 mb-0' : 'rotate-90 mb-1'}`} 
      />
      <span className={`${isHorizontal ? 'rotate-0' : 'rotate-90'} transition-transform`}>
        {label}
      </span>
    </button>
  );
} 