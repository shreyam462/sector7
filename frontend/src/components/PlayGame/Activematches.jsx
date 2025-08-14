import React from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

function ActiveMatches({ matches, currentAccount, onStake, onSettle, loading }) {
  const [stakingMatch, setStakingMatch] = React.useState(null);
  const [settlingMatch, setSettlingMatch] = React.useState(null);

  const handleStake = async (matchId) => {
    setStakingMatch(matchId);
    try {
      await onStake(matchId);
    } finally {
      setStakingMatch(null);
    }
  };

  const handleSettle = async (matchId, winner) => {
    setSettlingMatch(matchId);
    try {
      await onSettle(matchId, winner);
    } finally {
      setSettlingMatch(null);
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      0: 'Created',
      1: 'Staked',
      2: 'Settled',
      3: 'Refunded'
    };
    return statusMap[status] || 'Unknown';
  };

  const getStatusColor = (status) => {
    const colorMap = {
      0: 'bg-yellow-100 text-yellow-800',
      1: 'bg-green-100 text-green-800',
      2: 'bg-blue-100 text-blue-800',
      3: 'bg-gray-100 text-gray-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const isPlayerInMatch = (match) => {
    return match.player1.toLowerCase() === currentAccount?.toLowerCase() || 
           match.player2.toLowerCase() === currentAccount?.toLowerCase();
  };

  const hasPlayerStaked = (match) => {
    if (match.player1.toLowerCase() === currentAccount?.toLowerCase()) {
      return match.player1Staked;
    }
    if (match.player2.toLowerCase() === currentAccount?.toLowerCase()) {
      return match.player2Staked;
    }
    return false;
  };

  const canStake = (match) => {
    return match.status === 0 && isPlayerInMatch(match) && !hasPlayerStaked(match);
  };

  const canSettle = (match) => {
    return match.status === 1; // Both players staked
  };

  if (loading && matches.length === 0) {
    return <LoadingSpinner text="Loading matches..." />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Active Matches ({matches.length})
      </h3>
      
      {matches.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No active matches found. Create a new match to get started.
        </p>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <div key={match.matchId} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-gray-500">Match ID:</span>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                      {match.matchId.slice(0, 10)}...{match.matchId.slice(-8)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
                      {getStatusText(match.status)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Player 1:</span>
                      </p>
                      <p className="text-xs font-mono bg-gray-50 p-2 rounded">
                        {match.player1}
                        {match.player1Staked && (
                          <span className="ml-2 text-green-600">✓ Staked</span>
                        )}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Player 2:</span>
                      </p>
                      <p className="text-xs font-mono bg-gray-50 p-2 rounded">
                        {match.player2}
                        {match.player2Staked && (
                          <span className="ml-2 text-green-600">✓ Staked</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center space-x-4 text-sm">
                    <span>
                      <span className="font-medium text-gray-600">Stake:</span>{' '}
                      <span className="font-bold text-blue-600">{match.stakeAmount} GT</span>
                    </span>
                    {match.winner && match.winner !== '0x0000000000000000000000000000000000000000' && (
                      <span>
                        <span className="font-medium text-gray-600">Winner:</span>{' '}
                        <span className="font-mono text-xs text-green-600">
                          {match.winner.slice(0, 6)}...{match.winner.slice(-4)}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {canStake(match) && (
                  <button
                    onClick={() => handleStake(match.matchId)}
                    disabled={stakingMatch === match.matchId}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm font-bold py-2 px-4 rounded transition-colors"
                  >
                    {stakingMatch === match.matchId ? 'Staking...' : 'Place Stake'}
                  </button>
                )}
                
                {canSettle(match) && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSettle(match.matchId, match.player1)}
                      disabled={settlingMatch === match.matchId}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-bold py-2 px-3 rounded transition-colors"
                    >
                      {settlingMatch === match.matchId ? 'Settling...' : 'Player 1 Wins'}
                    </button>
                    <button
                      onClick={() => handleSettle(match.matchId, match.player2)}
                      disabled={settlingMatch === match.matchId}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-bold py-2 px-3 rounded transition-colors"
                    >
                      {settlingMatch === match.matchId ? 'Settling...' : 'Player 2 Wins'}
                    </button>
                  </div>
                )}
                
                {isPlayerInMatch(match) && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                    You're in this match
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActiveMatches;