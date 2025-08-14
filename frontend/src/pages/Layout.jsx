import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '../components/common/Navigation';
import WalletConnect from '../components/common/WalletConnect';

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-end">
            <WalletConnect />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 Game dApp. Built with React & Ethers.js</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;