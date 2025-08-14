const ethersService = require("./etherService.js");
const config = require("../config/config");
const GameTokenABI = require("../config/abis/GameTokenABI.json");
const MockUSDTABI = require("../config/abis/MockUSDTABI.json");
const PlayGameABI = require("../config/abis/PlayGame.json");
const TokenStoreABI = require("../config/abis/TokenStore.json");

class ContractService {
  constructor() {
    this.contracts = {};
    this.initContracts();
  }

  async initContracts() {
    try {
      this.contracts.gameToken = await ethersService.getContract(
        config.contracts.GameToken,
        GameTokenABI
      );

      this.contracts.mockUSDT = await ethersService.getContract(
        config.contracts.MockUSDT,
        MockUSDTABI
      );

      this.contracts.playGame = await ethersService.getContract(
        config.contracts.PlayGame,
        PlayGameABI
      );

      this.contracts.tokenStore = await ethersService.getContract(
        config.contracts.TokenStore,
        TokenStoreABI
      );

      console.log("Contracts initialized successfully");
    } catch (error) {
      console.error("Error initializing contracts:", error);
    }
  }

  getContract(name) {
    return this.contracts[name];
  }

  async mintUSDT(to, amount) {
    try {
      const mockUSDT = this.getContract("mockUSDT");
      const parsedAmount = ethersService.parseUnits(amount, 6); // USDT has 6 decimals

      const tx = await mockUSDT.mint(to, parsedAmount);
      await tx.wait();

      return {
        success: true,
        txHash: tx.hash,
        amount: amount.toString(),
        to,
      };
    } catch (error) {
      throw new Error(`Failed to mint USDT: ${error.message}`);
    }
  }

  async buyTokens(buyer, usdtAmount) {
    try {
      const tokenStore = this.getContract("tokenStore");
      const parsedAmount = ethersService.parseUnits(usdtAmount, 6);

      const tx = await tokenStore.buy(parsedAmount);
      await tx.wait();

      return {
        success: true,
        txHash: tx.hash,
        usdtAmount: usdtAmount.toString(),
        buyer,
      };
    } catch (error) {
      throw new Error(`Failed to buy tokens: ${error.message}`);
    }
  }

  async getBalances(address) {
    try {
      const gameToken = this.getContract("gameToken");
      const mockUSDT = this.getContract("mockUSDT");

      const [gtBalance, usdtBalance] = await Promise.all([
        gameToken.balanceOf(address),
        mockUSDT.balanceOf(address),
      ]);

      return {
        gameToken: ethersService.formatEther(gtBalance),
        usdt: ethersService.formatUnits(usdtBalance, 6),
      };
    } catch (error) {
      throw new Error(`Failed to get balances: ${error.message}`);
    }
  }

  async createMatch(matchId, player1, player2, stakeAmount) {
    try {
      const playGame = this.getContract("playGame");
      const parsedStake = ethersService.parseEther(stakeAmount);

      const tx = await playGame.createMatch(
        matchId,
        player1,
        player2,
        parsedStake
      );
      await tx.wait();

      return {
        success: true,
        txHash: tx.hash,
        matchId,
        player1,
        player2,
        stakeAmount: stakeAmount.toString(),
      };
    } catch (error) {
      throw new Error(`Failed to create match: ${error.message}`);
    }
  }

  async stakeForMatch(matchId, player) {
    try {
      const playGame = this.getContract("playGame");

      // Note: This would typically require the player's signature
      // For testing, we assume the backend wallet has the tokens
      const tx = await playGame.placeStake(matchId);
      await tx.wait();

      return {
        success: true,
        txHash: tx.hash,
        matchId,
        player,
      };
    } catch (error) {
      throw new Error(`Failed to place stake: ${error.message}`);
    }
  }

  async settleMatch(matchId, winner) {
    try {
      const playGame = this.getContract("playGame");

      const tx = await playGame.commitResult(matchId, winner);
      await tx.wait();

      return {
        success: true,
        txHash: tx.hash,
        matchId,
        winner,
      };
    } catch (error) {
      throw new Error(`Failed to settle match: ${error.message}`);
    }
  }

  async getActiveMatches() {
    try {
      const playGame = this.getContract("playGame");
      const activeMatchIds = await playGame.getActiveMatches();

      const matches = await Promise.all(
        activeMatchIds.map(async (matchId) => {
          const match = await playGame.getMatch(matchId);
          return {
            matchId: match.matchId,
            player1: match.player1,
            player2: match.player2,
            stakeAmount: ethersService.formatEther(match.stakeAmount),
            status: match.status,
            player1Staked: match.player1Staked,
            player2Staked: match.player2Staked,
            winner: match.winner,
            createdAt: match.createdAt.toString(),
          };
        })
      );

      return matches;
    } catch (error) {
      throw new Error(`Failed to get active matches: ${error.message}`);
    }
  }
}

module.exports = new ContractService();
