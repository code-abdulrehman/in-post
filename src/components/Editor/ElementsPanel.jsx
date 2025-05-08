// Handle activating drawing mode
const handleActivateDrawingTool = (tool) => {
  // Enable drawing mode in the store
  if (tool.type === 'freePen') {
    setDrawingMode({
      enabled: true,
      tool: 'pen',
      stroke: tool.stroke || '#000000',
      strokeWidth: tool.strokeWidth || 2,
      tension: 0.5
    });
    addToHistory(`Activated ${tool.name} tool`);
  } else if (tool.type === 'brush') {
    setDrawingMode({
      enabled: true,
      tool: 'brush',
      stroke: tool.stroke || '#000000',
      strokeWidth: tool.strokeWidth || 5,
      tension: 0.5
    });
    addToHistory(`Activated ${tool.name} tool`);
  }
}; 