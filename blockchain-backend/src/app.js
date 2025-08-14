const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const tokenRoutes = require("./routes/tokenRoutes");
const storeRoutes = require("./routes/storeRoutes");
const gameRoutes = require("./routes/gameRoutes");
const errorHandler = require("./middleware/errorhandler");

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/token", tokenRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/game", gameRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});
BigInt.prototype.toJSON = function () {
  return this.toString();
};

// Error handling
app.use(errorHandler);

module.exports = app;
