const { ethers } = require('ethers');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// Load contract addresses
const contracts = JSON.parse(fs.readFileSync('./contracts.json', 'utf8'));

// Database setup
const db = new sqlite3.Database('./leaderboard.db');

// Initialize database tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    buyer TEXT NOT NULL,
    usdt_amount TEXT NOT NULL,
    gt_amount TEXT NOT NULL,
    block_number INTEGER,
    transaction_hash TEXT,
    timestamp INTEGER DEFAULT (strftime('%s','now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    match_id TEXT UNIQUE NOT NULL,
    player1 TEXT NOT NULL,
    player2 TEXT NOT NULL,
    stake TEXT NOT NULL,
    status TEXT DEFAULT 'CREATED',
    winner TEXT,
    payout TEXT,
    block_number INTEGER,
    transaction_hash TEXT,
    timestamp INTEGER DEFAULT (strftime('%s','now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS stakes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    match_id TEXT NOT NULL,
    player TEXT NOT NULL,
    amount TEXT NOT NULL,
    block_number INTEGER,
    transaction_hash TEXT,
    timestamp INTEGER DEFAULT (strftime('%s','now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS settlements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    match_id TEXT NOT NULL,
    winner TEXT NOT NULL,
    payout TEXT NOT NULL,
    block_number INTEGER,
    transaction_hash TEXT,
    timestamp INTEGER DEFAULT (strftime('%s','now'))
  )`);

  console.log('Database tables initialized');
});

// Blockchain setup
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://localhost:8545');

// Contract ABIs
const tokenStoreABI = [
  'event Purchase(address indexed buyer, uint256 usdtAmount, uint256 gtAmount)'
];

const playGameABI = [
  'event MatchCreated(bytes32 indexed matchId, address indexed player1, address indexed player2, uint256 stake)',
  'event Staked(bytes32 indexed matchId, address indexed player, uint256 amount)',
  'event MatchReady(bytes32 indexed matchId)',
  'event Settled(bytes32 indexed matchId, address indexed winner, uint256 payout)',
  'event Refunded(bytes32 indexed matchId, address indexed player1, address indexed player2, uint256 stake)'
];

// Contract instances
const tokenStoreContract = new ethers.Contract(contracts.tokenStore, tokenStoreABI, provider);
const playGameContract = new ethers.Contract(contracts.playGame, playGameABI, provider);

// Event handlers
const handlePurchase = async (buyer, usdtAmount, gtAmount, event) => {
  console.log(`Purchase event: ${buyer} bought ${ethers.formatEther(gtAmount)} GT for ${ethers.formatUnits(usdtAmount, 6)} USDT`);
  
  db.run(
    `INSERT INTO purchases (buyer, usdt_amount, gt_amount, block_number, transaction_hash) 
     VALUES (?, ?, ?, ?, ?)`,
    [buyer, usdtAmount.toString(), gtAmount.toString(), event.blockNumber, event.transactionHash],
    function(err) {
      if (err) {
        console.error('Error saving purchase:', err);
      }
    }
  );
};

const handleMatchCreated = async (matchId, player1, player2, stake, event) => {
  console.log(`Match created: ${matchId} between ${player1} and ${player2} with stake ${ethers.formatEther(stake)} GT`);
  
  db.run(
    `INSERT INTO matches (match_id, player1, player2, stake, block_number, transaction_hash) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [matchId, player1, player2, stake.toString(), event.blockNumber, event.transactionHash],
    function(err) {
      if (err) {
        console.error('Error saving match:', err);
      }
    }
  );
};

const handleStaked = async (matchId, player, amount, event) => {
  console.log(`Stake event: ${player} staked ${ethers.formatEther(amount)} GT in match ${matchId}`);
  
  db.run(
    `INSERT INTO stakes (match_id, player, amount, block_number, transaction_hash) 
     VALUES (?, ?, ?, ?, ?)`,
    [matchId, player, amount.toString(), event.blockNumber, event.transactionHash],
    function(err) {
      if (err) {
        console.error('Error saving stake:', err);
      }
    }
  );
};

const handleMatchReady = async (matchId, event) => {
  console.log(`Match ready: ${matchId} - both players have staked`);
  
  db.run(
    `UPDATE matches SET status = 'STAKED' WHERE match_id = ?`,
    [matchId],
    function(err) {
      if (err) {
        console.error('Error updating match status:', err);
      }
    }
  );
};

const handleSettled = async (matchId, winner, payout, event) => {
  console.log(`Match settled: ${matchId} won by ${winner} with payout ${ethers.formatEther(payout)} GT`);
  
  // Update matches table
  db.run(
    `UPDATE matches SET status = 'SETTLED', winner = ?, payout = ? WHERE match_id = ?`,
    ['SETTLED', winner, payout.toString(), matchId],
    function(err) {
      if (err) {
        console.error('Error updating match:', err);
      }
    }
  );

  // Insert settlement record
  db.run(
    `INSERT INTO settlements (match_id, winner, payout, block_number, transaction_hash) 
     VALUES (?, ?, ?, ?, ?)`,
    [matchId, winner, payout.toString(), event.blockNumber, event.transactionHash],
    function(err) {
      if (err) {
        console.error('Error saving settlement:', err);
      }
    }
  );
};

const handleRefunded = async (matchId, player1, player2, stake, event) => {
  console.log(`Match refunded: ${matchId} - ${ethers.formatEther(stake)} GT refunded to both players`);
  
  db.run(
    `UPDATE matches SET status = 'REFUNDED' WHERE match_id = ?`,
    [matchId],
    function(err) {
      if (err) {
        console.error('Error updating refunded match:', err);
      }
    }
  );
};

// Set up event listeners
const setupEventListeners = () => {
  console.log('Setting up event listeners...');

  // TokenStore events
  tokenStoreContract.on('Purchase', handlePurchase);

  // PlayGame events
  playGameContract.on('MatchCreated', handleMatchCreated);
  playGameContract.on('Staked', handleStaked);
  playGameContract.on('MatchReady', handleMatchReady);
  playGameContract.on('Settled', handleSettled);
  playGameContract.on('Refunded', handleRefunded);

  console.log('Event listeners set up successfully!');
};

// Get leaderboard data
const getLeaderboard = (callback) => {
  const query = `
    SELECT 
      winner as player,
      COUNT(*) as wins,
      CAST(SUM(CAST(payout as REAL)) / 1000000000000000000 as TEXT) as total_won
    FROM settlements 
    GROUP BY winner 
    ORDER BY wins DESC, total_won DESC 
    LIMIT 10
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error getting leaderboard:', err);
      callback(err, null);
    } else {
      const leaderboard = rows.map(row => ({
        player: row.player,
        wins: row.wins,
        totalWon: parseFloat(row.total_won).toFixed(2)
      }));
      callback(null, leaderboard);
    }
  });
};

// API server for leaderboard
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/leaderboard', (req, res) => {
  getLeaderboard((err, leaderboard) => {
    if (err) {
      res.status(500).json({ error: 'Failed to get leaderboard' });
    } else {
      res.json(leaderboard);
    }
  });
});

app.get('/stats', (req, res) => {
  const queries = {
    totalMatches: 'SELECT COUNT(*) as count FROM matches',
    totalPurchases: 'SELECT COUNT(*) as count FROM purchases',
    totalVolume: 'SELECT CAST(SUM(CAST(payout as REAL)) / 1000000000000000000 as TEXT) as volume FROM settlements'
  };

  Promise.all([
    new Promise((resolve, reject) => {
      db.get(queries.totalMatches, (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    }),
    new Promise((resolve, reject) => {
      db.get(queries.totalPurchases, (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    }),
    new Promise((resolve, reject) => {
      db.get(queries.totalVolume, (err, row) => {
        if (err) reject(err);
        else resolve(parseFloat(row.volume || 0).toFixed(2));
      });
    })
  ]).then(([totalMatches, totalPurchases, totalVolume]) => {
    res.json({
      totalMatches,
      totalPurchases,
      totalVolume
    });
  }).catch(err => {
    console.error('Error getting stats:', err);
    res.status(500).json({ error: 'Failed to get stats' });
  });
});

app.get('/matches', (req, res) => {
  const query = `
    SELECT match_id, player1, player2, stake, status, winner, payout, timestamp
    FROM matches 
    ORDER BY timestamp DESC 
    LIMIT 50
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error getting matches:', err);
      res.status(500).json({ error: 'Failed to get matches' });
    } else {
      const matches = rows.map(row => ({
        matchId: row.match_id,
        player1: row.player1,
        player2: row.player2,
        stake: (parseFloat(row.stake) / 1e18).toFixed(2),
        status: row.status,
        winner: row.winner,
        payout: row.payout ? (parseFloat(row.payout) / 1e18).toFixed(2) : null,
        timestamp: row.timestamp
      }));
      res.json(matches);
    }
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  
  // Remove event listeners
  tokenStoreContract.removeAllListeners();
  playGameContract.removeAllListeners();
  
  // Close database
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Main execution
const main = async () => {
  try {
    console.log('Starting Leaderboard Event Listener...');
    console.log('Contracts loaded:', contracts);

    // Test provider connection
    const network = await provider.getNetwork();
    console.log('Connected to network:', network.name, 'chainId:', network.chainId);

    // Setup event listeners
    setupEventListeners();

    // Start API server
    const PORT = process.env.LEADERBOARD_PORT || 3002;
    app.listen(PORT, () => {
      console.log(`Leaderboard API server running on port ${PORT}`);
    });

    console.log('Event listener is running... Press Ctrl+C to stop.');

    // Keep the process alive
    setInterval(() => {
      // Heartbeat - could add health checks here
    }, 30000);

  } catch (error) {
    console.error('Error starting event listener:', error);
    process.exit(1);
  }
};

// Run if this is the main module
if (require.main === module) {
  main();
}

module.exports = {
  getLeaderboard,
  db
};