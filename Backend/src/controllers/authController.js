import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';

// @desc    Register a new customer
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists with this email');
    }

    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      // Auto-initialize Cart and Wishlist
      await Cart.create({ user: user._id, items: [] });
      await Wishlist.create({ user: user._id, products: [] });

      const accessToken = generateAccessToken(user._id);
      const refreshToken = await generateRefreshToken(user._id);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          accessToken,
          refreshToken
        }
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Login and receive access + refresh token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    if (user.isBlocked) {
      res.status(403);
      throw new Error('Access denied: This user account is blocked');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400);
      throw new Error('Refresh token is required');
    }

    const storedToken = await RefreshToken.findOne({ token: refreshToken });

    if (!storedToken) {
      res.status(401);
      throw new Error('Invalid refresh token');
    }

    if (storedToken.isExpired()) {
      await RefreshToken.deleteOne({ _id: storedToken._id });
      res.status(401);
      throw new Error('Refresh token has expired. Please login again.');
    }

    const user = await User.findById(storedToken.user);
    if (!user) {
      res.status(401);
      throw new Error('User not found');
    }

    if (user.isBlocked) {
      res.status(403);
      throw new Error('Access denied: User account is blocked');
    }

    const newAccessToken = generateAccessToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Access token refreshed successfully',
      data: {
        accessToken: newAccessToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout and invalidate refresh token
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400);
      throw new Error('Refresh token is required');
    }

    await RefreshToken.deleteOne({ token: refreshToken });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};
