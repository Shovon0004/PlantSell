import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress
} from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';
import { addressRules } from '../utils/validationRules.js';
import validate from '../middleware/validatorMiddleware.js';

const router = express.Router();

// Require authentication for profile operations
router.use(protect);

router.route('/')
  .get(getProfile)
  .put(updateProfile);

router.put('/change-password', changePassword);

router.post('/address', addressRules, validate, addAddress);
router.route('/address/:id')
  .put(addressRules, validate, updateAddress)
  .delete(deleteAddress);

export default router;
