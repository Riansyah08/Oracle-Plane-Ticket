import React, { useState } from 'react';
import { Plane, Menu, X } from 'lucide-react';

function Navbar({ onNavigate, onLogout }) {
  const [open, setOpen] = useState(false);

  const NavButton = ({ children, onClick, className = "" }) => (
    <button
      onClick={() => {
        onClick();
        setOpen(false); // close mobile menu after click
      }}
      className={`w-full text-left hover:bg-blue-700 px-4 py-2 rounded ${className}`}
    >
      {children}
    </button>
  );

  return (
    <nav className="bg-blue-600 text-white shadow-lg ">
      <div className="container mx-auto p-4 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => onNavigate('home')}
        >
          <Plane className="w-8 h-8 mr-2" />
          <span className="text-2xl font-bold">OracleSky Portal</span>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-4">
          <button onClick={() => onNavigate('home')} className="hover:bg-blue-700 px-4 py-2 rounded">Home</button>
          <button onClick={() => onNavigate('purchase')} className="hover:bg-blue-700 px-4 py-2 rounded">Buy Ticket</button>
          <button onClick={() => onNavigate('redeem')} className="hover:bg-blue-700 px-4 py-2 rounded">Redeem</button>
          <button onClick={() => onNavigate('transactions')} className="hover:bg-blue-700 px-4 py-2 rounded">Transactions</button>
          <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">Logout</button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-blue-600 px-4 pb-4 space-y-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:bg-blue-600">
          <NavButton onClick={() => onNavigate('home')}>Home</NavButton>
          <NavButton onClick={() => onNavigate('purchase')}>Buy Ticket</NavButton>
          <NavButton onClick={() => onNavigate('redeem')}>Redeem</NavButton>
          <NavButton onClick={() => onNavigate('transactions')}>Transactions</NavButton>
          <NavButton onClick={onLogout} className="bg-red-500 hover:bg-red-600">Logout</NavButton>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
