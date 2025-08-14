import { ethers } from "ethers";

// Contract addresses - should match your deployed contracts
export const CONTRACT_ADDRESSES = {
  GameToken: "0x66F46D274A186DCd1E13e8ad598184b20910FC69",
  MockUSDT: "0x6BABe4703b06fa62602Fe4e470fde43DdbdE66b0",
  PlayGame: "0xdb17725A2353F5da589294A4b965Ccb41715AA0C",
  TokenStore: "0x5E581B8C44F0ec1f86b68A1E23342432311e6e15",
};

// ABI imports - these should be imported from your compiled artifacts
import GameTokenABI from "../GameTokenABI.json";
import MockUSDTABI from "../MockUSDTABI.json";
import PlayGameABI from "../PlayGame.json";
import TokenStoreABI from "../TokenStore.json";

export const CONTRACT_ABIS = {
  GameToken: GameTokenABI,
  MockUSDT: MockUSDTABI,
  PlayGame: PlayGameABI,
  TokenStore: TokenStoreABI,
};

export default class ContractService {
  constructor(signer) {
    this.signer = signer;
    this.contracts = {};
    this.initContracts();
  }

  initContracts() {
    Object.keys(CONTRACT_ADDRESSES).forEach((contractName) => {
      this.contracts[contractName] = new ethers.Contract(
        CONTRACT_ADDRESSES[contractName],
        CONTRACT_ABIS[contractName],
        this.signer
      );
    });
  }

  getContract(name) {
    return this.contracts[name];
  }

  // Token operations
  async approveUSDT(spender, amount) {
    const mockUSDT = this.getContract("MockUSDT");
    const parsedAmount = ethers.parseUnits(amount.toString(), 6);

    const tx = await mockUSDT.approve(spender, parsedAmount);
    return await tx.wait();
  }

  async approveGT(spender, amount) {
    const gameToken = this.getContract("GameToken");
    const parsedAmount = ethers.parseEther(amount.toString());

    const tx = await gameToken.approve(spender, parsedAmount);
    return await tx.wait();
  }

  async getBalances(address) {
    const gameToken = this.getContract("GameToken");
    const mockUSDT = this.getContract("MockUSDT");

    const [gtBalance, usdtBalance] = await Promise.all([
      gameToken.balanceOf(address),
      mockUSDT.balanceOf(address),
    ]);

    return {
      gameToken: ethers.formatEther(gtBalance),
      usdt: ethers.formatUnits(usdtBalance, 6),
    };
  }

  // Game operations
  async placeStake(matchId) {
    const playGame = this.getContract("PlayGame");
    const tx = await playGame.placeStake(matchId);
    return await tx.wait();
  }

  async getActiveMatches() {
    const playGame = this.getContract("PlayGame");
    const activeMatchIds = await playGame.getActiveMatches();

    const matches = await Promise.all(
      activeMatchIds.map(async (matchId) => {
        const match = await playGame.getMatch(matchId);
        return {
          matchId: match.matchId,
          player1: match.player1,
          player2: match.player2,
          stakeAmount: ethers.formatEther(match.stakeAmount),
          status: match.status,
          player1Staked: match.player1Staked,
          player2Staked: match.player2Staked,
          winner: match.winner,
          createdAt: match.createdAt.toString(),
        };
      })
    );

    return matches;
  }
}
