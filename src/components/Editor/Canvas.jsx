import { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Line, Text, Image, Star, RegularPolygon, Transformer, TextPath } from 'react-konva';
import { useStore } from '../../store';
import URLImage from './URLImage';
import Konva from 'konva';
import * as MdIcons from 'react-icons/md';

// Only use MD icons since they're compatible with the canvas
const iconLibrary = MdIcons;

// Helper function to get dash array based on border style
const getDashArray = (borderStyle) => {
  if (!borderStyle) return undefined;
  
  switch (borderStyle) {
    case 'dashed':
      return [10, 5];
    case 'dotted':
      return [2, 3];
    default:
      return undefined;
  }
};

// Helper function to create konva.Image from SVG element
const createKonvaImageFromSVG = (svg, callback) => {
  const svgURL = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  const img = new window.Image();
  img.onload = () => callback(img);
  img.src = svgURL;
};

// Helper function to create SVG from React Icon component
const createSVGFromReactIcon = (IconComponent, fill) => {
  // Create a temporary div to render the React icon
  const tempDiv = document.createElement('div');
  tempDiv.style.display = 'inline-block';
  document.body.appendChild(tempDiv);

  // Render the React icon into an SVG string
  const iconElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  iconElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  iconElement.setAttribute('width', '24');
  iconElement.setAttribute('height', '24');
  iconElement.setAttribute('fill', fill || '#000000');
  iconElement.setAttribute('viewBox', '0 0 24 24');
  
  // Get the path data from the React icon
  const icon = IconComponent({ size: 24 });
  const pathElements = icon.props.children;
  
  // Handle both single and multiple path elements
  if (Array.isArray(pathElements)) {
    pathElements.forEach(path => {
      if (path && path.props) {
        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        for (let attr in path.props) {
          if (attr !== 'children') {
            pathElement.setAttribute(attr, path.props[attr]);
          }
        }
        iconElement.appendChild(pathElement);
      }
    });
  } else if (pathElements && pathElements.props) {
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    for (let attr in pathElements.props) {
      if (attr !== 'children') {
        pathElement.setAttribute(attr, pathElements.props[attr]);
      }
    }
    iconElement.appendChild(pathElement);
  }

  const svgString = new XMLSerializer().serializeToString(iconElement);
  document.body.removeChild(tempDiv);
  
  return svgString;
};

