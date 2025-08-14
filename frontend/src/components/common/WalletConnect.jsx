import React from 'react';
import { useWallet } from '../../context/WalletContext';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

function WalletConnect() {
  const { isConnected, account, connectWallet, disconnect, isLoading, error } = useWallet();

  if (isLoading) {
    return <LoadingSpinner text="Connecting wallet..." />;
  }

  if (!isConnected) {
    return (
      <div className="text-center">
        <ErrorMessage error={error} />
        <button
          onClick={connectWallet}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Connect MetaMask
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <p className="text-sm text-green-800">
          Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
        </p>
      </div>
      <button
        onClick={disconnect}
        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        Disconnect
      </button>
    </div>
  );
}

export default WalletConnect;