import Product from '../models/Product.js';
import Review from '../models/Review.js';

// @desc    Browse all products (filter, sort, paginate)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { category, type, priceMin, priceMax, ratingMin, tags, isFeatured, isAvailable, sortBy, page = 1, limit = 10 } = req.query;

    const query = {};

    if (category) query.category = category;
    if (type) query.type = type;
    if (isFeatured) query.isFeatured = isFeatured === 'true';
    if (isAvailable) query.isAvailable = isAvailable === 'true';

    // Price range filter
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }

    // Rating filter
    if (ratingMin) {
      query['ratings.average'] = { $gte: Number(ratingMin) };
    }

    // Tags filter (supports comma-separated tags or array)
    if (tags) {
      const tagsArray = typeof tags === 'string' ? tags.split(',') : tags;
      query.tags = { $in: tagsArray };
    }

    // Count documents matching the query
    const total = await Product.countDocuments(query);

    // Sorting options
    let sortOptions = { createdAt: -1 }; // default: newest
    if (sortBy) {
      if (sortBy === 'priceAsc') sortOptions = { price: 1 };
      else if (sortBy === 'priceDesc') sortOptions = { price: -1 };
      else if (sortBy === 'rating') sortOptions = { 'ratings.average': -1 };
      else if (sortBy === 'newest') sortOptions = { createdAt: -1 };
    }

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: products.length,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        totalProducts: total
      },
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true, isAvailable: true }).limit(10);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search products by name or tags
// @route   GET /api/products/search
// @access  Public
export const searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      res.status(400);
      throw new Error('Search query parameter q is required');
    }

    // Find using text index search, or fall back to name regex / tag match
    const products = await Product.find({
      $or: [
        { $text: { $search: q } },
        { name: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ],
      isAvailable: true
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a review & rating
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: req.user._id
    });

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed by this user');
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating: Number(rating),
      comment
    });

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for a product
// @route   GET /api/products/:id/reviews
// @access  Public
export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.id })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};
