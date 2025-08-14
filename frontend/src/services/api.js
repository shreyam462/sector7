import axios from "axios";

const API_BASE_URL = "http://localhost:38010/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token API
export const tokenApi = {
  mintUSDT: (to, amount) => api.post("/token/mint-usdt", { to, amount }),
};

// Store API
export const storeApi = {
  buy: (buyer, usdtAmount) => api.post("/store/buy", { buyer, usdtAmount }),

  getBalance: (address) => api.get(`/store/balance/${address}`),
};

// Game API
export const gameApi = {
  create: (player1, player2, stakeAmount) =>
    api.post("/game/create", { player1, player2, stakeAmount }),

  stake: (matchId, player) => api.post("/game/stake", { matchId, player }),

  settle: (matchId, winner) => api.post("/game/settle", { matchId, winner }),

  getActive: () => api.get("/game/active"),
};

export default api;
