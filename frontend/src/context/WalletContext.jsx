import React, { createContext, useContext, useReducer, useEffect } from "react";
import { ethers } from "ethers";

const WalletContext = createContext();

const initialState = {
  isConnected: false,
  account: null,
  provider: null,
  signer: null,
  chainId: null,
  isLoading: false,
  error: null,
};

function walletReducer(state, action) {
  switch (action.type) {
    case "CONNECT_START":
      return { ...state, isLoading: true, error: null };
    case "CONNECT_SUCCESS":
      return {
        ...state,
        isConnected: true,
        account: action.payload.account,
        provider: action.payload.provider,
        signer: action.payload.signer,
        chainId: action.payload.chainId,
        isLoading: false,
        error: null,
      };
    case "CONNECT_ERROR":
      return {
        ...state,
        isConnected: false,
        account: null,
        provider: null,
        signer: null,
        chainId: null,
        isLoading: false,
        error: action.payload,
      };
    case "DISCONNECT":
      return {
        ...initialState,
      };
    case "ACCOUNT_CHANGED":
      return {
        ...state,
        account: action.payload,
      };
    case "CHAIN_CHANGED":
      return {
        ...state,
        chainId: action.payload,
      };
    default:
      return state;
  }
}

export function WalletProvider({ children }) {
  const [state, dispatch] = useReducer(walletReducer, initialState);

  const connectWallet = async () => {
    if (!window.ethereum) {
      dispatch({
        type: "CONNECT_ERROR",
        payload: "MetaMask is not installed",
      });
      return;
    }

    dispatch({ type: "CONNECT_START" });

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      dispatch({
        type: "CONNECT_SUCCESS",
        payload: {
          account: accounts[0],
          provider,
          signer,
          chainId: network.chainId,
        },
      });
    } catch (error) {
      dispatch({
        type: "CONNECT_ERROR",
        payload: error.message,
      });
    }
  };

  const disconnect = () => {
    dispatch({ type: "DISCONNECT" });
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          dispatch({
            type: "ACCOUNT_CHANGED",
            payload: accounts[0],
          });
        }
      });

      window.ethereum.on("chainChanged", (chainId) => {
        dispatch({
          type: "CHAIN_CHANGED",
          payload: parseInt(chainId, 16),
        });
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
        window.ethereum.removeAllListeners("chainChanged");
      }
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{
        ...state,
        connectWallet,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
}
