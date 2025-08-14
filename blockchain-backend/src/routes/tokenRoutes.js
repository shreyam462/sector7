const express = require('express');
const tokenController = require('../controllers/tokenController');

const router = express.Router();

router.post('/mint-usdt', tokenController.mintUSDT);

module.exports = router;