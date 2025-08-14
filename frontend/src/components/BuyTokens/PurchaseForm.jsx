import React, { useState } from 'react';

function PurchaseForm({ onPurchase, loading, usdtBalance }) {
  const [amount, setAmount] = useState('');
  const [purchasing, setPurchasing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    
    if (parseFloat(amount) > parseFloat(usdtBalance)) {
      alert('Insufficient USDT balance');
      return;
    }

    setPurchasing(true);
    try {
      await onPurchase(amount);
      setAmount('');
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Purchase GT Tokens</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            USDT Amount
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Enter USDT amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading || purchasing}
          />
          <p className="text-xs text-gray-500 mt-1">
            Available: {parseFloat(usdtBalance).toFixed(2)} USDT
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex justify-between text-sm">
            <span>You will receive:</span>
            <span className="font-bold">
              {amount ? parseFloat(amount).toFixed(2) : '0'} GT
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Exchange rate:</span>
            <span>1 USDT = 1 GT</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || purchasing || !amount || parseFloat(amount) <= 0}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded transition-colors"
        >
          {purchasing ? 'Purchasing...' : 'Buy GT Tokens'}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500">
        <p>• This will approve USDT spending and mint GT tokens</p>
        <p>• Transaction requires two steps: approval + purchase</p>
      </div>
    </div>
  );
}

export default PurchaseForm;