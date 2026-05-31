import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  createCategory,
  updateCategory,
  deleteCategory,
  getOrders,
  getAdminOrderById,
  updateOrderStatus,
  getUsers,
  getUserById,
  blockUser,
  deleteUser,
  getDashboardOverview,
  getTopProductsAnalytics,
  getRevenueAnalytics
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../config/multer.js';
import { productRules } from '../utils/validationRules.js';
import validate from '../middleware/validatorMiddleware.js';

const router = express.Router();

// Require JWT authentication and Admin role
router.use(protect, admin);

// Product Management
router.post('/products', upload.array('images', 5), productRules, validate, createProduct);
router.route('/products/:id')
  .put(upload.array('images', 5), updateProduct)
  .delete(deleteProduct);
router.put('/products/:id/stock', updateProductStock);

// Category Management
router.post('/categories', createCategory);
router.route('/categories/:id')
  .put(updateCategory)
  .delete(deleteCategory);

// Order Management
router.get('/orders', getOrders);
router.get('/orders/:id', getAdminOrderById);
router.put('/orders/:id/status', updateOrderStatus);

// User Management
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/block', blockUser);
router.delete('/users/:id', deleteUser);

// Dashboard & Analytics
router.get('/dashboard', getDashboardOverview);
router.get('/analytics/top-products', getTopProductsAnalytics);
router.get('/analytics/revenue', getRevenueAnalytics);

export default router;
