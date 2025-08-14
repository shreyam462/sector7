import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { useApi } from '../../hooks/useApi';
import { storeApi } from '../../services/api';

function WithdrawUSDT({ loading }) {
  const { account } = useWallet();
  const { callApi } = useApi();
  const [storeBalance, setStoreBalance] = useState('0');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    loadStoreBalance();
  }, []);

  const loadStoreBalance = async () => {
    try {
      // This would need a new API endpoint to get store balance
      // For now, we'll show a placeholder
      setStoreBalance('0.00');
    } catch (err) {
      console.error('Failed to load store balance:', err);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setWithdrawing(true);
    try {
      // This would need a new API endpoint for withdrawing
      alert('Withdraw functionality needs to be implemented in backend');
      setWithdrawAmount('');
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Withdraw USDT from Store</h3>
      
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-700">Store Balance:</span>
          <span className="text-lg font-bold text-green-600">
            {storeBalance} USDT
          </span>
        </div>
      </div>
      
      <form onSubmit={handleWithdraw} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Withdraw Amount (USDT)
          </label>
          <input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            step="0.01"
            min="0"
            max={storeBalance}
            placeholder="Enter amount to withdraw"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading || withdrawing}
          />
          <p className="text-xs text-gray-500 mt-1">
            Available: {storeBalance} USDT
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || withdrawing || !withdrawAmount}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded transition-colors"
        >
          {withdrawing ? 'Withdrawing...' : 'Withdraw USDT'}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500">
        <p>• Withdraws USDT from TokenStore contract</p>
        <p>• Only contract owner can withdraw</p>
        <p>• Funds will be sent to connected wallet</p>
      </div>
    </div>
  );
}

export default WithdrawUSDT;