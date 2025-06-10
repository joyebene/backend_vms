import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token failed' });
  }
};

export default protect;
