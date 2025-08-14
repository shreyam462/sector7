import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { useApi } from '../../hooks/useApi';
import { tokenApi, storeApi } from '../../services/api';
import ContractService from '../../services/contractService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import MintUSDT from './MintUSDT';
import WithdrawUSDT from './WithdrawUSDT';

function AdminPanel() {
  const { isConnected, account, signer } = useWallet();
  const { loading, error, callApi, clearError } = useApi();
  const [contractService, setContractService] = useState(null);

  useEffect(() => {
    if (signer) {
      setContractService(new ContractService(signer));
    }
  }, [signer]);

  const handleMintUSDT = async (to, amount) => {
    try {
      await callApi(() => tokenApi.mintUSDT(to, amount));
      return true;
    } catch (err) {
      console.error('Failed to mint USDT:', err);
      return false;
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Admin Panel</h2>
        <p className="text-gray-600">Please connect your wallet to access admin features.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Admin Panel</h2>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
        <div className="flex items-center">
          <svg className="h-5 w-5 text-yellow-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-yellow-800">
            <strong>Warning:</strong> These are admin/testing functions. Use with caution on mainnet.
          </p>
        </div>
      </div>
      
      <ErrorMessage error={error} onDismiss={clearError} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <MintUSDT onMintUSDT={handleMintUSDT} loading={loading} />
        <WithdrawUSDT loading={loading} />
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Contract Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Your Account:</span>
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
              {account}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Connected:</span>
            <span className="text-green-600">✓ MetaMask Connected</span>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Available Admin Functions</h3>
        <ul className="space-y-2 text-blue-700 text-sm">
          <li>• Mint test USDT tokens to any address</li>
          <li>• Withdraw USDT from TokenStore (owner only)</li>
          <li>• Create matches in the Play Game section</li>
          <li>• Settle matches as operator</li>
          <li>• All functions use the connected wallet for authorization</li>
        </ul>
      </div>
    </div>
  );
}

export default AdminPanel;