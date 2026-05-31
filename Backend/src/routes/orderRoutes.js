import express from 'express';
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { orderRules } from '../utils/validationRules.js';
import validate from '../middleware/validatorMiddleware.js';

const router = express.Router();

// Require login for all order operations
router.use(protect);

router.post('/', orderRules, validate, placeOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);
router.post('/:id/cancel', cancelOrder);

export default router;
