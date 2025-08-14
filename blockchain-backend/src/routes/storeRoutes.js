const express = require('express');
const storeController = require('../controllers/storeController');

const router = express.Router();

router.post('/buy', storeController.buy);
router.get('/balance/:address', storeController.getBalance);

module.exports = router;