const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const axios = require('axios');
const matchmaking = require('./matchmaking');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for simplicity in this example
        methods: ["GET", "POST"]
    }
});

const API_GATEWAY_URL = 'http://localhost:38010/api'; // Your backend API

const GAME_TIMEOUT = 120000; // 2 minutes

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('joinMatchmaking', async ({ playerAddress, stakeAmount }) => {
        console.log(`Player ${playerAddress} joined matchmaking with stake ${stakeAmount}`);
        const match = matchmaking.enqueuePlayer(socket, playerAddress, stakeAmount);
        
        if (match) {
            // Match found, inform both players
            const { p1, p2, matchId } = match;
            
            // Call your backend API to create the match on-chain
            try {
                const response = await axios.post(`${API_GATEWAY_URL}/game/create`, {
                    player1: p1.address,
                    player2: p2.address,
                    stakeAmount: stakeAmount
                });
                console.log('Match created on-chain:', response.data);

                p1.socket.emit('matchFound', { matchId: matchId, opponent: p2.address, stakeAmount });
                p2.socket.emit('matchFound', { matchId: matchId, opponent: p1.address, stakeAmount });
            } catch (error) {
                console.error('Error creating match on-chain:', error.response.data);
                p1.socket.emit('error', 'Failed to create match on-chain.');
                p2.socket.emit('error', 'Failed to create match on-chain.');
                matchmaking.cleanupMatch(matchId);
            }
        }
    });

    socket.on('playerReady', ({ matchId, playerAddress }) => {
        matchmaking.setPlayerReady(matchId, playerAddress, socket);
        const match = matchmaking.getMatch(matchId);
        
        if (match && match.p1Ready && match.p2Ready) {
            console.log(`Match ${matchId} is ready! Starting game...`);
            io.to(matchId).emit('gameStart', { matchId });
            
            // Set up game timeout
            setTimeout(() => {
                if (match.status !== 'settled') {
                    // Handle game timeout logic, e.g., refunding stakes
                    console.log(`Match ${matchId} timed out.`);
                }
            }, GAME_TIMEOUT);
        }
    });

    socket.on('move', ({ matchId, move }) => {
        const match = matchmaking.getMatch(matchId);
        if (match) {
            // Update game state and broadcast to all players in the room
            io.to(matchId).emit('updateGameState', { move });
            // Add game logic here to check for a winner
            // Example:
            const winnerAddress = checkWinner(match.gameState);
            if (winnerAddress) {
                commitResult(matchId, winnerAddress);
            }
        }
    });
    
    // Disconnect event
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        // Handle player disconnection (e.g., refund logic)
    });
});

async function commitResult(matchId, winnerAddress) {
    try {
        const response = await axios.post(`${API_GATEWAY_URL}/game/settle`, {
            matchId: matchId,
            winner: winnerAddress
        });
        console.log('Result committed on-chain:', response.data);
        io.to(matchId).emit('gameEnd', { winner: winnerAddress, txHash: response.data.data.txHash });
        matchmaking.cleanupMatch(matchId);
    } catch (error) {
        console.error('Error committing result:', error.response.data);
        io.to(matchId).emit('error', 'Failed to commit result on-chain.');
    }
}

server.listen(3001, () => {
    console.log('Game Server listening on port 3001');
});