import { FiPlusCircle } from 'react-icons/fi';

export default function Navbar({ isScrolled, handleCreateDesign }) {
  return (
    <nav className={`fixed z-50 container mx-auto transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/50 backdrop-blur-sm py-3 top-3 left-0 right-0 rounded-xl' 
        : 'bg-transparent py-5 top-0 left-0 right-0 rounded-none'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-orange-600">PPost
              <span className="sm:inline hidden"> Designer</span> 
              </h1>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="font-medium text-stone-700 hover:text-orange-600 transition duration-300">Features</a>
            <a href="#export" className="font-medium text-stone-700 hover:text-orange-600 transition duration-300">Export</a>
            <a href="#canvas-sizes" className="font-medium text-stone-700 hover:text-orange-600 transition duration-300">Sizes</a>
            <a href="#faq" className="font-medium text-stone-700 hover:text-orange-600 transition duration-300">FAQ</a>
          </div>

          <div className="flex items-center">
            <button
              onClick={handleCreateDesign}
              className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center shadow-sm"
            >
              <FiPlusCircle className="mr-1" /> New Design
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 