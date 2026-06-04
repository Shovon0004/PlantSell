import { body } from 'express-validator';

export const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

export const loginRules = [
  body('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

export const productRules = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('type').trim().notEmpty().withMessage('Type is required'),
  body('discount').optional().isFloat({ min: 0, max: 100 }).withMessage('Discount must be between 0 and 100'),
  body('isFeatured').optional().isBoolean().withMessage('isFeatured must be a boolean'),
  body('isAvailable').optional().isBoolean().withMessage('isAvailable must be a boolean'),
  body('tags').optional().custom(value => typeof value === 'string' || Array.isArray(value)).withMessage('Tags must be a string or array')
];

export const reviewRules = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Review comment is required')
];

export const addressRules = [
  body('street').trim().notEmpty().withMessage('Street is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('zipCode').trim().notEmpty().withMessage('Zip code is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('isDefault').optional().isBoolean().withMessage('isDefault must be a boolean')
];

export const orderRules = [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.product').isMongoId().withMessage('Product ID must be a valid MongoDB ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
  body('shippingAddress.street').trim().notEmpty().withMessage('Shipping street is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('Shipping city is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('Shipping state is required'),
  body('shippingAddress.zipCode').trim().notEmpty().withMessage('Shipping zip code is required'),
  body('shippingAddress.country').trim().notEmpty().withMessage('Shipping country is required'),
  body('paymentMethod').optional().trim().notEmpty().withMessage('Payment method is required')
];
