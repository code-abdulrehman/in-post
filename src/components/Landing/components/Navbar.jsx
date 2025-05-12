import { FiMenu, FiPlusCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ isScrolled, handleCreateDesign }) {
  const navigate = useNavigate();
  
  return (
    <nav className={`fixed z-50 w-full md:container mx-auto transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/50 backdrop-blur-sm py-3 top-3 left-0 right-0 rounded-xl' 
        : 'bg-transparent py-5 top-0 left-0 right-0 rounded-none'
    }`}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-indigo-600">PPost Designer</h1>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="font-medium hover:text-indigo-600 transition duration-300">Features</a>
            <a href="#templates" className="font-medium hover:text-indigo-600 transition duration-300">Templates</a>
            <a href="#export" className="font-medium hover:text-indigo-600 transition duration-300">Export</a>
            <a href="#pricing" className="font-medium hover:text-indigo-600 transition duration-300">Pricing</a>
          </div>

          <div className="flex items-center">
            <button
              onClick={handleCreateDesign}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center"
            >
              <FiPlusCircle className="mr-1" /> New Design
            </button>
            <button className="md:hidden ml-4 text-2xl">
              <FiMenu />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 