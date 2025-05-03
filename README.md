# InPost Designer

InPost Designer is a modern, browser-based graphic design application built with React, allowing users to create stunning social media posts, marketing materials, and digital designs without leaving their browser.

## Features

- **Intuitive Editor Interface**: A user-friendly canvas with drag-and-drop functionality
- **Shape Tools**: Add rectangles, circles, triangles, lines, stars, and polygons
- **Text Editing**: Add and customize text with different fonts, sizes, and styles
- **Image Support**: Upload and incorporate images into your designs
- **Layer Management**: Control the stacking order of elements with an easy-to-use layers panel
- **Background Options**: Solid colors and patterns for your canvas background
- **Grid Toggle**: Enable grid for precise alignment
- **History Management**: Undo/redo functionality
- **Responsive Properties Panel**: Edit element properties like position, size, color, and opacity
- **Keyboard Shortcuts**: Boost productivity with common keyboard shortcuts
- **Canvas Size Presets**: Common social media sizes and custom dimensions
- **Local Storage**: Designs are saved to your browser's local storage
- **Export Options**: Download your designs in various formats

## Tech Stack

- React 19
- Zustand for state management
- React Konva for canvas manipulation
- Tailwind CSS for styling
- React Icons for UI elements
- React Toastify for notifications

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```
   or
   ```
   pnpm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```
   or
   ```
   pnpm dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Usage

1. From the landing page, click "Create Design"
2. Use the left sidebar to add elements, change canvas size, or modify background
3. Select elements on the canvas to edit them using the right sidebar
4. Use the layers tab in the right sidebar to manage element stacking
5. Click Export to save your design

## Keyboard Shortcuts

- **Ctrl+Z**: Undo
- **Ctrl+Y** or **Ctrl+Shift+Z**: Redo
- **Ctrl+D**: Duplicate selected element
- **Delete**: Remove selected element
- **Escape**: Clear selection

## License

MIT
