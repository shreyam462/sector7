import React, { useState } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

function BalanceCard({ balances, onMintUSDT, loading }) {
  const [mintAmount, setMintAmount] = useState('');
  const [minting, setMinting] = useState(false);

  const handleMint = async (e) => {
    e.preventDefault();
    if (!mintAmount || parseFloat(mintAmount) <= 0) return;

    setMinting(true);
    try {
      await onMintUSDT(mintAmount);
      setMintAmount('');
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Balances</h3>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="font-medium text-gray-700">USDT Balance:</span>
          <span className="text-lg font-bold text-blue-600">
            {parseFloat(balances.usdt).toFixed(2)} USDT
          </span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="font-medium text-gray-700">GT Balance:</span>
          <span className="text-lg font-bold text-green-600">
            {parseFloat(balances.gameToken).toFixed(2)} GT
          </span>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="text-lg font-medium text-gray-900 mb-3">Mint Test USDT</h4>
        <form onSubmit={handleMint} className="space-y-3">
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Amount to mint"
            value={mintAmount}
            onChange={(e) => setMintAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading || minting}
          />
          <button
            type="submit"
            disabled={loading || minting || !mintAmount}
            className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            {minting ? 'Minting...' : 'Mint USDT'}
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2">
          * For testing purposes only
        </p>
      </div>
    </div>
  );
}

export default BalanceCard;