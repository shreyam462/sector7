import React, { useState, useEffect } from "react";
import { useWallet } from "../../context/WalletContext";
import { useApi } from "../../hooks/useApi";
import { gameApi } from "../../services/api";
import ContractService from "../../services/contractService";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";
import CreateMatch from "./CreateMatch";
import ActiveMatches from "./Activematches";

function PlayGamePage() {
  const { isConnected, account, signer } = useWallet();
  const { loading, error, callApi, clearError } = useApi();
  const [activeMatches, setActiveMatches] = useState([]);
  const [contractService, setContractService] = useState(null);

  useEffect(() => {
    if (signer) {
      setContractService(new ContractService(signer));
    }
  }, [signer]);

  useEffect(() => {
    if (isConnected) {
      loadActiveMatches();
      // Poll for updates every 10 seconds
      const interval = setInterval(loadActiveMatches, 10000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  const loadActiveMatches = async () => {
    try {
      const response = await callApi(() => gameApi.getActive());
      setActiveMatches(response.data.data);
    } catch (err) {
      console.error("Failed to load active matches:", err);
    }
  };

  const handleCreateMatch = async (player1, player2, stakeAmount) => {
    try {
      await callApi(() => gameApi.create(player1, player2, stakeAmount));
      await loadActiveMatches();
      return true;
    } catch (err) {
      console.error("Failed to create match:", err);
      return false;
    }
  };

  const handleStake = async (matchId) => {
    if (!contractService) {
      throw new Error("Contract service not initialized");
    }

    try {
      // Get match details first
      const match = activeMatches.find((m) => m.matchId === matchId);
      if (!match) {
        throw new Error("Match not found");
      }

      // Approve GT spending
      await contractService.approveGT(
        CONTRACT_ADDRESSES.PlayGame,
        match.stakeAmount
      );

      // Place stake through contract
      await contractService.placeStake(matchId);

      // Reload matches
      await loadActiveMatches();
      return true;
    } catch (err) {
      console.error("Failed to place stake:", err);
      return false;
    }
  };

  const handleSettle = async (matchId, winner) => {
    try {
      await callApi(() => gameApi.settle(matchId, winner));
      await loadActiveMatches();
      return true;
    } catch (err) {
      console.error("Failed to settle match:", err);
      return false;
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Play Game</h2>
        <p className="text-gray-600">
          Please connect your wallet to play games.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Play Game
      </h2>

      <ErrorMessage error={error} onDismiss={clearError} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <CreateMatch onCreateMatch={handleCreateMatch} loading={loading} />
        </div>

        <div className="xl:col-span-2">
          <ActiveMatches
            matches={activeMatches}
            currentAccount={account}
            onStake={handleStake}
            onSettle={handleSettle}
            loading={loading}
          />
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Game Rules</h3>
        <ul className="space-y-2 text-blue-700">
          <li>• Matches are created by operators/admins</li>
          <li>• Both players must stake the required GT amount</li>
          <li>• Game is played off-chain</li>
          <li>• Operator declares the winner</li>
          <li>• Winner receives all staked tokens (2x stake amount)</li>
          <li>• Matches timeout after 24 hours if not completed</li>
        </ul>
      </div>
    </div>
  );
}

export default PlayGamePage;
