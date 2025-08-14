const activeQueue = {}; // { 'stakeAmount': [player_socket_id] }
const waitingPlayers = {}; // { 'player_address': { socket: ..., stake: ... } }
const activeMatches = {}; // { 'match_id': { p1: { address:.., socket:..}, p2: {..}, status:.. } }

function enqueuePlayer(socket, playerAddress, stakeAmount) {
    if (waitingPlayers[playerAddress]) {
        return null; // Player is already in a queue
    }

    // Add player to the waiting list and queue for their stake amount
    waitingPlayers[playerAddress] = { socket, address: playerAddress, stake: stakeAmount };
    if (!activeQueue[stakeAmount]) {
        activeQueue[stakeAmount] = [];
    }
    activeQueue[stakeAmount].push(playerAddress);
    console.log(`Player ${playerAddress} enqueued for stake ${stakeAmount}. Queue size: ${activeQueue[stakeAmount].length}`);

    if (activeQueue[stakeAmount].length >= 2) {
        const p1_address = activeQueue[stakeAmount].shift();
        const p2_address = activeQueue[stakeAmount].shift();

        const p1_info = waitingPlayers[p1_address];
        const p2_info = waitingPlayers[p2_address];

        delete waitingPlayers[p1_address];
        delete waitingPlayers[p2_address];

        const matchId = `match_${Date.now()}_${p1_address.slice(-4)}_${p2_address.slice(-4)}`;
        
        activeMatches[matchId] = {
            matchId,
            p1: p1_info,
            p2: p2_info,
            stake: stakeAmount,
            p1Ready: false,
            p2Ready: false,
            status: 'pending_stake'
        };

        // Make players join a socket.io room
        p1_info.socket.join(matchId);
        p2_info.socket.join(matchId);

        return activeMatches[matchId];
    }
    return null;
}

function setPlayerReady(matchId, playerAddress, socket) {
    const match = activeMatches[matchId];
    if (match) {
        if (match.p1.address === playerAddress) {
            match.p1Ready = true;
        } else if (match.p2.address === playerAddress) {
            match.p2Ready = true;
        }
    }
}

function getMatch(matchId) {
    return activeMatches[matchId];
}

function cleanupMatch(matchId) {
    delete activeMatches[matchId];
}

module.exports = {
    enqueuePlayer,
    setPlayerReady,
    getMatch,
    cleanupMatch
};