import React, { useState } from 'react';

function CreateMatch({ onCreateMatch, loading }) {
  const [formData, setFormData] = useState({
    player1: '',
    player2: '',
    stakeAmount: ''
  });
  const [creating, setCreating] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.player1 || !formData.player2 || !formData.stakeAmount) {
      alert('Please fill in all fields');
      return;
    }

    if (formData.player1 === formData.player2) {
      alert('Players must be different');
      return;
    }

    setCreating(true);
    try {
      const success = await onCreateMatch(
        formData.player1,
        formData.player2,
        formData.stakeAmount
      );
      
      if (success) {
        setFormData({
          player1: '',
          player2: '',
          stakeAmount: ''
        });
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Create New Match</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Player 1 Address
          </label>
          <input
            type="text"
            name="player1"
            value={formData.player1}
            onChange={handleInputChange}
            placeholder="0x..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading || creating}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Player 2 Address
          </label>
          <input
            type="text"
            name="player2"
            value={formData.player2}
            onChange={handleInputChange}
            placeholder="0x..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading || creating}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stake Amount (GT)
          </label>
          <input
            type="number"
            name="stakeAmount"
            value={formData.stakeAmount}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            placeholder="Enter stake amount"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading || creating}
          />
        </div>

        <button
          type="submit"
          disabled={loading || creating}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded transition-colors"
        >
          {creating ? 'Creating Match...' : 'Create Match'}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500">
        <p>• Only operators/admins can create matches</p>
        <p>• Both players will need to stake the specified amount</p>
      </div>
    </div>
  );
}

export default CreateMatch;