import express from 'express';
import {
  getProducts,
  getFeaturedProducts,
  searchProducts,
  getProductById,
  createProductReview,
  getProductReviews
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import { reviewRules } from '../utils/validationRules.js';
import validate from '../middleware/validatorMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductById);
router.get('/:id/reviews', getProductReviews);
router.post('/:id/reviews', protect, reviewRules, validate, createProductReview);

export default router;
