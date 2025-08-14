// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./GameToken.sol";

contract PlayGame is Ownable, ReentrancyGuard {
    IERC20 public immutable gameToken;
    enum MatchStatus { CREATED, STAKED, SETTLED, REFUNDED }
    
    struct Match {
        bytes32 matchId;
        address player1;
        address player2;
        uint256 stakeAmount;
        MatchStatus status;
        bool player1Staked;
        bool player2Staked;
        address winner;
        uint256 createdAt;
    }
    
    mapping(bytes32 => Match) public matches;
    bytes32[] public activeMatches;
    uint256 public constant MATCH_TIMEOUT = 24 hours;
    address public operator;
    
    event MatchCreated(bytes32 indexed matchId, address indexed player1, address indexed player2, uint256 stakeAmount);
    event Staked(bytes32 indexed matchId, address indexed player, uint256 amount);
    event MatchReady(bytes32 indexed matchId);
    event Settled(bytes32 indexed matchId, address indexed winner, uint256 payout);
    event Refunded(bytes32 indexed matchId, address indexed player1, address indexed player2, uint256 stakeAmount);
    event OperatorSet(address indexed newOperator);
    
    modifier onlyOperator() {
        require(msg.sender == operator || msg.sender == owner(), "Only operator or owner");
        _;
    }
    
    constructor(address _gameToken) Ownable(msg.sender) {
        require(_gameToken != address(0), "Invalid GameToken address");
        gameToken = IERC20(_gameToken);
        operator = msg.sender;
    }
    
    function setOperator(address _operator) external onlyOwner {
        require(_operator != address(0), "Invalid address");
        operator = _operator;
        emit OperatorSet(_operator);
    }
    
    function createMatch(
        bytes32 matchId,
        address player1,
        address player2,
        uint256 stakeAmount
    ) external onlyOperator {
        // ... (rest of the function is correct)
    }
    
    function placeStake(bytes32 matchId) external nonReentrant {
        // ... (rest of the function is correct)
    }
    
    function commitResult(bytes32 matchId, address winner) external onlyOperator nonReentrant {
        // ... (rest of the function is correct)
    }
    
    function refund(bytes32 matchId) external nonReentrant {
        Match storage match_ = matches[matchId];
        require(match_.matchId != bytes32(0), "Match does not exist");
        require(match_.status == MatchStatus.STAKED, "Match not ready for refund"); // Fixed status check
        require(block.timestamp >= match_.createdAt + MATCH_TIMEOUT, "Refund not available yet");
        
        _processRefund(matchId);
    }

    function cancelMatchByOperator(bytes32 matchId) external onlyOperator nonReentrant {
        Match storage match_ = matches[matchId];
        require(match_.matchId != bytes32(0), "Match does not exist");
        require(match_.status == MatchStatus.CREATED || match_.status == MatchStatus.STAKED, "Cannot cancel settled match");
        
        _processRefund(matchId);
    }
    
    function _processRefund(bytes32 matchId) internal {
        Match storage match_ = matches[matchId];
        match_.status = MatchStatus.REFUNDED;
        
        if (match_.player1Staked) {
            require(gameToken.transfer(match_.player1, match_.stakeAmount), "Player1 refund failed");
        }
        
        if (match_.player2Staked) {
            require(gameToken.transfer(match_.player2, match_.stakeAmount), "Player2 refund failed");
        }
        
        _removeActiveMatch(matchId);
        emit Refunded(matchId, match_.player1, match_.player2, match_.stakeAmount);
    }

    function _removeActiveMatch(bytes32 matchId) internal {
        for (uint256 i = 0; i < activeMatches.length; i++) {
            if (activeMatches[i] == matchId) {
                activeMatches[i] = activeMatches[activeMatches.length - 1];
                activeMatches.pop();
                break;
            }
        }
    }
    
    function getActiveMatches() external view returns (bytes32[] memory) {
        return activeMatches;
    }
    
    function getMatch(bytes32 matchId) external view returns (Match memory) {
        return matches[matchId];
    }
    
    function getActiveMatchCount() external view returns (uint256) {
        return activeMatches.length;
    }
}