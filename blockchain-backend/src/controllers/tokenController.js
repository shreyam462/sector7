const contractService = require('../services/contractService');

class TokenController {
  async mintUSDT(req, res, next) {
    try {
      const { to, amount } = req.body;
      
      if (!to || !amount) {
        return res.status(400).json({
          error: 'Missing required fields: to, amount'
        });
      }
      
      const result = await contractService.mintUSDT(to, amount);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TokenController();