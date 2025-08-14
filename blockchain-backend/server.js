const app = require("./src/app");
const config = require("./src/config/config");

const PORT = 38010;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Network: ${config.network.name} (${config.network.chainId})`);
});
