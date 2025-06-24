// import User from '../models/User.js';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import crypto from 'crypto';
// import sendEmail from '../utils/sendEmail.js';


// const JWT_SECRET = process.env.JWT_SECRET;
// const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;


// // const createAccessToken = (id) => {
// //   if (!JWT_SECRET) throw new Error("Missing JWT_SECRET");
// //   return jwt.sign({ id }, JWT_SECRET, { expiresIn: '15m' });
// // };

//    const createAccessToken = (id) => {
//   if (!JWT_SECRET) throw new Error("Missing JWT_SECRET");
//   console.log("Creating access token for ID:", id);
//   console.log("Using JWT_SECRET:", JWT_SECRET);
//   try {
//     const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: '15m' });
//     console.log("Generated access token:", token);
//     return token;
//   } catch (err) {
//     console.error("JWT sign error:", err);
//     throw err;
//   }
// };

// const createRefreshToken = (id) => {
//   if (!JWT_REFRESH_SECRET) throw new Error("Missing JWT_REFRESH_SECRET");
//   return jwt.sign({ id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
// };












// export const refreshAccessToken = async (req, res) => {
//   const { refreshToken } = req.body;
//   if (!refreshToken) return res.status(401).json({ error: 'Missing refresh token' });

//   try {
//     const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
//     const user = await User.findById(decoded.id);
//     if (!user || user.refreshToken !== refreshToken)
//       return res.status(403).json({ error: 'Invalid refresh token' });

//     const newAccessToken = createAccessToken(user._id);
//     res.json({ accessToken: newAccessToken });
//   } catch {
//     res.status(403).json({ error: 'Expired or invalid refresh token' });
//   }
// };



// export const changePassword = async (req, res) => {
//   const { currentPassword, newPassword } = req.body;
//   const user = await User.findById(req.user.id);
//   if (!user || !(await bcrypt.compare(currentPassword, user.password)))
//     return res.status(400).json({ error: 'Current password is incorrect' });

//   user.password = await bcrypt.hash(newPassword, 12);
//   await user.save();
//   res.json({ message: 'Password changed successfully' });
// };

// controllers/auth.js
import  User  from '../models/User.js';
import bcrypt from 'bcryptjs';
import { createAccessToken, createRefreshToken } from '../utils/jwt.js'; 
import logger from '../utils/logger.js';
import { AuthError, TokenError, DatabaseError } from '../utils/error.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).select('-password -refreshToken -resetToken -resetTokenExpiry').catch(err => {
      logger.error('Database query error', { error: err.message, stack: err.stack });
      throw new DatabaseError('Failed to query user');
    });

    if (!user) {
      logger.warn('Login attempt with non-existent email', { email });
      throw new AuthError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn('Invalid password attempt', { email });
      throw new AuthError('Invalid email or password');
    }

    logger.debug('User found', { userId: user._id, email });

    // Generate tokens
    const accessToken = await createAccessToken(user._id);
    const refreshToken = await createRefreshToken(user._id);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save().catch(err => {
      logger.error('Failed to save refresh token', { error: err.message, stack: err.stack });
      throw new DatabaseError('Failed to save refresh token');
    });

    logger.info('Login successful', { userId: user._id, email });

    return res.json({
      userId: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    logger.error('Login error', { error: err.message, stack: err.stack });

    if (err instanceof AuthError) {
      return res.status(400).json({ error: err.message });
    }
    if (err instanceof TokenError) {
      return res.status(500).json({
        error: process.env.NODE_ENV === 'development' ? `Token generation failed: ${err.message}` : 'Token generation failed',
      });
    }
    if (err instanceof DatabaseError) {
      return res.status(500).json({
        error: process.env.NODE_ENV === 'development' ? `Database error: ${err.message}` : 'Server error during login',
      });
    }

    return res.status(500).json({
      error: process.env.NODE_ENV === 'development' ? `Unexpected error: ${err.message}` : 'Server error during login',
    });
  }
};



export const register = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: 'Email already exists' });

  const hashed = await bcrypt.hash(password, 12);

  const user = await User.create({
    email, password: hashed, firstName, lastName,
  });

  res.status(201).json({ message: 'User registered.', data: user });
};



export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);
  if (!user || !(await bcrypt.compare(currentPassword, user.password)))
    return res.status(400).json({ error: 'Current password is incorrect' });

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();
  res.json({ message: 'Password changed successfully' });
};

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 1000 * 60 * 15; // 15 mins
  await user.save();

  await sendEmail(email, 'Reset Password', `Reset your password using token: ${token}`);
  res.json({ message: 'Reset token sent to email' });
};

export const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;
  const user = await User.findOne({
    resetToken,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ error: 'Invalid or expired reset token' });

  user.password = await bcrypt.hash(newPassword, 12);
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await user.save();

  res.json({ message: 'Password reset successful' });
};