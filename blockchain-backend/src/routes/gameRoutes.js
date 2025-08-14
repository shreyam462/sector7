const express = require('express');
const gameController = require('../controllers/gameController');

const router = express.Router();

router.post('/create', gameController.create);
router.post('/stake', gameController.stake);
router.post('/settle', gameController.settle);
router.get('/active', gameController.getActive);

module.exports = router;