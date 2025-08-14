import React from 'react';
import { NavLink } from 'react-router-dom';

function Navigation() {
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/buy-tokens', label: 'Buy Tokens' },
    { to: '/play-game', label: 'Play Game' },
    { to: '/admin', label: 'Admin Panel' }
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800">Game dApp</h1>
          </div>
          <div className="flex space-x-8">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;