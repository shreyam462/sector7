const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // For testnet/local development, you might want to deploy a mock USDT token
  // Comment this out if using real USDT
  console.log("Deploying Mock USDT...");
  const MockUSDT = await ethers.getContractFactory("MockUSDT");
  const mockUSDT = await MockUSDT.deploy();
  await mockUSDT.waitForDeployment();
  console.log("Mock USDT deployed to:", await mockUSDT.getAddress());

  // Deploy GameToken
  console.log("Deploying GameToken...");
  const GameToken = await ethers.getContractFactory("GameToken");
  const gameToken = await GameToken.deploy();
  await gameToken.waitForDeployment();
  console.log("GameToken deployed to:", await gameToken.getAddress());

  // Deploy TokenStore
  console.log("Deploying TokenStore...");
  const TokenStore = await ethers.getContractFactory("TokenStore");
  const tokenStore = await TokenStore.deploy(
    await mockUSDT.getAddress(), // Use real USDT address in production
    await gameToken.getAddress()
  );
  await tokenStore.waitForDeployment();
  console.log("TokenStore deployed to:", await tokenStore.getAddress());

  // Set TokenStore as minter in GameToken
  console.log("Setting TokenStore as minter...");
  await gameToken.setTokenStore(await tokenStore.getAddress());

  // Deploy PlayGame
  console.log("Deploying PlayGame...");
  const PlayGame = await ethers.getContractFactory("PlayGame");
  const playGame = await PlayGame.deploy(await gameToken.getAddress());
  await playGame.waitForDeployment();
  console.log("PlayGame deployed to:", await playGame.getAddress());

  // Save contract addresses
  const contracts = {
    mockUSDT: await mockUSDT.getAddress(),
    gameToken: await gameToken.getAddress(),
    tokenStore: await tokenStore.getAddress(),
    playGame: await playGame.getAddress(),
    network: await deployer.provider.getNetwork()
  };

  fs.writeFileSync('./contracts.json', JSON.stringify(contracts, null, 2));
  console.log("Contract addresses saved to contracts.json");

  // Mint some test USDT to deployer (for testing)
  console.log("Minting test USDT...");
  await mockUSDT.mint(deployer.address, ethers.parseUnits("1000", 6)); // 1000 USDT
  console.log("Minted 1000 USDT to deployer");

  console.log("\nDeployment Summary:");
  console.log("==================");
  console.log("Mock USDT:", contracts.mockUSDT);
  console.log("GameToken:", contracts.gameToken);
  console.log("TokenStore:", contracts.tokenStore);
  console.log("PlayGame:", contracts.playGame);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });