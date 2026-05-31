import express from 'express';
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser
} from '../controllers/authController.js';
import { registerRules, loginRules } from '../utils/validationRules.js';
import validate from '../middleware/validatorMiddleware.js';

const router = express.Router();

router.post('/register', registerRules, validate, registerUser);
router.post('/login', loginRules, validate, loginUser);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logoutUser);

export default router;
