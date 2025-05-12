import { FiLayers } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-6 md:px-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <FiLayers className="text-purple-400 text-2xl mr-2" />
              <h3 className="text-xl font-bold text-purple-400">PPost</h3>
            </div>
            <p className="text-gray-400">
              The ultimate design tool for creating stunning visuals right in your browser. No design experience needed.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Features</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-purple-400 transition">Templates</a></li>
              <li><a href="#" className="hover:text-purple-400 transition">Elements</a></li>
              <li><a href="#" className="hover:text-purple-400 transition">Photos</a></li>
              <li><a href="#" className="hover:text-purple-400 transition">Text Styles</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-purple-400 transition">Blog</a></li>
              <li><a href="#" className="hover:text-purple-400 transition">Tutorials</a></li>
              <li><a href="#" className="hover:text-purple-400 transition">Help Center</a></li>
              <li><a href="#" className="hover:text-purple-400 transition">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-purple-400 transition">About Us</a></li>
              <li><a href="#" className="hover:text-purple-400 transition">Careers</a></li>
              <li><a href="#" className="hover:text-purple-400 transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-purple-400 transition">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} PPost. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 