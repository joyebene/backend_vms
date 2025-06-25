import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';


const JWT_SECRET = process.env.JWT_SECRET || 'L3gZs1NJI_etZXqb8S5FV5Y_Jyn7Rl6xOND26mw0Yz_N35_AXM0WS39750AOQKUE';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'L3gZs1NJI_etZXqb8S5FV5Y_Jyn7Rl6xOND26mw0Yz_N35_AXM0WS39750AOQKUE';


// const createAccessToken = (id) => {
//   if (!JWT_SECRET) throw new Error("Missing JWT_SECRET");
//   return jwt.sign({ id }, JWT_SECRET, { expiresIn: '15m' });
// };

const createAccessToken = (id) => {
  if (!JWT_SECRET) throw new Error("Missing JWT_SECRET");
  console.log("Creating access token for ID:", id);
  console.log("Using JWT_SECRET:", JWT_SECRET);
  try {
    const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: '30m' });
    console.log("Generated access token:", token);
    return token;
  } catch (err) {
    console.error("JWT sign error:", err);
    throw err;
  }
};

const createRefreshToken = (id) => {
  if (!JWT_SECRET) throw new Error("Missing JWT_REFRESH_SECRET");
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};


export const register = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      role,
      department,
    } = req.body;

    // Validate required fields
    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !department ||
      !role
    ) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      email,
      password: hashed,
      firstName,
      lastName,
      phoneNumber,
      role,
      department,
    });

    res.status(201).json({ message: 'User registered.', data: user });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
};

export const login = async (req, res) => {
  try {

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ error: 'Invalid email or password' });

    let accessToken, refreshToken;
    try {
      accessToken = createAccessToken(user._id);
      refreshToken = createRefreshToken(user._id);
    } catch (err) {
      console.error("JWT generation error:", err);
      return res.status(500).json({ error: "Token generation failed" });
    }

    user.refreshToken = refreshToken;
    user.accessToken = accessToken;
    await user.save();

    return res.status(201).json({ message: "User Logged in Successfully", data: user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
};


export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: 'Missing refresh token' });

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken)
      return res.status(403).json({ error: 'Invalid refresh token' });

    const newAccessToken = createAccessToken(user._id);
    res.json({ accessToken: newAccessToken });
  } catch {
    res.status(403).json({ error: 'Expired or invalid refresh token' });
  }
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

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);
  if (!user || !(await bcrypt.compare(currentPassword, user.password)))
    return res.status(400).json({ error: 'Current password is incorrect' });

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();
  res.json({ message: 'Password changed successfully' });
};
