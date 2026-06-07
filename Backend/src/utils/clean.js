import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';
import RefreshToken from '../models/RefreshToken.js';

dotenv.config();

const cleanDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/plantb');
    console.log('MongoDB Connected for database cleaning...');

    // Clear collections
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();
    await RefreshToken.deleteMany();
    console.log('Cleared existing data.');

    // 1. Seed Users (Only Admin)
    const admin = new User({
      name: 'System Admin',
      email: 'admin@plantb.com',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();
    console.log('Seeded admin account.');

    console.log('Database Cleaning Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error with database cleaning:', error);
    process.exit(1);
  }
};

cleanDB();
