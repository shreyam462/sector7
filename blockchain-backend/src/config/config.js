require("dotenv").config();

module.exports = {
  port: process.env.PORT || 38010,
  rpcUrl:
    "https://eth-sepolia.g.alchemy.com/v2/45hYRHpZY8B-ahK1laOdFeU03ulUjoqe",
  privateKey:
    "0x85bdc305f79abfd823e18bd1264f749b467248966403842c799aa1c9c948f718",
  contracts: {
    GameToken: "0x66F46D274A186DCd1E13e8ad598184b20910FC69",
    MockUSDT: "0x6BABe4703b06fa62602Fe4e470fde43DdbdE66b0",
    PlayGame: "0xdb17725A2353F5da589294A4b965Ccb41715AA0C",
    TokenStore: "0x5E581B8C44F0ec1f86b68A1E23342432311e6e15",
  },
  network: {
    chainId: process.env.CHAIN_ID || 11155111, // Sepolia Chain ID
    name: process.env.NETWORK_NAME || "sepolia",
  },
};
