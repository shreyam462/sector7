const contractService = require('../services/contractService');

class StoreController {
  async buy(req, res, next) {
    try {
      const { buyer, usdtAmount } = req.body;
      
      if (!buyer || !usdtAmount) {
        return res.status(400).json({
          error: 'Missing required fields: buyer, usdtAmount'
        });
      }
      
      const result = await contractService.buyTokens(buyer, usdtAmount);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getBalance(req, res, next) {
    try {
      const { address } = req.params;
      
      if (!address) {
        return res.status(400).json({
          error: 'Address parameter is required'
        });
      }
      
      const balances = await contractService.getBalances(address);
      
      res.json({
        success: true,
        data: balances
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StoreController();