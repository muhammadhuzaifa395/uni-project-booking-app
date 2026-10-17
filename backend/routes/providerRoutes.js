const express = require('express');
const router = express.Router();
const {
  getAllProviders,
  getProviderById,
  createProvider,
  updateProvider,
  deleteProvider
} = require('../controllers/providerController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', getAllProviders);
router.get('/:id', getProviderById);

// Admin-protected routes
router.post('/', protect, adminOnly, createProvider);
router.put('/:id', protect, adminOnly, updateProvider);
router.delete('/:id', protect, adminOnly, deleteProvider);

module.exports = router;
