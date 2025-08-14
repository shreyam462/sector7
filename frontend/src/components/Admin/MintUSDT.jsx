import React, { useState } from 'react';

function MintUSDT({ onMintUSDT, loading }) {
  const [formData, setFormData] = useState({
    to: '',
    amount: ''
  });
  const [minting, setMinting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.to || !formData.amount) {
      alert('Please fill in all fields');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      alert('Amount must be greater than 0');
      return;
    }

    setMinting(true);
    try {
      const success = await onMintUSDT(formData.to, formData.amount);
      
      if (success) {
        setFormData({
          to: '',
          amount: ''
        });
      }
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Mint USDT Tokens</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            name="to"
            value={formData.to}
            onChange={handleInputChange}
            placeholder="0x..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading || minting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (USDT)
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            placeholder="Enter amount"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading || minting}
          />
        </div>

        <button
          type="submit"
          disabled={loading || minting}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded transition-colors"
        >
          {minting ? 'Minting...' : 'Mint USDT'}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500">
        <p>• Mints test USDT tokens for development/testing</p>
        <p>• Only works with MockUSDT contract</p>
        <p>• Requires owner permissions</p>
      </div>
    </div>
  );
}

export default MintUSDT;