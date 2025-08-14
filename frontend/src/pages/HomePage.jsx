import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';

function HomePage() {
  const { isConnected } = useWallet();

  return (
    <div className="text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to Game dApp
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          A decentralized gaming platform where players can stake tokens and compete in 1v1 matches.
        </p>

        {isConnected ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Link
              to="/buy-tokens"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-8 rounded-lg transition-colors shadow-lg"
            >
              <div className="text-2xl mb-2">💰</div>
              <h3 className="text-lg font-semibold mb-2">Buy Tokens</h3>
              <p className="text-sm opacity-90">Purchase GT tokens with USDT</p>
            </Link>

            <Link
              to="/play-game"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-8 rounded-lg transition-colors shadow-lg"
            >
              <div className="text-2xl mb-2">🎮</div>
              <h3 className="text-lg font-semibold mb-2">Play Game</h3>
              <p className="text-sm opacity-90">Join matches and stake tokens</p>
            </Link>

            <Link
              to="/admin"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-6 px-8 rounded-lg transition-colors shadow-lg"
            >
              <div className="text-2xl mb-2">⚙️</div>
              <h3 className="text-lg font-semibold mb-2">Admin Panel</h3>
              <p className="text-sm opacity-90">Manage contracts and testing</p>
            </Link>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Connect Your Wallet
            </h3>
            <p className="text-yellow-700">
              Please connect your MetaMask wallet to start using the dApp.
            </p>
          </div>
        )}

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">How It Works</h3>
            <ol className="space-y-3 text-gray-600">
              <li>1. Buy GT tokens using USDT</li>
              <li>2. Join a match created by an operator</li>
              <li>3. Stake your GT tokens</li>
              <li>4. Play the game off-chain</li>
              <li>5. Winner takes all staked tokens</li>
            </ol>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Features</h3>
            <ul className="space-y-3 text-gray-600">
              <li>• Secure smart contract interactions</li>
              <li>• Transparent match settlement</li>
              <li>• Automatic token transfers</li>
              <li>• Real-time match status</li>
              <li>• Admin controls for testing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;