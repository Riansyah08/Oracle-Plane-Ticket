import React from 'react';
import { Plane } from 'lucide-react';

function Navbar({ onNavigate, onLogout }) {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg flex-shrink-0">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Plane className="w-8 h-8 mr-2" />
          <span className="text-2xl font-bold cursor-pointer" 
            onClick={() => onNavigate('home')} >OracleSky Portal</span>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => onNavigate('home')} 
            className="hover:bg-blue-700 px-4 py-2 rounded"
          >
            Home
          </button>
          <button 
            onClick={onLogout} 
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
