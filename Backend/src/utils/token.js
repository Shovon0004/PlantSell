import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import RefreshToken from '../models/RefreshToken.js';

export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m'
  });
};

export const generateRefreshToken = async (userId) => {
  const tokenString = crypto.randomBytes(40).toString('hex');
  
  // Parse expiration days from environment config (e.g. "7d" -> 7)
  const daysString = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  const days = parseInt(daysString.replace('d', ''), 10) || 7;
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);

  const refreshToken = await RefreshToken.create({
    user: userId,
    token: tokenString,
    expiresAt
  });

  return refreshToken.token;
};
