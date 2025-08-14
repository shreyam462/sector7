import React, { useState, useEffect } from "react";
import { useWallet } from "../../context/WalletContext";
import { useApi } from "../../hooks/useApi";
import { storeApi, tokenApi } from "../../services/api";
import ContractService, {
  CONTRACT_ADDRESSES,
} from "../../services/contractService";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";
import BalanceCard from "./BalancedCard";
import PurchaseForm from "./PurchaseForm";

function BuyTokensPage() {
  const { isConnected, account, signer } = useWallet();
  const { loading, error, callApi, clearError } = useApi();
  const [balances, setBalances] = useState({ gameToken: "0", usdt: "0" });
  const [contractService, setContractService] = useState(null);

  useEffect(() => {
    if (signer) {
      setContractService(new ContractService(signer));
    }
  }, [signer]);

  useEffect(() => {
    if (isConnected && account) {
      loadBalances();
    }
  }, [isConnected, account]);

  const loadBalances = async () => {
    try {
      const response = await callApi(() => storeApi.getBalance(account));
      setBalances(response.data.data);
    } catch (err) {
      console.error("Failed to load balances:", err);
    }
  };

  const handleMintUSDT = async (amount) => {
    try {
      await callApi(() => tokenApi.mintUSDT(account, amount));
      await loadBalances();
      return true;
    } catch (err) {
      console.error("Failed to mint USDT:", err);
      return false;
    }
  };

  const handleBuyTokens = async (usdtAmount) => {
    if (!contractService) {
      throw new Error("Contract service not initialized");
    }

    try {
      // First approve USDT spending
      await contractService.approveUSDT(
        CONTRACT_ADDRESSES.TokenStore,
        usdtAmount
      );

      // Then call the backend to execute the purchase
      await callApi(() => storeApi.buy(account, usdtAmount));

      // Reload balances
      await loadBalances();
      return true;
    } catch (err) {
      console.error("Failed to buy tokens:", err);
      return false;
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Buy Game Tokens
        </h2>
        <p className="text-gray-600">
          Please connect your wallet to buy tokens.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Buy Game Tokens
      </h2>

      <ErrorMessage error={error} onDismiss={clearError} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <BalanceCard
            balances={balances}
            onMintUSDT={handleMintUSDT}
            loading={loading}
          />
        </div>

        <div>
          <PurchaseForm
            onPurchase={handleBuyTokens}
            loading={loading}
            usdtBalance={balances.usdt}
          />
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          How Token Purchase Works
        </h3>
        <ul className="space-y-2 text-blue-700">
          <li>• 1 USDT = 1 GT (Game Token)</li>
          <li>• USDT has 6 decimals, GT has 18 decimals</li>
          <li>• You need to approve USDT spending first</li>
          <li>• GT tokens are automatically minted to your wallet</li>
        </ul>
      </div>
    </div>
  );
}

export default BuyTokensPage;
