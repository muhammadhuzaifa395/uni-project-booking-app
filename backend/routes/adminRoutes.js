const express = require('express');
const router = express.Router();
const { getAdminStats } = require('../controllers/adminStatsController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.use(adminOnly);

router.get('/stats', getAdminStats);

module.exports = router;
