import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

// ==========================================
// 1. PRODUCT MANAGEMENT
// ==========================================

// @desc    Add a new product
// @route   POST /api/admin/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category, type, tags, discount, isFeatured, isAvailable } = req.body;

    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        images.push(`/uploads/${file.filename}`);
      });
    } else if (req.body.imageUrl) {
      images.push(req.body.imageUrl);
    }

    const tagsArray = tags ? (typeof tags === 'string' ? tags.split(',') : tags) : [];

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      images,
      category,
      type,
      tags: tagsArray,
      discount: discount ? Number(discount) : 0,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isAvailable: isAvailable !== 'false' && isAvailable !== false
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product details
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const updates = { ...req.body };

    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);
    if (updates.discount !== undefined) updates.discount = Number(updates.discount);
    if (updates.isFeatured !== undefined) updates.isFeatured = updates.isFeatured === 'true' || updates.isFeatured === true;
    if (updates.isAvailable !== undefined) updates.isAvailable = updates.isAvailable !== 'false' && updates.isAvailable !== false;
    
    if (updates.tags) {
      updates.tags = typeof updates.tags === 'string' ? updates.tags.split(',') : updates.tags;
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      updates.images = [...(product.images || []), ...newImages];
    } else if (req.body.imageUrl) {
      updates.images = [req.body.imageUrl];
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update stock quantity
// @route   PUT /api/admin/products/:id/stock
// @access  Private/Admin
export const updateProductStock = async (req, res, next) => {
  try {
    const { stock } = req.body;

    if (stock === undefined || stock < 0) {
      res.status(400);
      throw new Error('Stock must be a non-negative integer');
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    product.stock = Number(stock);
    await product.save();

    res.status(200).json({
      success: true,
      message: `Stock updated for ${product.name}`,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 2. CATEGORY MANAGEMENT
// ==========================================

// @desc    Add a new category
// @route   POST /api/admin/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, subcategories } = req.body;

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      res.status(400);
      throw new Error('Category already exists');
    }

    const subcategoriesArray = subcategories 
      ? (typeof subcategories === 'string' ? subcategories.split(',') : subcategories) 
      : [];

    const category = await Category.create({
      name,
      description,
      subcategories: subcategoriesArray
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category details
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, subcategories } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (subcategories) {
      category.subcategories = typeof subcategories === 'string' ? subcategories.split(',') : subcategories;
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 3. ORDER MANAGEMENT
// ==========================================

// @desc    View all orders (filter by status, date range)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getOrders = async (req, res, next) => {
  try {
    const { status, dateFrom, dateTo } = req.query;

    const query = {};

    if (status) query.status = status;

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    View single order details
// @route   GET /api/admin/orders/:id
// @access  Private/Admin
export const getAdminOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product');

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      res.status(400);
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    const oldStatus = order.status;
    order.status = status;

    if (status === 'delivered') {
      order.paymentStatus = 'paid';
    }

    if (status === 'cancelled' && oldStatus !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
    }

    if (oldStatus === 'cancelled' && status !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
      }
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 4. USER MANAGEMENT
// ==========================================

// @desc    View all registered users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    View single user details
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Block or unblock a user
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
export const blockUser = async (req, res, next) => {
  try {
    const { isBlocked } = req.body;

    if (isBlocked === undefined) {
      res.status(400);
      throw new Error('isBlocked boolean is required');
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (user._id.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error('You cannot block your own admin account');
    }

    user.isBlocked = isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User is now ${isBlocked ? 'blocked' : 'unblocked'}`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (user._id.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error('You cannot delete your own admin account');
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 5. DASHBOARD & ANALYTICS
// ==========================================

// @desc    Overview statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardOverview = async (req, res, next) => {
  try {
    const salesAggregate = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalSales = salesAggregate.length > 0 ? salesAggregate[0].total : 0;

    const totalOrders = await Order.countDocuments({});
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const lowStockAlerts = await Product.countDocuments({ stock: { $lt: 10 } });

    const lowStockItems = await Product.find({ stock: { $lt: 10 } })
      .select('name stock category type price')
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        totalSales: Math.round(totalSales * 100) / 100,
        totalOrders,
        totalUsers,
        lowStockAlerts,
        lowStockItems
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Best-selling products by category
// @route   GET /api/admin/analytics/top-products
// @access  Private/Admin
export const getTopProductsAnalytics = async (req, res, next) => {
  try {
    const topProducts = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          quantitySold: { $sum: '$items.quantity' },
          revenueGenerated: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      {
        $project: {
          _id: 1,
          name: '$productInfo.name',
          category: '$productInfo.category',
          type: '$productInfo.type',
          images: '$productInfo.images',
          quantitySold: 1,
          revenueGenerated: { $round: ['$revenueGenerated', 2] }
        }
      },
      { $sort: { quantitySold: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: topProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Revenue report (daily/weekly/monthly)
// @route   GET /api/admin/analytics/revenue
// @access  Private/Admin
export const getRevenueAnalytics = async (req, res, next) => {
  try {
    const { period = 'daily' } = req.query;

    let groupStage;

    if (period === 'weekly') {
      groupStage = {
        _id: {
          year: { $year: '$createdAt' },
          week: { $week: '$createdAt' }
        },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 }
      };
    } else if (period === 'monthly') {
      groupStage = {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 }
      };
    } else {
      groupStage = {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 }
      };
    }

    const revenueReport = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: groupStage },
      {
        $project: {
          _id: 1,
          revenue: { $round: ['$revenue', 2] },
          orders: 1
        }
      }
    ]);

    if (period === 'weekly') {
      revenueReport.sort((a, b) => {
        if (a._id.year !== b._id.year) return a._id.year - b._id.year;
        return a._id.week - b._id.week;
      });
    } else {
      revenueReport.sort((a, b) => (a._id > b._id ? 1 : -1));
    }

    res.status(200).json({
      success: true,
      period,
      data: revenueReport
    });
  } catch (error) {
    next(error);
  }
};
