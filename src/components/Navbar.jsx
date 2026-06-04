import React, { useState } from 'react';
import { Plane, Menu, X } from 'lucide-react';

function Navbar({ currentPage, onNavigate, onLogout, user }) {
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

const handleNavigation = (page) => {
  if (currentPage === page) {
    window.location.reload();
    return;
  }

  onNavigate(page);
};

  return (
    <nav className="bg-blue-600 text-white shadow-lg ">
      <div className="container mx-auto p-4 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => handleNavigation('home')}
        >
          <Plane className="w-8 h-8 mr-2" />
          <span className="text-2xl font-bold">OSky</span>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-4">
          {!user?.user_id && (
            <>
              <button onClick={() => handleNavigation('purchase')} className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-800 transition-all duration-300 ease-in-out">Ticket</button>
              <button onClick={() => handleNavigation('redeem')} className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-800 transition-all duration-300 ease-in-out">Reward</button>
            </>
          )}
          {user?.user_id ? (
            <>
              <button onClick={() => handleNavigation('home')} className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-800 transition-all duration-300 ease-in-out">Home</button>
              <button onClick={() => handleNavigation('purchase')} className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-800 transition-all duration-300 ease-in-out">Ticket</button>
              <button onClick={() => handleNavigation('redeem')} className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-800 transition-all duration-300 ease-in-out">Reward</button>
              <button onClick={() => handleNavigation('transactions')} className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-800 transition-all duration-300 ease-in-out">Transactions</button>
              <button onClick={onLogout} className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-800 transition-all duration-300 ease-in-out">Logout</button>
            </>
          ) : (
            <button
              onClick={() => handleNavigation('home')}
              className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-800 transition-all duration-300 ease-in-out"
            >
              Login
            </button>
          )}
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
          {!user?.user_id && (
            <>
              <NavButton onClick={() => handleNavigation('purchase')}>Ticket</NavButton>
              <NavButton onClick={() => handleNavigation('redeem')}>Reward</NavButton>
            </>
          )}
          {user?.user_id ? (
            <>
              <NavButton onClick={() => handleNavigation('home')}>Home</NavButton>
              <NavButton onClick={() => handleNavigation('purchase')}>Ticket</NavButton>
              <NavButton onClick={() => handleNavigation('redeem')}>Reward</NavButton>
              <NavButton onClick={() => handleNavigation('transactions')}>Transactions</NavButton>
              <NavButton onClick={onLogout} className="bg-red-500 hover:bg-red-600">Logout</NavButton>
            </>
          ) : (
            <NavButton
              onClick={() => handleNavigation('home')}
              className="bg-green-500 hover:bg-green-600"
            >
              Login
            </NavButton>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;