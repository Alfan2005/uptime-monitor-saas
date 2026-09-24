const express = require('express');
const router = express.Router();
const monitorController = require('../controllers/monitorController');

router.post('/', monitorController.createMonitor);
router.get('/', monitorController.getMonitors);

module.exports = router;