export default function Canvas() {
  const {
    canvasSize,
    canvasBackground,
    elements,
    selectedElementId,
    selectElement,
    clearSelection,
    updateElement,
    addToHistory,
    showGrid,
    canvasScale,
    setCursorPosition
  } = useStore();
  
  const stageRef = useRef(null);
  const layerRef = useRef(null);
  const transformerRef = useRef(null);
  
  // Handle click on empty canvas to clear selection
  const handleCanvasClick = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      clearSelection();
    }
  };
  
  // Handle element selection
  const handleElementSelect = (e, id) => {
    e.cancelBubble = true;
    
    // Check if the element is locked
    const element = elements.find(el => el.id === id);
    if (element && element.locked) {
      // Still select the element for viewing properties, but don't allow transforming
      selectElement(id);
      // Don't add the transformer for locked elements
      return;
    }
    
    selectElement(id);
  };
  
  // Update cursor position on mouse move
  const handleMouseMove = (e) => {
    const stage = stageRef.current;
    if (stage) {
      const pointer = stage.getPointerPosition();
      if (pointer) {
        // Convert pointer position to stage coordinates
        const scale = canvasScale;
        const stagePos = {
          x: pointer.x / scale,
          y: pointer.y / scale
        };
        setCursorPosition(stagePos.x, stagePos.y);
      }
    }
  };
  
  // Update transformer on selection change
  useEffect(() => {
    if (!transformerRef.current) return;
    
    const selectedNodes = [];
    if (selectedElementId) {
      const node = layerRef.current.findOne(`#${selectedElementId}`);
      const element = elements.find(el => el.id === selectedElementId);
      
      // Only add to transformer if not locked
      if (node && element && !element.locked) {
        selectedNodes.push(node);
      }
    }
    
    transformerRef.current.nodes(selectedNodes);
    transformerRef.current.getLayer()?.batchDraw();
  }, [selectedElementId, elements]);
  
  // Element transformation handling
  const handleTransformEnd = (e) => {
    const node = e.target;
    const id = node.id();
    
    // Check if element is locked before transforming
    const element = elements.find(el => el.id === id);
    if (element && element.locked) return;
    
    // Get the updated attributes
    const updates = {};
    
    // For all elements
    updates.x = node.x();
    updates.y = node.y();
    updates.rotation = node.rotation();
    
    // For specific element types
    switch (node.getClassName()) {
      case 'Rect':
        updates.width = node.width() * node.scaleX();
        updates.height = node.height() * node.scaleY();
        // Reset scale
        node.scaleX(1);
        node.scaleY(1);
        break;
      
      case 'Circle':
        // For circles, use the larger scale for the radius
        const scale = Math.max(node.scaleX(), node.scaleY());
        updates.radius = node.radius() * scale;
        // Reset scale
        node.scaleX(1);
        node.scaleY(1);
        break;
      
      case 'Text':
        updates.width = node.width() * node.scaleX();
        updates.fontSize = node.fontSize() * node.scaleY();
        // Reset scale
        node.scaleX(1);
        node.scaleY(1);
        break;
      
      case 'Image':
        updates.width = node.width() * node.scaleX();
        updates.height = node.height() * node.scaleY();
        // Reset scale
        node.scaleX(1);
        node.scaleY(1);
        break;
        
      // Handle other shapes similarly
    }
    
    // Update the element in the store
    updateElement(id, updates);
    addToHistory('Transform element');
  };
  
  // Expose the Konva stage to the window for export
  useEffect(() => {
    if (stageRef.current) {
      window.konvaStage = stageRef.current;
    }
    
    return () => {
      delete window.konvaStage;
    };
  }, [stageRef.current]);
  
  // Render each element based on its type
  const renderElement = (element) => {
    if (element.visible === false) return null;
    
    const commonProps = {
      id: element.id,
      x: element.x,
      y: element.y,
      draggable: !element.locked, // Only draggable if not locked
      rotation: element.rotation || 0,
      opacity: element.opacity !== undefined ? element.opacity : 1,
      onClick: (e) => handleElementSelect(e, element.id),
      onTap: (e) => handleElementSelect(e, element.id),
      onDragEnd: () => {
        // Shouldn't happen for locked elements, but check anyway
        if (element.locked) return;
        
        const node = layerRef.current.findOne(`#${element.id}`);
        if (node) {
          updateElement(element.id, {
            x: node.x(),
            y: node.y()
          });
          addToHistory('Move element');
        }
      },
      onTransformEnd: handleTransformEnd,
      // Style to indicate locked state
      stroke: element.locked ? '#FCD34D' : undefined, // yellow outline for locked elements
      strokeWidth: element.locked ? 1 : undefined,
      strokeScaleEnabled: false, // keep stroke width constant during scaling
    };
    
    switch (element.type) {
      case 'rectangle':
        return (
          <Rect
            key={element.id}
            {...commonProps}
            width={element.width}
            height={element.height}
            fill={element.fill}
            cornerRadius={element.border?.enabled ? element.border.radius || 0 : 0}
            stroke={element.border?.enabled ? element.border.color : undefined}
            strokeWidth={element.border?.enabled ? element.border.width || 2 : 0}
            strokeScaleEnabled={false}
            dashEnabled={element.border?.enabled && element.border.style !== 'solid'}
            dash={element.border?.enabled ? getDashArray(element.border.style) : undefined}
            shadowEnabled={element.shadow?.enabled}
            shadowColor={element.shadow?.color}
            shadowBlur={element.shadow?.blur}
            shadowOffsetX={element.shadow?.offsetX}
            shadowOffsetY={element.shadow?.offsetY}
            shadowOpacity={1}
          />
        );
        
      case 'circle':
        return (
          <Circle
            key={element.id}
            {...commonProps}
            radius={element.radius}
            fill={element.fill}
            stroke={element.border?.enabled ? element.border.color : undefined}
            strokeWidth={element.border?.enabled ? element.border.width || 2 : 0}
            strokeScaleEnabled={false}
            dashEnabled={element.border?.enabled && element.border.style !== 'solid'}
            dash={element.border?.enabled ? getDashArray(element.border.style) : undefined}
            shadowEnabled={element.shadow?.enabled}
            shadowColor={element.shadow?.color}
            shadowBlur={element.shadow?.blur}
            shadowOffsetX={element.shadow?.offsetX}
            shadowOffsetY={element.shadow?.offsetY}
            shadowOpacity={1}
          />
        );
        
      case 'line':
        return (
          <Line
            key={element.id}
            {...commonProps}
            points={element.points}
            stroke={element.stroke}
            strokeWidth={element.strokeWidth}
            lineCap="round"
            lineJoin="round"
            shadowEnabled={element.shadow?.enabled}
            shadowColor={element.shadow?.color}
            shadowBlur={element.shadow?.blur}
            shadowOffsetX={element.shadow?.offsetX}
            shadowOffsetY={element.shadow?.offsetY}
            shadowOpacity={1}
          />
        );
        
      case 'star':
        return (
          <Star
            key={element.id}
            {...commonProps}
            numPoints={element.numPoints || 5}
            innerRadius={element.innerRadius || 20}
            outerRadius={element.outerRadius || 40}
            fill={element.fill}
            stroke={element.border?.enabled ? element.border.color : undefined}
            strokeWidth={element.border?.enabled ? element.border.width : undefined}
            strokeScaleEnabled={false}
            dashEnabled={element.border?.enabled && element.border.style !== 'solid'}
            dash={element.border?.enabled ? getDashArray(element.border.style) : undefined}
            shadowEnabled={element.shadow?.enabled}
            shadowColor={element.shadow?.color}
            shadowBlur={element.shadow?.blur}
            shadowOffsetX={element.shadow?.offsetX}
            shadowOffsetY={element.shadow?.offsetY}
            shadowOpacity={1}
          />
        );
        
      case 'triangle':
        return (
          <RegularPolygon
            key={element.id}
            {...commonProps}
            sides={3}
            radius={element.radius || 50}
            fill={element.fill}
            stroke={element.border?.enabled ? element.border.color : undefined}
            strokeWidth={element.border?.enabled ? element.border.width || 2 : 0}
            strokeScaleEnabled={false}
            dashEnabled={element.border?.enabled && element.border.style !== 'solid'}
            dash={element.border?.enabled ? getDashArray(element.border.style) : undefined}
            shadowEnabled={element.shadow?.enabled}
            shadowColor={element.shadow?.color}
            shadowBlur={element.shadow?.blur}
            shadowOffsetX={element.shadow?.offsetX}
            shadowOffsetY={element.shadow?.offsetY}
            shadowOpacity={1}
            cornerRadius={element.cornerRadius || 0}
          />
        );
        
      case 'polygon':
        return (
          <RegularPolygon
            key={element.id}
            {...commonProps}
            sides={element.sides || 6}
            radius={element.radius || 50}
            fill={element.fill}
            stroke={element.border?.enabled ? element.border.color : undefined}
            strokeWidth={element.border?.enabled ? element.border.width || 2 : 0}
            strokeScaleEnabled={false}
            dashEnabled={element.border?.enabled && element.border.style !== 'solid'}
            dash={element.border?.enabled ? getDashArray(element.border.style) : undefined}
            shadowEnabled={element.shadow?.enabled}
            shadowColor={element.shadow?.color}
            shadowBlur={element.shadow?.blur}
            shadowOffsetX={element.shadow?.offsetX}
            shadowOffsetY={element.shadow?.offsetY}
            shadowOpacity={1}
            cornerRadius={element.cornerRadius || 0}
          />
        );
        
      case 'text':
        return (
          <Text
            key={element.id}
            {...commonProps}
            text={element.text}
            fontSize={element.fontSize}
            fontFamily={element.fontFamily}
            fill={element.fill}
            width={element.width}
            align={element.align || 'center'}
            wrap="word"
            fontStyle={element.fontStyle}
            fontWeight={element.fontWeight}
            textDecoration={element.textDecoration}
            lineHeight={element.lineHeight || 1.2}
            letterSpacing={element.letterSpacing || 0}
            cornerRadius={element.border?.enabled ? element.border.radius || 0 : 0}
            stroke={element.border?.enabled ? element.border.color : undefined}
            strokeWidth={element.border?.enabled ? element.border.width : undefined}
            strokeScaleEnabled={false}
            dashEnabled={element.border?.enabled && element.border.style !== 'solid'}
            dash={element.border?.enabled ? getDashArray(element.border.style) : undefined}
            shadowEnabled={element.shadow?.enabled}
            shadowColor={element.shadow?.color}
            shadowBlur={element.shadow?.blur}
            shadowOffsetX={element.shadow?.offsetX}
            shadowOffsetY={element.shadow?.offsetY}
            shadowOpacity={1}
          />
        );
        
      case 'image':
        // Generate CSS filter string for image
        const filterString = element.filters ? 
          `brightness(${element.filters.brightness || 100}%) ` +
          `contrast(${element.filters.contrast || 100}%) ` +
          `saturate(${element.filters.saturation || 100}%) ` +
          `blur(${element.filters.blur || 0}px) ` +
          `grayscale(${element.filters.grayscale || 0}%)` 
          : '';
          
        return (
          <URLImage
            key={element.id}
            {...commonProps}
            src={element.src}
            width={element.width}
            height={element.height}
            cornerRadius={element.border?.enabled ? element.border.radius || 0 : 0}
            stroke={element.border?.enabled ? element.border.color : undefined}
            strokeWidth={element.border?.enabled ? element.border.width : undefined}
            strokeScaleEnabled={false}
            dashEnabled={element.border?.enabled && element.border.style !== 'solid'}
            dash={element.border?.enabled ? getDashArray(element.border.style) : undefined}
            shadowEnabled={element.shadow?.enabled}
            shadowColor={element.shadow?.color}
            shadowBlur={element.shadow?.blur}
            shadowOffsetX={element.shadow?.offsetX}
            shadowOffsetY={element.shadow?.offsetY}
            shadowOpacity={1}
            cssFilter={filterString}
          />
        );
        
      case 'textPath':
        return (
          <TextPath
            key={element.id}
            {...commonProps}
            text={element.text}
            fontSize={element.fontSize}
            fontFamily={element.fontFamily}
            fill={element.fill}
            data={element.pathData}
            fontStyle={element.fontStyle}
            fontWeight={element.fontWeight}
            textDecoration={element.textDecoration}
            letterSpacing={element.letterSpacing || 0}
            strokeEnabled={element.border?.enabled}
            stroke={element.border?.enabled ? element.border.color : undefined}
            strokeWidth={element.border?.enabled ? element.border.width : undefined}
            dashEnabled={element.border?.enabled && element.border.style !== 'solid'}
            dash={element.border?.enabled ? getDashArray(element.border.style) : undefined}
            shadowEnabled={element.shadow?.enabled}
            shadowColor={element.shadow?.color}
            shadowBlur={element.shadow?.blur}
            shadowOffsetX={element.shadow?.offsetX}
            shadowOffsetY={element.shadow?.offsetY}
            shadowOpacity={1}
          />
        );
        
      case 'customIcon':
        // Render an icon from react-icons
        const IconComponent = iconLibrary[element.iconName];
        
        if (!IconComponent) {
          console.error(`Icon ${element.iconName} not found`);
          return null;
        }
        
        return (
          <URLImage
            key={element.id}
            {...commonProps}
            width={element.width}
            height={element.height}
            src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(
              createSVGFromReactIcon(IconComponent, element.fill)
            )}`}
            cornerRadius={element.border?.enabled ? element.border.radius || 0 : 0}
            stroke={element.border?.enabled ? element.border.color : undefined}
            strokeWidth={element.border?.enabled ? element.border.width : undefined}
            strokeScaleEnabled={false}
            dashEnabled={element.border?.enabled && element.border.style !== 'solid'}
            dash={element.border?.enabled ? getDashArray(element.border.style) : undefined}
            shadowEnabled={element.shadow?.enabled}
            shadowColor={element.shadow?.color}
            shadowBlur={element.shadow?.blur}
            shadowOffsetX={element.shadow?.offsetX}
            shadowOffsetY={element.shadow?.offsetY}
            shadowOpacity={1}
          />
        );
        
      default:
        return null;
    }
  };
  
  // Get background style based on the type
  const getBackgroundStyle = () => {
    if (typeof canvasBackground === 'object') {
      // Handle pattern backgrounds
      if (canvasBackground.type === 'pattern') {
        return {
          backgroundImage: canvasBackground.value,
          backgroundSize: canvasBackground.size || '20px 20px',
          backgroundRepeat: 'repeat',
          backgroundColor: canvasBackground.backgroundColor || '#ffffff',
          position: 'relative' // Ensure relative positioning for absolute positioned children
        };
      }
    }
    
    // Default solid color background
    return { 
      backgroundColor: typeof canvasBackground === 'string' ? canvasBackground : '#ffffff',
      position: 'relative' // Ensure relative positioning for absolute positioned children
    };
  };
  
  // Ensure pattern background is properly set in Konva
  useEffect(() => {
    if (!layerRef.current) return;
    
    // Remove any existing background rect
    const existingBg = layerRef.current.findOne('#background-rect');
    if (existingBg) {
      existingBg.destroy();
    }
    
    // Create the background rect with appropriate fill
    let bgFill;
    
    if (typeof canvasBackground === 'object') {
      if (canvasBackground.type === 'pattern' && canvasBackground.backgroundColor) {
        bgFill = canvasBackground.backgroundColor;
      } else {
        bgFill = '#ffffff';
      }
    } else if (typeof canvasBackground === 'string') {
      bgFill = canvasBackground;
    } else {
      bgFill = '#ffffff';
    }
    
    // Always add a background rect for all background types
    const bgRect = new Konva.Rect({
      id: 'background-rect',
      x: 0,
      y: 0,
      width: canvasSize.width,
      height: canvasSize.height,
      fill: bgFill
    });
    
    layerRef.current.add(bgRect);
    bgRect.moveToBottom();
    layerRef.current.draw();
    
  }, [canvasBackground, canvasSize.width, canvasSize.height]);
  
  // Create pattern overlay element independent of Konva for better display
  const renderBackgroundOverlay = () => {
    if (typeof canvasBackground === 'object') {
      if (canvasBackground.type === 'pattern') {
        return (
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{
              backgroundImage: canvasBackground.value,
              backgroundSize: canvasBackground.size || '20px 20px',
              backgroundRepeat: 'repeat',
              zIndex: 1 // Very low z-index for background elements
            }}
          />
        );
      }
    }
    return null;
  };
  
  // Calculate container dimensions to center the canvas
  const containerWidth = '100%';
  const containerHeight = '100%';
  
  return (
    <div 
      className="flex-1 flex justify-center items-center overflow-auto p-4 canvas-container"
      style={{ 
        transform: `scale(${canvasScale})`,
        transformOrigin: 'center center',
        transition: 'transform 0.2s ease-out',
      }}
    >
      <div 
        className="relative"
        style={{
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          ...getBackgroundStyle()
        }}
      >
        {/* Background overlay as a DOM element for better display */}
        {renderBackgroundOverlay()}
        
        {/* Konva Stage */}
        <Stage
          ref={stageRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onClick={handleCanvasClick}
          onTap={handleCanvasClick}
          onMouseMove={handleMouseMove}
        >
          <Layer ref={layerRef}>
            {elements.map(renderElement)}
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                // Minimum size
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox;
                }
                return newBox;
              }}
              rotateAnchorOffset={30}
              enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
              anchorSize={8}
              anchorCornerRadius={4}
              borderStroke="#3B82F6"
              borderDash={[4, 4]}
            />
          </Layer>
        </Stage>
        
        {/* Grid overlay if enabled - with highest z-index */}
        {showGrid && (
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              zIndex: 1000 // Highest z-index for grid
            }}
          />
        )}
      </div>
    </div>
  );
} 