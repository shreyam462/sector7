const { ethers } = require("ethers");
const config = require("../config/config");

class EthersService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      "https://eth-sepolia.g.alchemy.com/v2/45hYRHpZY8B-ahK1laOdFeU03ulUjoqe"
    );
    this.wallet = new ethers.Wallet(
      "85bdc305f79abfd823e18bd1264f749b467248966403842c799aa1c9c948f718",
      this.provider
    );
  }

  getProvider() {
    return this.provider;
  }

  getWallet() {
    return this.wallet;
  }

  async getContract(address, abi) {
    return new ethers.Contract(address, abi, this.wallet);
  }

  formatEther(amount) {
    return ethers.formatEther(amount);
  }

  parseEther(amount) {
    return ethers.parseEther(amount.toString());
  }

  formatUnits(amount, decimals) {
    return ethers.formatUnits(amount, decimals);
  }

  parseUnits(amount, decimals) {
    return ethers.parseUnits(amount.toString(), decimals);
  }
}

module.exports = new EthersService();
