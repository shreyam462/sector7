const contractService = require('../services/contractService');
const { ethers } = require('ethers');

class GameController {
  async create(req, res, next) {
    try {
      const { player1, player2, stakeAmount } = req.body;
      
      if (!player1 || !player2 || !stakeAmount) {
        return res.status(400).json({
          error: 'Missing required fields: player1, player2, stakeAmount'
        });
      }
      
      // Generate unique match ID
      const matchId = ethers.keccak256(
        ethers.toUtf8Bytes(`${player1}-${player2}-${Date.now()}`)
      );
      
      const result = await contractService.createMatch(
        matchId,
        player1,
        player2,
        stakeAmount
      );
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async stake(req, res, next) {
    try {
      const { matchId, player } = req.body;
      
      if (!matchId || !player) {
        return res.status(400).json({
          error: 'Missing required fields: matchId, player'
        });
      }
      
      const result = await contractService.stakeForMatch(matchId, player);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async settle(req, res, next) {
    try {
      const { matchId, winner } = req.body;
      
      if (!matchId || !winner) {
        return res.status(400).json({
          error: 'Missing required fields: matchId, winner'
        });
      }
      
      const result = await contractService.settleMatch(matchId, winner);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getActive(req, res, next) {
    try {
      const matches = await contractService.getActiveMatches();
      
      res.json({
        success: true,
        data: matches
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new GameController();