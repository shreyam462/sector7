// Network configurations
export const NETWORKS = {
  localhost: {
    chainId: "0x7A69", // 31337
    chainName: "Localhost 8545",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["http://localhost:8545"],
  },
  hardhat: {
    chainId: "0x7A69", // 31337
    chainName: "Hardhat Network",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["http://localhost:8545"],
  },
};

// Contract addresses - should be set from environment variables
export const CONTRACT_ADDRESSES = {
  GameToken: "0x66F46D274A186DCd1E13e8ad598184b20910FC69",
  MockUSDT: "0x6BABe4703b06fa62602Fe4e470fde43DdbdE66b0",
  PlayGame: "0xdb17725A2353F5da589294A4b965Ccb41715AA0C",
  TokenStore: "0x5E581B8C44F0ec1f86b68A1E23342432311e6e15",
};

// API configuration
export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:38010/api",
  timeout: 30000,
};

// Game constants
export const GAME_CONSTANTS = {
  MATCH_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  MIN_STAKE_AMOUNT: 0.01,
  MAX_STAKE_AMOUNT: 1000000,
};

// Status mappings
export const MATCH_STATUS = {
  CREATED: 0,
  STAKED: 1,
  SETTLED: 2,
  REFUNDED: 3,
};

export const MATCH_STATUS_LABELS = {
  [MATCH_STATUS.CREATED]: "Created",
  [MATCH_STATUS.STAKED]: "Staked",
  [MATCH_STATUS.SETTLED]: "Settled",
  [MATCH_STATUS.REFUNDED]: "Refunded",
};
